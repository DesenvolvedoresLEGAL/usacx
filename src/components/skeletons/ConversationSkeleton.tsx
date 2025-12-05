import { Skeleton } from "@/components/ui/skeleton";

export function ConversationItemSkeleton() {
  return (
    <div className="flex items-start gap-3 px-4 py-3 border-b">
      <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-3 w-full" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ConversationsListSkeleton() {
  return (
    <div className="flex flex-col h-full border-r bg-background">
      {/* Header skeleton */}
      <div className="px-4 py-3 flex items-center gap-2 border-b">
        <Skeleton className="h-9 w-9 rounded" />
        <Skeleton className="h-9 flex-1 rounded" />
        <Skeleton className="h-9 w-9 rounded" />
      </div>

      {/* Quick filters skeleton */}
      <div className="px-4 py-2 border-b flex justify-center gap-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>

      {/* Conversation items skeleton */}
      <div className="flex-1 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <ConversationItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function ChatMessageSkeleton({ isAgent = false }: { isAgent?: boolean }) {
  return (
    <div className={`flex gap-3 ${isAgent ? 'flex-row-reverse' : ''}`}>
      <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
      <div className={`space-y-2 max-w-[70%] ${isAgent ? 'items-end' : ''}`}>
        <Skeleton className={`h-16 w-64 rounded-2xl ${isAgent ? 'rounded-br-sm' : 'rounded-bl-sm'}`} />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

export function ChatWindowSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="h-16 border-b flex items-center gap-3 px-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-4 space-y-4">
        <ChatMessageSkeleton isAgent={false} />
        <ChatMessageSkeleton isAgent={true} />
        <ChatMessageSkeleton isAgent={false} />
        <ChatMessageSkeleton isAgent={true} />
      </div>
      
      {/* Input */}
      <div className="h-16 border-t flex items-center gap-2 px-4">
        <Skeleton className="h-10 flex-1 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );
}
