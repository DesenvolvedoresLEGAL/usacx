
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings, Pause, Play, RefreshCw, Bell, Users, MessageSquare } from "lucide-react";

export const LiveControlPanel = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-ping-primary" />
            Controles do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-distribution">Distribuição Automática</Label>
            <Switch id="auto-distribution" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Notificações em Tempo Real</Label>
            <Switch id="notifications" defaultChecked />
          </div>
          
          <div className="space-y-2">
            <Label>Fila Ativa</Label>
            <Select defaultValue="geral">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="geral">Fila Geral</SelectItem>
                <SelectItem value="vendas">Vendas</SelectItem>
                <SelectItem value="suporte">Suporte Técnico</SelectItem>
                <SelectItem value="financeiro">Financeiro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Pause className="h-3 w-3 mr-1" />
              Pausar Sistema
            </Button>
            <Button size="sm" variant="outline">
              <RefreshCw className="h-3 w-3 mr-1" />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-ping-primary" />
            Alertas Ativos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-2 bg-red-50 rounded border-l-4 border-red-500">
            <div>
              <p className="text-sm font-medium text-red-800">Fila com muita espera</p>
              <p className="text-xs text-red-600">4 clientes aguardando mais de 10min</p>
            </div>
            <Badge variant="destructive">Crítico</Badge>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-yellow-50 rounded border-l-4 border-yellow-500">
            <div>
              <p className="text-sm font-medium text-yellow-800">Agente inativo</p>
              <p className="text-xs text-yellow-600">Maria Silva - sem atividade há 20min</p>
            </div>
            <Badge variant="secondary">Atenção</Badge>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-blue-50 rounded border-l-4 border-blue-500">
            <div>
              <p className="text-sm font-medium text-blue-800">Pico de atendimentos</p>
              <p className="text-xs text-blue-600">+15 novos atendimentos na última hora</p>
            </div>
            <Badge variant="secondary">Info</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
