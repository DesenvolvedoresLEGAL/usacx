import { Message } from '@/types/conversations';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, CheckCheck, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
  clientAvatar?: string;
  clientName: string;
  agentAvatar?: string;
}

export function ChatMessage({ message, clientAvatar, clientName, agentAvatar }: ChatMessageProps) {
  const isAgent = message.sender === 'agent';

  const StatusIcon = () => {
    if (message.sender === 'client') return null;
    
    switch (message.status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-muted-foreground" />;
      case 'sent':
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      case 'failed':
        return <AlertCircle className="h-3 w-3 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn("flex gap-3 mb-4", isAgent && "flex-row-reverse")}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={isAgent ? agentAvatar : clientAvatar} />
        <AvatarFallback>{isAgent ? 'A' : clientName[0]}</AvatarFallback>
      </Avatar>

      <div className={cn("flex flex-col gap-1 max-w-[70%]", isAgent && "items-end")}>
        <div
          className={cn(
            "rounded-lg px-4 py-2",
            isAgent 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted"
          )}
        >
          {message.type === 'text' && (
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          )}
          {message.type === 'image' && message.mediaUrl && (
            <img src={message.mediaUrl} alt="Imagem" className="rounded max-w-full" />
          )}
          {message.type === 'document' && (
            <p className="text-sm">📎 {message.fileName || message.content}</p>
          )}
        </div>

        <div className={cn("flex items-center gap-1 text-xs text-muted-foreground", isAgent && "flex-row-reverse")}>
          <span>{format(message.timestamp, 'HH:mm')}</span>
          <StatusIcon />
        </div>
      </div>
    </div>
  );
}
