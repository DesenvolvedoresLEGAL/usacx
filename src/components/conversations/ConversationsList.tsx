import { Conversation, ConversationStatus } from '@/types/conversations';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, MoreVertical, Coffee, Archive, Star, Settings } from 'lucide-react';
import { ConversationListItem } from './ConversationListItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ConversationsListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelectConversation: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  quickFilter: 'all' | 'unread' | 'favorites';
  onQuickFilterChange: (filter: 'all' | 'unread' | 'favorites') => void;
}

interface PauseReason {
  id: string;
  label: string;
  icon: string;
}

export function ConversationsList({
  conversations,
  selectedId,
  onSelectConversation,
  searchQuery,
  onSearchChange,
  quickFilter,
  onQuickFilterChange,
}: ConversationsListProps) {
  const [pauseReasons, setPauseReasons] = useState<PauseReason[]>([]);

  useEffect(() => {
    const fetchPauseReasons = async () => {
      const { data } = await supabase.from('pause_reasons').select('*').eq('is_active', true);
      if (data) setPauseReasons(data);
    };
    fetchPauseReasons();
  }, []);

  const handleNewChat = () => {
    toast.success('Iniciando nova conversa...');
  };

  const handlePause = (reason: PauseReason) => {
    toast.info(`Status alterado: ${reason.label}`);
  };

  return (
    <div className="flex flex-col h-full border-r bg-background">
      {/* MINI HEADER - WhatsApp Style */}
      <div className="px-4 py-3 flex items-center gap-2 border-b">
        {/* New Chat Button */}
        <Button variant="ghost" size="icon" onClick={handleNewChat}>
          <Plus className="h-5 w-5" />
        </Button>

        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ou iniciar conversa"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 bg-muted/50"
          />
        </div>

        {/* 3-Dots Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Meu Status</DropdownMenuLabel>
            <DropdownMenuItem>
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
              Online
            </DropdownMenuItem>
            {pauseReasons.map((reason) => (
              <DropdownMenuItem key={reason.id} onClick={() => handlePause(reason)}>
                <Coffee className="h-4 w-4 mr-2" />
                {reason.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Ações Rápidas</DropdownMenuLabel>
            <DropdownMenuItem>
              <Archive className="h-4 w-4 mr-2" />
              Conversas arquivadas
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Star className="h-4 w-4 mr-2" />
              Favoritas
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* QUICK FILTERS - Pills WhatsApp Style */}
      <div className="px-4 py-2 border-b flex gap-2 overflow-x-auto">
        <Button
          variant={quickFilter === 'all' ? 'default' : 'ghost'}
          size="sm"
          className="rounded-full"
          onClick={() => onQuickFilterChange('all')}
        >
          Todas
        </Button>
        <Button
          variant={quickFilter === 'unread' ? 'default' : 'ghost'}
          size="sm"
          className="rounded-full"
          onClick={() => onQuickFilterChange('unread')}
        >
          Não lidas
        </Button>
        <Button
          variant={quickFilter === 'favorites' ? 'default' : 'ghost'}
          size="sm"
          className="rounded-full"
          onClick={() => onQuickFilterChange('favorites')}
        >
          Favoritas
        </Button>
      </div>

      {/* CONVERSATION LIST */}
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
