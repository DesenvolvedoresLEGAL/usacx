import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface QueueItem {
  id: string;
  customer: string;
  channel: string;
  waitTime: string;
  priority: 'urgent' | 'high' | 'normal';
  subject: string;
  conversationId: string;
  startedAt: Date;
}

export const useQueueMonitor = () => {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchQueueItems = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          started_at,
          priority,
          metadata,
          clients:client_id (
            name
          ),
          channels:channel_id (
            type
          )
        `)
        .eq('status', 'waiting')
        .order('priority', { ascending: false })
        .order('started_at', { ascending: true });

      if (error) throw error;

      const formattedItems: QueueItem[] = (data || []).map((item: any) => {
        const waitTime = calculateWaitTime(new Date(item.started_at));
        const priorityLevel = getPriorityLevel(item.priority);
        
        return {
          id: item.id,
          customer: item.clients?.name || 'Cliente Desconhecido',
          channel: formatChannelName(item.channels?.type || 'webchat'),
          waitTime,
          priority: priorityLevel,
          subject: item.metadata?.subject || 'Sem assunto',
          conversationId: item.id,
          startedAt: new Date(item.started_at),
        };
      });

      setQueueItems(formattedItems);
    } catch (error) {
      console.error('Erro ao buscar fila:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar fila',
        description: 'Não foi possível carregar os itens da fila de atendimento.',
      });
    } finally {
      setLoading(false);
    }
  };

  const assignConversation = async (conversationId: string, agentProfileId: string) => {
    try {
      const { error } = await supabase.rpc('assign_conversation_to_agent', {
        _conversation_id: conversationId,
        _agent_profile_id: agentProfileId,
      });

      if (error) throw error;

      toast({
        title: 'Conversa atribuída',
        description: 'A conversa foi atribuída ao agente com sucesso.',
      });

      // Refresh queue
      await fetchQueueItems();
    } catch (error) {
      console.error('Erro ao atribuir conversa:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao atribuir',
        description: 'Não foi possível atribuir a conversa ao agente.',
      });
    }
  };

  useEffect(() => {
    fetchQueueItems();

    // Setup realtime subscription
    const channel = supabase
      .channel('queue-monitor')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: 'status=eq.waiting',
        },
        (payload) => {
          console.log('Queue change detected:', payload);
          fetchQueueItems();
        }
      )
      .subscribe();

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchQueueItems();
    }, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  return {
    queueItems,
    loading,
    assignConversation,
    refresh: fetchQueueItems,
  };
};

// Helper functions
const calculateWaitTime = (startedAt: Date): string => {
  const now = new Date();
  const diff = now.getTime() - startedAt.getTime();
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
};

const getPriorityLevel = (priority: number): 'urgent' | 'high' | 'normal' => {
  if (priority >= 8) return 'urgent';
  if (priority >= 5) return 'high';
  return 'normal';
};

const formatChannelName = (type: string): string => {
  const channelMap: Record<string, string> = {
    whatsapp: 'WhatsApp',
    instagram: 'Instagram',
    telegram: 'Telegram',
    messenger: 'Facebook',
    webchat: 'Chat Web',
  };
  return channelMap[type] || type;
};
