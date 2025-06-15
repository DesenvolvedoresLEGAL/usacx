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

const queryClient = new QueryClient();

// Placeholder for future pages, just to make sidebar links work without 404
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-4">
    <h1 className="text-2xl font-bold">{title}</h1>
    <p>Esta página está em construção.</p>
    <p className="mt-4 text-sm text-muted-foreground">
      Conteúdo para a página <span className="font-semibold">{title}</span> será adicionado em breve.
    </p>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Routes that use MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* Gestão */}
            <Route path="/gestao/ao-vivo" element={<LiveManagementPage />} />
            <Route path="/gestao/atendimentos" element={<AttendanceManagementPage />} />
            {/* Novo: página completa de agentes */}
            <Route path="/gestao/agentes" element={<AgentsManagementPage />} />
            <Route path="/gestao/canais" element={<PlaceholderPage title="Gestão - Canais" />} />
            {/* Relatórios */}
            <Route path="/relatorios/atendimentos" element={<PlaceholderPage title="Relatórios - Atendimentos" />} />
            <Route path="/relatorios/auditoria" element={<PlaceholderPage title="Relatórios - Auditoria" />} />
            <Route path="/relatorios/clientes" element={<PlaceholderPage title="Relatórios - Clientes" />} />
            <Route path="/relatorios/avaliacoes" element={<PlaceholderPage title="Relatórios - Avaliações" />} />
            <Route path="/relatorios/pausas" element={<PlaceholderPage title="Relatórios - Pausas" />} />
            <Route path="/relatorios/performance" element={<PlaceholderPage title="Relatórios - Performance" />} />
            <Route path="/relatorios/analitico" element={<PlaceholderPage title="Relatórios - Analítico" />} />
            <Route path="/relatorios/exportar" element={<PlaceholderPage title="Relatórios - Exportar" />} />
            {/* Acesso */}
            <Route path="/acesso/agentes" element={<PlaceholderPage title="Acesso - Agentes" />} />
            <Route path="/acesso/usuarios" element={<PlaceholderPage title="Acesso - Usuários" />} />
            <Route path="/acesso/logs" element={<PlaceholderPage title="Acesso - Logs de Acesso" />} />
            {/* Configurações */}
            <Route path="/configuracoes/agentes" element={<PlaceholderPage title="Configurações - Agentes" />} />
            <Route path="/configuracoes/bots" element={<PlaceholderPage title="Configurações - Bots" />} />
            <Route path="/configuracoes/clientes" element={<PlaceholderPage title="Configurações - Clientes" />} />
            <Route path="/configuracoes/etiquetas" element={<PlaceholderPage title="Configurações - Etiquetas" />} />
            <Route path="/configuracoes/filas" element={<PlaceholderPage title="Configurações - Filas de Atendimento" />} />
            <Route path="/configuracoes/pausas" element={<PlaceholderPage title="Configurações - Pausas" />} />
            <Route path="/configuracoes/csat" element={<PlaceholderPage title="Configurações - CSAT" />} />
            <Route path="/configuracoes/hashtags" element={<PlaceholderPage title="Configurações - Hashtags" />} />
            <Route path="/configuracoes/mensagens-prontas" element={<PlaceholderPage title="Configurações - Mensagens Prontas" />} />
            <Route path="/configuracoes/anexos" element={<PlaceholderPage title="Configurações - Anexos" />} />
            <Route path="/configuracoes/slas" element={<PlaceholderPage title="Configurações - SLAs" />} />
            <Route path="/configuracoes/prioridades" element={<PlaceholderPage title="Configurações - Prioridades" />} />
            {/* Ajuda */}
            <Route path="/ajuda/chat" element={<PlaceholderPage title="Ajuda - Chat" />} />
            <Route path="/ajuda/status" element={<PlaceholderPage title="Ajuda - Status" />} />
            <Route path="/ajuda/versao" element={<PlaceholderPage title="Ajuda - Versão" />} />
            <Route path="/ajuda/cancelamento" element={<PlaceholderPage title="Ajuda - Cancelamento" />} />

            {/* Old placeholder routes, can be removed if all are covered by new structure */}
            <Route path="/conversations" element={<PlaceholderPage title="Conversas (Legado)" />} />
            <Route path="/templates" element={<PlaceholderPage title="Templates (Legado)" />} />
            <Route path="/reports" element={<PlaceholderPage title="Relatórios (Legado)" />} />
            <Route path="/agents" element={<AgentsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
