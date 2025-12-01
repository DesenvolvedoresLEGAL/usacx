# Documentação Técnica - USAC Platform

## 📋 Visão Geral

**USAC** é uma plataforma omnichannel de atendimento ao cliente desenvolvida com React, TypeScript, Vite e Lovable Cloud (Supabase).

### Stack Tecnológica
- **Frontend**: React 18, TypeScript, Vite
- **UI/UX**: Tailwind CSS, Shadcn/ui, Lucide React Icons
- **Backend**: Lovable Cloud (Supabase)
- **Estado**: React Context API, TanStack Query
- **Roteamento**: React Router DOM v6
- **Real-time**: Supabase Realtime
- **Edge Functions**: Deno (TypeScript)

---

## 🗂️ Estrutura de Páginas

### Páginas Principais

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/` | `src/pages/Index.tsx` | Página inicial (redirect) |
| `/login` | `src/pages/LoginPage.tsx` | Autenticação de usuários |
| `/dashboard` | `src/pages/DashboardPage.tsx` | Dashboard principal (role-based) |
| `/conversas` | `src/pages/ConversationsPage.tsx` | Painel de conversas (operacional) |
| `/perfil/configuracoes` | `src/pages/ProfileSettingsPage.tsx` | Configurações de perfil do usuário |

### Gestão (Management)

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/gestao/ao-vivo` | `src/pages/LiveManagementPage.tsx` | Monitoramento em tempo real |
| `/gestao/atendimentos` | `src/pages/AttendanceManagementPage.tsx` | Gestão de atendimentos |
| `/gestao/canais` | `src/pages/ChannelsManagementPage.tsx` | Gerenciamento de canais |

### Relatórios (Reports)

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/relatorios/atendimentos` | `src/pages/ReportAttendancesPage.tsx` | Relatório de atendimentos |
| `/relatorios/clientes` | `src/pages/ReportClientsPage.tsx` | Relatório de clientes |
| `/relatorios/avaliacoes` | `src/pages/ReportEvaluationsPage.tsx` | Relatório de avaliações |
| `/relatorios/pausas` | `src/pages/ReportBreaksPage.tsx` | Relatório de pausas |
| `/relatorios/performance` | `src/pages/ReportPerformancePage.tsx` | Relatório de performance |
| `/relatorios/analitico` | `src/pages/ReportAnalyticsPage.tsx` | Relatório analítico |
| `/relatorios/exportar` | `src/pages/ReportExportPage.tsx` | Exportação de relatórios |

### Inteligência Artificial

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/ia/agentes` | `src/pages/AIAgentsPage.tsx` | Gestão de agentes de IA |
| `/ia/copiloto` | `src/pages/AICopilotPage.tsx` | Copiloto de IA para agentes |
| `/ia/analytics` | `src/pages/AIAnalyticsPage.tsx` | Analytics de IA |
| `/ia/conhecimento` | `src/pages/AIKnowledgePage.tsx` | Base de conhecimento |

### Acesso (Access Control)

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/acesso/usuarios` | `src/pages/UserManagementPage.tsx` | Gestão de usuários |
| `/acesso/auditoria` | `src/pages/AuditCenterPage.tsx` | Centro de auditoria |

### Configurações (Settings)

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/configuracoes` | `src/pages/SettingsPage.tsx` | Configurações gerais |
| `/configuracoes/filas` | `src/pages/SettingsQueuesPage.tsx` | Configuração de filas |
| `/configuracoes/pausas` | `src/pages/SettingsPausesPage.tsx` | Configuração de pausas |
| `/configuracoes/slas` | `src/pages/SettingsSLAsPage.tsx` | Configuração de SLAs |
| `/configuracoes/prioridades` | `src/pages/SettingsPrioritiesPage.tsx` | Configuração de prioridades |
| `/configuracoes/clientes` | `src/pages/SettingsClientsPage.tsx` | Configuração de clientes |
| `/configuracoes/etiquetas` | `src/pages/SettingsTagsPage.tsx` | Configuração de etiquetas |
| `/configuracoes/hashtags` | `src/pages/SettingsHashtagsPage.tsx` | Configuração de hashtags |
| `/configuracoes/mensagens-prontas` | `src/pages/SettingsTemplatesPage.tsx` | Mensagens prontas |
| `/configuracoes/anexos` | `src/pages/SettingsAttachmentsPage.tsx` | Configuração de anexos |
| `/configuracoes/pesquisas` | `src/pages/SettingsSurveysPage.tsx` | Configuração de pesquisas |
| `/configuracoes/api` | `src/pages/SettingsApiPage.tsx` | Configuração de API |

