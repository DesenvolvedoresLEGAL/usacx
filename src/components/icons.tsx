
import {
  Home,
  Users,
  Settings,
  BarChart2,
  MessageSquare,
  FileText,
  LogIn,
  LogOut,
  Bell,
  ChevronDown,
  Briefcase, // Using Briefcase for "LEGAL" company
  LucideIcon,
  RadioTower,
  ClipboardList,
  Waypoints, // For Canais
  ShieldCheck, // For Auditoria
  Users2, // For Clientes (alternative to Users)
  Star, // For Avaliações
  PauseCircle, // For Pausas
  TrendingUp, // For Performance
  PieChart, // For Analítico
  Download, // For Exportar
  KeyRound, // For Acesso
  UserCog, // For Usuários (config)
  History, // For Logs de Acesso
  Bot, // For Bots
  Tags, // For Etiquetas
  ListOrdered, // For Filas de Atendimento
  Smile, // For CSAT
  Hash, // For Hashtags
  MessageSquarePlus, // For Mensagens Prontas
  Paperclip, // For Anexos
  Timer, // For SLAs
  AlertTriangle, // For Prioridades (or ChevronUpSquare)
  HelpCircle, // For Ajuda
  Info, // For Status
  GitCommit, // For Versão (alternative: Package)
  XOctagon, // For Cancelamento
  LayoutGrid, // Alternative for Gestão
  Network, // Alternative for Canais
  Package, // Alternative for Versão
  Plus, // For adding new items
  UserCheck, // For active users
  Building, // For departments/companies
  Target, // For goals/targets
  Sparkles, // For IA Copiloto
  BookOpen, // For Base de Conhecimento
} from 'lucide-react';

export type Icon = LucideIcon;

export const Icons = {
  logo: Briefcase,
  home: Home,
  users: Users, // Agentes, Acesso > Agentes, Configurações > Agentes
  settings: Settings, // Configurações
  barChart2: BarChart2, // Relatórios
  messageSquare: MessageSquare, // Conversas, Ajuda > Chat
  fileText: FileText, // Templates
  login: LogIn,
  logout: LogOut,
  bell: Bell,
  chevronDown: ChevronDown,
  
  // Gestão
  gestao: LayoutGrid, // Icon for Gestão group
  radioTower: RadioTower, // Ao Vivo
  clipboardList: ClipboardList, // Atendimentos (Gestão), Atendimentos (Relatórios)
  network: Network, // Canais
  
  // Relatórios
  shieldCheck: ShieldCheck, // Auditoria
  users2: Users2, // Clientes (Relatórios), Clientes (Configurações)
  star: Star, // Avaliações
  pauseCircle: PauseCircle, // Pausas (Relatórios), Pausas (Configurações)
  trendingUp: TrendingUp, // Performance
  pieChart: PieChart, // Analítico
  download: Download, // Exportar

  // Acesso
  keyRound: KeyRound, // Acesso
  userCog: UserCog, // Usuários (Acesso)
  history: History, // Logs de Acesso

  // Configurações
  bot: Bot, // Bots
  tags: Tags, // Etiquetas
  listOrdered: ListOrdered, // Filas de Atendimento
  smile: Smile, // CSAT
  hash: Hash, // Hashtags
  messageSquarePlus: MessageSquarePlus, // Mensagens Prontas
  paperclip: Paperclip, // Anexos
  timer: Timer, // SLAs
  alertTriangle: AlertTriangle, // Prioridades

  // Ajuda
  helpCircle: HelpCircle, // Ajuda
  info: Info, // Status
  packageIcon: Package, // Versão (using Package as more generic)
  xOctagon: XOctagon, // Cancelamento

  // Additional icons for SettingsAgentsPage
  plus: Plus, // For adding new items
  userCheck: UserCheck, // For active users
  building: Building, // For departments/companies
  target: Target, // For goals/targets
  
  // IA
  sparkles: Sparkles, // Copiloto
  bookOpen: BookOpen, // Base de Conhecimento
};

export default Icons;
