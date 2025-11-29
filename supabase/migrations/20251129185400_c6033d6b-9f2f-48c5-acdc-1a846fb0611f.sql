-- ============================================================================
-- FASE 1.1B: POLICIES ADICIONAIS E REALTIME
-- ============================================================================

-- 1. ADICIONAR POLICIES FALTANTES PARA CLIENTS
-- ============================================================================

-- Agents podem ver clientes das conversas que participam
DROP POLICY IF EXISTS "Agents can view their clients" ON public.clients;

CREATE POLICY "Agents can view their clients"
ON public.clients
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'agent'::app_role)
  AND id IN (
    SELECT client_id FROM public.conversations
    WHERE assigned_agent_id IN (
      SELECT id FROM public.agent_profiles WHERE user_id = auth.uid()
    )
  )
);

-- Managers podem ver clientes do time
DROP POLICY IF EXISTS "Managers can view team clients" ON public.clients;

CREATE POLICY "Managers can view team clients"
ON public.clients
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'manager'::app_role)
  AND id IN (
    SELECT c.client_id FROM public.conversations c
    JOIN public.agent_profiles ap ON c.assigned_agent_id = ap.id
    JOIN public.teams t ON ap.team_id = t.id
    WHERE t.manager_id = auth.uid()
  )
);


-- 2. HABILITAR REALTIME NAS TABELAS CRÍTICAS
-- ============================================================================

-- Habilitar realtime para conversations (status, mensagens, atribuições)
ALTER TABLE public.conversations REPLICA IDENTITY FULL;

-- Habilitar realtime para messages (nova mensagem chegou)
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- Adicionar tabelas à publicação realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;