### Ajuda

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/ajuda` | `src/pages/HelpCenterPage.tsx` | Central de ajuda |

### Outras

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `*` | `src/pages/NotFound.tsx` | Página 404 |

---

## 🧩 Componentes

### Layout

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| `MainLayout` | `src/components/MainLayout.tsx` | Layout principal com sidebar |
| `AppSidebar` | `src/components/AppSidebar.tsx` | Sidebar de navegação |

### Dashboard

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| `AdminDashboard` | `src/components/dashboard/AdminDashboard.tsx` | Dashboard do administrador |
| `AgentDashboard` | `src/components/dashboard/AgentDashboard.tsx` | Dashboard do agente |
| `ManagerDashboard` | `src/components/dashboard/ManagerDashboard.tsx` | Dashboard do gestor |
| `MetricCard` | `src/components/dashboard/MetricCard.tsx` | Card de métrica |
| `AlertCard` | `src/components/dashboard/AlertCard.tsx` | Card de alerta |
| `AttendanceChart` | `src/components/dashboard/AttendanceChart.tsx` | Gráfico de atendimentos |
| `ChannelChart` | `src/components/dashboard/ChannelChart.tsx` | Gráfico de canais |
| `LiveActivityTable` | `src/components/dashboard/LiveActivityTable.tsx` | Tabela de atividade ao vivo |

### Conversas (Conversations)

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| `ConversationsList` | `src/components/conversations/ConversationsList.tsx` | Lista de conversas |
| `ConversationListItem` | `src/components/conversations/ConversationListItem.tsx` | Item da lista de conversas |
| `ConversationHeader` | `src/components/conversations/ConversationHeader.tsx` | Cabeçalho da conversa |
| `ChatWindow` | `src/components/conversations/ChatWindow.tsx` | Janela de chat |
| `ChatMessage` | `src/components/conversations/ChatMessage.tsx` | Mensagem individual |
| `ChatInput` | `src/components/conversations/ChatInput.tsx` | Input de mensagem |
| `ClientInfoSidebar` | `src/components/conversations/ClientInfoSidebar.tsx` | Sidebar com info do cliente |

### Gestão Ao Vivo (Live Management)

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| `LiveStatsCards` | `src/components/live/LiveStatsCards.tsx` | Cards de estatísticas ao vivo |
| `QueueMonitor` | `src/components/live/QueueMonitor.tsx` | Monitor de filas |
| `ActiveAgentsTable` | `src/components/live/ActiveAgentsTable.tsx` | Tabela de agentes ativos |
| `LiveControlPanel` | `src/components/live/LiveControlPanel.tsx` | Painel de controle ao vivo |
| `TransferConversationsDialog` | `src/components/live/TransferConversationsDialog.tsx` | Diálogo de transferência |

### Atendimentos (Attendance)

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| `AttendanceTable` | `src/components/attendance/AttendanceTable.tsx` | Tabela de atendimentos |
| `AttendanceStatsCards` | `src/components/attendance/AttendanceStatsCards.tsx` | Cards de estatísticas |
| `AttendanceFilters` | `src/components/attendance/AttendanceFilters.tsx` | Filtros de atendimentos |
| `AttendanceBulkActions` | `src/components/attendance/AttendanceBulkActions.tsx` | Ações em lote |

### Relatórios (Reports)

#### Atendimentos
- `ReportAttendanceFilters` - `src/components/reports/ReportAttendanceFilters.tsx`
- `ReportAttendanceStats` - `src/components/reports/ReportAttendanceStats.tsx`
- `ReportAttendanceTable` - `src/components/reports/ReportAttendanceTable.tsx`

#### Clientes
- `ReportClientFilters` - `src/components/reports/ReportClientFilters.tsx`
- `ReportClientStats` - `src/components/reports/ReportClientStats.tsx`
- `ReportClientTable` - `src/components/reports/ReportClientTable.tsx`

#### Avaliações
- `ReportEvaluationFilters` - `src/components/reports/ReportEvaluationFilters.tsx`
- `ReportEvaluationStats` - `src/components/reports/ReportEvaluationStats.tsx`
- `ReportEvaluationTable` - `src/components/reports/ReportEvaluationTable.tsx`
- `ReportEvaluationCharts` - `src/components/reports/ReportEvaluationCharts.tsx`

#### Pausas
- `ReportBreakFilters` - `src/components/reports/ReportBreakFilters.tsx`
- `ReportBreakStats` - `src/components/reports/ReportBreakStats.tsx`
- `ReportBreakTable` - `src/components/reports/ReportBreakTable.tsx`
- `ReportBreakCharts` - `src/components/reports/ReportBreakCharts.tsx`

#### Performance
- `ReportPerformanceFilters` - `src/components/reports/ReportPerformanceFilters.tsx`
- `ReportPerformanceStats` - `src/components/reports/ReportPerformanceStats.tsx`
- `ReportPerformanceTable` - `src/components/reports/ReportPerformanceTable.tsx`
- `ReportPerformanceCharts` - `src/components/reports/ReportPerformanceCharts.tsx`

#### Analítico
- `ReportAnalyticsFilters` - `src/components/reports/ReportAnalyticsFilters.tsx`
- `ReportAnalyticsMetrics` - `src/components/reports/ReportAnalyticsMetrics.tsx`
- `ReportAnalyticsCharts` - `src/components/reports/ReportAnalyticsCharts.tsx`
- `ReportAnalyticsInsights` - `src/components/reports/ReportAnalyticsInsights.tsx`

#### Gerador
- `ReportGeneratorPanel` - `src/components/reports/ReportGeneratorPanel.tsx`

### Inteligência Artificial

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| `AISuggestionPanel` | `src/components/ai/AISuggestionPanel.tsx` | Painel de sugestões de IA |
| `AISummaryPanel` | `src/components/ai/AISummaryPanel.tsx` | Painel de resumo de IA |

### Usuários (Users)

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| `UserListTab` | `src/components/users/UserListTab.tsx` | Aba de lista de usuários |
| `UserFormDialog` | `src/components/users/UserFormDialog.tsx` | Diálogo de formulário de usuário |
| `RolesPermissionsTab` | `src/components/users/RolesPermissionsTab.tsx` | Aba de roles e permissões |
| `TeamsTab` | `src/components/users/TeamsTab.tsx` | Aba de equipes |
| `SecurityTab` | `src/components/users/SecurityTab.tsx` | Aba de segurança |
| `OperationalConfigTab` | `src/components/users/OperationalConfigTab.tsx` | Aba de config operacional |

### Auditoria (Audit)

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| `AuditAccessLogsTab` | `src/components/audit/AuditAccessLogsTab.tsx` | Logs de acesso |
| `AuditUserActivitiesTab` | `src/components/audit/AuditUserActivitiesTab.tsx` | Atividades de usuários |
| `AuditAttendanceTab` | `src/components/audit/AuditAttendanceTab.tsx` | Auditoria de atendimentos |

### Configurações (Settings)

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| `ProfileTab` | `src/components/settings/ProfileTab.tsx` | Aba de perfil |
| `SecurityTab` | `src/components/settings/SecurityTab.tsx` | Aba de segurança |
| `NotificationsTab` | `src/components/settings/NotificationsTab.tsx` | Aba de notificações |
| `AppearanceTab` | `src/components/settings/AppearanceTab.tsx` | Aba de aparência |
| `ChatTab` | `src/components/settings/ChatTab.tsx` | Aba de chat |
| `SystemTab` | `src/components/settings/SystemTab.tsx` | Aba de sistema |

### Ajuda (Help)

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| `HelpStatusTab` | `src/components/help/HelpStatusTab.tsx` | Status do sistema |
| `HelpSupportTab` | `src/components/help/HelpSupportTab.tsx` | Suporte |
| `HelpAccountTab` | `src/components/help/HelpAccountTab.tsx` | Conta |
| `HelpVersionTab` | `src/components/help/HelpVersionTab.tsx` | Versão |

### Autenticação/Autorização

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| `RouteGuard` | `src/components/auth/RouteGuard.tsx` | Guarda de rotas |
| `RoleGate` | `src/components/auth/RoleGate.tsx` | Portão de roles |
| `PermissionGate` | `src/components/auth/PermissionGate.tsx` | Portão de permissões |

### UI (Shadcn/ui)

**Localização**: `src/components/ui/`

- `accordion.tsx` - Componente de acordeão
- `alert-dialog.tsx` - Diálogo de alerta
- `alert.tsx` - Alerta
- `aspect-ratio.tsx` - Proporção de aspecto
- `avatar.tsx` - Avatar
- `badge.tsx` - Badge
- `breadcrumb.tsx` - Breadcrumb
- `button.tsx` - Botão
- `calendar.tsx` - Calendário
- `card.tsx` - Card
- `carousel.tsx` - Carrossel
- `chart.tsx` - Gráfico
- `checkbox.tsx` - Checkbox
- `collapsible.tsx` - Colapsável
- `command.tsx` - Command
- `context-menu.tsx` - Menu de contexto
- `date-range-picker.tsx` - Seletor de intervalo de datas
- `dialog.tsx` - Diálogo
- `drawer.tsx` - Drawer
- `dropdown-menu.tsx` - Menu dropdown
- `form.tsx` - Formulário
- `hover-card.tsx` - Card de hover
- `input-otp.tsx` - Input OTP
- `input.tsx` - Input
- `label.tsx` - Label
- `menubar.tsx` - Barra de menu
- `navigation-menu.tsx` - Menu de navegação
- `pagination.tsx` - Paginação
- `popover.tsx` - Popover
- `progress.tsx` - Barra de progresso
- `radio-group.tsx` - Grupo de rádio
- `resizable.tsx` - Redimensionável
- `scroll-area.tsx` - Área de scroll
- `select.tsx` - Select
- `separator.tsx` - Separador
- `sheet.tsx` - Sheet
- `skeleton.tsx` - Skeleton
- `slider.tsx` - Slider
- `sonner.tsx` - Toast (Sonner)
- `switch.tsx` - Switch
- `table.tsx` - Tabela
- `tabs.tsx` - Abas
- `textarea.tsx` - Textarea
- `toast.tsx` - Toast
- `toaster.tsx` - Toaster
- `toggle-group.tsx` - Grupo de toggle
- `toggle.tsx` - Toggle
- `tooltip.tsx` - Tooltip
- `use-toast.ts` - Hook de toast

#### Sidebar UI Components

**Localização**: `src/components/ui/sidebar/`

- `index.ts` - Exports
- `SidebarContent.tsx` - Conteúdo da sidebar
- `SidebarFooter.tsx` - Rodapé da sidebar
- `SidebarGroup.tsx` - Grupo da sidebar
- `SidebarHeader.tsx` - Cabeçalho da sidebar
- `SidebarInput.tsx` - Input da sidebar
- `SidebarInset.tsx` - Inset da sidebar
- `SidebarMain.tsx` - Main da sidebar
- `SidebarMenu.tsx` - Menu da sidebar
- `SidebarMenuSub.tsx` - Submenu da sidebar
- `SidebarProvider.tsx` - Provider da sidebar
- `SidebarRail.tsx` - Rail da sidebar
- `SidebarSeparator.tsx` - Separador da sidebar
- `SidebarTrigger.tsx` - Trigger da sidebar

### Ícones

| Arquivo | Descrição |
|---------|-----------|
| `src/components/icons.tsx` | Exporta todos os ícones Lucide usados no projeto |

---

## 🎣 Hooks Customizados

| Hook | Arquivo | Descrição |
|------|---------|-----------|
| `useActiveAgents` | `src/hooks/useActiveAgents.ts` | Agentes ativos em tempo real |
| `useAdminMetrics` | `src/hooks/useAdminMetrics.ts` | Métricas do admin |
| `useAgentMetrics` | `src/hooks/useAgentMetrics.ts` | Métricas do agente |
| `useAvailableAgents` | `src/hooks/useAvailableAgents.ts` | Agentes disponíveis |
| `useConversations` | `src/hooks/useConversations.ts` | Lista de conversas |
| `useCurrentAgent` | `src/hooks/useCurrentAgent.ts` | Dados do agente logado |
| `useLiveStats` | `src/hooks/useLiveStats.ts` | Estatísticas ao vivo |
| `useMessages` | `src/hooks/useMessages.ts` | Mensagens de uma conversa |
| `useMobile` | `src/hooks/use-mobile.tsx` | Detecção de mobile |
| `usePauseSettings` | `src/hooks/usePauseSettings.ts` | Configurações de pausa |
| `useQueueMonitor` | `src/hooks/useQueueMonitor.ts` | Monitor de filas |
| `useQueuesSettings` | `src/hooks/useQueuesSettings.ts` | Configurações de filas |
| `useRealtimeSimulation` | `src/hooks/useRealtimeSimulation.ts` | Simulação de realtime |
| `useTagsSettings` | `src/hooks/useTagsSettings.ts` | Configurações de tags |
| `useTeam` | `src/hooks/useTeam.ts` | Dados da equipe |
| `useTeamMetrics` | `src/hooks/useTeamMetrics.ts` | Métricas da equipe |
| `useToast` | `src/hooks/use-toast.ts` | Toast notifications |

---

## 🔐 Contextos e Providers

### AuthContext

**Arquivo**: `src/contexts/AuthContext.tsx`

Gerencia autenticação e sessão do usuário.

**Exports**:
- `AuthProvider` - Provider do contexto
- `useAuth()` - Hook para acessar contexto

**Dados disponíveis**:
```typescript
{
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  profile: AgentProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}
```

### PermissionsContext

**Arquivo**: `src/contexts/PermissionsContext.tsx`

Gerencia permissões baseadas em roles (RBAC).

**Exports**:
- `PermissionsProvider` - Provider do contexto
- `usePermissions()` - Hook para acessar permissões

**Dados disponíveis**:
```typescript
{
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
}
```

---

## 🗄️ Integração Supabase

### Client

**Arquivo**: `src/integrations/supabase/client.ts`

Cliente Supabase configurado e pronto para uso.

```typescript
import { supabase } from '@/integrations/supabase/client';
```

### Types

**Arquivo**: `src/integrations/supabase/types.ts` (Read-only)

Tipos TypeScript gerados automaticamente do schema do banco de dados.

---

## ⚡ Edge Functions

**Localização**: `supabase/functions/`

| Function | Arquivo | Descrição |
|----------|---------|-----------|
| `ai-suggest-response` | `ai-suggest-response/index.ts` | Sugestões de resposta com IA |
| `ai-summarize-conversation` | `ai-summarize-conversation/index.ts` | Resumo de conversas com IA |
| `generate-report` | `generate-report/index.ts` | Geração de relatórios |

### Secrets Configurados

- `SUPABASE_DB_URL`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `LOVABLE_API_KEY`

---

## 📐 Sistema de Tipos

### Autenticação

**Arquivo**: `src/types/auth.ts`

```typescript
export type AppRole = 'agent' | 'manager' | 'admin';

