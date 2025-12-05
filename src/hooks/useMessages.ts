import { useCallback, useEffect, useMemo, useState } from 'react';
import { Message, MessageStatus, MessageType } from '@/types/conversations';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { mapMessageFromDB } from '@/types/database';
import { useCurrentAgent } from './useCurrentAgent';
import { logger } from '@/lib/logger';

type SendMessageType = Exclude<MessageType, 'sticker'>;

const getFileMessageType = (file: File): SendMessageType => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('audio/')) return 'audio';
  if (file.type.startsWith('video/')) return 'video';
  return 'document';
};

export function useMessages(conversationId: string | null, initialMessages: Message[] = []) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const currentAgent = useCurrentAgent();

  // Sincronizar mensagens iniciais
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Setup realtime para novas mensagens
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          logger.debug('New message received', { payload });
          const newMessage = mapMessageFromDB(payload.new as any);
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const sendMessage = useCallback(
    async (content: string, type: SendMessageType = 'text') => {
      if (!conversationId || !content.trim() || !currentAgent?.profile?.id) return;

      const trimmedContent = content.trim();
      const tempId = `temp-${Date.now()}`;

      // Criar mensagem temporária para mostrar imediatamente
      const tempMessage: Message = {
        id: tempId,
        conversationId,
        type,
        content: trimmedContent,
        sender: 'agent',
        timestamp: new Date(),
        status: 'sending',
      };

      setMessages((prev) => [...prev, tempMessage]);
      setLoading(true);

      try {
        // Inserir no banco
        const { data, error } = await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_type: 'agent',
            sender_id: currentAgent.profile.id,
            content: trimmedContent,
            message_type: type,
            status: 'sent',
          })
          .select()
          .single();

        if (error) throw error;

        // Remover mensagem temporária e adicionar a real
        setMessages((prev) => {
          const filtered = prev.filter((m) => m.id !== tempId);
          if (data) {
            const realMessage = mapMessageFromDB(data);
            return [...filtered, realMessage];
          }
          return filtered;
        });

        toast({
          title: 'Mensagem enviada',
          description: 'Sua mensagem foi enviada com sucesso.',
        });
      } catch (error) {
        logger.error('Error sending message', { error });

        // Marcar mensagem como falha
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, status: 'failed' as MessageStatus } : m))
        );

        toast({
          title: 'Erro ao enviar mensagem',
          description: 'Não foi possível enviar sua mensagem. Tente novamente.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    },
    [conversationId, currentAgent, toast]
  );

  const uploadFile = useCallback(
    async (file: File) => {
      if (!conversationId || !currentAgent?.profile?.id) return;

      const fileType = getFileMessageType(file);

      try {
        setLoading(true);

        // Upload para storage
        const fileExt = file.name.split('.').pop();
        const filePath = `${conversationId}/${Date.now()}.${fileExt}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('attachments')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Obter URL pública
        const { data: urlData } = supabase.storage.from('attachments').getPublicUrl(filePath);

        // Enviar mensagem com o arquivo
        const { data, error } = await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_type: 'agent',
            sender_id: currentAgent.profile.id,
            content: file.name,
            message_type: fileType,
            media_url: urlData.publicUrl,
            file_name: file.name,
            status: 'sent',
          })
          .select()
          .single();

        if (error) throw error;

        // Adicionar mensagem
        if (data) {
          const newMessage = mapMessageFromDB(data);
          setMessages((prev) => [...prev, newMessage]);
        }

        toast({
          title: 'Arquivo enviado',
          description: `${file.name} foi enviado com sucesso.`,
        });
      } catch (error) {
        logger.error('Error uploading file', { error });
        toast({
          title: 'Erro ao enviar arquivo',
          description: 'Não foi possível enviar o arquivo. Tente novamente.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    },
    [conversationId, currentAgent, toast]
  );

  return useMemo(
    () => ({
      messages,
      sendMessage,
      uploadFile,
      loading,
    }),
    [messages, sendMessage, uploadFile, loading]
  );
}
