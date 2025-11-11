import { useEffect, useRef } from 'react';
import { Conversation } from '@/types/conversations';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Phone, Video, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMessages } from '@/hooks/useMessages';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChatWindowProps {
  conversation: Conversation | null;
}

export function ChatWindow({ conversation }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, uploadFile } = useMessages(
    conversation?.id || null,
    conversation?.messages || []
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Nenhuma conversa selecionada</h3>
            <p className="text-sm text-muted-foreground">
              Selecione uma conversa da lista ou atenda o próximo cliente
            </p>
          </div>
        </div>
      </div>
    );
  }

  const groupedMessages = messages.reduce((groups, message) => {
    const date = format(message.timestamp, 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, typeof messages>);

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b bg-background px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={conversation.client.avatar} />
            <AvatarFallback>{conversation.client.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{conversation.client.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{conversation.client.phone}</span>
              {conversation.client.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            <div className="flex items-center justify-center my-4">
              <div className="bg-muted px-3 py-1 rounded-full">
                <span className="text-xs text-muted-foreground">
                  {isSameDay(new Date(date), new Date())
                    ? 'Hoje'
                    : format(new Date(date), "dd 'de' MMMM", { locale: ptBR })}
                </span>
              </div>
            </div>
            {msgs.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                clientAvatar={conversation.client.avatar}
                clientName={conversation.client.name}
              />
            ))}
          </div>
        ))}
      </ScrollArea>

      {/* Input */}
      <ChatInput
        onSendMessage={sendMessage}
        onUploadFile={uploadFile}
        disabled={conversation.status === 'finished'}
      />
    </div>
  );
}
