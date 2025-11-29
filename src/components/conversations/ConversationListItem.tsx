import { Conversation } from '@/types/conversations';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Instagram, Send, Star } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
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

  // Format time WhatsApp-style
  const formatTime = (date: Date) => {
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return 'Ontem';
    } else {
      return format(date, 'dd/MM/yyyy');
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 cursor-pointer border-b hover:bg-muted/50 transition-colors",
        isSelected && "bg-muted"
      )}
      onClick={onClick}
    >
      {/* Avatar with channel indicator */}
      <div className="relative flex-shrink-0">
        <Avatar className="h-12 w-12">
          <AvatarImage src={conversation.client.avatar} />
          <AvatarFallback>{conversation.client.name[0]}</AvatarFallback>
        </Avatar>
        <div className={cn("absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full flex items-center justify-center", channelColor)}>
          <ChannelIcon className="h-2.5 w-2.5 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="font-medium text-sm truncate">{conversation.client.name}</span>
          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
            {formatTime(conversation.updatedAt)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground truncate">
            {conversation.lastMessage.sender === 'agent' && '✓✓ '}
            {conversation.lastMessage.content}
          </p>

          {/* Badges - right side */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {conversation.isFavorite && (
              <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
            )}
            {conversation.unreadCount > 0 && (
              <span className="bg-green-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 font-medium">
                {conversation.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
