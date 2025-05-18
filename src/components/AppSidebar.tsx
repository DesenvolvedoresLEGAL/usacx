
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
// Button import is not used in this file after previous refactors.
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
  SidebarGroupLabel, // Added for grouping
  // SidebarTrigger is not used here, it's in MainLayout
} from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";

// Define interface for menu items for clarity
interface MenuItem {
  title: string;
  href: string;
  icon: React.ElementType;
  isBeta?: boolean; // Optional beta tag
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
      { title: "CSAT", href: "/configuracoes/csat", icon: Icons.smile },
      { title: "Hashtags", href: "/configuracoes/hashtags", icon: Icons.hash },
      { title: "Mensagens Prontas", href: "/configuracoes/mensagens-prontas", icon: Icons.messageSquarePlus },
      { title: "Anexos", href: "/configuracoes/anexos", icon: Icons.paperclip },
      { title: "SLAs", href: "/configuracoes/slas", icon: Icons.timer },
      { title: "Prioridades", href: "/configuracoes/prioridades", icon: Icons.alertTriangle },
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
    <Sidebar className="border-r bg-sidebar text-sidebar-foreground"> {/* Ensured sidebar specific colors are applied */}
      <SidebarHeader className="p-4">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <Icons.logo className="h-8 w-8 text-primary" /> {/* text-primary will use the new #020cbc */}
          <span className="font-semibold text-lg text-primary">LEGAL Atende</span> {/* text-primary for logo text */}
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-grow">
        {menuGroups.map((group, groupIndex) => (
          <SidebarGroup key={group.groupTitle || `group-${groupIndex}`}>
            {group.groupTitle && (
              <SidebarGroupLabel>{group.groupTitle}</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={location.pathname.startsWith(item.href)}
                      asChild={false} // Let SidebarMenuButton handle its own rendering
                      className="w-full" // Ensure button takes full width for proper click area
                    >
                      <Link
                        to={item.href}
                        className={cn(
                          "flex items-center w-full h-full", // Ensure link fills the button
                          // Active state styling is handled by SidebarMenuButton's data-active attribute
                          // and CSS variables. Text color will be based on sidebar-foreground or sidebar-primary-foreground.
                          // Forcing text color here might override the intended behavior.
                          // If specific active text color different from button's active fg is needed,
                          // it can be added here, but usually it's fine.
                          location.pathname.startsWith(item.href) ? "font-medium" : "" // Keep font-medium for active
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
                className="flex items-center w-full h-full" // text-sidebar-foreground is default
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

