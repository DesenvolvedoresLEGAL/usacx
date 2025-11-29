-- ============================================================================
-- FASE 1.1: TABELAS CORE DO BANCO DE DADOS
-- ============================================================================

-- 1. CRIAR ENUMS
-- ============================================================================

-- Status de conversas
CREATE TYPE public.conversation_status AS ENUM (
  'waiting',    -- Na fila aguardando atendimento
  'active',     -- Em atendimento
  'paused',     -- Pausada pelo agente
  'finished'    -- Finalizada
);

-- Tipos de canal
CREATE TYPE public.channel_type AS ENUM (
  'whatsapp',
  'instagram',
  'telegram',
  'messenger',
  'webchat'
);

-- Tipos de mensagem
CREATE TYPE public.message_type AS ENUM (
  'text',
  'image',
  'audio',
  'video',
  'document',
  'sticker'
);

-- Status de mensagem
CREATE TYPE public.message_status AS ENUM (
  'sending',
  'sent',
  'delivered',
  'read',
  'failed'
);

-- Tipo de remetente
CREATE TYPE public.sender_type AS ENUM (
  'client',
  'agent',
  'system'
);


-- 2. TABELA: CLIENTS (Clientes)
-- ============================================================================

CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  name TEXT NOT NULL,
  avatar_url TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX idx_clients_phone ON public.clients(phone);
CREATE INDEX idx_clients_email ON public.clients(email) WHERE email IS NOT NULL;
CREATE INDEX idx_clients_name ON public.clients(name);

-- RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Admins podem ver todos os clientes
CREATE POLICY "Admins can view all clients"
ON public.clients
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins podem inserir/atualizar/deletar clientes
CREATE POLICY "Admins can manage clients"
ON public.clients
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para updated_at
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- 3. TABELA: CHANNELS (Canais de Comunicação)
-- ============================================================================

CREATE TABLE public.channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type public.channel_type NOT NULL,
  name TEXT NOT NULL,
  config JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX idx_channels_type ON public.channels(type);
CREATE INDEX idx_channels_is_active ON public.channels(is_active);

-- RLS
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;

-- Todos autenticados podem ver canais ativos
CREATE POLICY "All authenticated users can view channels"
ON public.channels
FOR SELECT
TO authenticated
USING (is_active = true);

-- Apenas admins podem gerenciar canais
CREATE POLICY "Only admins can manage channels"
ON public.channels
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para updated_at
CREATE TRIGGER update_channels_updated_at
  BEFORE UPDATE ON public.channels
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- 4. TABELA: QUEUES (Filas de Atendimento)
-- ============================================================================

CREATE TABLE public.queues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  priority INTEGER NOT NULL DEFAULT 0,
  max_queue_size INTEGER,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX idx_queues_team_id ON public.queues(team_id);
CREATE INDEX idx_queues_is_active ON public.queues(is_active);
CREATE INDEX idx_queues_priority ON public.queues(priority DESC);

-- RLS
ALTER TABLE public.queues ENABLE ROW LEVEL SECURITY;

-- Todos autenticados podem ver filas ativas
CREATE POLICY "All authenticated users can view queues"
ON public.queues
FOR SELECT
TO authenticated
USING (is_active = true);

-- Apenas admins podem gerenciar filas
CREATE POLICY "Only admins can manage queues"
ON public.queues
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para updated_at
CREATE TRIGGER update_queues_updated_at
  BEFORE UPDATE ON public.queues
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- 5. TABELA: CONVERSATIONS (Conversas)
-- ============================================================================

CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  channel_id UUID NOT NULL REFERENCES public.channels(id) ON DELETE RESTRICT,
  assigned_agent_id UUID REFERENCES public.agent_profiles(id) ON DELETE SET NULL,
  queue_id UUID REFERENCES public.queues(id) ON DELETE SET NULL,
  status public.conversation_status NOT NULL DEFAULT 'waiting',
  priority INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  assigned_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Índices críticos para performance
CREATE INDEX idx_conversations_status ON public.conversations(status);
CREATE INDEX idx_conversations_assigned_agent_id ON public.conversations(assigned_agent_id);
CREATE INDEX idx_conversations_client_id ON public.conversations(client_id);
CREATE INDEX idx_conversations_queue_id ON public.conversations(queue_id);
CREATE INDEX idx_conversations_updated_at ON public.conversations(updated_at DESC);
CREATE INDEX idx_conversations_waiting ON public.conversations(queue_id, priority DESC, started_at ASC) 
  WHERE status = 'waiting';

-- RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Agents podem ver suas próprias conversas
CREATE POLICY "Agents can view their own conversations"
ON public.conversations
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'agent'::app_role)
  AND assigned_agent_id IN (
    SELECT id FROM public.agent_profiles WHERE user_id = auth.uid()
  )
);

-- Agents podem atualizar suas próprias conversas
CREATE POLICY "Agents can update their own conversations"
ON public.conversations
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'agent'::app_role)
  AND assigned_agent_id IN (
    SELECT id FROM public.agent_profiles WHERE user_id = auth.uid()
  )
);

-- Agents podem ver conversas na fila (para pegar próxima)
CREATE POLICY "Agents can view waiting conversations"
ON public.conversations
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'agent'::app_role)
  AND status = 'waiting'
);

-- Managers podem ver conversas do time
CREATE POLICY "Managers can view team conversations"
ON public.conversations
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'manager'::app_role)
  AND (
    assigned_agent_id IN (
      SELECT ap.id FROM public.agent_profiles ap
      JOIN public.teams t ON ap.team_id = t.id
      WHERE t.manager_id = auth.uid()
    )
    OR queue_id IN (
      SELECT id FROM public.queues WHERE team_id IN (
        SELECT id FROM public.teams WHERE manager_id = auth.uid()
      )
    )
  )
);

-- Managers podem atualizar conversas do time
CREATE POLICY "Managers can update team conversations"
ON public.conversations
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'manager'::app_role)
  AND assigned_agent_id IN (
    SELECT ap.id FROM public.agent_profiles ap
    JOIN public.teams t ON ap.team_id = t.id
    WHERE t.manager_id = auth.uid()
  )
);

-- Admins podem ver e gerenciar todas as conversas
CREATE POLICY "Admins can view all conversations"
ON public.conversations
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage all conversations"
ON public.conversations
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para updated_at
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- 6. TABELA: MESSAGES (Mensagens)
-- ============================================================================

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_type public.sender_type NOT NULL,
  sender_id UUID,
  content TEXT NOT NULL,
  message_type public.message_type NOT NULL DEFAULT 'text',
  media_url TEXT,
  file_name TEXT,
  status public.message_status NOT NULL DEFAULT 'sent',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices críticos
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_messages_sender ON public.messages(sender_type, sender_id);

-- RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Agents podem ver mensagens de suas conversas
CREATE POLICY "Agents can view their conversation messages"
ON public.messages
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'agent'::app_role)
  AND conversation_id IN (
    SELECT id FROM public.conversations
    WHERE assigned_agent_id IN (
      SELECT id FROM public.agent_profiles WHERE user_id = auth.uid()
    )
  )
);

-- Agents podem inserir mensagens em suas conversas
CREATE POLICY "Agents can insert messages in their conversations"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'agent'::app_role)
  AND conversation_id IN (
    SELECT id FROM public.conversations
    WHERE assigned_agent_id IN (
      SELECT id FROM public.agent_profiles WHERE user_id = auth.uid()
    )
  )
);

-- Managers podem ver mensagens das conversas do time
CREATE POLICY "Managers can view team messages"
ON public.messages
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'manager'::app_role)
  AND conversation_id IN (
    SELECT c.id FROM public.conversations c
    JOIN public.agent_profiles ap ON c.assigned_agent_id = ap.id
    JOIN public.teams t ON ap.team_id = t.id
    WHERE t.manager_id = auth.uid()
  )
);

-- Admins podem ver todas as mensagens
CREATE POLICY "Admins can view all messages"
ON public.messages
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins podem gerenciar todas as mensagens
CREATE POLICY "Admins can manage all messages"
ON public.messages
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));


-- 7. TRIGGER: Atualizar conversations.updated_at quando nova mensagem
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_conversation_on_new_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.conversations
  SET updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_conversation_on_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_conversation_on_new_message();


-- 8. FUNÇÃO: Atribuir conversa a agente
-- ============================================================================

CREATE OR REPLACE FUNCTION public.assign_conversation_to_agent(
  _conversation_id UUID,
  _agent_profile_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.conversations
  SET 
    assigned_agent_id = _agent_profile_id,
    assigned_at = now(),
    status = 'active',
    updated_at = now()
  WHERE id = _conversation_id
  AND status = 'waiting';
  
  RETURN FOUND;
END;
$$;


-- 9. FUNÇÃO: Finalizar conversa
-- ============================================================================

CREATE OR REPLACE FUNCTION public.finish_conversation(
  _conversation_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.conversations
  SET 
    status = 'finished',
    finished_at = now(),
    updated_at = now()
  WHERE id = _conversation_id
  AND status IN ('active', 'paused');
  
  RETURN FOUND;
END;
$$;