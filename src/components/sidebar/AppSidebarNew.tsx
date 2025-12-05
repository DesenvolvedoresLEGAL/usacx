import { PanelLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Icons } from "@/components/icons";
import { SidebarOrgSelector } from "./SidebarOrgSelector";
import { SidebarSearchBar } from "./SidebarSearchBar";
import { SidebarNavigation } from "./SidebarNavigation";
import { SidebarUserFooter } from "./SidebarUserFooter";

export function AppSidebarNew() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        "border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-out",
        isCollapsed ? "w-[56px]" : "w-[260px]"
      )}
    >
      {/* Header with Logo and Collapse Button */}
      <SidebarHeader className={cn("p-3", isCollapsed && "px-2")}>
        <div className={cn("flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
          {/* Logo */}
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/dashboard" className="flex items-center justify-center">
                  <Icons.logo className="h-8 w-8 text-primary" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>USAC</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link to="/dashboard" className="flex items-center gap-2">
              <Icons.logo className="h-8 w-8 text-primary" />
              <span className="text-lg font-bold text-primary">USAC</span>
            </Link>
          )}

          {/* Collapse Button - Only visible when expanded */}
          {!isCollapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="h-8 w-8 shrink-0 text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                >
                  <PanelLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Recolher menu</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </SidebarHeader>

      {/* Organization Selector */}
      <div className={cn("px-3 pb-1", isCollapsed && "px-2")}>
        <SidebarOrgSelector />
      </div>

      {/* Search */}
      <div className={cn("px-3 pb-2", isCollapsed && "px-2")}>
        <SidebarSearchBar />
      </div>

      {/* Navigation */}
      <SidebarContent className="flex-1 overflow-y-auto py-2">
        <SidebarNavigation />
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className={cn("border-t border-sidebar-border p-3", isCollapsed && "px-2")}>
        <div className="flex flex-col gap-2">
          {/* Expand Button - Only visible when collapsed */}
          {isCollapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="mx-auto h-9 w-9 text-muted-foreground hover:text-sidebar-foreground"
                >
                  <PanelLeft className="h-4 w-4 rotate-180" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Expandir menu</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* User Footer */}
          <SidebarUserFooter />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
