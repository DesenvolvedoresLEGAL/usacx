import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Conversation, ConversationStatus } from '@/types/conversations';
import { supabase } from '@/integrations/supabase/client';
import { mapConversationFromDB, ConversationWithRelations } from '@/types/database';
import { useCurrentAgent } from './useCurrentAgent';
import { useOrganization } from './useOrganization';
import { useToast } from './use-toast';
import { logger } from '@/lib/logger';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState<'all' | 'unread' | 'favorites' | 'archived'>('all');
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  
  const currentAgent = useCurrentAgent();
  const { organizationId } = useOrganization();
  const { toast } = useToast();
  
  // Extrair valores primitivos estáveis para evitar loop infinito
  const agentProfileId = currentAgent?.profile?.id;
  const agentRole = currentAgent?.role;
  
  // Ref para usar em subscriptions sem causar re-renders
  const fetchConversationsRef = useRef<() => Promise<void>>();

  // Buscar conversas do banco
  const fetchConversations = useCallback(async () => {
    if (!agentProfileId || !organizationId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Query base - busca conversas baseado na role do usuário
      // Usando hints para especificar qual FK usar (necessário após adicionar constraints)
      // FILTRO MULTI-TENANT: sempre filtrar por organization_id
      let query = supabase
        .from('conversations')
        .select(`
          *,
          client:clients!fk_conversations_client(*),
          channel:channels!fk_conversations_channel(*)
        `)
        .eq('organization_id', organizationId);

      // ADMIN: vê todas as conversas da organização
      if (agentRole === 'admin') {
        // Não adiciona filtro adicional, vê tudo da org
      }
      // MANAGER: vê conversas do time + em espera
      else if (agentRole === 'manager') {
        // RLS policy já cuida disso, não precisa filtro adicional
      }
      // AGENT: vê apenas suas conversas + em espera
      else {
        query = query.or(`assigned_agent_id.eq.${agentProfileId},status.eq.waiting`);
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

          // Buscar tags (usando hint explícito para FK)
          const { data: tagsData } = await supabase
            .from('conversation_tags')
            .select('tag:tags!fk_conversation_tags_tag(*)')
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
      logger.error('Error fetching conversations', { error });
      toast({
        title: 'Erro ao carregar conversas',
        description: 'Não foi possível carregar as conversas.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [agentProfileId, agentRole, organizationId, toast]);

  // Manter ref atualizado para subscriptions
  useEffect(() => {
    fetchConversationsRef.current = fetchConversations;
  }, [fetchConversations]);

  // Carregar conversas ao montar (apenas uma vez)
  useEffect(() => {
    if (!initialized && agentProfileId && organizationId) {
      setInitialized(true);
      fetchConversations();
    }
  }, [initialized, agentProfileId, organizationId, fetchConversations]);

  // Setup realtime subscriptions
  useEffect(() => {
    if (!agentProfileId || !organizationId) return;

    // Subscribe to conversations changes (filtrado por organização)
    const conversationsChannel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `organization_id=eq.${organizationId}`,
        },
        (payload) => {
          logger.debug('Conversation changed', { payload });
          fetchConversationsRef.current?.();
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
          logger.debug('New message', { payload });
          fetchConversationsRef.current?.();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [agentProfileId, organizationId]);

  // Filtrar conversas
  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      // Search filter
      const matchesSearch =
        conv.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Quick filter (pills)
      let matchesQuickFilter = true;
      switch (quickFilter) {
        case 'unread':
          matchesQuickFilter = conv.unreadCount > 0;
          break;
        case 'favorites':
          matchesQuickFilter = conv.isFavorite === true;
          break;
        case 'archived':
          matchesQuickFilter = conv.status === 'finished';
          break;
        default:
          matchesQuickFilter = true;
      }
      
      return matchesSearch && matchesQuickFilter;
    });
  }, [conversations, searchQuery, quickFilter]);

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
        logger.error('Error marking messages as read', { error });
      }
    },
    []
  );

  // Pegar próxima conversa da fila (filtrada por organização)
  const attendNext = useCallback(async () => {
    if (!agentProfileId || !organizationId) return;

    try {
      // Buscar primeira conversa em espera da organização
      const { data: nextConversation, error: fetchError } = await supabase
        .from('conversations')
        .select('id')
        .eq('status', 'waiting')
        .eq('organization_id', organizationId)
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
        _agent_profile_id: agentProfileId,
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
      logger.error('Error assigning conversation', { error });
      toast({
        title: 'Erro ao atribuir conversa',
        description: 'Não foi possível iniciar o atendimento.',
        variant: 'destructive',
      });
    }
  }, [agentProfileId, organizationId, fetchConversations, toast]);

  return {
    conversations: filteredConversations,
    selectedConversation,
    selectConversation,
    searchQuery,
    setSearchQuery,
    quickFilter,
    setQuickFilter,
    attendNext,
    loading,
    refresh: fetchConversations,
  };
}
