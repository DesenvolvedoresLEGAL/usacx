# 📊 Plano Detalhado: Conectar Dashboards a Métricas Reais

## 🎯 Objetivo
Substituir todos os dados mockados nos três dashboards (Agent, Manager, Admin) por métricas reais calculadas a partir das tabelas `conversations`, `messages`, `agent_profiles`, e `teams` do banco de dados.

---

## 📋 Inventário de Métricas Atuais (Mock)

### 1️⃣ **AgentDashboard** (Dashboard do Agente)
| Métrica | Valor Mock | Fonte Real Necessária |
|---------|------------|----------------------|
| Conversas Ativas | `5` | `COUNT(conversations WHERE status='active' AND assigned_agent_id=current_agent)` |
| Tempo Médio de Resposta | `"2m 30s"` | `AVG(tempo_resposta) das messages do agente` |
| Finalizadas Hoje | `12` | `COUNT(conversations WHERE status='finished' AND finished_at >= today AND assigned_agent_id=current_agent)` |
| Satisfação | `4.8/5.0` | `AVG(evaluation_score)` quando tivermos tabela de avaliações |
| Desempenho Semanal (gráfico) | Array fixo | `COUNT(conversations) GROUP BY day dos últimos 7 dias` |
| Objetivos Diários | Mock (12/15, 4.8/5.0) | Cálculos baseados em metas vs. realizações |
| Entrada/Tempo Trabalhado/Pausas | Mock | Quando implementarmos time tracking/attendance logs |

### 2️⃣ **ManagerDashboard** (Dashboard do Gestor)
| Métrica | Valor Mock | Fonte Real Necessária |
|---------|------------|----------------------|
| Total de Agentes | `members.length` | ✅ **JÁ REAL** (vem do hook useTeam) |
| Ativos Agora | `filter(status='online')` | ✅ **JÁ REAL** (vem do hook useTeam) |
| Tempo Médio (Time) | `"3m 15s"` | `AVG(tempo_resposta) de todos os agentes do team` |
| Satisfação (Time) | `4.6/5.0` | `AVG(evaluation_score) de todos os agentes do team` |
| Conversas na Fila | `8` | `COUNT(conversations WHERE status='waiting' AND queue_id IN team_queues)` |
| Performance Semanal | Array fixo | `COUNT(conversations) GROUP BY day dos últimos 7 dias do team` |
| Status dos Agentes | ✅ **JÁ REAL** | Avatar, nome, status vêm do useTeam |
| Conversas por Agente | `"5 conversas"` | `COUNT(conversations) per agent WHERE status='active'` |
| Top Performers | Mock (João, Maria, Pedro) | `SELECT agent, COUNT(*) FROM conversations WHERE finished_at >= today GROUP BY agent ORDER BY count DESC LIMIT 3` |
| Alertas (Fila, SLA) | Mock | Queries de conversas aguardando + tempo de espera |

### 3️⃣ **AdminDashboard** (Dashboard Admin)
| Métrica | Valor Mock | Fonte Real Necessária |
|---------|------------|----------------------|
| Total de Agentes | `45` | `COUNT(agent_profiles)` |
| Ativos Agora | `32` | `COUNT(agent_profiles WHERE status='online')` |
| Total de Times | `teams.length` | ✅ **JÁ REAL** (vem do hook useAllTeams) |
| Conversas Hoje | `156` | `COUNT(conversations WHERE started_at >= today)` |
| Total no Mês | `1248` | `COUNT(conversations WHERE started_at >= first_day_of_month)` |
| Satisfação Geral | `4.7/5.0` | `AVG(evaluation_score) de todas as conversations` |
| Performance Global (gráfico) | Array fixo | `COUNT(conversations) GROUP BY day dos últimos 7 dias (global)` |
| Canais de Atendimento | Array fixo | `COUNT(conversations) GROUP BY channel_id` |
| Performance por Time | Mock | `SELECT team, COUNT(*), AVG(satisfaction) FROM conversations JOIN agents ON ... GROUP BY team` |
| Estatísticas do Sistema | Mock | Queries agregadas de capacidade, taxa de resolução, SLA |
| Atividade em Tempo Real | Mock | `SELECT * FROM conversations WHERE status='active' ORDER BY updated_at DESC` |

---

## 🗄️ Estrutura de Dados e Queries SQL

