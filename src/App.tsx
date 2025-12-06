
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PermissionsProvider } from "@/contexts/PermissionsContext";
import { RouteGuard } from "@/components/auth/RouteGuard";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import LiveManagementPage from "./pages/LiveManagementPage";
import AttendanceManagementPage from "./pages/AttendanceManagementPage";
import MainLayout from "./components/MainLayout";
import SettingsPage from "./pages/SettingsPage";
import ChannelsManagementPage from "./pages/ChannelsManagementPage";
import ReportAttendancesPage from "./pages/ReportAttendancesPage";
import ReportClientsPage from "./pages/ReportClientsPage";
import AIAgentsPage from "./pages/AIAgentsPage";
import AICopilotPage from "./pages/AICopilotPage";
import AIAnalyticsPage from "./pages/AIAnalyticsPage";
import AIKnowledgePage from "./pages/AIKnowledgePage";
import ReportAnalyticsPage from "./pages/ReportAnalyticsPage";
import ReportPerformancePage from "./pages/ReportPerformancePage";
import SettingsApiPage from "./pages/SettingsApiPage";
import ReportExportPage from "./pages/ReportExportPage";
// UserManagementPage removida - consolidada em OrganizationSettingsPage
import AuditCenterPage from "./pages/AuditCenterPage";
import SettingsClientsPage from "./pages/SettingsClientsPage";
import SettingsTagsPage from "./pages/SettingsTagsPage";
import SettingsQueuesPage from "./pages/SettingsQueuesPage";
import SettingsPausesPage from "./pages/SettingsPausesPage";
import SettingsSurveysPage from "./pages/SettingsSurveysPage";
import SettingsHashtagsPage from "./pages/SettingsHashtagsPage";
import SettingsTemplatesPage from "./pages/SettingsTemplatesPage";
import SettingsAttachmentsPage from "./pages/SettingsAttachmentsPage";
import SettingsSLAsPage from "./pages/SettingsSLAsPage";
import SettingsPrioritiesPage from "./pages/SettingsPrioritiesPage";
import HelpCenterPage from "./pages/HelpCenterPage";
import ConversationsPage from "./pages/ConversationsPage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import OrganizationSettingsPage from "./pages/OrganizationSettingsPage";

// Lazy load the breaks report page
const ReportBreaksPage = React.lazy(() => import("./pages/ReportBreaksPage"));

const queryClient = new QueryClient();

