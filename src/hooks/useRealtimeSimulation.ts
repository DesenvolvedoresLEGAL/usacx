import { useEffect, useCallback } from 'react';
import { Conversation, Message, ConversationStatus } from '@/types/conversations';
import { useToast } from '@/hooks/use-toast';

interface RealtimeSimulationProps {
  conversations: Conversation[];
  onNewMessage: (conversationId: string, message: Message) => void;
  onNewConversation: (conversation: Conversation) => void;
  onStatusUpdate: (conversationId: string, status: ConversationStatus) => void;
  selectedConversationId: string | null;
}

export function useRealtimeSimulation({
  conversations,
  onNewMessage,
  onNewConversation,
  onStatusUpdate,
  selectedConversationId,
}: RealtimeSimulationProps) {
  const { toast } = useToast();

  // Simular mensagens de clientes
  const simulateClientMessage = useCallback(() => {
    const activeConversations = conversations.filter(
      conv => conv.status === 'active' || conv.status === 'waiting'
    );

    if (activeConversations.length === 0) return;

    const randomConv = activeConversations[Math.floor(Math.random() * activeConversations.length)];
    
    const clientMessages = [
      'Olá, preciso de ajuda',
      'Vocês têm disponibilidade hoje?',
      'Quanto custa esse serviço?',
      'Pode me enviar mais informações?',
      'Ainda estou aguardando retorno',
      'Obrigado pelo atendimento!',
      'Consegue me ajudar agora?',
      'Qual o prazo de entrega?',
    ];

    const newMessage: Message = {
      id: `m-sim-${Date.now()}`,
      conversationId: randomConv.id,
      type: 'text',
      content: clientMessages[Math.floor(Math.random() * clientMessages.length)],
      sender: 'client',
      timestamp: new Date(),
      status: 'delivered',
    };

    onNewMessage(randomConv.id, newMessage);

    // Notificar se não é a conversa selecionada
    if (selectedConversationId !== randomConv.id) {
      toast({
        title: 'Nova mensagem',
        description: `${randomConv.client.name}: ${newMessage.content.substring(0, 50)}${newMessage.content.length > 50 ? '...' : ''}`,
        duration: 4000,
      });
    }
  }, [conversations, onNewMessage, selectedConversationId, toast]);

  // Simular nova conversa na fila
  const simulateNewConversation = useCallback(() => {
    const newConv: Conversation = {
      id: `conv-sim-${Date.now()}`,
      client: {
        id: `client-${Date.now()}`,
        name: `Cliente ${Math.floor(Math.random() * 1000)}`,
        phone: `+55 11 9${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`,
        tags: ['Novo'],
        notes: '',
      },
      channel: ['whatsapp', 'instagram', 'telegram'][Math.floor(Math.random() * 3)] as any,
      status: 'waiting',
      unreadCount: 1,
      lastMessage: {
        id: `m-first-${Date.now()}`,
        conversationId: `conv-sim-${Date.now()}`,
        type: 'text',
        content: 'Olá, gostaria de mais informações',
        sender: 'client',
        timestamp: new Date(),
        status: 'delivered',
      },
      messages: [],
      startedAt: new Date(),
      updatedAt: new Date(),
    };

    onNewConversation(newConv);

    toast({
      title: '🔔 Novo cliente na fila',
      description: `${newConv.client.name} está aguardando atendimento`,
      duration: 5000,
    });
  }, [onNewConversation, toast]);

  // Simular mudança de status
  const simulateStatusChange = useCallback(() => {
    const activeConvs = conversations.filter(conv => conv.status === 'active');
    if (activeConvs.length === 0) return;

    const randomConv = activeConvs[Math.floor(Math.random() * activeConvs.length)];
    
    // Ocasionalmente finalizar uma conversa
    if (Math.random() > 0.7) {
      onStatusUpdate(randomConv.id, 'finished');
      
      if (selectedConversationId !== randomConv.id) {
        toast({
          title: 'Conversa finalizada',
          description: `Atendimento de ${randomConv.client.name} foi finalizado`,
          duration: 3000,
        });
      }
    }
  }, [conversations, onStatusUpdate, selectedConversationId, toast]);

  useEffect(() => {
    console.log('🔌 WebSocket simulado conectado');

    // Simular mensagens de clientes a cada 15-30 segundos
    const messageInterval = setInterval(() => {
      if (Math.random() > 0.3) { // 70% de chance
        simulateClientMessage();
      }
    }, 15000 + Math.random() * 15000);

    // Simular novas conversas a cada 30-60 segundos
    const conversationInterval = setInterval(() => {
      if (Math.random() > 0.5) { // 50% de chance
        simulateNewConversation();
      }
    }, 30000 + Math.random() * 30000);

    // Simular mudanças de status a cada 40-80 segundos
    const statusInterval = setInterval(() => {
      if (Math.random() > 0.6) { // 40% de chance
        simulateStatusChange();
      }
    }, 40000 + Math.random() * 40000);

    return () => {
      console.log('🔌 WebSocket simulado desconectado');
      clearInterval(messageInterval);
      clearInterval(conversationInterval);
      clearInterval(statusInterval);
    };
  }, [simulateClientMessage, simulateNewConversation, simulateStatusChange]);

  return {
    connected: true,
  };
}
