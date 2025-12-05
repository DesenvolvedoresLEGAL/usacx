import { ChevronDown, Building2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";

interface SidebarOrgSelectorProps {
  className?: string;
}

export function SidebarOrgSelector({ className }: SidebarOrgSelectorProps) {
  const { organization } = useAuth();
  const { state } = useSidebar();
  const organizationName = organization?.name;
  const isCollapsed = state === "collapsed";

  const displayName = organizationName || "Organização";
  const initials = displayName.slice(0, 2).toUpperCase();

  if (isCollapsed) {
    return (
      <div className={cn("flex items-center justify-center py-2", className)}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
          {initials}
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
            "hover:bg-sidebar-accent/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
            className
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
            {initials}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold text-sidebar-foreground">
              {displayName}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Pro Plan
            </span>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-xs font-medium text-muted-foreground">Organização</p>
          <p className="text-sm font-semibold">{displayName}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <Building2 className="mr-2 h-4 w-4" />
          Trocar Organização
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
