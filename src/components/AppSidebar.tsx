import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";
import { navigationGroups } from "@/data/navigation";
import { ChevronDown } from "lucide-react";

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="p-4">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <Icons.logo className="h-8 w-8 text-primary" />
          <span className="text-lg font-semibold text-primary">PING</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-grow">
        {navigationGroups.map((group, groupIndex) => {
          const groupKey = group.groupTitle ?? `group-${groupIndex}`;
          const isGroupActive = group.items.some((item) =>
            location.pathname.startsWith(item.href)
          );

          if (group.groupTitle) {
            return (
              <SidebarGroup key={groupKey}>
                <Collapsible defaultOpen={isGroupActive}>
                  <CollapsibleTrigger className="group flex h-8 w-full items-center justify-between rounded-md px-2 text-left text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2">
                    <span>{group.groupTitle}</span>
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarGroupContent className="pt-1">
                      <SidebarMenu>
                        {group.items.map((item) => {
                          const active = location.pathname.startsWith(item.href);
                          return (
                            <SidebarMenuItem key={item.title}>
                              <SidebarMenuButton isActive={active} className="w-full" asChild>
                                <Link
                                  to={item.href}
                                  className={cn(
                                    "flex h-full w-full items-center",
                                    active && "font-medium"
                                  )}
                                >
                                  <item.icon className="mr-2 h-5 w-5 shrink-0" />
                                  <span className="truncate">{item.title}</span>
                                  {item.highlight === "blue" && (
                                    <span className="ml-2 rounded bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
                                      BLUE
                                    </span>
                                  )}
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarGroup>
            );
          }

          return (
            <SidebarGroup key={groupKey}>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const active = location.pathname.startsWith(item.href);
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton isActive={active} className="w-full" asChild>
                          <Link
                            to={item.href}
                            className={cn(
                              "flex h-full w-full items-center",
                              active && "font-medium"
                            )}
                          >
                            <item.icon className="mr-2 h-5 w-5 shrink-0" />
                            <span className="truncate">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full" asChild>
              <Link to="/login" className="flex h-full w-full items-center">
                <Icons.logout className="mr-2 h-5 w-5 shrink-0" />
                <span className="truncate">Sair</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
