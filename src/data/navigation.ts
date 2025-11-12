import type { Icon } from "@/components/icons";
import { Icons } from "@/components/icons";

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
}

export interface NavigationGroup {
  groupTitle?: string;
  items: NavigationItem[];
}

export const navigationGroups: NavigationGroup[] = [
  {
    items: [
      { title: "Dashboard", href: "/dashboard", icon: Icons.home },
    ],
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
      { title: "API", href: "/configuracoes/api", icon: Icons.settings, highlight: "blue" },
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

const flattenedItems: NavigationItem[] = navigationGroups.flatMap((group) =>
  group.items.map((item) => ({ ...item, groupTitle: item.groupTitle ?? group.groupTitle }))
);

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
