import { Conversation, ConversationStatus } from '@/types/conversations';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { ConversationListItem } from './ConversationListItem';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ConversationsListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelectConversation: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: ConversationStatus | 'all';
  onStatusFilterChange: (status: ConversationStatus | 'all') => void;
}

export function ConversationsList({
  conversations,
  selectedId,
  onSelectConversation,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: ConversationsListProps) {
  return (
    <div className="flex flex-col h-full border-r bg-background">
      <div className="p-4 border-b space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar conversas..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={(value) => onStatusFilterChange(value as ConversationStatus | 'all')}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="active">Ativas</SelectItem>
            <SelectItem value="waiting">Aguardando</SelectItem>
            <SelectItem value="paused">Pausadas</SelectItem>
            <SelectItem value="finished">Finalizadas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="flex-1">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p className="text-sm">Nenhuma conversa encontrada</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedId === conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
            />
          ))
        )}
      </ScrollArea>
    </div>
  );
}
