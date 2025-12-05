import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOrganization } from './useOrganization';

interface WeeklyData {
  day: string;
  count: number;
}

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
  weeklyPerformance: WeeklyData[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook para buscar métricas do time/gestor
 * FILTRADO POR ORGANIZAÇÃO para isolamento multi-tenant
 * Atualiza automaticamente a cada 30 segundos
 */
export const useTeamMetrics = (teamId: string | null): TeamMetrics => {
  const { organizationId } = useOrganization();
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

  const fetchMetrics = useCallback(async () => {
    if (!teamId || !organizationId) {
      setMetrics(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

      // Buscar IDs dos agentes do time
      const { data: teamAgents, error: agentsError } = await supabase
        .from('agent_profiles')
        .select('id')
        .eq('team_id', teamId);

      if (agentsError) throw agentsError;

      const agentIds = (teamAgents || []).map(a => a.id);

      if (agentIds.length === 0) {
        setMetrics(prev => ({ ...prev, loading: false }));
        return;
      }

      // Query 1: Conversas ativas do time (filtrado por org)
      const { count: activeCount, error: activeError } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .in('assigned_agent_id', agentIds)
        .eq('status', 'active')
        .eq('organization_id', organizationId);

      if (activeError) throw activeError;

      // Query 2: Conversas finalizadas hoje (filtrado por org)
      const { count: finishedCount, error: finishedError } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .in('assigned_agent_id', agentIds)
        .eq('status', 'finished')
        .eq('organization_id', organizationId)
        .gte('finished_at', today);

      if (finishedError) throw finishedError;

      // Query 3: Conversas na fila (queues do time, filtrado por org)
      const { data: teamQueues } = await supabase
        .from('queues')
        .select('id')
        .eq('team_id', teamId)
        .eq('organization_id', organizationId);

      const queueIds = (teamQueues || []).map(q => q.id);

      let queueCount = 0;
      if (queueIds.length > 0) {
        const { count, error: queueError } = await supabase
          .from('conversations')
          .select('*', { count: 'exact', head: true })
          .in('queue_id', queueIds)
          .eq('status', 'waiting')
          .eq('organization_id', organizationId);

        if (queueError) throw queueError;
        queueCount = count || 0;
      }

      // Query 4: Conversas ativas por agente (filtrado por org)
      const { data: agentConvsData, error: agentConvsError } = await supabase
        .from('conversations')
        .select('assigned_agent_id')
        .in('assigned_agent_id', agentIds)
        .eq('status', 'active')
        .eq('organization_id', organizationId);

      if (agentConvsError) throw agentConvsError;

      const agentConversations = agentIds.map(agentId => ({
        agentId,
        activeCount: (agentConvsData || []).filter(c => c.assigned_agent_id === agentId).length,
      }));

      // Query 5: Top 3 performers do time (conversas finalizadas hoje, filtrado por org)
      const { data: topPerformersData, error: topError } = await supabase
        .from('conversations')
        .select(`
          assigned_agent_id,
          agent_profiles!fk_conversations_agent(id, display_name)
        `)
        .in('assigned_agent_id', agentIds)
        .eq('status', 'finished')
        .eq('organization_id', organizationId)
        .gte('finished_at', today);

      if (topError) throw topError;

      // Agrupar por agente e contar
      const performerCounts = (topPerformersData || []).reduce((acc: any, conv: any) => {
        const agentId = conv.assigned_agent_id;
        if (!acc[agentId]) {
          acc[agentId] = {
            id: agentId,
            displayName: conv.agent_profiles?.display_name || 'Agente',
            conversationsCount: 0,
          };
        }
        acc[agentId].conversationsCount++;
        return acc;
      }, {});

      const topPerformers = Object.values(performerCounts)
        .sort((a: any, b: any) => b.conversationsCount - a.conversationsCount)
        .slice(0, 3) as TopPerformer[];

      // Query 6: Conversas próximas ao SLA (mais de 30 min ativas, filtrado por org)
      const { count: nearSlaCount, error: slaError } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .in('assigned_agent_id', agentIds)
        .eq('status', 'active')
        .eq('organization_id', organizationId)
        .lt('started_at', thirtyMinutesAgo);

      if (slaError) throw slaError;

      // Query 7: Desempenho semanal do time (filtrado por org)
      const { data: weeklyData, error: weeklyError } = await supabase
        .from('conversations')
        .select('finished_at')
        .in('assigned_agent_id', agentIds)
        .eq('status', 'finished')
        .eq('organization_id', organizationId)
        .gte('finished_at', sevenDaysAgo)
        .order('finished_at', { ascending: true });

      if (weeklyError) throw weeklyError;

      const weeklyGrouped = (weeklyData || []).reduce((acc, conv) => {
        const day = conv.finished_at.split('T')[0];
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const weeklyPerformance: WeeklyData[] = Object.entries(weeklyGrouped).map(([day, count]) => ({
        day,
        count,
      }));

      // Query 8: Tempo médio de resposta do time (simplificado, filtrado por org)
      const { data: conversationsWithMessages, error: convError } = await supabase
        .from('conversations')
        .select(`
          id,
          started_at,
          messages(created_at, sender_type)
        `)
        .in('assigned_agent_id', agentIds)
        .eq('status', 'finished')
        .eq('organization_id', organizationId)
        .gte('finished_at', today)
        .limit(30); // Limitar para performance

      if (convError) throw convError;

      let totalResponseTime = 0;
      let validResponses = 0;

      (conversationsWithMessages || []).forEach((conv: any) => {
        const messages = conv.messages || [];
        const clientFirstMsg = messages.find((m: any) => m.sender_type === 'client');
        const agentFirstMsg = messages.find((m: any) => m.sender_type === 'agent');

        if (clientFirstMsg && agentFirstMsg) {
          const clientTime = new Date(clientFirstMsg.created_at).getTime();
          const agentTime = new Date(agentFirstMsg.created_at).getTime();
          const diff = (agentTime - clientTime) / 1000;

          if (diff > 0 && diff < 3600) {
            totalResponseTime += diff;
            validResponses++;
          }
        }
      });

      const avgSeconds = validResponses > 0 ? totalResponseTime / validResponses : 0;

      setMetrics({
        activeConversations: activeCount || 0,
        finishedToday: finishedCount || 0,
        conversationsInQueue: queueCount,
        avgResponseTime: formatSeconds(avgSeconds),
        agentConversations,
        topPerformers,
        nearSlaCount: nearSlaCount || 0,
        weeklyPerformance,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching team metrics:', error);
      setMetrics(prev => ({
        ...prev,
        loading: false,
        error: error as Error,
      }));
    }
  }, [teamId, organizationId]);

  useEffect(() => {
    if (teamId && organizationId) {
      fetchMetrics();
    }
  }, [teamId, organizationId, fetchMetrics]);

  useEffect(() => {
    if (!teamId || !organizationId) return;

    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [teamId, organizationId, fetchMetrics]);

  return metrics;
};

function formatSeconds(seconds: number): string {
  if (seconds === 0) return '--';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  
  const minutes = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  
  if (minutes < 60) {
    return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}
