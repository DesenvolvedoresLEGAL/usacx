import { useState, useEffect, useMemo } from 'react';
import { Conversation, ConversationStatus, Message } from '@/types/conversations';
import { mockConversations } from '@/data/mockConversations';
import { useRealtimeSimulation } from './useRealtimeSimulation';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ConversationStatus | 'all'>('all');

  const filteredConversations = useMemo(() => {
    return conversations.filter(conv => {
      const matchesSearch = conv.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || conv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [conversations, searchQuery, statusFilter]);

  const selectedConversation = useMemo(() => {
    return conversations.find(conv => conv.id === selectedId) || null;
  }, [conversations, selectedId]);

  const selectConversation = (id: string) => {
    setSelectedId(id);
    // Mark as read
    setConversations(prev => prev.map(conv => 
      conv.id === id ? { ...conv, unreadCount: 0 } : conv
    ));
  };

  const attendNext = () => {
    const nextInQueue = conversations.find(conv => conv.status === 'waiting');
    if (nextInQueue) {
      setConversations(prev => prev.map(conv =>
        conv.id === nextInQueue.id ? { ...conv, status: 'active' as ConversationStatus, assignedAgent: 'current' } : conv
      ));
      selectConversation(nextInQueue.id);
    }
  };

  // Handlers para simulação realtime
  const handleNewMessage = (conversationId: string, message: Message) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [...conv.messages, message],
          lastMessage: message,
          unreadCount: selectedId === conversationId ? 0 : conv.unreadCount + 1,
          updatedAt: new Date(),
        };
      }
      return conv;
    }));
  };

  const handleNewConversation = (conversation: Conversation) => {
    setConversations(prev => [conversation, ...prev]);
  };

  const handleStatusUpdate = (conversationId: string, status: ConversationStatus) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId ? { ...conv, status } : conv
    ));
  };

  // Conectar simulação de realtime
  useRealtimeSimulation({
    conversations,
    onNewMessage: handleNewMessage,
    onNewConversation: handleNewConversation,
    onStatusUpdate: handleStatusUpdate,
    selectedConversationId: selectedId,
  });

  return {
    conversations: filteredConversations,
    selectedConversation,
    selectConversation,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    attendNext,
  };
}
