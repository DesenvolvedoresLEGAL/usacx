import { ChevronUp, Settings, HelpCircle, LogOut, Moon, Sun, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarUserFooterProps {
  className?: string;
}

export function SidebarUserFooter({ className }: SidebarUserFooterProps) {
  const { user, role, signOut, profile } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const agentStatus = profile?.status || "online";

  // Priorizar dados do profile (agent_profiles) sobre user_metadata
  const displayName = profile?.display_name || user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Usuário";
  const email = user?.email || "";
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const initials = displayName.slice(0, 2).toUpperCase();

  const statusColors: Record<string, string> = {
    online: "bg-green-500",
    away: "bg-yellow-500",
    busy: "bg-red-500",
    offline: "bg-muted-foreground/50",
  };

  const roleLabels: Record<string, string> = {
    agent: "Vendedor",
    manager: "Gestor",
    admin: "Admin",
  };

  const AvatarWithStatus = () => (
    <div className="relative">
      <Avatar className={cn("h-8 w-8 border-2 border-sidebar-border", isCollapsed && "h-9 w-9")}>
        <AvatarImage src={avatarUrl} alt={displayName} />
        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      <span
        className={cn(
          "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-sidebar-background",
          statusColors[agentStatus || "offline"]
        )}
      />
    </div>
  );

  if (isCollapsed) {
    return (
      <div className={cn("flex items-center justify-center py-2", className)}>
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring">
                  <AvatarWithStatus />
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{displayName}</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end" side="right" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-xs text-muted-foreground">{email}</p>
              {role && (
                <span className="mt-1 inline-flex rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                  {roleLabels[role] || role}
                </span>
              )}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/perfil/configuracoes" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/ajuda" className="flex items-center">
                <HelpCircle className="mr-2 h-4 w-4" />
                Central de Ajuda
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="https://docs.usac.app" target="_blank" rel="noopener noreferrer" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Documentação
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
          <AvatarWithStatus />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium text-sidebar-foreground">
              {displayName}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {email}
            </span>
          </div>
          <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{displayName}</p>
          <p className="text-xs text-muted-foreground">{email}</p>
          {role && (
            <span className="mt-1 inline-flex rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
              {roleLabels[role] || role}
            </span>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/perfil/configuracoes" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/ajuda" className="flex items-center">
            <HelpCircle className="mr-2 h-4 w-4" />
            Central de Ajuda
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="https://docs.usac.app" target="_blank" rel="noopener noreferrer" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Documentação
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
