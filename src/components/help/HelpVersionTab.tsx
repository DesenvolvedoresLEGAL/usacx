import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, CheckCircle, Clock, Star, Bug, Zap, Shield } from "lucide-react";

export const HelpVersionTab = () => {
  const currentVersion = {
    version: "2.4.1",
    releaseDate: "15 de Janeiro, 2024",
    type: "Estável",
    buildNumber: "2024.01.15.001"
  };

  const updates = [
    {
      version: "2.4.1",
      date: "15 de Janeiro, 2024",
      type: "patch",
      status: "current",
      changes: [
        { type: "fix", description: "Corrigido problema de sincronização no chat ao vivo" },
        { type: "fix", description: "Melhorada performance de carregamento de relatórios" },
        { type: "security", description: "Atualização de segurança para autenticação" }
      ]
    },
    {
      version: "2.4.0",
      date: "10 de Janeiro, 2024",
      type: "minor",
      status: "previous",
      changes: [
        { type: "feature", description: "Nova funcionalidade de hashtags automáticas" },
        { type: "feature", description: "Dashboard de analytics aprimorado" },
        { type: "improvement", description: "Interface de configurações reformulada" },
        { type: "fix", description: "Corrigidos diversos bugs menores" }
      ]
    },
    {
      version: "2.3.5",
      date: "28 de Dezembro, 2023",
      type: "patch",
      status: "previous",
      changes: [
        { type: "fix", description: "Resolvido problema de exportação de relatórios" },
        { type: "fix", description: "Corrigida validação de formulários" },
        { type: "improvement", description: "Melhorado tempo de resposta da API" }
      ]
    },
    {
      version: "2.3.0",
      date: "15 de Dezembro, 2023",
      type: "minor",
      status: "previous",
      changes: [
        { type: "feature", description: "Sistema de SLA automatizado" },
        { type: "feature", description: "Integração com WhatsApp Business" },
        { type: "feature", description: "Novo sistema de prioridades" },
        { type: "improvement", description: "Performance geral melhorada em 30%" }
      ]
    }
  ];

  const roadmap = [
    {
      version: "2.5.0",
      quarter: "Q1 2024",
      status: "planned",
      features: [
        "IA para categorização automática de tickets",
        "Nova interface de chat com recursos avançados",
        "Sistema de workflow personalizável",
        "Integração com Microsoft Teams"
      ]
    },
    {
      version: "2.6.0",
      quarter: "Q2 2024",
      status: "development",
      features: [
        "Dashboard personalização completa",
        "API v3 com GraphQL",
        "Sistema de automação avançado",
        "Relatórios em tempo real"
      ]
    },
    {
      version: "3.0.0",
      quarter: "Q3 2024",
      status: "planning",
      features: [
        "Arquitetura de microserviços",
        "Interface completamente redesenhada",
        "Sistema de plugins",
        "IA generativa integrada"
      ]
    }
  ];

  const systemInfo = {
    platform: "Web Application",
    framework: "React 18.3.1",
    database: "PostgreSQL 15.2",
    server: "Node.js 20.11.0",
    deployment: "Docker + Kubernetes",
    lastBackup: "Hoje, 02:00",
    uptime: "99.98%",
    storage: "128 GB usado de 500 GB"
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case "feature": return <Star className="w-4 h-4 text-blue-500" />;
      case "improvement": return <Zap className="w-4 h-4 text-green-500" />;
      case "fix": return <Bug className="w-4 h-4 text-orange-500" />;
      case "security": return <Shield className="w-4 h-4 text-red-500" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getChangeTypeText = (type: string) => {
    switch (type) {
      case "feature": return "Novidade";
      case "improvement": return "Melhoria";
      case "fix": return "Correção";
      case "security": return "Segurança";
      default: return "Alteração";
    }
  };

  return (
    <div className="space-y-6">
      {/* Action button */}
      <div className="flex justify-end">
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Baixar Notas da Versão
        </Button>
      </div>

      {/* Current Version */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Versão Atual</span>
            <Badge variant="default" className="bg-green-600">
              {currentVersion.type}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Versão</p>
              <p className="text-2xl font-bold text-primary">{currentVersion.version}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data de Lançamento</p>
              <p className="font-medium">{currentVersion.releaseDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Build</p>
              <p className="font-medium font-mono text-sm">{currentVersion.buildNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="font-medium">Atualizado</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="changelog" className="space-y-4">
        <TabsList>
          <TabsTrigger value="changelog">Histórico de Versões</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="system">Informações do Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="changelog" className="space-y-4">
          <div className="space-y-6">
            {updates.map((update) => (
              <Card key={update.version}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold">v{update.version}</h3>
                      {update.status === "current" && (
                        <Badge variant="default">Atual</Badge>
                      )}
                      <Badge variant="outline">
                        {update.type === "major" ? "Principal" :
                         update.type === "minor" ? "Secundária" : "Correção"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{update.date}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {update.changes.map((change, index) => (
                      <div key={index} className="flex items-start gap-3">
                        {getChangeIcon(change.type)}
                        <div>
                          <span className="text-xs font-medium text-muted-foreground mr-2">
                            {getChangeTypeText(change.type).toUpperCase()}
                          </span>
                          <span>{change.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-4">
          <div className="space-y-6">
            {roadmap.map((item) => (
              <Card key={item.version}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold">v{item.version}</h3>
                      <Badge 
                        variant={
                          item.status === "development" ? "default" :
                          item.status === "planned" ? "secondary" : "outline"
                        }
                      >
                        {item.status === "development" ? "Em Desenvolvimento" :
                         item.status === "planned" ? "Planejado" : "Em Planejamento"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.quarter}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {item.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Técnicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Plataforma:</span>
                  <span className="text-sm font-medium">{systemInfo.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Framework:</span>
                  <span className="text-sm font-medium">{systemInfo.framework}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Banco de Dados:</span>
                  <span className="text-sm font-medium">{systemInfo.database}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Servidor:</span>
                  <span className="text-sm font-medium">{systemInfo.server}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Deploy:</span>
                  <span className="text-sm font-medium">{systemInfo.deployment}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status do Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Último Backup:</span>
                  <span className="text-sm font-medium">{systemInfo.lastBackup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Uptime:</span>
                  <span className="text-sm font-medium text-green-600">{systemInfo.uptime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Armazenamento:</span>
                  <span className="text-sm font-medium">{systemInfo.storage}</span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Uso de Armazenamento</span>
                    <span>25.6%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "25.6%" }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Dependências</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Frontend</h4>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <div>React 18.3.1</div>
                    <div>TypeScript 5.2.2</div>
                    <div>Tailwind CSS 3.3.0</div>
                    <div>Vite 5.0.8</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Backend</h4>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <div>Node.js 20.11.0</div>
                    <div>Express 4.18.2</div>
                    <div>PostgreSQL 15.2</div>
                    <div>Redis 7.0.8</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Infraestrutura</h4>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <div>Docker 24.0.5</div>
                    <div>Kubernetes 1.28</div>
                    <div>Nginx 1.24.0</div>
                    <div>Let's Encrypt SSL</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
