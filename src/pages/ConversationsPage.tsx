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
    statusFilter,
    setStatusFilter,
    attendNext,
  } = useConversations();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <ConversationHeader onAttendNext={attendNext} />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 flex-shrink-0">
          <ConversationsList
            conversations={conversations}
            selectedId={selectedConversation?.id || null}
            onSelectConversation={selectConversation}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        </div>

        <ChatWindow conversation={selectedConversation} />

        <ClientInfoSidebar client={selectedConversation?.client || null} />
      </div>
    </div>
  );
}
