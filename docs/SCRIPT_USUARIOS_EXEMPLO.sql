-- ============================================
-- SCRIPT EXEMPLO: Criar Usuários de Teste
-- ============================================
-- Este é um exemplo. Você precisa substituir os UUIDs
-- pelos IDs reais dos usuários que criou via signup.
--
-- IMPORTANTE: 
-- 1. Crie as contas primeiro em /login (aba Cadastrar)
-- 2. Vá em Backend → Database → agent_profiles
-- 3. Copie os user_id de cada usuário
-- 4. Substitua nos campos marcados com "SUBSTITUIR"
-- ============================================

-- Definir IDs (SUBSTITUA ESTES VALORES!)
DO $$
DECLARE
  v_admin_id UUID := 'SUBSTITUIR_UUID_DO_ADMIN';
  v_gestor_id UUID := 'SUBSTITUIR_UUID_DO_GESTOR';
  v_agente1_id UUID := 'SUBSTITUIR_UUID_DO_AGENTE1';
  v_agente2_id UUID := 'SUBSTITUIR_UUID_DO_AGENTE2';
  v_agente3_id UUID := 'SUBSTITUIR_UUID_DO_AGENTE3';
  v_team_id UUID := gen_random_uuid();
BEGIN
  -- Criar time de vendas
  INSERT INTO public.teams (id, name, manager_id)
  VALUES (v_team_id, 'Equipe de Vendas', v_gestor_id);

  -- Atribuir roles
  INSERT INTO public.user_roles (user_id, role) VALUES
    (v_admin_id, 'admin'),
    (v_gestor_id, 'manager'),
    (v_agente1_id, 'agent'),
    (v_agente2_id, 'agent'),
    (v_agente3_id, 'agent');

  -- Associar agentes e gestor ao time
  UPDATE public.agent_profiles
  SET team_id = v_team_id
  WHERE user_id IN (v_gestor_id, v_agente1_id, v_agente2_id, v_agente3_id);

  -- Atualizar status dos agentes para online (para teste)
  UPDATE public.agent_profiles
  SET status = 'online'
  WHERE user_id IN (v_agente1_id, v_agente2_id, v_agente3_id);

  RAISE NOTICE 'Usuários de teste configurados com sucesso!';
  RAISE NOTICE 'Team ID: %', v_team_id;
END $$;

-- Verificar se foi criado corretamente
SELECT 
  ap.display_name,
  ap.status,
  ur.role,
  t.name as team_name
FROM public.agent_profiles ap
LEFT JOIN public.user_roles ur ON ap.user_id = ur.user_id
LEFT JOIN public.teams t ON ap.team_id = t.id
ORDER BY ur.role DESC, ap.display_name;
