import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, AlertTriangle, XCircle, Clock, Server } from "lucide-react";

export const HelpStatusTab = () => {
  const systemStatus = {
    overall: "operational",
    lastUpdate: "2 minutos atrás"
  };

  const services = [
    { 
      name: "API Principal", 
      status: "operational", 
      uptime: "99.98%", 
      lastIncident: "Nenhum",
      description: "API core do sistema"
    },
    { 
      name: "Banco de Dados", 
      status: "operational", 
      uptime: "99.99%", 
      lastIncident: "Nenhum",
      description: "Sistema de banco de dados"
    },
    { 
      name: "Autenticação", 
      status: "operational", 
      uptime: "99.97%", 
      lastIncident: "15 dias atrás",
      description: "Sistema de login e autenticação"
    },
    { 
      name: "Chat ao Vivo", 
      status: "degraded", 
      uptime: "98.85%", 
      lastIncident: "2 horas atrás",
      description: "Sistema de chat em tempo real"
    },
    { 
      name: "Relatórios", 
      status: "operational", 
      uptime: "99.95%", 
      lastIncident: "7 dias atrás",
      description: "Geração de relatórios"
    },
    { 
      name: "Notificações", 
      status: "maintenance", 
      uptime: "99.92%", 
      lastIncident: "Agora",
      description: "Sistema de notificações push"
    },
  ];

  const incidents = [
    {
      id: 1,
      title: "Lentidão no sistema de chat",
      status: "investigating",
      severity: "minor",
      startTime: "14:30 - Hoje",
      description: "Identificamos lentidão no carregamento de mensagens do chat ao vivo.",
      updates: [
        { time: "14:45", message: "Equipe técnica investigando a causa da lentidão." },
        { time: "14:30", message: "Primeiros relatos de lentidão no chat recebidos." }
      ]
    },
    {
      id: 2,
      title: "Manutenção programada - Notificações",
      status: "scheduled",
      severity: "maintenance",
      startTime: "15:00 - Hoje",
      description: "Manutenção programada no sistema de notificações.",
      updates: [
        { time: "12:00", message: "Manutenção programada para as 15:00." }
      ]
    }
  ];

  const metrics = [
    { name: "Uptime Geral", value: "99.96%", period: "Últimos 30 dias" },
    { name: "Tempo de Resposta", value: "145ms", period: "Média das últimas 24h" },
    { name: "Incidentes Resolvidos", value: "98.5%", period: "Últimos 90 dias" },
    { name: "Disponibilidade", value: "99.99%", period: "Últimos 12 meses" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational": return "bg-green-500";
      case "degraded": return "bg-yellow-500";
      case "outage": return "bg-red-500";
      case "maintenance": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "operational": return "Operacional";
      case "degraded": return "Degradado";
      case "outage": return "Indisponível";
      case "maintenance": return "Manutenção";
      default: return "Desconhecido";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "degraded": return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "outage": return <XCircle className="w-5 h-5 text-red-500" />;
      case "maintenance": return <Clock className="w-5 h-5 text-blue-500" />;
      default: return <CheckCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="flex items-center justify-end gap-2">
        <div className={`w-3 h-3 rounded-full ${getStatusColor(systemStatus.overall)}`} />
        <span className="text-sm font-medium">
          {getStatusText(systemStatus.overall)}
        </span>
        <span className="text-sm text-muted-foreground">
          • Atualizado {systemStatus.lastUpdate}
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(systemStatus.overall)}
            Status Geral dos Serviços
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div key={service.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{service.name}</h4>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`} />
                </div>
                <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Uptime:</span>
                    <span className="font-medium">{service.uptime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Último incidente:</span>
                    <span className="text-muted-foreground">{service.lastIncident}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="incidents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="incidents">Incidentes</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="subscribe">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="incidents" className="space-y-4">
          {incidents.length > 0 ? (
            <div className="space-y-4">
              {incidents.map((incident) => (
                <Card key={incident.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{incident.title}</CardTitle>
                      <div className="flex gap-2">
                        <Badge 
                          variant={incident.severity === "major" ? "destructive" : "secondary"}
                        >
                          {incident.severity === "major" ? "Grave" : 
                           incident.severity === "minor" ? "Menor" : "Manutenção"}
                        </Badge>
                        <Badge variant="outline">
                          {incident.status === "investigating" ? "Investigando" : 
                           incident.status === "resolved" ? "Resolvido" : "Programado"}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{incident.startTime}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{incident.description}</p>
                    <div className="space-y-2">
                      <h5 className="font-medium">Atualizações:</h5>
                      {incident.updates.map((update, index) => (
                        <div key={index} className="flex gap-3 text-sm">
                          <span className="text-muted-foreground font-mono">{update.time}</span>
                          <span>{update.message}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum incidente ativo</h3>
                <p className="text-muted-foreground">
                  Todos os serviços estão funcionando normalmente
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <Card key={metric.name}>
                <CardContent className="p-6">
                  <div className="text-center">
                    <h4 className="font-medium mb-2">{metric.name}</h4>
                    <p className="text-3xl font-bold text-primary mb-1">{metric.value}</p>
                    <p className="text-sm text-muted-foreground">{metric.period}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance nas Últimas 24 Horas</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Server className="w-12 h-12 mx-auto mb-4" />
                  <p>Gráficos de performance serão exibidos aqui</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Incidentes (Últimos 30 dias)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium">Sistema totalmente operacional</h4>
                  <p className="text-sm text-muted-foreground">15/01/2024 - Hoje</p>
                  <p className="text-sm">Todos os serviços funcionando normalmente.</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-medium">Lentidão no banco de dados</h4>
                  <p className="text-sm text-muted-foreground">12/01/2024 - 14/01/2024</p>
                  <p className="text-sm">Problema resolvido com otimização de queries.</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-medium">Indisponibilidade da API</h4>
                  <p className="text-sm text-muted-foreground">08/01/2024 - 09/01/2024</p>
                  <p className="text-sm">Falha no servidor principal, migrado para backup.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscribe" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Notificações por Email</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Receba alertas sobre incidentes e manutenções programadas
                </p>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Incidentes críticos</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Manutenções programadas</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span className="text-sm">Atualizações de status</span>
                  </label>
                </div>
                <Button className="w-full">Salvar Preferências</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Webhook</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Configure um webhook para receber atualizações de status
                </p>
                <div className="space-y-2">
                  <label className="text-sm font-medium">URL do Webhook</label>
                  <input 
                    type="url" 
                    placeholder="https://sua-url.com/webhook"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <Button variant="outline" className="w-full">Configurar Webhook</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
