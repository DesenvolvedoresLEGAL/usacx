import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export const SecurityTab = () => {
  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Configure políticas de segurança globais para todo o sistema. Funcionalidade em desenvolvimento.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Autenticação de Dois Fatores</CardTitle>
            <CardDescription>Proteção adicional para contas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Exigir 2FA para administradores e gestores
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Política de Senhas</CardTitle>
            <CardDescription>Requisitos mínimos de senha</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Comprimento mínimo, caracteres especiais, expiração
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tentativas de Login</CardTitle>
            <CardDescription>Limite de tentativas incorretas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Bloquear conta após X tentativas falhadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sessões e Timeout</CardTitle>
            <CardDescription>Gerenciamento de sessões ativas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Auto-logout por inatividade, limite de dispositivos simultâneos
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
