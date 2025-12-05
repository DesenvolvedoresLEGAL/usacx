import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOrganization } from './useOrganization';

export interface LiveStats {
  onlineAgents: number;
  totalAgents: number;
  activeConversations: number;
  queueSize: number;
  averageWaitTime: string;
  isLoading: boolean;
}

export const useLiveStats = () => {
  const [stats, setStats] = useState<LiveStats>({
    onlineAgents: 0,
    totalAgents: 0,
    activeConversations: 0,
    queueSize: 0,
    averageWaitTime: '0m 0s',
    isLoading: true,
  });
  const { organizationId } = useOrganization();

  const fetchStats = useCallback(async () => {
    if (!organizationId) {
      setStats(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      // FILTRO MULTI-TENANT: buscar times da organização primeiro
      const { data: teamsData } = await supabase
        .from('teams')
        .select('id')
        .eq('organization_id', organizationId);

      const teamIds = (teamsData || []).map(t => t.id);

      // Fetch agent stats (filtrado por times da org)
      let agentsQuery = supabase
        .from('agent_profiles')
        .select('id, status');

      if (teamIds.length > 0) {
        agentsQuery = agentsQuery.in('team_id', teamIds);
      }

      const { data: allAgents } = await agentsQuery;

      const totalAgents = allAgents?.length || 0;
      const onlineAgents = allAgents?.filter(
        (agent) => agent.status === 'online' || agent.status === 'away'
      ).length || 0;

      // Fetch active conversations (filtrado por org)
      const { count: activeCount } = await supabase
        .from('conversations')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active')
        .eq('organization_id', organizationId);

      // Fetch queue (waiting conversations, filtrado por org)
      const { data: queueData } = await supabase
        .from('conversations')
        .select('started_at')
        .eq('status', 'waiting')
        .eq('organization_id', organizationId);

      const queueSize = queueData?.length || 0;

      // Calculate average wait time for conversations in queue
      let averageWaitTime = '0m 0s';
      if (queueData && queueData.length > 0) {
        const now = new Date();
        const totalWaitMs = queueData.reduce((sum, conv) => {
          const waitMs = now.getTime() - new Date(conv.started_at).getTime();
          return sum + waitMs;
        }, 0);
        const avgWaitMs = totalWaitMs / queueData.length;
        const minutes = Math.floor(avgWaitMs / 60000);
        const seconds = Math.floor((avgWaitMs % 60000) / 1000);
        averageWaitTime = `${minutes}m ${seconds}s`;
      }

      setStats({
        onlineAgents,
        totalAgents,
        activeConversations: activeCount || 0,
        queueSize,
        averageWaitTime,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching live stats:', error);
      setStats((prev) => ({ ...prev, isLoading: false }));
    }
  }, [organizationId]);

  useEffect(() => {
    if (organizationId) {
      fetchStats();
    }
  }, [organizationId, fetchStats]);

  useEffect(() => {
    if (!organizationId) return;

    // Subscribe to agent_profiles changes
    const agentChannel = supabase
      .channel('agent-status-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agent_profiles',
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    // Subscribe to conversations changes (filtrado por org)
    const conversationChannel = supabase
      .channel('conversation-status-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `organization_id=eq.${organizationId}`,
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    return () => {
      supabase.removeChannel(agentChannel);
      supabase.removeChannel(conversationChannel);
      clearInterval(interval);
    };
  }, [organizationId, fetchStats]);

  return stats;
};
