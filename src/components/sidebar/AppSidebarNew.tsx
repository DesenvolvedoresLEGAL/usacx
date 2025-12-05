import { PanelLeft } from "lucide-react";
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
      {/* Header */}
      <SidebarHeader className={cn("p-3", isCollapsed && "px-2")}>
        <div className={cn("flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
          {!isCollapsed && <SidebarOrgSelector />}
          {isCollapsed && (
            <SidebarOrgSelector />
          )}
        </div>
      </SidebarHeader>

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
          {/* Collapse Toggle */}
          {!isCollapsed ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="w-full justify-start gap-2 text-muted-foreground hover:text-sidebar-foreground"
            >
              <PanelLeft className="h-4 w-4" />
              <span className="text-xs">Recolher menu</span>
            </Button>
          ) : (
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