### **Query 1: Métricas do Agente Individual**
```sql
-- Conversas ativas do agente
SELECT COUNT(*) as active_count
FROM conversations
WHERE assigned_agent_id = $agent_id
  AND status = 'active';

-- Conversas finalizadas hoje
SELECT COUNT(*) as finished_today
FROM conversations
WHERE assigned_agent_id = $agent_id
  AND status = 'finished'
  AND finished_at >= CURRENT_DATE;

-- Conversas finalizadas na última semana (para gráfico)
SELECT 
  DATE_TRUNC('day', finished_at) as day,
  COUNT(*) as count
FROM conversations
WHERE assigned_agent_id = $agent_id
  AND status = 'finished'
  AND finished_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE_TRUNC('day', finished_at)
ORDER BY day ASC;

-- Tempo médio de resposta (primeira resposta do agente)
-- Precisa calcular a diferença entre primeira mensagem do cliente e primeira do agente
WITH first_messages AS (
  SELECT 
    m.conversation_id,
    MIN(CASE WHEN m.sender_type = 'client' THEN m.created_at END) as client_first,
    MIN(CASE WHEN m.sender_type = 'agent' THEN m.created_at END) as agent_first
  FROM messages m
  JOIN conversations c ON c.id = m.conversation_id
  WHERE c.assigned_agent_id = $agent_id
    AND c.finished_at >= CURRENT_DATE
  GROUP BY m.conversation_id
)
SELECT AVG(EXTRACT(EPOCH FROM (agent_first - client_first))) as avg_response_seconds
FROM first_messages
WHERE agent_first IS NOT NULL AND client_first IS NOT NULL;
```

### **Query 2: Métricas do Time (Manager)**
```sql
-- Conversas ativas dos agentes do time
SELECT COUNT(*) as team_active_count
FROM conversations c
JOIN agent_profiles ap ON c.assigned_agent_id = ap.id
WHERE ap.team_id = $team_id
  AND c.status = 'active';

-- Conversas finalizadas pelos agentes do time hoje
SELECT COUNT(*) as team_finished_today
FROM conversations c
JOIN agent_profiles ap ON c.assigned_agent_id = ap.id
WHERE ap.team_id = $team_id
  AND c.status = 'finished'
  AND c.finished_at >= CURRENT_DATE;

-- Conversas na fila do time
SELECT COUNT(*) as queue_count
FROM conversations c
WHERE c.queue_id IN (
  SELECT id FROM queues WHERE team_id = $team_id
)
AND c.status = 'waiting';

-- Top 3 agentes do time (por conversas finalizadas hoje)
SELECT 
  ap.id,
  ap.display_name,
  COUNT(*) as conversations_finished
FROM conversations c
JOIN agent_profiles ap ON c.assigned_agent_id = ap.id
WHERE ap.team_id = $team_id
  AND c.status = 'finished'
  AND c.finished_at >= CURRENT_DATE
GROUP BY ap.id, ap.display_name
ORDER BY conversations_finished DESC
LIMIT 3;

-- Conversas ativas por agente (para badges)
SELECT 
  ap.id,
  COUNT(*) as active_conversations
FROM conversations c
JOIN agent_profiles ap ON c.assigned_agent_id = ap.id
WHERE ap.team_id = $team_id
  AND c.status = 'active'
GROUP BY ap.id;

-- Tempo médio de resposta do time
WITH first_messages AS (
  SELECT 
    m.conversation_id,
    MIN(CASE WHEN m.sender_type = 'client' THEN m.created_at END) as client_first,
    MIN(CASE WHEN m.sender_type = 'agent' THEN m.created_at END) as agent_first
  FROM messages m
  JOIN conversations c ON c.id = m.conversation_id
  JOIN agent_profiles ap ON c.assigned_agent_id = ap.id
  WHERE ap.team_id = $team_id
    AND c.finished_at >= CURRENT_DATE
  GROUP BY m.conversation_id
)
SELECT AVG(EXTRACT(EPOCH FROM (agent_first - client_first))) as avg_response_seconds
FROM first_messages
WHERE agent_first IS NOT NULL AND client_first IS NOT NULL;

-- Conversas próximas ao SLA (alertas)
SELECT COUNT(*) as near_sla_count
FROM conversations c
JOIN agent_profiles ap ON c.assigned_agent_id = ap.id
WHERE ap.team_id = $team_id
  AND c.status = 'active'
  AND c.started_at < NOW() - INTERVAL '30 minutes'; -- exemplo: SLA de 30 min
```