export interface AgentProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  status: string | null;
  team_id: string | null;
  created_at: string;
  updated_at: string;
}
```

### Conversas

**Arquivo**: `src/types/conversations.ts`

```typescript
export type MessageType = 'text' | 'image' | 'audio' | 'video' | 'document' | 'sticker';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
export type MessageSender = 'client' | 'agent' | 'system';

export interface Message {
  id: string;
  conversationId: string;
  type: MessageType;
  content: string;
  sender: MessageSender;
  timestamp: Date;
  status: MessageStatus;
  mediaUrl?: string;
  fileName?: string;
}

export interface Conversation {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  channelType: 'whatsapp' | 'instagram' | 'telegram' | 'messenger' | 'webchat';
  status: 'waiting' | 'active' | 'paused' | 'finished';
  lastMessage: string;
  lastMessageTime: Date;
  assignedAgentId?: string;
  unreadCount: number;
  isFavorite: boolean;
  tags?: string[];
  priority: number;
}
```

### Permissões

**Arquivo**: `src/types/permissions.ts`

Define todas as permissões do sistema RBAC:

```typescript
export type Permission =
  | 'dashboard:view_own'
  | 'dashboard:view_team'
  | 'dashboard:view_all'
  | 'conversations:view_own'
  | 'conversations:view_team'
  | 'conversations:view_all'
  | 'conversations:assign'
  | 'conversations:transfer'
  | 'management:live'
  | 'management:channels'
  | 'reports:view_own'
  | 'reports:view_team'
  | 'reports:view_all'
  | 'reports:export'
  | 'ai:chatbot'
  | 'ai:ml'
  | 'access:users'
  | 'access:logs'
  | 'settings:view'
  | 'settings:edit';
