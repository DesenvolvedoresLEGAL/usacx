import { useState, useEffect, useMemo, useCallback } from 'react';
import { Conversation, ConversationStatus } from '@/types/conversations';
import { supabase } from '@/integrations/supabase/client';
import { mapConversationFromDB, ConversationWithRelations } from '@/types/database';
import { useCurrentAgent } from './useCurrentAgent';
import { useToast } from './use-toast';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ConversationStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const currentAgent = useCurrentAgent();
  const { toast } = useToast();

  // Buscar conversas do banco
  const fetchConversations = useCallback(async () => {
    if (!currentAgent) return;

    try {
      setLoading(true);

      // Query base - busca conversas baseado na role do usuário
      let query = supabase
        .from('conversations')
        .select(`
          *,
          client:clients(*),
          channel:channels(*)
        `);

      // ADMIN: vê todas as conversas
      if (currentAgent.role === 'admin') {
        // Não adiciona filtro, vê tudo
      }
      // MANAGER: vê conversas do time + em espera
      else if (currentAgent.role === 'manager') {
        // RLS policy já cuida disso, não precisa filtro adicional
      }
      // AGENT: vê apenas suas conversas + em espera
      else {
        query = query.or(`assigned_agent_id.eq.${currentAgent.profile?.id},status.eq.waiting`);
      }

      const { data: conversationsData, error: convError } = await query
        .order('updated_at', { ascending: false });

      if (convError) throw convError;
      if (!conversationsData) {
        setConversations([]);
        return;
      }

      // Para cada conversa, buscar mensagens e tags
      const conversationsWithData: Conversation[] = await Promise.all(
        conversationsData.map(async (conv) => {
          // Buscar mensagens
          const { data: messagesData } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: true });

          // Buscar tags
          const { data: tagsData } = await supabase
            .from('conversation_tags')
            .select('tag:tags(*)')
            .eq('conversation_id', conv.id);

          const tags = tagsData?.map((t: any) => t.tag).filter(Boolean) || [];

          // Calcular unread count (mensagens não lidas do cliente)
          const unreadCount = messagesData?.filter(
            (m) => m.sender_type === 'client' && m.status !== 'read'
          ).length || 0;

          const conversationWithRelations: ConversationWithRelations = {
            conversation: conv,
            client: conv.client,
            channel: conv.channel,
            messages: messagesData || [],
            tags,
            unread_count: unreadCount,
          };

          return mapConversationFromDB(conversationWithRelations);
        })
      );

      setConversations(conversationsWithData);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: 'Erro ao carregar conversas',
        description: 'Não foi possível carregar as conversas.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [currentAgent, toast]);

  // Carregar conversas ao montar
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Setup realtime subscriptions
  useEffect(() => {
    if (!currentAgent) return;

    // Subscribe to conversations changes
    const conversationsChannel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        (payload) => {
          console.log('Conversation changed:', payload);
          fetchConversations();
        }
      )
      .subscribe();

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          console.log('New message:', payload);
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationsChannel);
      supabase.removeChannel(messagesChannel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAgent]);

  // Filtrar conversas
  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      const matchesSearch =
        conv.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || conv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [conversations, searchQuery, statusFilter]);

  const selectedConversation = useMemo(() => {
    return conversations.find((conv) => conv.id === selectedId) || null;
  }, [conversations, selectedId]);

  // Selecionar conversa e marcar como lida
  const selectConversation = useCallback(
    async (id: string) => {
      setSelectedId(id);

      // Marcar mensagens como lidas no banco
      try {
        await supabase
          .from('messages')
          .update({ status: 'read' })
          .eq('conversation_id', id)
          .eq('sender_type', 'client')
          .neq('status', 'read');

        // Atualizar localmente
        setConversations((prev) =>
          prev.map((conv) => (conv.id === id ? { ...conv, unreadCount: 0 } : conv))
        );
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    },
    []
  );

  // Pegar próxima conversa da fila
  const attendNext = useCallback(async () => {
    if (!currentAgent?.profile?.id) return;

    try {
      // Buscar primeira conversa em espera
      const { data: nextConversation, error: fetchError } = await supabase
        .from('conversations')
        .select('id')
        .eq('status', 'waiting')
        .order('priority', { ascending: false })
        .order('started_at', { ascending: true })
        .limit(1)
        .single();

      if (fetchError || !nextConversation) {
        toast({
          title: 'Nenhuma conversa na fila',
          description: 'Não há conversas aguardando atendimento.',
        });
        return;
      }

      // Atribuir ao agente atual usando a função do banco
      const { data, error } = await supabase.rpc('assign_conversation_to_agent', {
        _conversation_id: nextConversation.id,
        _agent_profile_id: currentAgent.profile.id,
      });

      if (error) throw error;

      if (data) {
        toast({
          title: 'Atendimento iniciado',
          description: 'Conversa atribuída com sucesso.',
        });

        // Recarregar conversas e selecionar a nova
        await fetchConversations();
        setSelectedId(nextConversation.id);
      } else {
        toast({
          title: 'Conversa não disponível',
          description: 'A conversa pode ter sido atribuída a outro agente.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error assigning conversation:', error);
      toast({
        title: 'Erro ao atribuir conversa',
        description: 'Não foi possível iniciar o atendimento.',
        variant: 'destructive',
      });
    }
  }, [currentAgent, fetchConversations, toast]);

  return {
    conversations: filteredConversations,
    selectedConversation,
    selectConversation,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    attendNext,
    loading,
  };
}
