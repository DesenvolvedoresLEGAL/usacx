import { useState } from 'react';
import { Message } from '@/types/conversations';
import { useToast } from '@/hooks/use-toast';

export function useMessages(conversationId: string | null, initialMessages: Message[] = []) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (content: string, type: 'text' | 'image' | 'audio' | 'video' | 'document' = 'text') => {
    if (!conversationId || !content.trim()) return;

    const newMessage: Message = {
      id: `m-${Date.now()}`,
      conversationId,
      type,
      content: content.trim(),
      sender: 'agent',
      timestamp: new Date(),
      status: 'sending',
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate sending
    setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === newMessage.id ? { ...msg, status: 'sent' as const } : msg
      ));
      
      setTimeout(() => {
        setMessages(prev => prev.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: 'delivered' as const } : msg
        ));
      }, 500);
    }, 500);
  };

  const uploadFile = async (file: File) => {
    const fileType = file.type.startsWith('image/') ? 'image' :
                     file.type.startsWith('audio/') ? 'audio' :
                     file.type.startsWith('video/') ? 'video' : 'document';

    toast({
      title: "Arquivo enviado",
      description: `${file.name} foi enviado com sucesso.`,
    });

    await sendMessage(file.name, fileType);
  };

  return {
    messages,
    sendMessage,
    uploadFile,
    isTyping,
  };
}
