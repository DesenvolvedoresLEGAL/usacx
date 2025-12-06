import {
  Home,
  MessageSquare,
  RadioTower,
  Network,
  ClipboardList,
  Users2,
  Star,
  PauseCircle,
  TrendingUp,
  PieChart,
  Download,
  Bot,
  Sparkles,
  BookOpen,
  Building2,
  ShieldCheck,
  ListOrdered,
  Timer,
  AlertTriangle,
  Tags,
  Hash,
  MessageSquarePlus,
  Paperclip,
  Smile,
  Settings,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";
import type { Permission } from "@/types/permissions";

export interface SidebarNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  permission?: Permission;
  badge?: string;
}

export interface SidebarNavGroup {
  id: string;
  title: string;
  icon: LucideIcon;
  items: SidebarNavItem[];
}

export interface SidebarNavigationConfig {
  quickActions: SidebarNavItem[];
  groups: SidebarNavGroup[];
  bottomItems: SidebarNavItem[];
}

export const sidebarNavigation: SidebarNavigationConfig = {
  // Quick Actions - Always visible, no group
  quickActions: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
      permission: "dashboard:view_own",
    },
    {
      title: "Atendimentos",
      href: "/conversations",
      icon: MessageSquare,
      permission: "conversations:view_own",
    },
  ],

  // Main Navigation Groups (reduced from 7+ to 4)
  groups: [
    {
      id: "operations",
      title: "Operações",
      icon: RadioTower,
      items: [
        {
          title: "Ao Vivo",
          href: "/gestao/ao-vivo",
          icon: RadioTower,
          permission: "management:live",
        },
        {
          title: "Gestão de Atendimentos",
          href: "/gestao/atendimentos",
          icon: ClipboardList,
          permission: "conversations:view_all",
        },
        {
          title: "Canais",
          href: "/gestao/canais",
          icon: Network,
          permission: "management:channels",
        },
      ],
    },
    {
      id: "reports",
      title: "Relatórios",
      icon: PieChart,
      items: [
        {
          title: "Atendimentos",
          href: "/relatorios/atendimentos",
          icon: ClipboardList,
          permission: "reports:view_own",
        },
        {
          title: "Clientes",
          href: "/relatorios/clientes",
          icon: Users2,
          permission: "reports:view_team",
        },
        {
          title: "Avaliações",
          href: "/relatorios/avaliacoes",
          icon: Star,
          permission: "reports:view_team",
        },
        {
          title: "Pausas",
          href: "/relatorios/pausas",
          icon: PauseCircle,
          permission: "reports:view_team",
        },
        {
          title: "Performance",
          href: "/relatorios/performance",
          icon: TrendingUp,
          permission: "reports:view_team",
        },
        {
          title: "Analítico",
          href: "/relatorios/analitico",
          icon: PieChart,
          permission: "reports:view_all",
        },
        {
          title: "Exportar",
          href: "/relatorios/exportar",
          icon: Download,
          permission: "reports:export",
        },
      ],
    },
    {
      id: "ai",
      title: "Inteligência Artificial",
      icon: Sparkles,
      items: [
        {
          title: "Agentes de IA",
          href: "/ia/agentes",
          icon: Bot,
          permission: "ai:chatbot",
        },
        {
          title: "Copiloto",
          href: "/ia/copiloto",
          icon: Sparkles,
          permission: "ai:ml",
        },
        {
          title: "Analytics IA",
          href: "/ia/analytics",
          icon: PieChart,
          permission: "ai:ml",
        },
        {
          title: "Base de Conhecimento",
          href: "/ia/conhecimento",
          icon: BookOpen,
          permission: "ai:ml",
        },
      ],
    },
    {
      id: "admin",
      title: "Administração",
      icon: Settings,
      items: [
        // Organização (consolidada)
        {
          title: "Organização",
          href: "/organizacao/configuracoes",
          icon: Building2,
          permission: "dashboard:view_own",
        },
        {
          title: "Auditoria",
          href: "/acesso/auditoria",
          icon: ShieldCheck,
          permission: "access:logs",
        },
        // Settings - Atendimento
        {
          title: "Filas de Atendimento",
          href: "/configuracoes/filas",
          icon: ListOrdered,
          permission: "settings:edit",
        },
        {
          title: "Pausas",
          href: "/configuracoes/pausas",
          icon: PauseCircle,
          permission: "settings:edit",
        },
        {
          title: "SLAs",
          href: "/configuracoes/slas",
          icon: Timer,
          permission: "settings:edit",
        },
        {
          title: "Prioridades",
          href: "/configuracoes/prioridades",
          icon: AlertTriangle,
          permission: "settings:edit",
        },
        // Settings - Conteúdo
        {
          title: "Clientes",
          href: "/configuracoes/clientes",
          icon: Users2,
          permission: "settings:edit",
        },
        {
          title: "Etiquetas",
          href: "/configuracoes/etiquetas",
          icon: Tags,
          permission: "settings:edit",
        },
        {
          title: "Hashtags",
          href: "/configuracoes/hashtags",
          icon: Hash,
          permission: "settings:edit",
        },
        {
          title: "Mensagens Prontas",
          href: "/configuracoes/mensagens-prontas",
          icon: MessageSquarePlus,
          permission: "settings:edit",
        },
        {
          title: "Anexos",
          href: "/configuracoes/anexos",
          icon: Paperclip,
          permission: "settings:edit",
        },
        {
          title: "Pesquisas",
          href: "/configuracoes/pesquisas",
          icon: Smile,
          permission: "settings:edit",
        },
        // Integrations
        {
          title: "API",
          href: "/configuracoes/api",
          icon: Settings,
          permission: "settings:edit",
          badge: "Beta",
        },
      ],
    },
  ],

  // Bottom items (always visible)
  bottomItems: [
    {
      title: "Central de Ajuda",
      href: "/ajuda",
      icon: HelpCircle,
    },
  ],
};
