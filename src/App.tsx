
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import MainLayout from "./components/MainLayout"; // Import the MainLayout

const queryClient = new QueryClient();

// Placeholder for future pages, just to make sidebar links work without 404
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-4">
    <h1 className="text-2xl font-bold">{title}</h1>
    <p>Esta página está em construção.</p>
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
            <Route path="/conversations" element={<PlaceholderPage title="Conversas" />} />
            <Route path="/templates" element={<PlaceholderPage title="Templates" />} />
            <Route path="/reports" element={<PlaceholderPage title="Relatórios" />} />
            <Route path="/agents" element={<PlaceholderPage title="Agentes" />} />
            <Route path="/settings" element={<PlaceholderPage title="Configurações" />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
