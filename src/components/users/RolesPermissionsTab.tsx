import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, UserCog } from "lucide-react";
import { ROLE_PERMISSIONS } from "@/types/permissions";
import type { AppRole } from "@/types/auth";

export const RolesPermissionsTab = () => {
  const roles: { role: AppRole; title: string; description: string; icon: any; color: string }[] = [
    {
      role: "agent",
      title: "Agente",
      description: "Atende conversas e acessa apenas seus próprios dados",
      icon: Users,
      color: "text-blue-500",
    },
    {
      role: "manager",
      title: "Gestor",
      description: "Supervisiona equipe, transfere atendimentos e acessa dashboards de time",
      icon: UserCog,
      color: "text-purple-500",
    },
    {
      role: "admin",
      title: "Administrador",
      description: "Acesso total ao sistema, incluindo configurações e gestão de usuários",
      icon: Shield,
      color: "text-red-500",
    },
  ];

  const permissionLabels: Record<string, string> = {
    "conversations:view_own": "Ver próprias conversas",
    "conversations:view_all": "Ver todas as conversas",
    "conversations:transfer": "Transferir conversas",
    "conversations:intervene": "Intervir em conversas",
    "dashboard:view_own": "Ver próprio dashboard",
    "dashboard:view_team": "Ver dashboard do time",
    "dashboard:view_all": "Ver todos os dashboards",
    "reports:view_own": "Ver próprios relatórios",
    "reports:view_team": "Ver relatórios do time",
    "reports:view_all": "Ver todos os relatórios",
    "reports:export": "Exportar relatórios",
    "management:live": "Gestão ao vivo",
    "management:agents": "Gestão de agentes",
    "management:channels": "Gestão de canais",
    "settings:view": "Ver configurações",
    "settings:edit": "Editar configurações",
    "access:agents": "Acesso a agentes",
    "access:users": "Acesso a usuários",
    "access:logs": "Acesso a logs",
    "ai:chatbot": "IA: Chatbot",
    "ai:ml": "IA: Machine Learning",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {roles.map(({ role, title, description, icon: Icon, color }) => (
        <Card key={role} className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg bg-muted ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <CardTitle>{title}</CardTitle>
                <CardDescription className="text-xs">{description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground mb-3">Permissões:</p>
              <div className="space-y-1.5">
                {ROLE_PERMISSIONS[role].map((permission) => (
                  <div key={permission} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{permissionLabels[permission] || permission}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
