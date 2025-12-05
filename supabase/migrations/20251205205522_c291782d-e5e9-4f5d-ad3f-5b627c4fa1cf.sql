-- =========================================
-- FASE 1: FOREIGN KEYS PARA INTEGRIDADE REFERENCIAL
-- =========================================

-- Conversations Foreign Keys (usando DO para ignorar se já existir)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_conversations_client') THEN
    ALTER TABLE public.conversations ADD CONSTRAINT fk_conversations_client 
      FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_conversations_channel') THEN
    ALTER TABLE public.conversations ADD CONSTRAINT fk_conversations_channel 
      FOREIGN KEY (channel_id) REFERENCES public.channels(id) ON DELETE RESTRICT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_conversations_agent') THEN
    ALTER TABLE public.conversations ADD CONSTRAINT fk_conversations_agent 
      FOREIGN KEY (assigned_agent_id) REFERENCES public.agent_profiles(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_conversations_queue') THEN
    ALTER TABLE public.conversations ADD CONSTRAINT fk_conversations_queue 
      FOREIGN KEY (queue_id) REFERENCES public.queues(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_conversations_organization') THEN
    ALTER TABLE public.conversations ADD CONSTRAINT fk_conversations_organization 
      FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Messages Foreign Keys
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_messages_conversation') THEN
    ALTER TABLE public.messages ADD CONSTRAINT fk_messages_conversation 
      FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Agent Profiles Foreign Keys
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_agent_profiles_team') THEN
    ALTER TABLE public.agent_profiles ADD CONSTRAINT fk_agent_profiles_team 
      FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Teams Foreign Keys
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_teams_organization') THEN
    ALTER TABLE public.teams ADD CONSTRAINT fk_teams_organization 
      FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Queues Foreign Keys
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_queues_team') THEN
    ALTER TABLE public.queues ADD CONSTRAINT fk_queues_team 
      FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_queues_organization') THEN
    ALTER TABLE public.queues ADD CONSTRAINT fk_queues_organization 
      FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Tags Foreign Keys
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_tags_organization') THEN
    ALTER TABLE public.tags ADD CONSTRAINT fk_tags_organization 
      FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Conversation Tags Foreign Keys
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_conversation_tags_conversation') THEN
    ALTER TABLE public.conversation_tags ADD CONSTRAINT fk_conversation_tags_conversation 
      FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_conversation_tags_tag') THEN
    ALTER TABLE public.conversation_tags ADD CONSTRAINT fk_conversation_tags_tag 
      FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Clients Foreign Keys
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_clients_organization') THEN
    ALTER TABLE public.clients ADD CONSTRAINT fk_clients_organization 
      FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Channels Foreign Keys
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_channels_organization') THEN
    ALTER TABLE public.channels ADD CONSTRAINT fk_channels_organization 
      FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Pause Reasons Foreign Keys
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_pause_reasons_organization') THEN
    ALTER TABLE public.pause_reasons ADD CONSTRAINT fk_pause_reasons_organization 
      FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Priorities Foreign Keys
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_priorities_organization') THEN
    ALTER TABLE public.priorities ADD CONSTRAINT fk_priorities_organization 
      FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;
  END IF;
END $$;

-- SLAs Foreign Keys
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_slas_organization') THEN
    ALTER TABLE public.slas ADD CONSTRAINT fk_slas_organization 
      FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_slas_priority') THEN
    ALTER TABLE public.slas ADD CONSTRAINT fk_slas_priority 
      FOREIGN KEY (priority_id) REFERENCES public.priorities(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Organization Members Foreign Keys
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_org_members_organization') THEN
    ALTER TABLE public.organization_members ADD CONSTRAINT fk_org_members_organization 
      FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;
  END IF;
END $$;

-- User Roles Foreign Key
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_roles_user') THEN
    ALTER TABLE public.user_roles ADD CONSTRAINT fk_user_roles_user
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- =========================================
-- FASE 2: TRIGGERS DE AUDITORIA (com verificação)
-- =========================================

-- Trigger para mudanças em conversas
DROP TRIGGER IF EXISTS audit_conversation_changes_trigger ON public.conversations;
CREATE TRIGGER audit_conversation_changes_trigger
  AFTER UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_conversation_changes();

-- Trigger para mudanças em roles de usuário (já existe, apenas garantir)
DROP TRIGGER IF EXISTS audit_user_role_changes_trigger ON public.user_roles;
CREATE TRIGGER audit_user_role_changes_trigger
  AFTER INSERT OR DELETE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_user_role_changes();

-- Trigger para mudanças de status de agente
DROP TRIGGER IF EXISTS audit_agent_status_trigger ON public.agent_profiles;
CREATE TRIGGER audit_agent_status_trigger
  AFTER UPDATE ON public.agent_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_agent_status_changes();

-- Trigger para atualizar timestamp da conversa ao receber nova mensagem
DROP TRIGGER IF EXISTS update_conversation_timestamp_trigger ON public.messages;
CREATE TRIGGER update_conversation_timestamp_trigger
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_conversation_on_new_message();

-- =========================================
-- FASE 3: CORREÇÃO DE RLS - AUDIT_LOGS
-- =========================================

DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;

-- =========================================
-- FASE 4: ATRIBUIR TEAM AO ADMIN
-- =========================================

UPDATE public.agent_profiles 
SET team_id = (SELECT id FROM public.teams WHERE name = 'Equipe de Vendas' LIMIT 1)
WHERE user_id = 'dc07f44e-0580-4fc0-8611-b331addcb9b0'
AND team_id IS NULL;

-- =========================================
-- FASE 5: ÍNDICES PARA PERFORMANCE
-- =========================================

CREATE INDEX IF NOT EXISTS idx_conversations_status ON public.conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_assigned_agent ON public.conversations(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_conversations_organization ON public.conversations(organization_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_agent_profiles_user ON public.agent_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_profiles_team ON public.agent_profiles(team_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_user ON public.organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_org ON public.organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);