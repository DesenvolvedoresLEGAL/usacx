import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentAgent } from './useCurrentAgent';

interface WeeklyData {
  day: string;
  count: number;
}

interface AgentMetrics {
  activeConversations: number;
  finishedToday: number;
  avgResponseTime: string;
  weeklyPerformance: WeeklyData[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook para buscar métricas do agente individual
 * Atualiza automaticamente a cada 30 segundos
 */
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

  const fetchMetrics = useCallback(async () => {
    if (!currentAgent?.profile?.id) {
      setMetrics(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      const agentId = currentAgent.profile.id;
      const today = new Date().toISOString().split('T')[0];
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Query 1: Conversas ativas
      const { count: activeCount, error: activeError } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('assigned_agent_id', agentId)
        .eq('status', 'active');

      if (activeError) throw activeError;

      // Query 2: Conversas finalizadas hoje
      const { count: finishedCount, error: finishedError } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('assigned_agent_id', agentId)
        .eq('status', 'finished')
        .gte('finished_at', today);

      if (finishedError) throw finishedError;

      // Query 3: Desempenho semanal (últimos 7 dias)
      const { data: weeklyData, error: weeklyError } = await supabase
        .from('conversations')
        .select('finished_at')
        .eq('assigned_agent_id', agentId)
        .eq('status', 'finished')
        .gte('finished_at', sevenDaysAgo)
        .order('finished_at', { ascending: true });

      if (weeklyError) throw weeklyError;

      // Agrupar por dia
      const weeklyGrouped = (weeklyData || []).reduce((acc, conv) => {
        const day = conv.finished_at.split('T')[0];
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const weeklyPerformance: WeeklyData[] = Object.entries(weeklyGrouped).map(([day, count]) => ({
        day,
        count,
      }));

      // Query 4: Tempo médio de resposta (simplificado)
      // Busca conversas finalizadas hoje com mensagens
      const { data: conversationsWithMessages, error: convError } = await supabase
        .from('conversations')
        .select(`
          id,
          started_at,
          messages(created_at, sender_type)
        `)
        .eq('assigned_agent_id', agentId)
        .eq('status', 'finished')
        .gte('finished_at', today)
        .limit(20); // Limitar para performance

      if (convError) throw convError;

      // Calcular tempo médio de primeira resposta
      let totalResponseTime = 0;
      let validResponses = 0;

      (conversationsWithMessages || []).forEach((conv: any) => {
        const messages = conv.messages || [];
        const clientFirstMsg = messages.find((m: any) => m.sender_type === 'client');
        const agentFirstMsg = messages.find((m: any) => m.sender_type === 'agent');

        if (clientFirstMsg && agentFirstMsg) {
          const clientTime = new Date(clientFirstMsg.created_at).getTime();
          const agentTime = new Date(agentFirstMsg.created_at).getTime();
          const diff = (agentTime - clientTime) / 1000; // segundos

          if (diff > 0 && diff < 3600) { // Filtrar outliers (< 1 hora)
            totalResponseTime += diff;
            validResponses++;
          }
        }
      });

      const avgSeconds = validResponses > 0 ? totalResponseTime / validResponses : 0;

      setMetrics({
        activeConversations: activeCount || 0,
        finishedToday: finishedCount || 0,
        avgResponseTime: formatSeconds(avgSeconds),
        weeklyPerformance,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching agent metrics:', error);
      setMetrics(prev => ({
        ...prev,
        loading: false,
        error: error as Error,
      }));
    }
  }, [currentAgent?.profile?.id]);

  useEffect(() => {
    fetchMetrics();

    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  return metrics;
};

// Helper function para formatar segundos em formato legível
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
