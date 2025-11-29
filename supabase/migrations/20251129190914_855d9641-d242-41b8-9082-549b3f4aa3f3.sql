-- =====================================================
-- FASE 5: PERFORMANCE OPTIMIZATION
-- Add indexes for frequently queried columns
-- =====================================================

-- Conversations indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_status ON public.conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_assigned_agent ON public.conversations(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_conversations_channel ON public.conversations(channel_id);
CREATE INDEX IF NOT EXISTS idx_conversations_client ON public.conversations(client_id);
CREATE INDEX IF NOT EXISTS idx_conversations_queue ON public.conversations(queue_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON public.conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_started_at ON public.conversations(started_at DESC);

-- Messages indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_status ON public.messages(status);

-- Audit logs indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- Agent profiles indexes
CREATE INDEX IF NOT EXISTS idx_agent_profiles_user ON public.agent_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_profiles_team ON public.agent_profiles(team_id);
CREATE INDEX IF NOT EXISTS idx_agent_profiles_status ON public.agent_profiles(status);

-- User roles indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- Clients indexes for search
CREATE INDEX IF NOT EXISTS idx_clients_phone ON public.clients(phone);
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_name ON public.clients(name);

-- Teams indexes
CREATE INDEX IF NOT EXISTS idx_teams_manager ON public.teams(manager_id);

-- Reports cache indexes
CREATE INDEX IF NOT EXISTS idx_reports_cache_type ON public.reports_cache(report_type);
CREATE INDEX IF NOT EXISTS idx_reports_cache_generated_by ON public.reports_cache(generated_by);
CREATE INDEX IF NOT EXISTS idx_reports_cache_expires_at ON public.reports_cache(expires_at);

-- =====================================================
-- PERFORMANCE: Add composite indexes for common queries
-- =====================================================

-- Conversations by agent and status (for agent dashboard)
CREATE INDEX IF NOT EXISTS idx_conversations_agent_status 
ON public.conversations(assigned_agent_id, status);

-- Conversations by team and status (for manager dashboard)
CREATE INDEX IF NOT EXISTS idx_conversations_team_status 
ON public.conversations(queue_id, status) 
WHERE queue_id IS NOT NULL;

-- Messages by conversation and time (for chat history)
CREATE INDEX IF NOT EXISTS idx_messages_conversation_time 
ON public.messages(conversation_id, created_at DESC);

-- Audit logs by entity and time (for audit queries)
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_time 
ON public.audit_logs(entity_type, entity_id, created_at DESC);

-- =====================================================
-- SECURITY: Add trigger to log user role changes
-- =====================================================

CREATE OR REPLACE FUNCTION public.audit_user_role_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_audit(
      auth.uid(),
      'create'::audit_action,
      'user_role',
      NEW.id,
      NULL,
      jsonb_build_object('user_id', NEW.user_id, 'role', NEW.role),
      jsonb_build_object('operation', 'role_assigned')
    );
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_audit(
      auth.uid(),
      'delete'::audit_action,
      'user_role',
      OLD.id,
      jsonb_build_object('user_id', OLD.user_id, 'role', OLD.role),
      NULL,
      jsonb_build_object('operation', 'role_revoked')
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Attach trigger to user_roles table
DROP TRIGGER IF EXISTS audit_user_role_changes_trigger ON public.user_roles;
CREATE TRIGGER audit_user_role_changes_trigger
AFTER INSERT OR DELETE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.audit_user_role_changes();

-- =====================================================
-- SECURITY: Add trigger to log agent status changes
-- =====================================================

CREATE OR REPLACE FUNCTION public.audit_agent_status_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    PERFORM log_audit(
      auth.uid(),
      'update'::audit_action,
      'agent_profile',
      NEW.id,
      jsonb_build_object('status', OLD.status),
      jsonb_build_object('status', NEW.status),
      jsonb_build_object('field', 'status')
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Attach trigger to agent_profiles table
DROP TRIGGER IF EXISTS audit_agent_status_changes_trigger ON public.agent_profiles;
CREATE TRIGGER audit_agent_status_changes_trigger
AFTER UPDATE ON public.agent_profiles
FOR EACH ROW
EXECUTE FUNCTION public.audit_agent_status_changes();