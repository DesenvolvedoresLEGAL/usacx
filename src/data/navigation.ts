import type { Icon } from "@/components/icons";
import { Icons } from "@/components/icons";
import type { Permission } from "@/types/permissions";

export interface NavigationItem {
  title: string;
  href: string;
  icon: Icon;
  /**
   * Optional label indicating that the item should be highlighted using the
   * blue badge that is currently used for the API menu entry.
   */
  highlight?: "blue";
  /**
   * Optional label used for grouping inside breadcrumbs or other navigation
   * helpers.
   */
  groupTitle?: string;
  /**
   * Optional permission required to view this item
   */
  permission?: Permission;
}

export interface NavigationSubgroup {
  subgroupTitle?: string;
  items: NavigationItem[];
}

export interface NavigationGroup {
  groupTitle?: string;
  items?: NavigationItem[];
  subgroups?: NavigationSubgroup[];
}

export const navigationGroups: NavigationGroup[] = [
  {
    items: [
      { title: "Dashboard", href: "/dashboard", icon: Icons.home, permission: "dashboard:view_own" },
    ],
  },
  {
    groupTitle: "Gestão",
    items: [
      { title: "Ao Vivo", href: "/gestao/ao-vivo", icon: Icons.radioTower, permission: "management:live" },
      { title: "Atendimentos", href: "/gestao/atendimentos", icon: Icons.clipboardList, permission: "conversations:view_all" },
      { title: "Canais", href: "/gestao/canais", icon: Icons.network, permission: "management:channels" },
    ],
  },
  {
    groupTitle: "Relatórios",
    items: [
      { title: "Atendimentos", href: "/relatorios/atendimentos", icon: Icons.clipboardList, permission: "reports:view_own" },
      { title: "Clientes", href: "/relatorios/clientes", icon: Icons.users2, permission: "reports:view_team" },
      { title: "Avaliações", href: "/relatorios/avaliacoes", icon: Icons.star, permission: "reports:view_team" },
      { title: "Pausas", href: "/relatorios/pausas", icon: Icons.pauseCircle, permission: "reports:view_team" },
      { title: "Performance", href: "/relatorios/performance", icon: Icons.trendingUp, permission: "reports:view_team" },
      { title: "Analítico", href: "/relatorios/analitico", icon: Icons.pieChart, permission: "reports:view_all" },
      { title: "Exportar", href: "/relatorios/exportar", icon: Icons.download, permission: "reports:export" },
    ],
  },
  {
    groupTitle: "Inteligência Artificial",
    items: [
      { title: "Agentes de IA", href: "/ia/agentes", icon: Icons.bot, permission: "ai:chatbot" },
      { title: "Copiloto", href: "/ia/copiloto", icon: Icons.sparkles, permission: "ai:ml" },
      { title: "Analytics IA", href: "/ia/analytics", icon: Icons.pieChart, permission: "ai:ml" },
      { title: "Base de Conhecimento", href: "/ia/conhecimento", icon: Icons.bookOpen, permission: "ai:ml" },
    ],
  },
  {
    groupTitle: "Acesso",
    items: [
      { title: "Organização", href: "/organizacao/configuracoes", icon: Icons.building2, permission: "dashboard:view_own" },
      { title: "Auditoria", href: "/acesso/auditoria", icon: Icons.shieldCheck, permission: "access:logs" },
    ],
  },
  {
    groupTitle: "Configurações",
    subgroups: [
      {
        subgroupTitle: "Atendimento",
        items: [
          { title: "Filas de Atendimento", href: "/configuracoes/filas", icon: Icons.listOrdered, permission: "settings:edit" },
          { title: "Pausas", href: "/configuracoes/pausas", icon: Icons.pauseCircle, permission: "settings:edit" },
          { title: "SLAs", href: "/configuracoes/slas", icon: Icons.timer, permission: "settings:edit" },
          { title: "Prioridades", href: "/configuracoes/prioridades", icon: Icons.alertTriangle, permission: "settings:edit" },
        ],
      },
      {
        subgroupTitle: "Conteúdo",
        items: [
          { title: "Clientes", href: "/configuracoes/clientes", icon: Icons.users2, permission: "settings:edit" },
          { title: "Etiquetas", href: "/configuracoes/etiquetas", icon: Icons.tags, permission: "settings:edit" },
          { title: "Hashtags", href: "/configuracoes/hashtags", icon: Icons.hash, permission: "settings:edit" },
          { title: "Mensagens Prontas", href: "/configuracoes/mensagens-prontas", icon: Icons.messageSquarePlus, permission: "settings:edit" },
          { title: "Anexos", href: "/configuracoes/anexos", icon: Icons.paperclip, permission: "settings:edit" },
          { title: "Pesquisas", href: "/configuracoes/pesquisas", icon: Icons.smile, permission: "settings:edit" },
        ],
      },
    ],
  },
  {
    groupTitle: "Ajuda",
    items: [
      { title: "Central de Ajuda", href: "/ajuda", icon: Icons.helpCircle },
    ],
  },
];

const flattenedItems: NavigationItem[] = navigationGroups.flatMap((group) => {
  if (group.subgroups) {
    return group.subgroups.flatMap((subgroup) =>
      subgroup.items.map((item) => ({ ...item, groupTitle: item.groupTitle ?? group.groupTitle }))
    );
  }
  return (group.items ?? []).map((item) => ({ ...item, groupTitle: item.groupTitle ?? group.groupTitle }));
});

/**
 * Returns the navigation item whose `href` best matches the provided path. The
 * comparison uses the longest prefix strategy so that nested routes still map
 * to their parent entry in the navigation tree.
 */
export const matchNavigationItem = (pathname: string): NavigationItem | undefined => {
  if (!pathname) return undefined;

  const normalizedPath = pathname.endsWith("/") && pathname !== "/"
    ? pathname.slice(0, -1)
    : pathname;

  const candidates = flattenedItems.filter((item) =>
    normalizedPath === item.href || normalizedPath.startsWith(`${item.href}/`)
  );

  if (candidates.length === 0) {
    return undefined;
  }

  return candidates.sort((a, b) => b.href.length - a.href.length)[0];
};

export const getNavigationItems = () => flattenedItems;