### **Query 3: Métricas Globais (Admin)**
```sql
-- Total de agentes na plataforma
SELECT COUNT(*) as total_agents
FROM agent_profiles;

-- Agentes online agora
SELECT COUNT(*) as agents_online
FROM agent_profiles
WHERE status = 'online';

-- Total de times
SELECT COUNT(*) as total_teams
FROM teams;

-- Conversas iniciadas hoje
SELECT COUNT(*) as conversations_today
FROM conversations
WHERE started_at >= CURRENT_DATE;

-- Total de conversas no mês
SELECT COUNT(*) as conversations_month
FROM conversations
WHERE started_at >= DATE_TRUNC('month', CURRENT_DATE);

-- Distribuição por canal
SELECT 
  ch.name as channel_name,
  ch.type as channel_type,
  COUNT(*) as conversation_count
FROM conversations c
JOIN channels ch ON c.channel_id = ch.id
WHERE c.started_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY ch.id, ch.name, ch.type
ORDER BY conversation_count DESC;

-- Performance por time (ranking)
SELECT 
  t.id,
  t.name,
  COUNT(DISTINCT ap.id) as agent_count,
  COUNT(c.id) as conversations_count
FROM teams t
LEFT JOIN agent_profiles ap ON ap.team_id = t.id
LEFT JOIN conversations c ON c.assigned_agent_id = ap.id 
  AND c.finished_at >= CURRENT_DATE
GROUP BY t.id, t.name
ORDER BY conversations_count DESC
LIMIT 5;

-- Conversas ativas no momento (para Live Activity Table)
SELECT 
  c.id,
  c.status,
  c.started_at,
  c.updated_at,
  cl.name as client_name,
  ap.display_name as agent_name,
  ch.type as channel_type
FROM conversations c
JOIN clients cl ON c.client_id = cl.id
LEFT JOIN agent_profiles ap ON c.assigned_agent_id = ap.id
JOIN channels ch ON c.channel_id = ch.id
WHERE c.status = 'active'
ORDER BY c.updated_at DESC
LIMIT 10;

-- Taxa de resolução (% de conversas finalizadas vs. total)
SELECT 
  COUNT(CASE WHEN status = 'finished' THEN 1 END)::float / 
  NULLIF(COUNT(*), 0) * 100 as resolution_rate
FROM conversations
WHERE started_at >= CURRENT_DATE;

-- Tempo médio de resposta global
WITH first_messages AS (
  SELECT 
    m.conversation_id,
    MIN(CASE WHEN m.sender_type = 'client' THEN m.created_at END) as client_first,
    MIN(CASE WHEN m.sender_type = 'agent' THEN m.created_at END) as agent_first
  FROM messages m
  JOIN conversations c ON c.id = m.conversation_id
  WHERE c.finished_at >= CURRENT_DATE
  GROUP BY m.conversation_id
)
SELECT AVG(EXTRACT(EPOCH FROM (agent_first - client_first))) as avg_response_seconds
FROM first_messages
WHERE agent_first IS NOT NULL AND client_first IS NOT NULL;
```

---

## 🔧 Implementação: Hooks Customizados

### **Hook 1: `useAgentMetrics.ts`**
```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentAgent } from './useCurrentAgent';

interface AgentMetrics {
  activeConversations: number;
  finishedToday: number;
  avgResponseTime: string; // formatado como "2m 30s"
  weeklyPerformance: { day: string; count: number }[];
  loading: boolean;
  error: Error | null;
}

export const useAgentMetrics = (): AgentMetrics => {
  const currentAgent = useCurrentAgent();
  const [metrics, setMetrics] = useState<AgentMetrics>({
    activeConversations: 0,
    finishedToday: 0,
    avgResponseTime: '--',
    weeklyPerformance: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!currentAgent?.profile?.id) return;

    const fetchMetrics = async () => {
      try {
        // Query 1: Conversas ativas
        const { count: activeCount } = await supabase
          .from('conversations')
          .select('*', { count: 'exact', head: true })
          .eq('assigned_agent_id', currentAgent.profile.id)
          .eq('status', 'active');

        // Query 2: Conversas finalizadas hoje
        const today = new Date().toISOString().split('T')[0];
        const { count: finishedCount } = await supabase
          .from('conversations')
          .select('*', { count: 'exact', head: true })
          .eq('assigned_agent_id', currentAgent.profile.id)
          .eq('status', 'finished')
          .gte('finished_at', today);

        // Query 3: Desempenho semanal
        const { data: weeklyData } = await supabase.rpc('get_agent_weekly_performance', {
          _agent_id: currentAgent.profile.id
        });

        // Query 4: Tempo médio de resposta
        const { data: avgTimeData } = await supabase.rpc('get_agent_avg_response_time', {
          _agent_id: currentAgent.profile.id
        });

        setMetrics({
          activeConversations: activeCount || 0,
          finishedToday: finishedCount || 0,
          avgResponseTime: formatSeconds(avgTimeData?.[0]?.avg_response_seconds || 0),
          weeklyPerformance: weeklyData || [],
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching agent metrics:', error);
        setMetrics(prev => ({ ...prev, loading: false, error: error as Error }));
      }
    };

    fetchMetrics();

    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [currentAgent?.profile?.id]);

  return metrics;
};

// Helper function
function formatSeconds(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${minutes}m ${secs}s`;
}
```

### **Hook 2: `useTeamMetrics.ts`**
```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AgentConversations {
  agentId: string;
  activeCount: number;
}

