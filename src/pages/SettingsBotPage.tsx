
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Bot, 
  Settings, 
  Play, 
  Pause, 
  Edit, 
  Plus,
  MessageSquare,
  Clock,
  Zap,
  Brain,
  Users,
  BarChart3,
  Trash2,
  Save,
  Download,
  Upload
} from "lucide-react";

interface BotConfig {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "training";
  type: "general" | "support" | "sales" | "hr";
  responseTime: number;
  accuracy: number;
  conversationsToday: number;
  language: string;
  welcomeMessage: string;
  fallbackMessage: string;
  maxConversations: number;
  workingHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  autoTransfer: {
    enabled: boolean;
    attempts: number;
    transferTo: string;
  };
  integrations: {
    whatsapp: boolean;
    telegram: boolean;
    webchat: boolean;
    email: boolean;
  };
}

const mockBots: BotConfig[] = [
  {
    id: "1",
    name: "Atendimento Geral",
    description: "Bot principal para atendimento inicial e direcionamento",
    status: "active",
    type: "general",
    responseTime: 1.2,
    accuracy: 89,
    conversationsToday: 156,
    language: "pt-BR",
    welcomeMessage: "Olá! Como posso ajudá-lo hoje?",
    fallbackMessage: "Desculpe, não entendi. Você pode reformular sua pergunta?",
    maxConversations: 50,
    workingHours: {
      enabled: true,
      start: "08:00",
      end: "18:00"
    },
    autoTransfer: {
      enabled: true,
      attempts: 3,
      transferTo: "human"
    },
    integrations: {
      whatsapp: true,
      telegram: false,
      webchat: true,
      email: false
    }
  },
  {
    id: "2",
    name: "Suporte Técnico",
    description: "Bot especializado em questões técnicas e troubleshooting",
    status: "training",
    type: "support",
    responseTime: 2.1,
    accuracy: 76,
    conversationsToday: 43,
    language: "pt-BR",
    welcomeMessage: "Olá! Estou aqui para ajudar com questões técnicas.",
    fallbackMessage: "Para questões mais complexas, vou transferir para um especialista.",
    maxConversations: 30,
    workingHours: {
      enabled: true,
      start: "09:00",
      end: "17:00"
    },
    autoTransfer: {
      enabled: true,
      attempts: 2,
      transferTo: "technical_team"
    },
    integrations: {
      whatsapp: false,
      telegram: true,
      webchat: true,
      email: true
    }
  }
];

