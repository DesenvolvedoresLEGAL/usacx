-- ============================================================================
-- FASE 4: FEATURES AVANÇADAS - TABELAS
-- ============================================================================

-- 1. TABELA: REPORTS_CACHE (Cache de Relatórios)
-- ============================================================================

CREATE TABLE public.reports_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type TEXT NOT NULL,
  filters JSONB NOT NULL DEFAULT '{}'::jsonb,
  data JSONB NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  generated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX idx_reports_cache_type ON public.reports_cache(report_type);
CREATE INDEX idx_reports_cache_expires ON public.reports_cache(expires_at);
CREATE INDEX idx_reports_cache_generated_by ON public.reports_cache(generated_by);

-- RLS
ALTER TABLE public.reports_cache ENABLE ROW LEVEL SECURITY;

-- Agents podem ver seus próprios relatórios em cache
CREATE POLICY "Agents can view their cached reports"
ON public.reports_cache
FOR SELECT
TO authenticated
USING (generated_by = auth.uid());

-- Managers podem ver relatórios do time
CREATE POLICY "Managers can view team cached reports"
ON public.reports_cache
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'manager'::app_role)
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Qualquer usuário autenticado pode criar relatórios
CREATE POLICY "Authenticated users can create cached reports"
ON public.reports_cache
FOR INSERT
TO authenticated
WITH CHECK (generated_by = auth.uid());

-- Admins podem deletar relatórios expirados
CREATE POLICY "Admins can delete expired reports"
ON public.reports_cache
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));


-- 2. TABELA: AUDIT_LOGS (Logs de Auditoria)
-- ============================================================================

CREATE TYPE public.audit_action AS ENUM (
  'create',
  'update',
  'delete',
  'login',
  'logout',
  'assign',
  'finish',
  'pause',
  'resume'
);

CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action public.audit_action NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Apenas admins podem ver logs de auditoria
CREATE POLICY "Only admins can view audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Sistema pode inserir logs (via trigger)
CREATE POLICY "System can insert audit logs"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (true);


-- 3. FUNÇÃO: Registrar log de auditoria
-- ============================================================================

CREATE OR REPLACE FUNCTION public.log_audit(
  _user_id UUID,
  _action audit_action,
  _entity_type TEXT,
  _entity_id UUID,
  _old_values JSONB DEFAULT NULL,
  _new_values JSONB DEFAULT NULL,
  _metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _log_id UUID;
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action,
    entity_type,
    entity_id,
    old_values,
    new_values,
    metadata
  )
  VALUES (
    _user_id,
    _action,
    _entity_type,
    _entity_id,
    _old_values,
    _new_values,
    _metadata
  )
  RETURNING id INTO _log_id;
  
  RETURN _log_id;
END;
$$;


-- 4. TRIGGERS: Auditoria automática em conversations
-- ============================================================================

CREATE OR REPLACE FUNCTION public.audit_conversation_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    -- Registrar mudanças de status
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      PERFORM log_audit(
        auth.uid(),
        'update'::audit_action,
        'conversation',
        NEW.id,
        jsonb_build_object('status', OLD.status),
        jsonb_build_object('status', NEW.status),
        jsonb_build_object('field', 'status')
      );
    END IF;
    
    -- Registrar atribuições
    IF OLD.assigned_agent_id IS DISTINCT FROM NEW.assigned_agent_id THEN
      PERFORM log_audit(
        auth.uid(),
        'assign'::audit_action,
        'conversation',
        NEW.id,
        jsonb_build_object('agent_id', OLD.assigned_agent_id),
        jsonb_build_object('agent_id', NEW.assigned_agent_id),
        jsonb_build_object('field', 'assigned_agent_id')
      );
    END IF;
    
    RETURN NEW;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_audit_conversation_changes
  AFTER UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_conversation_changes();


-- 5. FUNÇÃO: Limpar relatórios expirados
-- ============================================================================

CREATE OR REPLACE FUNCTION public.cleanup_expired_reports()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.reports_cache
  WHERE expires_at < now();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;