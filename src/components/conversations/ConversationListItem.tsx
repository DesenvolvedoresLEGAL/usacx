import { Conversation } from '@/types/conversations';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Instagram, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ConversationListItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

const channelIcons = {
  whatsapp: MessageSquare,
  instagram: Instagram,
  telegram: Send,
  messenger: MessageSquare,
  webchat: MessageSquare,
};

const channelColors = {
  whatsapp: 'bg-green-500',
  instagram: 'bg-pink-500',
  telegram: 'bg-blue-500',
  messenger: 'bg-blue-600',
  webchat: 'bg-purple-500',
};

export function ConversationListItem({ conversation, isSelected, onClick }: ConversationListItemProps) {
  const ChannelIcon = channelIcons[conversation.channel];
  const channelColor = channelColors[conversation.channel];

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 cursor-pointer border-b hover:bg-muted/50 transition-colors",
        isSelected && "bg-muted"
      )}
      onClick={onClick}
    >
      <div className="relative">
        <Avatar>
          <AvatarImage src={conversation.client.avatar} />
          <AvatarFallback>{conversation.client.name[0]}</AvatarFallback>
        </Avatar>
        <div className={cn("absolute -bottom-1 -right-1 h-4 w-4 rounded-full flex items-center justify-center", channelColor)}>
          <ChannelIcon className="h-2.5 w-2.5 text-white" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="font-medium text-sm truncate">{conversation.client.name}</span>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDistanceToNow(conversation.updatedAt, { addSuffix: true, locale: ptBR })}
          </span>
        </div>

        <p className="text-sm text-muted-foreground truncate mb-1">
          {conversation.lastMessage.sender === 'agent' && 'Você: '}
          {conversation.lastMessage.content}
        </p>

        <div className="flex items-center gap-2">
          {conversation.status === 'waiting' && (
            <Badge variant="secondary" className="text-xs">
              Aguardando
            </Badge>
          )}
          {conversation.unreadCount > 0 && (
            <Badge variant="default" className="text-xs">
              {conversation.unreadCount}
            </Badge>
          )}
          {conversation.client.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
