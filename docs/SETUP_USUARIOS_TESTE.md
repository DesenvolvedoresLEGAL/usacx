# Guia: Criar Usuários de Teste

## Passo 1: Criar as Contas

Acesse `/login` e crie as seguintes contas usando a aba "Cadastrar":

### Admin
- **Email**: admin@usac.com
- **Senha**: admin123
- **Nome**: Administrador Sistema

### Gestor
- **Email**: gestor@usac.com
- **Senha**: gestor123
- **Nome**: Carlos Gestor

### Agentes (Vendedores)
1. **Email**: agente1@usac.com
   - **Senha**: agente123
   - **Nome**: João Silva

2. **Email**: agente2@usac.com
   - **Senha**: agente123
   - **Nome**: Maria Santos

3. **Email**: agente3@usac.com
   - **Senha**: agente123
   - **Nome**: Pedro Costa

## Passo 2: Obter os IDs dos Usuários

Após criar todas as contas, acesse o **Backend** (botão Cloud) e vá em:
- Database → Tables → agent_profiles

Anote os `user_id` de cada usuário criado (você pode identificar pelo display_name).

## Passo 3: Executar Script SQL

No Backend, vá em **SQL Editor** e execute o script abaixo, substituindo os IDs pelos IDs reais dos usuários:

```sql
-- IMPORTANTE: Substitua os UUIDs abaixo pelos IDs reais dos usuários
-- que você anotou no agent_profiles

-- Criar time de vendas
INSERT INTO public.teams (id, name, manager_id)
VALUES (
  'c7b3d8a0-1234-5678-9abc-def012345678',
  'Equipe de Vendas',
  'ID_DO_GESTOR_AQUI' -- Substitua pelo user_id do gestor
);

-- Atribuir role de ADMIN
INSERT INTO public.user_roles (user_id, role)
VALUES ('ID_DO_ADMIN_AQUI', 'admin'); -- Substitua pelo user_id do admin

-- Atribuir role de GESTOR
INSERT INTO public.user_roles (user_id, role)
VALUES ('ID_DO_GESTOR_AQUI', 'manager'); -- Substitua pelo user_id do gestor

-- Atribuir role de AGENTE para os 3 agentes
INSERT INTO public.user_roles (user_id, role)
VALUES 
  ('ID_DO_AGENTE1_AQUI', 'agent'), -- Substitua pelo user_id do agente 1
  ('ID_DO_AGENTE2_AQUI', 'agent'), -- Substitua pelo user_id do agente 2
  ('ID_DO_AGENTE3_AQUI', 'agent'); -- Substitua pelo user_id do agente 3

-- Associar agentes ao time
UPDATE public.agent_profiles
SET team_id = 'c7b3d8a0-1234-5678-9abc-def012345678'
WHERE user_id IN (
  'ID_DO_AGENTE1_AQUI',
  'ID_DO_AGENTE2_AQUI',
  'ID_DO_AGENTE3_AQUI'
);

-- Associar gestor ao time
UPDATE public.agent_profiles
SET team_id = 'c7b3d8a0-1234-5678-9abc-def012345678'
WHERE user_id = 'ID_DO_GESTOR_AQUI';
```

## Passo 4: Validar

Faça logout e teste cada conta:

### Teste Admin (admin@usac.com)
- ✅ Deve ver Dashboard com visão global
- ✅ Deve ter acesso a todas as seções do menu
- ✅ Deve ver estatísticas de todos os times

### Teste Gestor (gestor@usac.com)
- ✅ Deve ver Dashboard com visão do time
- ✅ Deve ver os 3 agentes no time
- ✅ NÃO deve ter acesso às Configurações
- ✅ Deve ter acesso à seção "Ao Vivo"

### Teste Agente (agente1@usac.com)
- ✅ Deve ser redirecionado para /conversations
- ✅ Deve ver Dashboard pessoal com suas métricas
- ✅ Menu simplificado (sem Configurações, Acesso, etc)
- ✅ NÃO deve ter acesso a gestão de outros agentes

## Troubleshooting

**Se o usuário não vir o menu correto:**
- Faça logout completo
- Limpe o cache do navegador
- Faça login novamente

**Se aparecer "Nenhum role atribuído":**
- Verifique se executou o script SQL corretamente
- Confirme que os UUIDs estão corretos
- Verifique na tabela user_roles se os dados foram inseridos
