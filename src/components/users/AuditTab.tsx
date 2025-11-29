import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export const AuditTab = () => {
  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Visualize logs de atividades do sistema e ações dos usuários. Funcionalidade em desenvolvimento.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Log de Atividades</CardTitle>
          <CardDescription>Registro completo de ações no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Login, logout, alterações de permissões, criação/edição de usuários, etc.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
