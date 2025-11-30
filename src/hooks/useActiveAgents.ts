import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ActiveAgent {
  id: string;
  userId: string;
  name: string;
  avatarUrl: string | null;
  status: 'online' | 'away' | 'busy' | 'paused';
  activeChats: number;
  totalToday: number;
  avgResponseTime: string;
  lastActivity: string;
  lastActivityDate: Date;
}

export const useActiveAgents = () => {
  const [agents, setAgents] = useState<ActiveAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchActiveAgents = useCallback(async () => {
    try {
      // Fetch agents that are not offline
      const { data: agentsData, error: agentsError } = await supabase
        .from('agent_profiles')
        .select('*')
        .neq('status', 'offline')
        .order('display_name');

      if (agentsError) throw agentsError;

      // For each agent, get conversation counts
      const agentsWithStats = await Promise.all(
        (agentsData || []).map(async (agent) => {
          // Count active conversations
          const { count: activeCount, error: activeError } = await supabase
            .from('conversations')
            .select('*', { count: 'exact', head: true })
            .eq('assigned_agent_id', agent.id)
            .eq('status', 'active');

          if (activeError) console.error('Error fetching active count:', activeError);

          // Count total conversations today
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const { count: totalCount, error: totalError } = await supabase
            .from('conversations')
            .select('*', { count: 'exact', head: true })
            .eq('assigned_agent_id', agent.id)
            .gte('started_at', today.toISOString());

          if (totalError) console.error('Error fetching total count:', totalError);

          // Get average response time (approximate from finished conversations today)
          const { data: finishedData, error: finishedError } = await supabase
            .from('conversations')
            .select('started_at, finished_at')
            .eq('assigned_agent_id', agent.id)
            .eq('status', 'finished')
            .gte('started_at', today.toISOString())
            .not('finished_at', 'is', null);

          let avgResponseTime = 'N/A';
          if (!finishedError && finishedData && finishedData.length > 0) {
            const totalTime = finishedData.reduce((acc, conv) => {
              const start = new Date(conv.started_at).getTime();
              const end = new Date(conv.finished_at!).getTime();
              return acc + (end - start);
            }, 0);
            const avgMs = totalTime / finishedData.length;
            avgResponseTime = formatDuration(avgMs);
          }

          // Get last message timestamp for this agent
          const { data: lastMessage, error: lastMessageError } = await supabase
            .from('messages')
            .select('created_at, conversations!inner(assigned_agent_id)')
            .eq('conversations.assigned_agent_id', agent.id)
            .eq('sender_type', 'agent')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          let lastActivityDate = new Date(agent.updated_at);
          if (!lastMessageError && lastMessage) {
            lastActivityDate = new Date(lastMessage.created_at);
          }

          return {
            id: agent.id,
            userId: agent.user_id,
            name: agent.display_name || 'Sem nome',
            avatarUrl: agent.avatar_url,
            status: agent.status as 'online' | 'away' | 'busy' | 'paused',
            activeChats: activeCount || 0,
            totalToday: totalCount || 0,
            avgResponseTime,
            lastActivity: getRelativeTime(lastActivityDate),
            lastActivityDate,
          };
        })
      );

      setAgents(agentsWithStats);
    } catch (error) {
      console.error('Erro ao buscar agentes ativos:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar agentes',
        description: 'Não foi possível carregar a lista de agentes ativos.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const pauseAgent = async (agentId: string, pauseReasonId?: string) => {
    try {
      const { error } = await supabase
        .from('agent_profiles')
        .update({ 
          status: 'paused',
          updated_at: new Date().toISOString(),
        })
        .eq('id', agentId);

      if (error) throw error;

      toast({
        title: 'Agente pausado',
        description: 'O agente foi pausado com sucesso.',
      });

      await fetchActiveAgents();
    } catch (error) {
      console.error('Erro ao pausar agente:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao pausar',
        description: 'Não foi possível pausar o agente.',
      });
    }
  };

  const resumeAgent = async (agentId: string) => {
    try {
      const { error } = await supabase
        .from('agent_profiles')
        .update({ 
          status: 'online',
          updated_at: new Date().toISOString(),
        })
        .eq('id', agentId);

      if (error) throw error;

      toast({
        title: 'Agente retomado',
        description: 'O agente voltou a ficar online.',
      });

      await fetchActiveAgents();
    } catch (error) {
      console.error('Erro ao retomar agente:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao retomar',
        description: 'Não foi possível retomar o agente.',
      });
    }
  };

  useEffect(() => {
    fetchActiveAgents();

    // Setup realtime subscription for agent status changes
    const channel = supabase
      .channel('active-agents')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agent_profiles',
        },
        () => {
          console.log('Agent status changed, refreshing...');
          fetchActiveAgents();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        () => {
          console.log('Conversation changed, refreshing...');
          fetchActiveAgents();
        }
      )
      .subscribe();

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchActiveAgents();
    }, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [fetchActiveAgents]);

  return {
    agents,
    loading,
    pauseAgent,
    resumeAgent,
    refresh: fetchActiveAgents,
  };
};

// Helper functions
const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 60) return 'Agora';
  if (minutes < 60) return `${minutes}min`;
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
};