```

### Database

**Arquivo**: `src/types/database.ts`

Mappers para converter dados do banco em tipos do frontend:

```typescript
export function mapMessageFromDB(dbMessage: any): Message;
export function mapConversationFromDB(dbConversation: any): Conversation;
```

### Settings

**Arquivo**: `src/types/settings.ts`

```typescript
export interface Tag {
  id: string;
  name: string;
  color: string;
  description?: string;
  is_active: boolean;
}

export interface Queue {
  id: string;
  name: string;
  description?: string;
  priority: number;
  team_id?: string;
  is_active: boolean;
  max_queue_size?: number;
}

export interface PauseReason {
  id: string;
  label: string;
  icon: string;
  description?: string;
  is_active: boolean;
}
```

---

## 🎨 Design System

### Configuração Tailwind

**Arquivo**: `tailwind.config.ts`

Define tokens semânticos, extensões de cores, animações e variantes.

### Estilos Globais

**Arquivo**: `src/index.css`

Define:
- Variáveis CSS (cores, gradientes, sombras, transições)
- Tema claro/escuro
- Estilos base
- Animações customizadas

### Utilitários

**Arquivo**: `src/lib/utils.ts`

```typescript
import { cn } from '@/lib/utils'; // Combina classes Tailwind
```

---

## 🗺️ Navegação

**Arquivo**: `src/data/navigation.ts`

Define toda a estrutura de navegação do sistema com grupos, itens e permissões:

```typescript
export interface NavigationItem {
  title: string;
  href: string;
  icon: Icon;
  highlight?: "blue";
  groupTitle?: string;
  permission?: Permission;
}

