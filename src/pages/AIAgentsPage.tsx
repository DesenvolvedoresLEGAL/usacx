import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bot, Plus, Search, MessageSquare, BarChart3, Settings, Zap, Clock, Target } from "lucide-react";
import { toast } from "sonner";

interface BotAgent {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "training";
  conversations: number;
  accuracy: number;
  lastTrained?: string;
  type: "atendimento" | "vendas" | "suporte";
  channels: string[];
}

const mockAgents: BotAgent[] = [
  {
    id: "1",
    name: "Assistente Principal",
    description: "Bot principal para atendimento geral",
    status: "active",
    conversations: 1247,
    accuracy: 94.5,
    lastTrained: "2024-01-15",
    type: "atendimento",
    channels: ["WhatsApp", "Telegram", "Web Chat"]
  },
  {
    id: "2",
    name: "Bot de Vendas",
    description: "Especializado em qualificação de leads",
    status: "active",
    conversations: 856,
    accuracy: 91.2,
    lastTrained: "2024-01-10",
    type: "vendas",
    channels: ["WhatsApp", "Instagram"]
  },
  {
    id: "3",
    name: "Suporte Técnico",
    description: "Atendimento técnico e troubleshooting",
    status: "training",
    conversations: 432,
    accuracy: 88.7,
    lastTrained: "2024-01-18",
    type: "suporte",
    channels: ["Web Chat", "Email"]
  }
];

export default function AIAgentsPage() {
  const [agents, setAgents] = useState<BotAgent[]>(mockAgents);
  const [selectedAgent, setSelectedAgent] = useState<BotAgent | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "inactive": return "bg-gray-500/10 text-gray-600 border-gray-500/20";
      case "training": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default: return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Ativo";
      case "inactive": return "Inativo";
      case "training": return "Treinando";
      default: return status;
    }
  };

  const toggleAgentStatus = (id: string) => {
    setAgents(agents.map(agent => {
      if (agent.id === id) {
        const newStatus = agent.status === "active" ? "inactive" : "active";
        toast.success(`Agente ${newStatus === "active" ? "ativado" : "desativado"} com sucesso`);
        return { ...agent, status: newStatus };
      }
      return agent;
    }));
  };

  const handleCreateAgent = () => {
    toast.success("Agente criado com sucesso!");
    setShowCreateForm(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bot className="w-8 h-8 text-primary" /> Agentes de IA
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Gerencie seus assistentes virtuais, configure fluxos de conversa e integre canais de atendimento.
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)} className="gap-2">
          <Plus className="w-4 h-4" /> Criar Agente
        </Button>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList>
          <TabsTrigger value="dashboard" className="gap-2">
            <BarChart3 className="w-4 h-4" /> Dashboard
          </TabsTrigger>
          <TabsTrigger value="agents" className="gap-2">
            <Bot className="w-4 h-4" /> Agentes
          </TabsTrigger>
          <TabsTrigger value="flows" className="gap-2">
            <Zap className="w-4 h-4" /> Fluxos
          </TabsTrigger>
          <TabsTrigger value="channels" className="gap-2">
            <MessageSquare className="w-4 h-4" /> Canais
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total de Agentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{agents.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {agents.filter(a => a.status === "active").length} ativos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Conversas Totais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {agents.reduce((sum, agent) => sum + agent.conversations, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Últimos 30 dias</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Precisão Média</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {(agents.reduce((sum, agent) => sum + agent.accuracy, 0) / agents.length).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">Todos os agentes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Canais Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {new Set(agents.flatMap(a => a.channels)).size}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Integrações configuradas</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar agentes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {showCreateForm && (
            <Card>
              <CardHeader>
                <CardTitle>Criar Novo Agente</CardTitle>
                <CardDescription>Configure um novo assistente virtual</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome do Agente</Label>
                    <Input placeholder="Ex: Assistente de Vendas" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select defaultValue="atendimento">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="atendimento">Atendimento</SelectItem>
                        <SelectItem value="vendas">Vendas</SelectItem>
                        <SelectItem value="suporte">Suporte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Input placeholder="Descreva o propósito deste agente" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateAgent}>Criar Agente</Button>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancelar</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 gap-4">
            {filteredAgents.map((agent) => (
              <Card key={agent.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Bot className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-lg">{agent.name}</h3>
                        <Badge variant="outline" className={getStatusColor(agent.status)}>
                          {getStatusText(agent.status)}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">{agent.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-muted-foreground" />
                          <span>{agent.conversations} conversas</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-muted-foreground" />
                          <span>{agent.accuracy}% precisão</span>
                        </div>
                        {agent.lastTrained && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>Treinado em {new Date(agent.lastTrained).toLocaleDateString('pt-BR')}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {agent.channels.map((channel) => (
                          <Badge key={channel} variant="secondary">{channel}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedAgent(agent)}>
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Switch
                        checked={agent.status === "active"}
                        onCheckedChange={() => toggleAgentStatus(agent.id)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="flows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Fluxos de Conversa
              </CardTitle>
              <CardDescription>
                Configure fluxos de conversa automatizados para seus agentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium">Funcionalidade em desenvolvimento</p>
                <p className="text-sm mt-2">Em breve você poderá criar fluxos visuais de conversa</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Integrações de Canais
              </CardTitle>
              <CardDescription>
                Conecte seus agentes a diferentes plataformas de mensagem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-2">WhatsApp Business</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Conecte via Meta API
                    </p>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600">Configurado</Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-2">Telegram</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Bot API do Telegram
                    </p>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600">Configurado</Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-2">Web Chat</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Widget para seu site
                    </p>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600">Configurado</Badge>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
