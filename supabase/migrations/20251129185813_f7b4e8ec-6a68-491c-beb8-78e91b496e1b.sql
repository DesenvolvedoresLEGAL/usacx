-- ============================================================================
-- FASE 1.2: TABELAS SECUNDÁRIAS - CONFIGURAÇÕES
-- ============================================================================

-- 1. TABELA: TAGS (Etiquetas para Conversas)
-- ============================================================================

CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  color TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX idx_tags_is_active ON public.tags(is_active);
CREATE INDEX idx_tags_name ON public.tags(name);

-- RLS
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- Todos autenticados podem ver tags ativas
CREATE POLICY "All authenticated users can view tags"
ON public.tags
FOR SELECT
TO authenticated
USING (is_active = true);

-- Apenas admins podem gerenciar tags
CREATE POLICY "Only admins can manage tags"
ON public.tags
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para updated_at
CREATE TRIGGER update_tags_updated_at
  BEFORE UPDATE ON public.tags
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- 2. TABELA: PAUSE_REASONS (Motivos de Pausa)
-- ============================================================================

CREATE TABLE public.pause_reasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  icon TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX idx_pause_reasons_is_active ON public.pause_reasons(is_active);

-- RLS
ALTER TABLE public.pause_reasons ENABLE ROW LEVEL SECURITY;

-- Todos autenticados podem ver motivos de pausa ativos
CREATE POLICY "All authenticated users can view pause reasons"
ON public.pause_reasons
FOR SELECT
TO authenticated
USING (is_active = true);

-- Apenas admins podem gerenciar motivos de pausa
CREATE POLICY "Only admins can manage pause reasons"
ON public.pause_reasons
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para updated_at
CREATE TRIGGER update_pause_reasons_updated_at
  BEFORE UPDATE ON public.pause_reasons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- 3. TABELA: PRIORITIES (Níveis de Prioridade)
-- ============================================================================

CREATE TABLE public.priorities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  level INTEGER UNIQUE NOT NULL,
  color TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX idx_priorities_level ON public.priorities(level);
CREATE INDEX idx_priorities_is_active ON public.priorities(is_active);

-- RLS
ALTER TABLE public.priorities ENABLE ROW LEVEL SECURITY;

-- Todos autenticados podem ver prioridades ativas
CREATE POLICY "All authenticated users can view priorities"
ON public.priorities
FOR SELECT
TO authenticated
USING (is_active = true);

-- Apenas admins podem gerenciar prioridades
CREATE POLICY "Only admins can manage priorities"
ON public.priorities
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para updated_at
CREATE TRIGGER update_priorities_updated_at
  BEFORE UPDATE ON public.priorities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- 4. TABELA: SLAS (Service Level Agreements)
-- ============================================================================

CREATE TABLE public.slas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  first_response_time INTERVAL NOT NULL,
  resolution_time INTERVAL NOT NULL,
  priority_id UUID REFERENCES public.priorities(id) ON DELETE SET NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX idx_slas_priority_id ON public.slas(priority_id);
CREATE INDEX idx_slas_is_active ON public.slas(is_active);

-- RLS
ALTER TABLE public.slas ENABLE ROW LEVEL SECURITY;

-- Todos autenticados podem ver SLAs ativos
CREATE POLICY "All authenticated users can view slas"
ON public.slas
FOR SELECT
TO authenticated
USING (is_active = true);

-- Apenas admins podem gerenciar SLAs
CREATE POLICY "Only admins can manage slas"
ON public.slas
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para updated_at
CREATE TRIGGER update_slas_updated_at
  BEFORE UPDATE ON public.slas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- 5. TABELA: CONVERSATION_TAGS (Relacionamento N:N entre Conversas e Tags)
-- ============================================================================

CREATE TABLE public.conversation_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(conversation_id, tag_id)
);

-- Índices
CREATE INDEX idx_conversation_tags_conversation_id ON public.conversation_tags(conversation_id);
CREATE INDEX idx_conversation_tags_tag_id ON public.conversation_tags(tag_id);

-- RLS
ALTER TABLE public.conversation_tags ENABLE ROW LEVEL SECURITY;

-- Agents podem ver tags de suas conversas
CREATE POLICY "Agents can view their conversation tags"
ON public.conversation_tags
FOR SELECT
TO authenticated
USING (
  conversation_id IN (
    SELECT id FROM public.conversations
    WHERE assigned_agent_id IN (
      SELECT id FROM public.agent_profiles WHERE user_id = auth.uid()
    )
  )
);

-- Agents podem adicionar tags às suas conversas
CREATE POLICY "Agents can add tags to their conversations"
ON public.conversation_tags
FOR INSERT
TO authenticated
WITH CHECK (
  conversation_id IN (
    SELECT id FROM public.conversations
    WHERE assigned_agent_id IN (
      SELECT id FROM public.agent_profiles WHERE user_id = auth.uid()
    )
  )
);

-- Agents podem remover tags de suas conversas
CREATE POLICY "Agents can remove tags from their conversations"
ON public.conversation_tags
FOR DELETE
TO authenticated
USING (
  conversation_id IN (
    SELECT id FROM public.conversations
    WHERE assigned_agent_id IN (
      SELECT id FROM public.agent_profiles WHERE user_id = auth.uid()
    )
  )
);

-- Managers podem ver tags das conversas do time
CREATE POLICY "Managers can view team conversation tags"
ON public.conversation_tags
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

-- Admins podem gerenciar todas as tags
CREATE POLICY "Admins can manage all conversation tags"
ON public.conversation_tags
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));