export const navigationGroups: NavigationGroup[];
export const matchNavigationItem: (pathname: string) => NavigationItem | undefined;
export const getNavigationItems: () => NavigationItem[];
```

---

## 🗃️ Banco de Dados

### Tabelas Principais

| Tabela | Descrição |
|--------|-----------|
| `agent_profiles` | Perfis dos agentes |
| `audit_logs` | Logs de auditoria |
| `channels` | Canais de comunicação |
| `clients` | Clientes |
| `conversation_tags` | Tags de conversas |
| `conversations` | Conversas |
| `messages` | Mensagens |
| `pause_reasons` | Motivos de pausa |
| `priorities` | Prioridades |
| `queues` | Filas de atendimento |
| `reports_cache` | Cache de relatórios |
| `slas` | SLAs |
| `tags` | Tags |
| `teams` | Equipes |
| `user_roles` | Roles dos usuários |

### Funções do Banco

- `assign_conversation_to_agent()`
- `finish_conversation()`
- `has_role()`
- `get_user_team_id()`
- `log_audit()`
- `cleanup_expired_reports()`

### Storage Buckets

- `avatars` (público)
- `attachments` (privado)

---

## 🔒 Segurança

### Row Level Security (RLS)

Todas as tabelas possuem políticas RLS configuradas baseadas em:
- `auth.uid()` - ID do usuário autenticado
- `has_role()` - Verificação de role
- `get_user_team_id()` - ID da equipe do usuário

### Guards de Rota

- `RouteGuard` - Protege rotas que requerem autenticação
- `RoleGate` - Renderiza conteúdo baseado em role
- `PermissionGate` - Renderiza conteúdo baseado em permissão

---

## 📱 Responsividade

O sistema usa:
- **Breakpoints Tailwind**: `sm`, `md`, `lg`, `xl`, `2xl`
- **Hook customizado**: `useMobile()` para detecção de mobile
- **Componentes adaptativos**: Sidebar colapsável, drawer para mobile

---

## 🚀 Build e Deploy

### Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview da build
npm run lint         # Linting
```

