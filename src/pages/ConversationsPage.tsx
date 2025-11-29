import { ConversationHeader } from '@/components/conversations/ConversationHeader';
import { ConversationsList } from '@/components/conversations/ConversationsList';
import { ChatWindow } from '@/components/conversations/ChatWindow';
import { ClientInfoSidebar } from '@/components/conversations/ClientInfoSidebar';
import { useConversations } from '@/hooks/useConversations';

export default function ConversationsPage() {
  const {
    conversations,
    selectedConversation,
    selectConversation,
    searchQuery,
    setSearchQuery,
    quickFilter,
    setQuickFilter,
    attendNext,
    loading,
  } = useConversations();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Carregando conversas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <ConversationHeader onAttendNext={attendNext} />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="w-96 flex-shrink-0">
          <ConversationsList
            conversations={conversations}
            selectedId={selectedConversation?.id || null}
            onSelectConversation={selectConversation}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            quickFilter={quickFilter}
            onQuickFilterChange={setQuickFilter}
          />
        </div>

        <ChatWindow conversation={selectedConversation} />

        <ClientInfoSidebar client={selectedConversation?.client || null} />
      </div>
    </div>
  );
}
