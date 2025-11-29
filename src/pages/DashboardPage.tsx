import { useAuth } from "@/contexts/AuthContext";
import { AgentDashboard } from "@/components/dashboard/AgentDashboard";
import { ManagerDashboard } from "@/components/dashboard/ManagerDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";

export default function DashboardPage() {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Renderiza o dashboard apropriado baseado no role
  if (role === 'agent') {
    return <AgentDashboard />;
  }

  if (role === 'manager') {
    return <ManagerDashboard />;
  }

  if (role === 'admin') {
    return <AdminDashboard />;
  }

  // Fallback para usuários sem role atribuído
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <h2 className="text-2xl font-bold">Bem-vindo!</h2>
      <p className="text-muted-foreground text-center max-w-md">
        Seu perfil ainda não possui um nível de acesso atribuído. 
        Entre em contato com o administrador para receber as permissões apropriadas.
      </p>
    </div>
  );
}
