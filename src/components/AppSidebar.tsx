import React from "react"; // Added React for useState if needed, not needed for uncontrolled
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"; // Import Collapsible components
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent, // Keep for non-collapsible groups
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  // SidebarGroupLabel, // We will render the trigger manually for collapsibles
} from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";
import { ChevronDown } from "lucide-react"; // Import ChevronDown

// Define interface for menu items for clarity
interface MenuItem {
  title: string;
  href: string;
  icon: React.ElementType;
  isBeta?: boolean; // Optional beta tag
  isBlue?: boolean; // Optional blue badge (e.g., for API menu item)
}

interface MenuGroup {
  groupTitle?: string; // Optional title for the group
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    items: [{ title: "Dashboard", href: "/dashboard", icon: Icons.home }],
  },
  {
    groupTitle: "Gestão",
    items: [
      { title: "Ao Vivo", href: "/gestao/ao-vivo", icon: Icons.radioTower },
      { title: "Atendimentos", href: "/gestao/atendimentos", icon: Icons.clipboardList },
      { title: "Agentes", href: "/gestao/agentes", icon: Icons.users },
      { title: "Canais", href: "/gestao/canais", icon: Icons.network },
    ],
  },
  {
    groupTitle: "Relatórios",
    items: [
      { title: "Atendimentos", href: "/relatorios/atendimentos", icon: Icons.clipboardList },
      { title: "Auditoria", href: "/relatorios/auditoria", icon: Icons.shieldCheck },
      { title: "Clientes", href: "/relatorios/clientes", icon: Icons.users2 },
      { title: "Avaliações", href: "/relatorios/avaliacoes", icon: Icons.star },
      { title: "Pausas", href: "/relatorios/pausas", icon: Icons.pauseCircle },
      { title: "Performance", href: "/relatorios/performance", icon: Icons.trendingUp },
      { title: "Analítico", href: "/relatorios/analitico", icon: Icons.pieChart },
      { title: "Exportar", href: "/relatorios/exportar", icon: Icons.download },
    ],
  },
  {
    groupTitle: "Inteligência Artificial",
    items: [
      { title: "Chatbot", href: "/ia/chatbot", icon: Icons.messageSquare },
      { title: "Machine Learning", href: "/ia/machine-learning", icon: Icons.barChart2 },
    ],
  },
  {
    groupTitle: "Acesso",
    items: [
      { title: "Agentes", href: "/acesso/agentes", icon: Icons.users },
      { title: "Usuários", href: "/acesso/usuarios", icon: Icons.userCog },
      { title: "Logs de Acesso", href: "/acesso/logs", icon: Icons.history },
    ],
  },
  {
    groupTitle: "Configurações",
    items: [
      { title: "Agentes", href: "/configuracoes/agentes", icon: Icons.users },
      { title: "Bots", href: "/configuracoes/bots", icon: Icons.bot },
      { title: "Clientes", href: "/configuracoes/clientes", icon: Icons.users2 },
      { title: "Etiquetas", href: "/configuracoes/etiquetas", icon: Icons.tags },
      { title: "Filas de Atendimento", href: "/configuracoes/filas", icon: Icons.listOrdered },
      { title: "Pausas", href: "/configuracoes/pausas", icon: Icons.pauseCircle },
      { title: "Pesquisas", href: "/configuracoes/pesquisas", icon: Icons.smile },
      { title: "Hashtags", href: "/configuracoes/hashtags", icon: Icons.hash },
      { title: "Mensagens Prontas", href: "/configuracoes/mensagens-prontas", icon: Icons.messageSquarePlus },
      { title: "Anexos", href: "/configuracoes/anexos", icon: Icons.paperclip },
      { title: "SLAs", href: "/configuracoes/slas", icon: Icons.timer },
      { title: "Prioridades", href: "/configuracoes/prioridades", icon: Icons.alertTriangle },
      { title: "API", href: "/configuracoes/api", icon: Icons.settings, isBlue: true },
    ],
  },
  {
    groupTitle: "Ajuda",
    items: [
      { title: "Chat", href: "/ajuda/chat", icon: Icons.messageSquare },
      { title: "Status", href: "/ajuda/status", icon: Icons.info },
      { title: "Versão", href: "/ajuda/versao", icon: Icons.packageIcon },
      { title: "Cancelamento", href: "/ajuda/cancelamento", icon: Icons.xOctagon },
    ],
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="p-4">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <Icons.logo className="h-8 w-8 text-primary" />
          <span className="font-semibold text-lg text-primary">PING</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-grow">
        {menuGroups.map((group, groupIndex) => (
          <SidebarGroup key={group.groupTitle || `group-${groupIndex}`}>
            {group.groupTitle ? (
              <Collapsible>
                <CollapsibleTrigger className="group flex h-8 w-full items-center justify-between rounded-md px-2 text-left text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2">
                  <span>{group.groupTitle}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroupContent className="pt-1">
                    <SidebarMenu>
                      {group.items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            isActive={location.pathname.startsWith(item.href)}
                            asChild={false}
                            className="w-full"
                          >
                            <Link
                              to={item.href}
                              className={cn(
                                "flex items-center w-full h-full",
                                location.pathname.startsWith(item.href) ? "font-medium" : ""
                              )}
                            >
                              <item.icon className="mr-2 h-5 w-5 shrink-0" />
                              <span className="truncate">{item.title}</span>
                              {item.isBlue && (
                                <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white rounded text-xs font-bold animate-pulse">
                                  BLUE
                                </span>
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={location.pathname.startsWith(item.href)}
                        asChild={false}
                        className="w-full"
                      >
                        <Link
                          to={item.href}
                          className={cn(
                            "flex items-center w-full h-full",
                            location.pathname.startsWith(item.href) ? "font-medium" : ""
                          )}
                        >
                          <item.icon className="mr-2 h-5 w-5 shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild={false}
              className="w-full"
            >
              <Link
                to="/login"
                className="flex items-center w-full h-full" 
              >
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
