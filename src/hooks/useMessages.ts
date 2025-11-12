import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Message, MessageStatus, MessageType } from '@/types/conversations';
import { useToast } from '@/hooks/use-toast';

type SendMessageType = Exclude<MessageType, 'sticker'>;

const getFileMessageType = (file: File): SendMessageType => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('audio/')) return 'audio';
  if (file.type.startsWith('video/')) return 'video';
  return 'document';
};

export function useMessages(conversationId: string | null, initialMessages: Message[] = []) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const timeoutIds = useRef<number[]>([]);
  const { toast } = useToast();

  const clearScheduledUpdates = useCallback(() => {
    timeoutIds.current.forEach((timeout) => clearTimeout(timeout));
    timeoutIds.current = [];
  }, []);

  useEffect(() => clearScheduledUpdates, [clearScheduledUpdates]);

  const scheduleStatusUpdate = useCallback(
    (messageId: string, status: MessageStatus, delay: number) => {
      const timeout = window.setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === messageId ? { ...msg, status } : msg))
        );
        timeoutIds.current = timeoutIds.current.filter((id) => id !== timeout);
      }, delay);

      timeoutIds.current.push(timeout);
    },
    []
  );

  const sendMessage = useCallback(
    async (
      content: string,
      type: SendMessageType = 'text'
    ) => {
      if (!conversationId || !content.trim()) return;

      const trimmedContent = content.trim();
      const newMessage: Message = {
        id: `m-${Date.now()}`,
        conversationId,
        type,
        content: trimmedContent,
        sender: 'agent',
        timestamp: new Date(),
        status: 'sending',
      };

      setMessages((prev) => [...prev, newMessage]);

      scheduleStatusUpdate(newMessage.id, 'sent', 500);
      scheduleStatusUpdate(newMessage.id, 'delivered', 1000);
    },
    [conversationId, scheduleStatusUpdate]
  );

  const uploadFile = useCallback(
    async (file: File) => {
      const fileType = getFileMessageType(file);

      toast({
        title: 'Arquivo enviado',
        description: `${file.name} foi enviado com sucesso.`,
      });

      await sendMessage(file.name, fileType);
    },
    [sendMessage, toast]
  );

  return useMemo(
    () => ({
      messages,
      sendMessage,
      uploadFile,
    }),
    [messages, sendMessage, uploadFile]
  );
}
