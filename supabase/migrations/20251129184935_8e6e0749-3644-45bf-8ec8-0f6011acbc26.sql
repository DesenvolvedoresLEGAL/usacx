-- ============================================================================
-- FASE 0: CORREÇÃO DE SEGURANÇA - RLS Recursão Infinita
-- ============================================================================

-- 1. DROPAR POLICIES PROBLEMÁTICAS
-- ============================================================================

-- Dropar policies de agent_profiles que causam recursão
DROP POLICY IF EXISTS "Managers can view team profiles" ON public.agent_profiles;

-- Dropar policies de teams que causam recursão  
DROP POLICY IF EXISTS "Users can view their own team" ON public.teams;


-- 2. CRIAR FUNÇÃO HELPER SECURITY DEFINER
-- ============================================================================

-- Função para obter o team_id do usuário sem passar por RLS
CREATE OR REPLACE FUNCTION public.get_user_team_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT team_id
  FROM public.agent_profiles
  WHERE user_id = _user_id
  LIMIT 1;
$$;


-- 3. RECRIAR POLICIES DE FORMA SEGURA (SEM RECURSÃO)
-- ============================================================================

-- AGENT_PROFILES: Managers podem ver perfis do seu time
CREATE POLICY "Managers can view team profiles"
ON public.agent_profiles
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'manager'::app_role) 
  AND team_id IN (
    SELECT id FROM public.teams WHERE manager_id = auth.uid()
  )
);

-- TEAMS: Usuários podem ver seu próprio time (usando função helper)
CREATE POLICY "Users can view their own team"
ON public.teams
FOR SELECT
TO authenticated
USING (
  id = public.get_user_team_id(auth.uid())
  OR manager_id = auth.uid()
);


-- 4. CRIAR STORAGE BUCKETS
-- ============================================================================

-- Bucket para avatars (público)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket para anexos de conversas (privado)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'attachments',
  'attachments',
  false,
  10485760, -- 10MB
  ARRAY[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'audio/mpeg', 'audio/wav', 'audio/ogg',
    'video/mp4', 'video/webm'
  ]
)
ON CONFLICT (id) DO NOTHING;


-- 5. CRIAR RLS POLICIES PARA STORAGE
-- ============================================================================

-- AVATARS: Qualquer um pode ver, usuários podem fazer upload do próprio
CREATE POLICY "Avatars são visíveis publicamente"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

CREATE POLICY "Usuários podem fazer upload do próprio avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Usuários podem atualizar o próprio avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Usuários podem deletar o próprio avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);


-- ATTACHMENTS: Apenas usuários autenticados veem e fazem upload
CREATE POLICY "Usuários autenticados podem ver attachments"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'attachments');

CREATE POLICY "Usuários autenticados podem fazer upload de attachments"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'attachments');

CREATE POLICY "Admins podem deletar attachments"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'attachments'
  AND has_role(auth.uid(), 'admin'::app_role)
);