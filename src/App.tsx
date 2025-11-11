
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import LiveManagementPage from "./pages/LiveManagementPage";
import AttendanceManagementPage from "./pages/AttendanceManagementPage";
import MainLayout from "./components/MainLayout";
import AgentsManagementPage from "./pages/AgentsManagementPage";
import SettingsPage from "./pages/SettingsPage";
import AgentsPage from "./pages/AgentsPage";
import ChannelsManagementPage from "./pages/ChannelsManagementPage";
import ReportAttendancesPage from "./pages/ReportAttendancesPage";
import ReportClientsPage from "./pages/ReportClientsPage";
import MachineLearningPage from "./pages/MachineLearningPage";
import ChatbotPage from "./pages/ChatbotPage";
import ReportAnalyticsPage from "./pages/ReportAnalyticsPage";
import ReportPerformancePage from "./pages/ReportPerformancePage";
import SettingsApiPage from "./pages/SettingsApiPage";
import ReportExportPage from "./pages/ReportExportPage";
import AccessAgentsPage from "./pages/AccessAgentsPage";
import AccessUsersPage from "./pages/AccessUsersPage";
import AccessLogsPage from "./pages/AccessLogsPage";
import SettingsAgentsPage from "./pages/SettingsAgentsPage";
import SettingsBotPage from "./pages/SettingsBotPage";
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
import HelpChatPage from "./pages/HelpChatPage";
import HelpStatusPage from "./pages/HelpStatusPage";
import HelpVersionPage from "./pages/HelpVersionPage";
import HelpCancellationPage from "./pages/HelpCancellationPage";
import ConversationsPage from "./pages/ConversationsPage";

// Lazy load the audit report page
const ReportAuditPage = React.lazy(() => import("./pages/ReportAuditPage"));

// Lazy load the breaks report page
const ReportBreaksPage = React.lazy(() => import("./pages/ReportBreaksPage"));

const queryClient = new QueryClient();

// Lazy load the evaluations report page
const ReportEvaluationsPage = React.lazy(() => import("./pages/ReportEvaluationsPage"));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <React.Suspense fallback={<div className="p-10 text-center">Carregando...</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/conversations" element={<ConversationsPage />} />
            
            {/* Routes that use MainLayout */}
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              {/* Gestão */}
              <Route path="/gestao/ao-vivo" element={<LiveManagementPage />} />
              <Route path="/gestao/atendimentos" element={<AttendanceManagementPage />} />
              <Route path="/gestao/agentes" element={<AgentsManagementPage />} />
              <Route path="/gestao/canais" element={<ChannelsManagementPage />} />
              {/* Relatórios */}
              <Route path="/relatorios/atendimentos" element={<ReportAttendancesPage />} />
              <Route path="/relatorios/auditoria" element={<ReportAuditPage />} />
              <Route path="/relatorios/clientes" element={<ReportClientsPage />} />
              <Route path="/relatorios/avaliacoes" element={<ReportEvaluationsPage />} />
              <Route path="/relatorios/pausas" element={<ReportBreaksPage />} />
              <Route path="/relatorios/performance" element={<ReportPerformancePage />} />
              <Route path="/relatorios/analitico" element={<ReportAnalyticsPage />} />
              <Route path="/relatorios/exportar" element={<ReportExportPage />} />
              {/* Inteligência Artificial */}
              <Route path="/ia/chatbot" element={<ChatbotPage />} />
              <Route path="/ia/machine-learning" element={<MachineLearningPage />} />
              {/* Acesso */}
              <Route path="/acesso/agentes" element={<AccessAgentsPage />} />
              <Route path="/acesso/usuarios" element={<AccessUsersPage />} />
              <Route path="/acesso/logs" element={<AccessLogsPage />} />
              {/* Configurações */}
              <Route path="/configuracoes/agentes" element={<SettingsAgentsPage />} />
              <Route path="/configuracoes/bots" element={<SettingsBotPage />} />
              <Route path="/configuracoes/clientes" element={<SettingsClientsPage />} />
              <Route path="/configuracoes/etiquetas" element={<SettingsTagsPage />} />
              <Route path="/configuracoes/filas" element={<SettingsQueuesPage />} />
              <Route path="/configuracoes/pausas" element={<SettingsPausesPage />} />
              <Route path="/configuracoes/pesquisas" element={<SettingsSurveysPage />} />
              <Route path="/configuracoes/hashtags" element={<SettingsHashtagsPage />} />
              <Route path="/configuracoes/mensagens-prontas" element={<SettingsTemplatesPage />} />
              <Route path="/configuracoes/anexos" element={<SettingsAttachmentsPage />} />
              <Route path="/configuracoes/slas" element={<SettingsSLAsPage />} />
              <Route path="/configuracoes/prioridades" element={<SettingsPrioritiesPage />} />
              <Route path="/configuracoes/api" element={<SettingsApiPage />} />
              {/* Ajuda */}
              <Route path="/ajuda/chat" element={<HelpChatPage />} />
              <Route path="/ajuda/status" element={<HelpStatusPage />} />
              <Route path="/ajuda/versao" element={<HelpVersionPage />} />
              <Route path="/ajuda/cancelamento" element={<HelpCancellationPage />} />

              {/* Old placeholder routes, can be removed if all are covered by new structure */}
              <Route path="/templates" element={<div className="p-4"><h1>Templates (Legado)</h1></div>} />
              <Route path="/reports" element={<div className="p-4"><h1>Relatórios (Legado)</h1></div>} />
              <Route path="/agents" element={<AgentsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
