import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Queue {
  id: string;
  name: string;
  description: string | null;
  priority: number;
  is_active: boolean;
  max_queue_size: number | null;
  team_id: string | null;
  created_at: string;
  updated_at: string;
  // Real-time stats
  waiting_count?: number;
  active_agents?: number;
}

export const useQueuesSettings = () => {
  const [queues, setQueues] = useState<Queue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchQueues = async () => {
    try {
      const { data: queuesData, error: queuesError } = await supabase
        .from('queues')
        .select('*')
        .order('priority');

      if (queuesError) throw queuesError;

      // Fetch real-time stats for each queue
      const queuesWithStats = await Promise.all(
        (queuesData || []).map(async (queue) => {
          // Count waiting conversations in this queue
          const { count: waitingCount } = await supabase
            .from('conversations')
            .select('id', { count: 'exact', head: true })
            .eq('queue_id', queue.id)
            .eq('status', 'waiting');

          // Count active agents (would need agent_profiles logic)
          const { count: activeAgents } = await supabase
            .from('agent_profiles')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'online');

          return {
            ...queue,
            waiting_count: waitingCount || 0,
            active_agents: activeAgents || 0,
          };
        })
      );

      setQueues(queuesWithStats);
    } catch (error) {
      console.error('Error fetching queues:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as filas.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createQueue = async (queueData: {
    name: string;
    description?: string;
    priority?: number;
    max_queue_size?: number;
    team_id?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('queues')
        .insert([
          {
            name: queueData.name,
            description: queueData.description || null,
            priority: queueData.priority || 0,
            max_queue_size: queueData.max_queue_size || null,
            team_id: queueData.team_id || null,
            is_active: true,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      await fetchQueues(); // Refetch to get stats
      toast({
        title: 'Fila criada',
        description: 'Nova fila de atendimento foi adicionada com sucesso.',
      });

      return data;
    } catch (error) {
      console.error('Error creating queue:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a fila.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateQueue = async (
    id: string,
    updates: Partial<Omit<Queue, 'id' | 'created_at' | 'updated_at'>>
  ) => {
    try {
      const { data, error } = await supabase
        .from('queues')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchQueues(); // Refetch to get updated stats
      toast({
        title: 'Fila atualizada',
        description: 'Fila foi atualizada com sucesso.',
      });

      return data;
    } catch (error) {
      console.error('Error updating queue:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a fila.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteQueue = async (id: string) => {
    try {
      // Check if there are conversations in this queue
      const { count } = await supabase
        .from('conversations')
        .select('id', { count: 'exact', head: true })
        .eq('queue_id', id);

      if (count && count > 0) {
        toast({
          title: 'Erro',
          description:
            'Não é possível remover fila com atendimentos ativos ou pendentes.',
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase.from('queues').delete().eq('id', id);

      if (error) throw error;

      setQueues((prev) => prev.filter((queue) => queue.id !== id));
      toast({
        title: 'Fila removida',
        description: 'Fila foi removida com sucesso.',
      });
    } catch (error) {
      console.error('Error deleting queue:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover a fila.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const toggleQueueStatus = async (id: string) => {
    const queue = queues.find((q) => q.id === id);
    if (!queue) return;

    await updateQueue(id, { is_active: !queue.is_active });
  };

  useEffect(() => {
    fetchQueues();

    // Subscribe to changes
    const queuesChannel = supabase
      .channel('queues-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'queues',
        },
        () => {
          fetchQueues();
        }
      )
      .subscribe();

    // Also subscribe to conversations changes to update queue stats
    const conversationsChannel = supabase
      .channel('queue-stats-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        () => {
          fetchQueues();
        }
      )
      .subscribe();

    // Refresh stats every 30 seconds
    const interval = setInterval(fetchQueues, 30000);

    return () => {
      supabase.removeChannel(queuesChannel);
      supabase.removeChannel(conversationsChannel);
      clearInterval(interval);
    };
  }, []);

  return {
    queues,
    isLoading,
    createQueue,
    updateQueue,
    deleteQueue,
    toggleQueueStatus,
    refetch: fetchQueues,
  };
};
