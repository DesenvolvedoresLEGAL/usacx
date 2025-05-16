
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Icons } from "@/components/icons"; // Import centralized icons

const menuItems = [
  { title: "Dashboard", href: "/dashboard", icon: Icons.home },
  { title: "Conversas", href: "/conversations", icon: Icons.messageSquare },
  { title: "Templates", href: "/templates", icon: Icons.fileText },
  { title: "Relatórios", href: "/reports", icon: Icons.barChart2 },
  { title: "Agentes", href: "/agents", icon: Icons.users },
  { title: "Configurações", href: "/settings", icon: Icons.settings },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <Icons.logo className="h-8 w-8 text-primary" />
          <span className="font-semibold text-lg">LEGAL Atende</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-grow">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      location.pathname.startsWith(item.href)
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "hover:bg-accent hover:text-accent-foreground",
                      "w-full justify-start"
                    )}
                  >
                    <Link to={item.href}>
                      <item.icon className="mr-2 h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="w-full justify-start">
              <Link to="/login">
                <Icons.logout className="mr-2 h-5 w-5" />
                <span>Sair</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
