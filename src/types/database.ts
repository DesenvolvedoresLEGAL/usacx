// Tipos que mapeiam do Supabase Database para nossa aplicação
import type { 
  Conversation as ConversationType,
  Message as MessageType,
  Client as ClientType,
  ConversationStatus,
  ChannelType,
  MessageType as MsgType,
  MessageStatus
} from './conversations';

// Tipo de conversa do banco com todos os joins
export interface ConversationRow {
  id: string;
  client_id: string;
  channel_id: string;
  assigned_agent_id: string | null;
  queue_id: string | null;
  status: ConversationStatus;
  priority: number;
  started_at: string;
  assigned_at: string | null;
  finished_at: string | null;
  updated_at: string;
  metadata: any;
}

export interface ClientRow {
  id: string;
  phone: string;
  email: string | null;
  name: string;
  avatar_url: string | null;
  notes: string | null;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface MessageRow {
  id: string;
  conversation_id: string;
  sender_type: 'client' | 'agent' | 'system';
  sender_id: string | null;
  content: string;
  message_type: MsgType;
  media_url: string | null;
  file_name: string | null;
  status: MessageStatus;
  metadata: any;
  created_at: string;
}

export interface ChannelRow {
  id: string;
  type: ChannelType;
  name: string;
  config: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TagRow {
  id: string;
  name: string;
  color: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Tipo completo de conversa com todos os dados relacionados
export interface ConversationWithRelations {
  conversation: ConversationRow;
  client: ClientRow;
  channel: ChannelRow;
  messages: MessageRow[];
  tags: TagRow[];
  unread_count?: number;
}

// Funções helper para converter tipos do banco para tipos da aplicação
export function mapClientFromDB(clientRow: ClientRow): ClientType {
  return {
    id: clientRow.id,
    name: clientRow.name,
    avatar: clientRow.avatar_url || undefined,
    phone: clientRow.phone,
    email: clientRow.email || undefined,
    tags: [], // Será preenchido depois
    notes: clientRow.notes || '',
    lastInteraction: clientRow.updated_at,
  };
}

export function mapMessageFromDB(msgRow: MessageRow): MessageType {
  return {
    id: msgRow.id,
    conversationId: msgRow.conversation_id,
    type: msgRow.message_type,
    content: msgRow.content,
    sender: msgRow.sender_type === 'client' ? 'client' : 'agent',
    timestamp: new Date(msgRow.created_at),
    status: msgRow.status,
    mediaUrl: msgRow.media_url || undefined,
    fileName: msgRow.file_name || undefined,
  };
}

export function mapConversationFromDB(data: ConversationWithRelations): ConversationType {
  const messages = data.messages.map(mapMessageFromDB);
  const lastMessage = messages[messages.length - 1] || {
    id: 'temp',
    conversationId: data.conversation.id,
    type: 'text' as MsgType,
    content: 'Sem mensagens',
    sender: 'client' as const,
    timestamp: new Date(data.conversation.started_at),
    status: 'sent' as MessageStatus,
  };

  const client = mapClientFromDB(data.client);
  client.tags = data.tags.map(t => t.name);

  return {
    id: data.conversation.id,
    client,
    channel: data.channel.type,
    status: data.conversation.status,
    unreadCount: data.unread_count || 0,
    lastMessage,
    messages,
    assignedAgent: data.conversation.assigned_agent_id || undefined,
    startedAt: new Date(data.conversation.started_at),
    updatedAt: new Date(data.conversation.updated_at),
  };
}