### Variáveis de Ambiente

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_PROJECT_ID=
```

---

## 📊 Estado da Aplicação

### Gerenciamento de Estado

- **React Context**: Autenticação, Permissões
- **TanStack Query**: Cache e sincronização de dados do servidor
- **Local State**: useState/useReducer para UI local

### Real-time

- **Supabase Realtime**: Subscriptions para conversas e mensagens
- **WebSocket simulation**: Para testes e desenvolvimento

---

## 🧪 Testes

Ver documentação em: `docs/PLANO_TESTES_PRODUCAO.md`

---

## 📚 Documentação Adicional

- `docs/API_EDGE_FUNCTIONS.md` - Documentação das Edge Functions
- `docs/FASE_5_SECURITY_OPTIMIZATION.md` - Otimização de segurança
- `docs/PLANO_DASHBOARDS_METRICAS_REAIS.md` - Dashboards com métricas reais
- `docs/PLANO_TESTES_PRODUCAO.md` - Plano de testes para produção
- `docs/SCRIPT_USUARIOS_EXEMPLO.sql` - Script de usuários de exemplo
- `docs/SETUP_USUARIOS_TESTE.md` - Setup de usuários de teste

---

## 🎯 Roadmap

### Implementado (85-90% MVP)
- ✅ Sistema de autenticação e RBAC
- ✅ Dashboard role-based (Agent, Manager, Admin)
- ✅ Painel de conversas em tempo real
- ✅ Gestão ao vivo (filas, agentes ativos)
- ✅ Configurações (filas, pausas, tags, SLAs, prioridades)
- ✅ Gestão de usuários e equipes
- ✅ Auditoria
- ✅ Edge Functions com IA (Lovable AI)
- ✅ Real-time com Supabase Realtime
- ✅ Sistema de permissões granular

### Próximos Passos
- 🔄 Integração com Meta API (WhatsApp Business)
- 🔄 Relatórios com queries reais
- 🔄 Sistema de notificações em tempo real
- 🔄 Analytics avançado de IA
- 🔄 Base de conhecimento para IA
- 🔄 Exportação avançada de relatórios

---

## 📞 Contato e Suporte

Para dúvidas técnicas, consulte a Central de Ajuda em `/ajuda` ou a documentação adicional em `docs/`.

---

**Última atualização**: 2025-12-01  
**Versão**: 1.0.0  
**Status**: MVP em desenvolvimento (85-90% completo)
