-- =============================================================================
-- FOREIGN KEYS + AUDIT TRIGGERS (com verificação de existência)
-- =============================================================================

-- Dropar e recriar apenas as FKs que faltam (as existentes são mantidas)

-- conversations -> clients (se não existir)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_conversations_client') THEN
    ALTER TABLE public.conversations ADD CONSTRAINT fk_conversations_client
    FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;
  END IF;
END $$;

-- conversations -> channels (se não existir)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_conversations_channel') THEN
    ALTER TABLE public.conversations ADD CONSTRAINT fk_conversations_channel
    FOREIGN KEY (channel_id) REFERENCES public.channels(id) ON DELETE RESTRICT;
  END IF;
END $$;

-- conversations -> agent_profiles (se não existir)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_conversations_agent') THEN
    ALTER TABLE public.conversations ADD CONSTRAINT fk_conversations_agent
    FOREIGN KEY (assigned_agent_id) REFERENCES public.agent_profiles(id) ON DELETE SET NULL;
  END IF;
END $$;

-- conversations -> queues (se não existir)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_conversations_queue') THEN
    ALTER TABLE public.conversations ADD CONSTRAINT fk_conversations_queue
    FOREIGN KEY (queue_id) REFERENCES public.queues(id) ON DELETE SET NULL;
  END IF;
END $$;

-- conversations -> organizations (se não existir)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_conversations_organization') THEN
    ALTER TABLE public.conversations ADD CONSTRAINT fk_conversations_organization
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;
  END IF;
END $$;

-- messages -> conversations (se não existir)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_messages_conversation') THEN
    ALTER TABLE public.messages ADD CONSTRAINT fk_messages_conversation
    FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;
  END IF;
END $$;

-- conversation_tags -> conversations (se não existir)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_conversation_tags_conversation') THEN
    ALTER TABLE public.conversation_tags ADD CONSTRAINT fk_conversation_tags_conversation
    FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;
  END IF;
END $$;

-- conversation_tags -> tags (se não existir)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_conversation_tags_tag') THEN
    ALTER TABLE public.conversation_tags ADD CONSTRAINT fk_conversation_tags_tag
    FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;
  END IF;
END $$;

-- =============================================================================
-- AUDIT TRIGGERS (com verificação de existência)
-- =============================================================================

-- Trigger para auditoria de mudanças em conversas
DROP TRIGGER IF EXISTS audit_conversation_changes_trigger ON public.conversations;
CREATE TRIGGER audit_conversation_changes_trigger
AFTER UPDATE ON public.conversations
FOR EACH ROW
EXECUTE FUNCTION public.audit_conversation_changes();

-- Trigger para auditoria de mudanças em user_roles
DROP TRIGGER IF EXISTS audit_user_role_changes_trigger ON public.user_roles;
CREATE TRIGGER audit_user_role_changes_trigger
AFTER INSERT OR DELETE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.audit_user_role_changes();

-- Trigger para auditoria de mudanças de status de agente
DROP TRIGGER IF EXISTS audit_agent_status_changes_trigger ON public.agent_profiles;
CREATE TRIGGER audit_agent_status_changes_trigger
AFTER UPDATE ON public.agent_profiles
FOR EACH ROW
EXECUTE FUNCTION public.audit_agent_status_changes();

-- Trigger para atualizar updated_at em conversas ao receber nova mensagem
DROP TRIGGER IF EXISTS update_conversation_on_message_trigger ON public.messages;
CREATE TRIGGER update_conversation_on_message_trigger
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_conversation_on_new_message();