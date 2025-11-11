import { useState, useEffect, useMemo } from 'react';
import { Conversation, ConversationStatus } from '@/types/conversations';
import { mockConversations } from '@/data/mockConversations';

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