interface TopPerformer {
  id: string;
  displayName: string;
  conversationsCount: number;
}

interface TeamMetrics {
  activeConversations: number;
  finishedToday: number;
  conversationsInQueue: number;
  avgResponseTime: string;
  agentConversations: AgentConversations[];
  topPerformers: TopPerformer[];
  nearSlaCount: number;
  weeklyPerformance: { day: string; count: number }[];
  loading: boolean;
  error: Error | null;
}

export const useTeamMetrics = (teamId: string | null): TeamMetrics => {
  const [metrics, setMetrics] = useState<TeamMetrics>({
    activeConversations: 0,
    finishedToday: 0,
    conversationsInQueue: 0,
    avgResponseTime: '--',
    agentConversations: [],
    topPerformers: [],
    nearSlaCount: 0,
    weeklyPerformance: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!teamId) return;

    const fetchMetrics = async () => {
      try {
        // Múltiplas queries em paralelo para performance
        const [
          activeResult,
          finishedResult,
          queueResult,
          avgTimeResult,
          agentConvsResult,
          topPerformersResult,
          nearSlaResult,
          weeklyResult,
        ] = await Promise.all([
          // Conversas ativas do time
          supabase.rpc('get_team_active_conversations', { _team_id: teamId }),
          
          // Conversas finalizadas hoje
          supabase.rpc('get_team_finished_today', { _team_id: teamId }),
          
          // Conversas na fila
          supabase.rpc('get_team_queue_count', { _team_id: teamId }),
          
          // Tempo médio de resposta
          supabase.rpc('get_team_avg_response_time', { _team_id: teamId }),
          
          // Conversas ativas por agente
          supabase.rpc('get_team_agent_conversations', { _team_id: teamId }),
          
          // Top 3 performers
          supabase.rpc('get_team_top_performers', { _team_id: teamId, _limit: 3 }),
          
          // Conversas próximas ao SLA
          supabase.rpc('get_team_near_sla_count', { _team_id: teamId }),
          
          // Performance semanal
          supabase.rpc('get_team_weekly_performance', { _team_id: teamId }),
        ]);

        setMetrics({
          activeConversations: activeResult.data?.[0]?.count || 0,
          finishedToday: finishedResult.data?.[0]?.count || 0,
          conversationsInQueue: queueResult.data?.[0]?.count || 0,
          avgResponseTime: formatSeconds(avgTimeResult.data?.[0]?.avg_response_seconds || 0),
          agentConversations: agentConvsResult.data || [],
          topPerformers: topPerformersResult.data || [],
          nearSlaCount: nearSlaResult.data?.[0]?.count || 0,
          weeklyPerformance: weeklyResult.data || [],
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching team metrics:', error);
        setMetrics(prev => ({ ...prev, loading: false, error: error as Error }));
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [teamId]);

  return metrics;
};

function formatSeconds(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${minutes}m ${secs}s`;
}
```

### **Hook 3: `useAdminMetrics.ts`**
```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ChannelDistribution {
  channelName: string;
  channelType: string;
  count: number;
}

interface TeamPerformance {
  teamId: string;
  teamName: string;
  agentCount: number;
  conversationsCount: number;
}

interface LiveActivity {
  id: string;
  status: string;
  startedAt: string;
  clientName: string;
  agentName: string | null;
  channelType: string;
}

interface AdminMetrics {
  totalAgents: number;
  agentsOnline: number;
  totalTeams: number;
  conversationsToday: number;
  conversationsMonth: number;
  resolutionRate: number;
  avgResponseTime: string;
  channelDistribution: ChannelDistribution[];
  teamPerformance: TeamPerformance[];
  liveActivity: LiveActivity[];
  weeklyPerformance: { day: string; count: number }[];
  loading: boolean;
  error: Error | null;
}

export const useAdminMetrics = (): AdminMetrics => {
  const [metrics, setMetrics] = useState<AdminMetrics>({
    totalAgents: 0,
    agentsOnline: 0,
    totalTeams: 0,
    conversationsToday: 0,
    conversationsMonth: 0,
    resolutionRate: 0,
    avgResponseTime: '--',
    channelDistribution: [],
    teamPerformance: [],
    liveActivity: [],
    weeklyPerformance: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [
          agentsResult,
          onlineResult,
          teamsResult,
          todayResult,
          monthResult,
          resolutionResult,
          avgTimeResult,
          channelsResult,
          teamsPerformanceResult,
          liveResult,
          weeklyResult,
        ] = await Promise.all([
          supabase.from('agent_profiles').select('*', { count: 'exact', head: true }),
          supabase.from('agent_profiles').select('*', { count: 'exact', head: true }).eq('status', 'online'),
          supabase.from('teams').select('*', { count: 'exact', head: true }),
          supabase.rpc('get_conversations_today_count'),
          supabase.rpc('get_conversations_month_count'),
          supabase.rpc('get_resolution_rate'),
          supabase.rpc('get_global_avg_response_time'),
          supabase.rpc('get_channel_distribution'),
          supabase.rpc('get_team_performance_ranking', { _limit: 5 }),
          supabase.rpc('get_live_activity', { _limit: 10 }),
          supabase.rpc('get_global_weekly_performance'),
        ]);

        setMetrics({
          totalAgents: agentsResult.count || 0,
          agentsOnline: onlineResult.count || 0,
          totalTeams: teamsResult.count || 0,
          conversationsToday: todayResult.data?.[0]?.count || 0,
          conversationsMonth: monthResult.data?.[0]?.count || 0,
          resolutionRate: resolutionResult.data?.[0]?.rate || 0,
          avgResponseTime: formatSeconds(avgTimeResult.data?.[0]?.avg_response_seconds || 0),
          channelDistribution: channelsResult.data || [],
          teamPerformance: teamsPerformanceResult.data || [],
          liveActivity: liveResult.data || [],
          weeklyPerformance: weeklyResult.data || [],
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching admin metrics:', error);
        setMetrics(prev => ({ ...prev, loading: false, error: error as Error }));
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  return metrics;
};

function formatSeconds(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${minutes}m ${secs}s`;
}
```

---

## 🛠️ Database Functions (RPC) Necessárias

Precisamos criar funções PostgreSQL para otimizar as queries agregadas complexas:

### **Function 1: `get_agent_weekly_performance`**
```sql
CREATE OR REPLACE FUNCTION get_agent_weekly_performance(_agent_id uuid)
RETURNS TABLE (day date, count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE_TRUNC('day', finished_at)::date as day,
    COUNT(*) as count
  FROM conversations
  WHERE assigned_agent_id = _agent_id
    AND status = 'finished'
    AND finished_at >= CURRENT_DATE - INTERVAL '7 days'
  GROUP BY DATE_TRUNC('day', finished_at)
  ORDER BY day ASC;
END;
$$;
```

### **Function 2: `get_agent_avg_response_time`**
```sql
CREATE OR REPLACE FUNCTION get_agent_avg_response_time(_agent_id uuid)
RETURNS TABLE (avg_response_seconds numeric)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH first_messages AS (
    SELECT 
      m.conversation_id,
      MIN(CASE WHEN m.sender_type = 'client' THEN m.created_at END) as client_first,
      MIN(CASE WHEN m.sender_type = 'agent' THEN m.created_at END) as agent_first
    FROM messages m
    JOIN conversations c ON c.id = m.conversation_id
    WHERE c.assigned_agent_id = _agent_id
      AND c.finished_at >= CURRENT_DATE
    GROUP BY m.conversation_id
  )
  SELECT AVG(EXTRACT(EPOCH FROM (agent_first - client_first)))::numeric as avg_response_seconds
  FROM first_messages
  WHERE agent_first IS NOT NULL AND client_first IS NOT NULL;
END;
$$;
```

### **Function 3: `get_team_active_conversations`**
```sql
CREATE OR REPLACE FUNCTION get_team_active_conversations(_team_id uuid)
RETURNS TABLE (count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT COUNT(*)
  FROM conversations c
  JOIN agent_profiles ap ON c.assigned_agent_id = ap.id
  WHERE ap.team_id = _team_id
    AND c.status = 'active';
END;
$$;
```

### **Function 4: `get_team_top_performers`**
```sql
CREATE OR REPLACE FUNCTION get_team_top_performers(_team_id uuid, _limit integer DEFAULT 3)
RETURNS TABLE (
  id uuid,
  display_name text,
  conversations_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ap.id,
    ap.display_name,
    COUNT(c.id) as conversations_count
  FROM agent_profiles ap
  LEFT JOIN conversations c ON c.assigned_agent_id = ap.id 
    AND c.status = 'finished'
    AND c.finished_at >= CURRENT_DATE
  WHERE ap.team_id = _team_id
  GROUP BY ap.id, ap.display_name
  ORDER BY conversations_count DESC
  LIMIT _limit;
END;
$$;
```

### **Function 5: `get_channel_distribution`**
```sql
CREATE OR REPLACE FUNCTION get_channel_distribution()
RETURNS TABLE (
  channel_name text,
  channel_type channel_type,
  count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ch.name,
    ch.type,
    COUNT(c.id) as count
  FROM channels ch
  LEFT JOIN conversations c ON c.channel_id = ch.id 
    AND c.started_at >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY ch.id, ch.name, ch.type
  ORDER BY count DESC;
END;
$$;
```

### **Function 6: `get_live_activity`**
```sql
CREATE OR REPLACE FUNCTION get_live_activity(_limit integer DEFAULT 10)
RETURNS TABLE (
  id uuid,
  status conversation_status,
  started_at timestamptz,
  client_name text,
  agent_name text,
  channel_type channel_type
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.status,
    c.started_at,
    cl.name as client_name,
    ap.display_name as agent_name,
    ch.type as channel_type
  FROM conversations c
  JOIN clients cl ON c.client_id = cl.id
  LEFT JOIN agent_profiles ap ON c.assigned_agent_id = ap.id
  JOIN channels ch ON c.channel_id = ch.id
  WHERE c.status = 'active'
  ORDER BY c.updated_at DESC
  LIMIT _limit;
END;
$$;
```

### **Outras Functions Necessárias**
```sql
-- get_team_finished_today
-- get_team_queue_count
-- get_team_avg_response_time
-- get_team_agent_conversations
-- get_team_near_sla_count
-- get_team_weekly_performance
-- get_conversations_today_count
-- get_conversations_month_count
-- get_resolution_rate
-- get_global_avg_response_time
-- get_team_performance_ranking
-- get_global_weekly_performance
```

*(Estrutura similar às anteriores, adaptadas para cada contexto)*

---

## 📝 Plano de Implementação (Step-by-Step)

### **FASE 1: Criar Database Functions** ⏱️ ~2-3 horas
1. Criar arquivo de migração com todas as 18 functions RPC
2. Testar cada function individualmente no Supabase
3. Verificar RLS e permissões de execução

### **FASE 2: Criar Hooks Customizados** ⏱️ ~3-4 horas
1. Criar `src/hooks/useAgentMetrics.ts`
2. Criar `src/hooks/useTeamMetrics.ts`
3. Criar `src/hooks/useAdminMetrics.ts`
4. Testar hooks isoladamente com console.log

### **FASE 3: Integrar AgentDashboard** ⏱️ ~1-2 horas
1. Substituir dados mock pelo hook `useAgentMetrics`
2. Atualizar componente AttendanceChart para receber dados reais
3. Adicionar loading states e error handling
4. Testar com agente real do banco

### **FASE 4: Integrar ManagerDashboard** ⏱️ ~2-3 horas
1. Substituir dados mock pelo hook `useTeamMetrics`
2. Integrar contagem de conversas por agente nos badges
3. Substituir top performers mockados por dados reais
4. Atualizar alertas com dados reais
5. Testar com manager e time reais

### **FASE 5: Integrar AdminDashboard** ⏱️ ~2-3 horas
1. Substituir dados mock pelo hook `useAdminMetrics`
2. Integrar ChannelChart com distribuição real
3. Atualizar Performance por Time com dados reais
4. Substituir LiveActivityTable por dados reais
5. Atualizar estatísticas do sistema
6. Testar com admin

### **FASE 6: Polimento e Otimização** ⏱️ ~2 horas
1. Adicionar cache com React Query (opcional)
2. Implementar refresh automático (já feito nos hooks)
3. Melhorar loading skeletons
4. Adicionar error boundaries
5. Testar performance com muitos dados

---

## ⚡ Otimizações de Performance

### **1. Indexação do Banco de Dados**
```sql
-- Índices recomendados para performance de queries
CREATE INDEX IF NOT EXISTS idx_conversations_assigned_agent 
  ON conversations(assigned_agent_id, status, finished_at);

CREATE INDEX IF NOT EXISTS idx_conversations_team_lookup 
  ON conversations(assigned_agent_id) 
  INCLUDE (status, finished_at, started_at);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_sender 
  ON messages(conversation_id, sender_type, created_at);

CREATE INDEX IF NOT EXISTS idx_agent_profiles_team_status 
  ON agent_profiles(team_id, status);

CREATE INDEX IF NOT EXISTS idx_conversations_channel_date 
  ON conversations(channel_id, started_at);
```

### **2. Caching com React Query (Opcional)**
```typescript
import { useQuery } from '@tanstack/react-query';

export const useAgentMetrics = () => {
  const currentAgent = useCurrentAgent();
  
  return useQuery({
    queryKey: ['agentMetrics', currentAgent?.profile?.id],
    queryFn: () => fetchAgentMetrics(currentAgent?.profile?.id),
    staleTime: 30000, // Cache por 30 segundos
    refetchInterval: 30000, // Refetch automático a cada 30s
    enabled: !!currentAgent?.profile?.id,
  });
};
```

### **3. Realtime Subscriptions (Futuro)**
Quando quisermos atualizações instantâneas, podemos adicionar:
```typescript
useEffect(() => {
  const channel = supabase
    .channel('conversations-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'conversations',
      filter: `assigned_agent_id=eq.${agentId}`
    }, () => {
      // Refetch metrics imediatamente
      refetch();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [agentId]);
```

---

## ✅ Checklist de Validação

Antes de considerar completo, verificar:

- [ ] Todas as 18 database functions criadas e testadas
- [ ] Todos os 3 hooks customizados criados
- [ ] AgentDashboard 100% com dados reais
- [ ] ManagerDashboard 100% com dados reais
- [ ] AdminDashboard 100% com dados reais
- [ ] Loading states funcionando em todos os dashboards
- [ ] Error handling implementado
- [ ] Índices de banco criados para performance
- [ ] Testado com múltiplos usuários e roles
- [ ] Testado com banco vazio (sem conversas)
- [ ] Testado com muitos dados (performance)
- [ ] Formatação de tempo funcionando corretamente
- [ ] Gráficos renderizando dados reais
- [ ] Realtime refresh (30s) funcionando

---

## 🚀 Estimativa de Tempo Total

| Fase | Tempo Estimado |
|------|----------------|
| FASE 1: Database Functions | 2-3 horas |
| FASE 2: Hooks Customizados | 3-4 horas |
| FASE 3: AgentDashboard | 1-2 horas |
| FASE 4: ManagerDashboard | 2-3 horas |
| FASE 5: AdminDashboard | 2-3 horas |
| FASE 6: Polimento | 2 horas |
| **TOTAL** | **12-17 horas** |

---

## 📌 Próximos Passos Recomendados

Após implementar este plano:

1. **Adicionar tabela de Avaliações** para métricas de satisfação reais
2. **Implementar Time Tracking** para horários de trabalho e pausas
3. **Adicionar metas configuráveis** para substituir objetivos mockados
4. **Implementar cache de métricas** com reports_cache para dashboards pesados
5. **Criar alertas em tempo real** usando Supabase Realtime

---

## 🎯 Resultado Final Esperado

Ao final deste plano:
- ✅ **0% dados mockados** nos dashboards
- ✅ **100% dados reais** vindos do banco
- ✅ **Performance otimizada** com indexes e RPC functions
- ✅ **Atualização automática** a cada 30 segundos
- ✅ **Escalável** para milhares de conversas e agentes
- ✅ **Pronto para produção** com error handling e loading states

---

**Pronto para começar? 🚀**
Recomendo começar pela **FASE 1** criando as database functions, já que todo o resto depende delas.