export default function SettingsBotPage() {
  const [bots, setBots] = useState<BotConfig[]>(mockBots);
  const [selectedBot, setSelectedBot] = useState<BotConfig | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "training": return "bg-yellow-500";
      case "inactive": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Ativo";
      case "training": return "Treinando";
      case "inactive": return "Inativo";
      default: return "Desconhecido";
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "general": return "Geral";
      case "support": return "Suporte";
      case "sales": return "Vendas";
      case "hr": return "RH";
      default: return "Outros";
    }
  };

  const handleBotSelect = (bot: BotConfig) => {
    setSelectedBot(bot);
    setShowCreateForm(false);
  };

  const handleCreateNew = () => {
    setSelectedBot(null);
    setShowCreateForm(true);
  };

  const toggleBotStatus = (botId: string) => {
    setBots(bots.map(bot => {
      if (bot.id === botId) {
        const newStatus = bot.status === "active" ? "inactive" : "active";
        return { ...bot, status: newStatus };
      }
      return bot;
    }));
  };

  const updateBotConfig = (updatedBot: BotConfig) => {
    setBots(bots.map(bot => bot.id === updatedBot.id ? updatedBot : bot));
    setSelectedBot(updatedBot);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bot className="w-8 h-8 text-primary" /> Configurações - Bots
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Configure e gerencie os bots de atendimento automático. Defina comportamentos,
            integrações e parâmetros de funcionamento.
          </p>
        </div>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Bot
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Bots */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bots Configurados</CardTitle>
              <CardDescription>
                Clique em um bot para editar suas configurações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {bots.map((bot) => (
                <div
                  key={bot.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                    selectedBot?.id === bot.id ? 'bg-accent border-primary' : ''
                  }`}
                  onClick={() => handleBotSelect(bot)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{bot.name}</h4>
                    <Badge className={`${getStatusColor(bot.status)} text-white text-xs`}>
                      {getStatusText(bot.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{bot.description}</p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Tipo: {getTypeText(bot.type)}</span>
                    <span>{bot.conversationsToday} conversas hoje</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Configurações do Bot Selecionado */}
        <div className="lg:col-span-2">
          {selectedBot ? (
            <BotConfigurationPanel 
              bot={selectedBot} 
              onUpdate={updateBotConfig}
              onToggleStatus={() => toggleBotStatus(selectedBot.id)}
            />
          ) : showCreateForm ? (
            <CreateBotForm onCancel={() => setShowCreateForm(false)} />
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Bot className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum bot selecionado</h3>
                  <p className="text-muted-foreground">
                    Selecione um bot da lista ou crie um novo para começar
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function BotConfigurationPanel({ 
  bot, 
  onUpdate, 
  onToggleStatus 
}: { 
  bot: BotConfig; 
  onUpdate: (bot: BotConfig) => void;
  onToggleStatus: () => void;
}) {
  const [editedBot, setEditedBot] = useState<BotConfig>(bot);

  const handleSave = () => {
    onUpdate(editedBot);
  };

  const updateField = (field: keyof BotConfig, value: any) => {
    setEditedBot(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent: keyof BotConfig, field: string, value: any) => {
    setEditedBot(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [field]: value
      }
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              {bot.name}
            </CardTitle>
            <CardDescription>{bot.description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={bot.status === "active" ? "destructive" : "default"}
              onClick={onToggleStatus}
            >
              {bot.status === "active" ? (
                <>
                  <Pause className="w-3 h-3 mr-1" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 mr-1" />
                  Ativar
                </>
              )}
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="w-3 h-3 mr-1" />
              Salvar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="messages">Mensagens</TabsTrigger>
            <TabsTrigger value="behavior">Comportamento</TabsTrigger>
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bot-name">Nome do Bot</Label>
                <Input
                  id="bot-name"
                  value={editedBot.name}
                  onChange={(e) => updateField('name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="bot-type">Tipo</Label>
                <Select value={editedBot.type} onValueChange={(value) => updateField('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Geral</SelectItem>
                    <SelectItem value="support">Suporte</SelectItem>
                    <SelectItem value="sales">Vendas</SelectItem>
                    <SelectItem value="hr">RH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="bot-description">Descrição</Label>
              <Textarea
                id="bot-description"
                value={editedBot.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="language">Idioma</Label>
                <Select value={editedBot.language} onValueChange={(value) => updateField('language', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es-ES">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="max-conversations">Máx. Conversas Simultâneas</Label>
                <Input
                  id="max-conversations"
                  type="number"
                  value={editedBot.maxConversations}
                  onChange={(e) => updateField('maxConversations', parseInt(e.target.value))}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <div>
              <Label htmlFor="welcome-message">Mensagem de Boas-vindas</Label>
              <Textarea
                id="welcome-message"
                value={editedBot.welcomeMessage}
                onChange={(e) => updateField('welcomeMessage', e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="fallback-message">Mensagem de Fallback</Label>
              <Textarea
                id="fallback-message"
                value={editedBot.fallbackMessage}
                onChange={(e) => updateField('fallbackMessage', e.target.value)}
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Horário de Funcionamento</Label>
                  <p className="text-sm text-muted-foreground">
                    Definir horários em que o bot estará ativo
                  </p>
                </div>
                <Switch
                  checked={editedBot.workingHours.enabled}
                  onCheckedChange={(checked) => updateNestedField('workingHours', 'enabled', checked)}
                />
              </div>

              {editedBot.workingHours.enabled && (
                <div className="grid grid-cols-2 gap-4 pl-4">
                  <div>
                    <Label htmlFor="start-time">Início</Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={editedBot.workingHours.start}
                      onChange={(e) => updateNestedField('workingHours', 'start', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-time">Fim</Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={editedBot.workingHours.end}
                      onChange={(e) => updateNestedField('workingHours', 'end', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Transferência Automática</Label>
                  <p className="text-sm text-muted-foreground">
                    Transferir para humano após tentativas falhadas
                  </p>
                </div>
                <Switch
                  checked={editedBot.autoTransfer.enabled}
                  onCheckedChange={(checked) => updateNestedField('autoTransfer', 'enabled', checked)}
                />
              </div>

              {editedBot.autoTransfer.enabled && (
                <div className="grid grid-cols-2 gap-4 pl-4">
                  <div>
                    <Label htmlFor="attempts">Tentativas</Label>
                    <Input
                      id="attempts"
                      type="number"
                      value={editedBot.autoTransfer.attempts}
                      onChange={(e) => updateNestedField('autoTransfer', 'attempts', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="transfer-to">Transferir para</Label>
                    <Select 
                      value={editedBot.autoTransfer.transferTo} 
                      onValueChange={(value) => updateNestedField('autoTransfer', 'transferTo', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="human">Atendente Humano</SelectItem>
                        <SelectItem value="technical_team">Equipe Técnica</SelectItem>
                        <SelectItem value="sales_team">Equipe de Vendas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-green-600" />
                  <Label>WhatsApp</Label>
                </div>
                <Switch
                  checked={editedBot.integrations.whatsapp}
                  onCheckedChange={(checked) => updateNestedField('integrations', 'whatsapp', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <Label>Telegram</Label>
                </div>
                <Switch
                  checked={editedBot.integrations.telegram}
                  onCheckedChange={(checked) => updateNestedField('integrations', 'telegram', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                  <Label>Chat Web</Label>
                </div>
                <Switch
                  checked={editedBot.integrations.webchat}
                  onCheckedChange={(checked) => updateNestedField('integrations', 'webchat', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-red-600" />
                  <Label>Email</Label>
                </div>
                <Switch
                  checked={editedBot.integrations.email}
                  onCheckedChange={(checked) => updateNestedField('integrations', 'email', checked)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function CreateBotForm({ onCancel }: { onCancel: () => void }) {
  const [newBot, setNewBot] = useState({
    name: "",
    description: "",
    type: "general",
    language: "pt-BR"
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Novo Bot</CardTitle>
        <CardDescription>
          Configure um novo bot de atendimento automático
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="new-bot-name">Nome do Bot</Label>
          <Input
            id="new-bot-name"
            value={newBot.name}
            onChange={(e) => setNewBot(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Ex: Bot de Vendas"
          />
        </div>

        <div>
          <Label htmlFor="new-bot-description">Descrição</Label>
          <Textarea
            id="new-bot-description"
            value={newBot.description}
            onChange={(e) => setNewBot(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Descreva o propósito e especialidade do bot..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="new-bot-type">Tipo</Label>
            <Select value={newBot.type} onValueChange={(value) => setNewBot(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Geral</SelectItem>
                <SelectItem value="support">Suporte</SelectItem>
                <SelectItem value="sales">Vendas</SelectItem>
                <SelectItem value="hr">RH</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="new-bot-language">Idioma</Label>
            <Select value={newBot.language} onValueChange={(value) => setNewBot(prev => ({ ...prev, language: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="es-ES">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button>Criar Bot</Button>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
