import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
 * Atualiza automaticamente a cada 30 segundos
 */
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

  const fetchMetrics = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Query 1: Total de agentes
      const { count: totalAgents, error: agentsError } = await supabase
        .from('agent_profiles')
        .select('*', { count: 'exact', head: true });

      if (agentsError) throw agentsError;

      // Query 2: Agentes online
      const { count: agentsOnline, error: onlineError } = await supabase
        .from('agent_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'online');

      if (onlineError) throw onlineError;

      // Query 3: Total de times
      const { count: totalTeams, error: teamsError } = await supabase
        .from('teams')
        .select('*', { count: 'exact', head: true });

      if (teamsError) throw teamsError;

      // Query 4: Conversas iniciadas hoje
      const { count: conversationsToday, error: todayError } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .gte('started_at', today);

      if (todayError) throw todayError;

      // Query 5: Conversas no mês
      const { count: conversationsMonth, error: monthError } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .gte('started_at', firstDayOfMonth);

      if (monthError) throw monthError;

      // Query 6: Taxa de resolução (% de conversas finalizadas hoje)
      const { count: finishedToday } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'finished')
        .gte('finished_at', today);

      const resolutionRate = conversationsToday 
        ? Math.round(((finishedToday || 0) / conversationsToday) * 100) 
        : 0;

      // Query 7: Distribuição por canal (últimos 30 dias)
      const { data: channelData, error: channelError } = await supabase
        .from('conversations')
        .select(`
          channel_id,
          channels(id, name, type)
        `)
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

      // Query 8: Performance por time (top 5)
      const { data: teamsData, error: teamsDataError } = await supabase
        .from('teams')
        .select(`
          id,
          name,
          agent_profiles(id)
        `)
        .limit(5);

      if (teamsDataError) throw teamsDataError;

      const teamPerformancePromises = (teamsData || []).map(async (team: any) => {
        const agentIds = (team.agent_profiles || []).map((a: any) => a.id);
        
        let conversationsCount = 0;
        if (agentIds.length > 0) {
          const { count } = await supabase
            .from('conversations')
            .select('*', { count: 'exact', head: true })
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

      // Query 9: Atividade em tempo real (conversas ativas)
      const { data: liveData, error: liveError } = await supabase
        .from('conversations')
        .select(`
          id,
          status,
          started_at,
          updated_at,
          clients(name),
          agent_profiles(display_name),
          channels(type)
        `)
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

      // Query 10: Desempenho semanal global
      const { data: weeklyData, error: weeklyError } = await supabase
        .from('conversations')
        .select('finished_at')
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

      // Query 11: Tempo médio de resposta global
      const { data: conversationsWithMessages, error: convError } = await supabase
        .from('conversations')
        .select(`
          id,
          started_at,
          messages(created_at, sender_type)
        `)
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
        totalAgents: totalAgents || 0,
        agentsOnline: agentsOnline || 0,
        totalTeams: totalTeams || 0,
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
      console.error('Error fetching admin metrics:', error);
      setMetrics(prev => ({
        ...prev,
        loading: false,
        error: error as Error,
      }));
    }
  }, []);

  useEffect(() => {
    fetchMetrics();

    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

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