// Lazy load the evaluations report page
const ReportEvaluationsPage = React.lazy(() => import("./pages/ReportEvaluationsPage"));

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <PermissionsProvider>
              <React.Suspense fallback={<div className="p-10 text-center">Carregando...</div>}>
                <Routes>
                  <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/conversations" element={
                  <RouteGuard permission="conversations:view_own">
                    <ConversationsPage />
                  </RouteGuard>
                } />
            
                {/* Routes that use MainLayout */}
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={
                    <RouteGuard permission="dashboard:view_own">
                      <DashboardPage />
                    </RouteGuard>
                  } />
                  {/* Gestão */}
                  <Route path="/gestao/ao-vivo" element={
                    <RouteGuard permission="management:live">
                      <LiveManagementPage />
                    </RouteGuard>
                  } />
                  <Route path="/gestao/atendimentos" element={
                    <RouteGuard permission="conversations:view_all">
                      <AttendanceManagementPage />
                    </RouteGuard>
                  } />
                  <Route path="/gestao/canais" element={
                    <RouteGuard permission="management:channels">
                      <ChannelsManagementPage />
                    </RouteGuard>
                  } />
              {/* Relatórios */}
              <Route path="/relatorios/atendimentos" element={
                <RouteGuard permission="reports:view_own">
                  <ReportAttendancesPage />
                </RouteGuard>
              } />
              <Route path="/relatorios/clientes" element={
                <RouteGuard permission="reports:view_team">
                  <ReportClientsPage />
                </RouteGuard>
              } />
              <Route path="/relatorios/avaliacoes" element={
                <RouteGuard permission="reports:view_team">
                  <ReportEvaluationsPage />
                </RouteGuard>
              } />
              <Route path="/relatorios/pausas" element={
                <RouteGuard permission="reports:view_team">
                  <ReportBreaksPage />
                </RouteGuard>
              } />
              <Route path="/relatorios/performance" element={
                <RouteGuard permission="reports:view_team">
                  <ReportPerformancePage />
                </RouteGuard>
              } />
              <Route path="/relatorios/analitico" element={
                <RouteGuard permission="reports:view_all">
                  <ReportAnalyticsPage />
                </RouteGuard>
              } />
              <Route path="/relatorios/exportar" element={
                <RouteGuard permission="reports:export">
                  <ReportExportPage />
                </RouteGuard>
              } />
              {/* Inteligência Artificial */}
              <Route path="/ia/agentes" element={
                <RouteGuard permission="ai:chatbot">
                  <AIAgentsPage />
                </RouteGuard>
              } />
              <Route path="/ia/copiloto" element={
                <RouteGuard permission="ai:ml">
                  <AICopilotPage />
                </RouteGuard>
              } />
              <Route path="/ia/analytics" element={
                <RouteGuard permission="ai:ml">
                  <AIAnalyticsPage />
                </RouteGuard>
              } />
              <Route path="/ia/conhecimento" element={
                <RouteGuard permission="ai:ml">
                  <AIKnowledgePage />
                </RouteGuard>
              } />
              {/* Redirects de compatibilidade IA */}
              <Route path="/ia/chatbot" element={<Navigate to="/ia/agentes" replace />} />
              <Route path="/ia/machine-learning" element={<Navigate to="/ia/conhecimento" replace />} />
              <Route path="/configuracoes/bots" element={<Navigate to="/ia/agentes" replace />} />
                  {/* Redirects - Gestão de Usuários consolidada em Organização */}
                  <Route path="/acesso/usuarios" element={<Navigate to="/organizacao/configuracoes?tab=pessoas" replace />} />
                  <Route path="/acesso/agentes" element={<Navigate to="/organizacao/configuracoes?tab=pessoas" replace />} />
                  <Route path="/configuracoes/agentes" element={<Navigate to="/organizacao/configuracoes?tab=pessoas" replace />} />
                  <Route path="/gestao/agentes" element={<Navigate to="/organizacao/configuracoes?tab=pessoas" replace />} />
                  <Route path="/acesso/logs" element={<Navigate to="/acesso/auditoria?tab=access" replace />} />
                  <Route path="/relatorios/auditoria" element={<Navigate to="/acesso/auditoria?tab=attendance" replace />} />
                  <Route path="/acesso/auditoria" element={
                    <RouteGuard permission="access:logs">
                      <AuditCenterPage />
                    </RouteGuard>
                  } />
                  {/* Configurações */}
                  <Route path="/configuracoes/clientes" element={
                    <RouteGuard permission="settings:edit">
                      <SettingsClientsPage />
                    </RouteGuard>
                  } />
                  <Route path="/configuracoes/etiquetas" element={
                    <RouteGuard permission="settings:edit">
                      <SettingsTagsPage />
                    </RouteGuard>
                  } />
                  <Route path="/configuracoes/filas" element={
                    <RouteGuard permission="settings:edit">
                      <SettingsQueuesPage />
                    </RouteGuard>
                  } />
                  <Route path="/configuracoes/pausas" element={
                    <RouteGuard permission="settings:edit">
                      <SettingsPausesPage />
                    </RouteGuard>
                  } />
                  <Route path="/configuracoes/pesquisas" element={
                    <RouteGuard permission="settings:edit">
                      <SettingsSurveysPage />
                    </RouteGuard>
                  } />
                  <Route path="/configuracoes/hashtags" element={
                    <RouteGuard permission="settings:edit">
                      <SettingsHashtagsPage />
                    </RouteGuard>
                  } />
                  <Route path="/configuracoes/mensagens-prontas" element={
                    <RouteGuard permission="settings:edit">
                      <SettingsTemplatesPage />
                    </RouteGuard>
                  } />
                  <Route path="/configuracoes/anexos" element={
                    <RouteGuard permission="settings:edit">
                      <SettingsAttachmentsPage />
                    </RouteGuard>
                  } />
                  <Route path="/configuracoes/slas" element={
                    <RouteGuard permission="settings:edit">
                      <SettingsSLAsPage />
                    </RouteGuard>
                  } />
                  <Route path="/configuracoes/prioridades" element={
                    <RouteGuard permission="settings:edit">
                      <SettingsPrioritiesPage />
                    </RouteGuard>
                  } />
                  <Route path="/configuracoes/api" element={
                    <RouteGuard permission="settings:edit">
                      <SettingsApiPage />
                    </RouteGuard>
                  } />
              {/* Ajuda */}
              <Route path="/ajuda" element={<HelpCenterPage />} />
              {/* Redirects de compatibilidade */}
              <Route path="/ajuda/chat" element={<Navigate to="/ajuda?tab=support" replace />} />
              <Route path="/ajuda/status" element={<Navigate to="/ajuda?tab=status" replace />} />
              <Route path="/ajuda/versao" element={<Navigate to="/ajuda?tab=version" replace />} />
              <Route path="/ajuda/cancelamento" element={<Navigate to="/ajuda?tab=account" replace />} />

              {/* Perfil */}
              <Route path="/perfil/configuracoes" element={
                <RouteGuard permission="dashboard:view_own">
                  <ProfileSettingsPage />
                </RouteGuard>
              } />

              {/* Organização */}
              <Route path="/organizacao/configuracoes" element={
                <RouteGuard permission="dashboard:view_own">
                  <OrganizationSettingsPage />
                </RouteGuard>
              } />

                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </React.Suspense>
          </PermissionsProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
