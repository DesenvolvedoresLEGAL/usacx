import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarSearchBarProps {
  className?: string;
}

export function SidebarSearchBar({ className }: SidebarSearchBarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const handleClick = () => {
    // Future: Open command palette (Cmd+K)
    console.log("Open command palette");
  };

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleClick}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg mx-auto",
              "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
              className
            )}
          >
            <Search className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Buscar (⌘K)</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg border border-sidebar-border bg-sidebar-accent/30 px-3 py-2",
        "text-muted-foreground transition-colors",
        "hover:bg-sidebar-accent/50 hover:border-sidebar-border/80",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className
      )}
    >
      <Search className="h-4 w-4 shrink-0" />
      <span className="flex-1 text-left text-sm">Buscar...</span>
      <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </button>
  );
}
