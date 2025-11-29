import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export const OperationalConfigTab = () => {
  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Esta seção permite configurar horários de trabalho, limites de atendimentos simultâneos, pausas permitidas e
          metas para cada usuário. Funcionalidade em desenvolvimento.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Horários de Trabalho</CardTitle>
            <CardDescription>Defina horários de trabalho para cada usuário</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Configure horários de entrada e saída para cada dia da semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atendimentos Simultâneos</CardTitle>
            <CardDescription>Limite de conversas ativas por agente</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Defina o máximo de atendimentos que cada agente pode ter simultaneamente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pausas Permitidas</CardTitle>
            <CardDescription>Configure tipos de pausas disponíveis</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Almoço, café, reunião, treinamento, etc.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metas de Performance</CardTitle>
            <CardDescription>Estabeleça metas individuais ou por time</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Atendimentos por dia, tempo médio de resposta, satisfação mínima
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
