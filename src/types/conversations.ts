export type MessageType = 'text' | 'image' | 'audio' | 'video' | 'document' | 'sticker';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
export type ConversationStatus = 'active' | 'waiting' | 'paused' | 'finished';
export type ChannelType = 'whatsapp' | 'instagram' | 'telegram' | 'messenger' | 'webchat';
export type AgentStatus = 'online' | 'away' | 'paused' | 'offline';

export interface Client {
  id: string;
  name: string;
  avatar?: string;
  phone?: string;
  email?: string;
  tags: string[];
  notes: string;
  lastInteraction?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  type: MessageType;
  content: string;
  sender: 'client' | 'agent';
  timestamp: Date;
  status: MessageStatus;
  mediaUrl?: string;
  fileName?: string;
}

export interface Conversation {
  id: string;
  client: Client;
  channel: ChannelType;
  status: ConversationStatus;
  unreadCount: number;
  lastMessage: Message;
  messages: Message[];
  assignedAgent?: string;
  startedAt: Date;
  updatedAt: Date;
}

export interface Agent {
  id: string;
  name: string;
  avatar?: string;
  status: AgentStatus;
  activeConversations: number;
  queueSize: number;
}

export interface PauseReason {
  id: string;
  label: string;
  icon: string;
}
