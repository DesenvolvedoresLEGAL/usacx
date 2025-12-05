import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOrganization } from './useOrganization';
import { logger } from '@/lib/logger';

interface WeeklyData {
  day: string;
  count: number;
}

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
  updatedAt: string;
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
  weeklyPerformance: WeeklyData[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook para buscar métricas globais do admin
 * FILTRADO POR ORGANIZAÇÃO para isolamento multi-tenant
 * Atualiza automaticamente a cada 30 segundos
 */
export const useAdminMetrics = (): AdminMetrics => {
  const { organizationId } = useOrganization();
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

  const fetchMetrics = useCallback(async () => {
    if (!organizationId) {
      setMetrics(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // FILTRO MULTI-TENANT: buscar times da organização
      // Usar hint explícito para FK devido a múltiplas relações
      const { data: teamsData, error: teamsDataError } = await supabase
        .from('teams')
        .select(`
          id,
          name,
          agent_profiles!fk_agent_profiles_team(id, status)
        `)
        .eq('organization_id', organizationId);

      if (teamsDataError) throw teamsDataError;

      const teamIds = (teamsData || []).map(t => t.id);
      const allAgentProfiles = (teamsData || []).flatMap((t: any) => t.agent_profiles || []);

      // Query 1: Total de agentes da organização
      const totalAgents = allAgentProfiles.length;

      // Query 2: Agentes online da organização
      const agentsOnline = allAgentProfiles.filter((a: any) => a.status === 'online').length;

      // Query 3: Total de times da organização
      const totalTeams = teamsData?.length || 0;

      // Query 4: Conversas iniciadas hoje (filtrado por org)
      const { count: conversationsToday, error: todayError } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organizationId)
        .gte('started_at', today);

      if (todayError) throw todayError;

      // Query 5: Conversas no mês (filtrado por org)
      const { count: conversationsMonth, error: monthError } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organizationId)
        .gte('started_at', firstDayOfMonth);

      if (monthError) throw monthError;

      // Query 6: Taxa de resolução (% de conversas finalizadas hoje)
      const { count: finishedToday } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organizationId)
        .eq('status', 'finished')
        .gte('finished_at', today);

      const resolutionRate = conversationsToday 
        ? Math.round(((finishedToday || 0) / conversationsToday) * 100) 
        : 0;

      // Query 7: Distribuição por canal (últimos 30 dias, filtrado por org)
      const { data: channelData, error: channelError } = await supabase
        .from('conversations')
        .select(`
          channel_id,
          channels!fk_conversations_channel(id, name, type)
        `)
        .eq('organization_id', organizationId)
        .gte('started_at', thirtyDaysAgo);

      if (channelError) throw channelError;

      const channelCounts = (channelData || []).reduce((acc: any, conv: any) => {
        const channel = conv.channels;
        if (channel) {
          const key = channel.id;
          if (!acc[key]) {
            acc[key] = {
              channelName: channel.name,
              channelType: channel.type,
              count: 0,
            };
          }
          acc[key].count++;
        }
        return acc;
      }, {});

      const channelDistribution: ChannelDistribution[] = Object.values(channelCounts);

      // Query 8: Performance por time (top 5 da org)
      const teamPerformancePromises = (teamsData || []).slice(0, 5).map(async (team: any) => {
        const agentIds = (team.agent_profiles || []).map((a: any) => a.id);
        
        let conversationsCount = 0;
        if (agentIds.length > 0) {
          const { count } = await supabase
            .from('conversations')
            .select('*', { count: 'exact', head: true })
            .eq('organization_id', organizationId)
            .in('assigned_agent_id', agentIds)
            .eq('status', 'finished')
            .gte('finished_at', today);
          
          conversationsCount = count || 0;
        }

        return {
          teamId: team.id,
          teamName: team.name,
          agentCount: agentIds.length,
          conversationsCount,
        };
      });

      const teamPerformance = await Promise.all(teamPerformancePromises);
      teamPerformance.sort((a, b) => b.conversationsCount - a.conversationsCount);

      // Query 9: Atividade em tempo real (conversas ativas da org)
      const { data: liveData, error: liveError } = await supabase
        .from('conversations')
        .select(`
          id,
          status,
          started_at,
          updated_at,
          clients!fk_conversations_client(name),
          agent_profiles!fk_conversations_agent(display_name),
          channels!fk_conversations_channel(type)
        `)
        .eq('organization_id', organizationId)
        .eq('status', 'active')
        .order('updated_at', { ascending: false })
        .limit(10);

      if (liveError) throw liveError;

      const liveActivity: LiveActivity[] = (liveData || []).map((conv: any) => ({
        id: conv.id,
        status: conv.status,
        startedAt: conv.started_at,
        updatedAt: conv.updated_at,
        clientName: conv.clients?.name || 'Cliente',
        agentName: conv.agent_profiles?.display_name || null,
        channelType: conv.channels?.type || 'webchat',
      }));

      // Query 10: Desempenho semanal global da org
      const { data: weeklyData, error: weeklyError } = await supabase
        .from('conversations')
        .select('finished_at')
        .eq('organization_id', organizationId)
        .eq('status', 'finished')
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

      // Query 11: Tempo médio de resposta global da org
      // Usar hint explícito para FK devido a múltiplas relações entre conversations e messages
      const { data: conversationsWithMessages, error: convError } = await supabase
        .from('conversations')
        .select(`
          id,
          started_at,
          messages!fk_messages_conversation(created_at, sender_type)
        `)
        .eq('organization_id', organizationId)
        .eq('status', 'finished')
        .gte('finished_at', today)
        .limit(50); // Limitar para performance

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
        totalAgents,
        agentsOnline,
        totalTeams,
        conversationsToday: conversationsToday || 0,
        conversationsMonth: conversationsMonth || 0,
        resolutionRate,
        avgResponseTime: formatSeconds(avgSeconds),
        channelDistribution,
        teamPerformance,
        liveActivity,
        weeklyPerformance,
        loading: false,
        error: null,
      });
    } catch (error) {
      logger.error('Error fetching admin metrics', { error });
      setMetrics(prev => ({
        ...prev,
        loading: false,
        error: error as Error,
      }));
    }
  }, [organizationId]);

  useEffect(() => {
    if (organizationId) {
      fetchMetrics();
    }
  }, [organizationId, fetchMetrics]);

  useEffect(() => {
    if (!organizationId) return;

    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [organizationId, fetchMetrics]);

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
