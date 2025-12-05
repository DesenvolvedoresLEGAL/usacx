-- =====================================================
-- FASE 1: Criar tabela de organizações
-- =====================================================

CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    logo_url TEXT,
    settings JSONB DEFAULT '{}',
    plan TEXT DEFAULT 'free',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger para updated_at
CREATE TRIGGER update_organizations_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- FASE 2: Criar tabela de membros da organização
-- =====================================================

CREATE TABLE public.organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    user_id UUID NOT NULL,
    org_role TEXT DEFAULT 'member',
    is_owner BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(organization_id, user_id)
);

-- Enable RLS
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- FASE 3: Adicionar organization_id às tabelas existentes
-- =====================================================

ALTER TABLE public.teams ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.channels ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.queues ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.tags ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.pause_reasons ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.priorities ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.slas ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.clients ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.conversations ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- =====================================================
-- FASE 4: Funções de segurança multi-tenant
-- =====================================================

-- Função para obter a organização do usuário
CREATE OR REPLACE FUNCTION public.get_user_organization_id(_user_id UUID)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id
  FROM public.organization_members
  WHERE user_id = _user_id
  LIMIT 1;
$$;

-- Função para verificar acesso à organização
CREATE OR REPLACE FUNCTION public.has_org_access(_user_id UUID, _org_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE user_id = _user_id
      AND organization_id = _org_id
  );
$$;

-- Função para verificar se é owner da organização
CREATE OR REPLACE FUNCTION public.is_org_owner(_user_id UUID, _org_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE user_id = _user_id
      AND organization_id = _org_id
      AND is_owner = true
  );
$$;

-- =====================================================
-- FASE 5: Políticas RLS para organizations
-- =====================================================

CREATE POLICY "Users can view their organizations"
ON public.organizations FOR SELECT
USING (id IN (
  SELECT organization_id FROM public.organization_members 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Org owners can update their organization"
ON public.organizations FOR UPDATE
USING (is_org_owner(auth.uid(), id));

-- =====================================================
-- FASE 6: Políticas RLS para organization_members
-- =====================================================

CREATE POLICY "Users can view members of their orgs"
ON public.organization_members FOR SELECT
USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Org owners can manage members"
ON public.organization_members FOR ALL
USING (is_org_owner(auth.uid(), organization_id));

-- =====================================================
-- FASE 7: Criar organização "operadoralegal"
-- =====================================================

INSERT INTO public.organizations (slug, name, plan, is_active)
VALUES ('operadoralegal', 'Operadora Legal', 'pro', true);

-- =====================================================
-- FASE 8: Migrar usuários existentes para a organização
-- =====================================================

-- Adicionar todos os usuários atuais à organização operadoralegal
INSERT INTO public.organization_members (organization_id, user_id, org_role, is_owner)
SELECT 
  (SELECT id FROM public.organizations WHERE slug = 'operadoralegal'),
  ur.user_id,
  CASE 
    WHEN ur.role = 'admin' THEN 'owner'
    WHEN ur.role = 'manager' THEN 'admin'
    ELSE 'member'
  END,
  (ur.role = 'admin')
FROM public.user_roles ur;

-- =====================================================
-- FASE 9: Atualizar dados existentes com organization_id
-- =====================================================

-- Atualizar teams
UPDATE public.teams 
SET organization_id = (SELECT id FROM public.organizations WHERE slug = 'operadoralegal')
WHERE organization_id IS NULL;

-- Atualizar channels
UPDATE public.channels 
SET organization_id = (SELECT id FROM public.organizations WHERE slug = 'operadoralegal')
WHERE organization_id IS NULL;

-- Atualizar queues
UPDATE public.queues 
SET organization_id = (SELECT id FROM public.organizations WHERE slug = 'operadoralegal')
WHERE organization_id IS NULL;

-- Atualizar tags
UPDATE public.tags 
SET organization_id = (SELECT id FROM public.organizations WHERE slug = 'operadoralegal')
WHERE organization_id IS NULL;

-- Atualizar pause_reasons
UPDATE public.pause_reasons 
SET organization_id = (SELECT id FROM public.organizations WHERE slug = 'operadoralegal')
WHERE organization_id IS NULL;

-- Atualizar priorities
UPDATE public.priorities 
SET organization_id = (SELECT id FROM public.organizations WHERE slug = 'operadoralegal')
WHERE organization_id IS NULL;

-- Atualizar slas
UPDATE public.slas 
SET organization_id = (SELECT id FROM public.organizations WHERE slug = 'operadoralegal')
WHERE organization_id IS NULL;

-- Atualizar clients
UPDATE public.clients 
SET organization_id = (SELECT id FROM public.organizations WHERE slug = 'operadoralegal')
WHERE organization_id IS NULL;

-- Atualizar conversations
UPDATE public.conversations 
SET organization_id = (SELECT id FROM public.organizations WHERE slug = 'operadoralegal')
WHERE organization_id IS NULL;

-- =====================================================
-- FASE 10: Criar índices para performance
-- =====================================================

CREATE INDEX idx_organization_members_user_id ON public.organization_members(user_id);
CREATE INDEX idx_organization_members_org_id ON public.organization_members(organization_id);
CREATE INDEX idx_teams_org_id ON public.teams(organization_id);
CREATE INDEX idx_channels_org_id ON public.channels(organization_id);
CREATE INDEX idx_queues_org_id ON public.queues(organization_id);
CREATE INDEX idx_conversations_org_id ON public.conversations(organization_id);
CREATE INDEX idx_clients_org_id ON public.clients(organization_id);