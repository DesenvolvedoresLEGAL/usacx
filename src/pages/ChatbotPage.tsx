
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  Bot, 
  Settings, 
  Play, 
  Pause, 
  Edit, 
  Plus,
  BarChart2,
  MessageCircle,
  Clock
} from "lucide-react";

interface Chatbot {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "training";
  conversations: number;
  accuracy: number;
  lastTrained: string;
}

const mockChatbots: Chatbot[] = [
  {
    id: "1",
    name: "Atendimento Geral",
    description: "Bot para dúvidas gerais e direcionamento inicial",
    status: "active",
    conversations: 1247,
    accuracy: 89,
    lastTrained: "2024-01-10"
  },
  {
    id: "2", 
    name: "Suporte Técnico",
    description: "Bot especializado em questões técnicas",
    status: "training",
    conversations: 532,
    accuracy: 76,
    lastTrained: "2024-01-08"
  },
  {
    id: "3",
    name: "Vendas",
    description: "Bot para qualificação de leads e informações comerciais",
    status: "inactive",
    conversations: 89,
    accuracy: 62,
    lastTrained: "2024-01-05"
  }
];

export default function ChatbotPage() {
  const [chatbots, setChatbots] = useState<Chatbot[]>(mockChatbots);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBotName, setNewBotName] = useState("");
  const [newBotDescription, setNewBotDescription] = useState("");

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

  const handleCreateBot = () => {
    if (newBotName && newBotDescription) {
      const newBot: Chatbot = {
        id: Date.now().toString(),
        name: newBotName,
        description: newBotDescription,
        status: "inactive",
        conversations: 0,
        accuracy: 0,
        lastTrained: "Nunca"
      };
      setChatbots([...chatbots, newBot]);
      setNewBotName("");
      setNewBotDescription("");
      setShowCreateForm(false);
    }
  };

  const toggleBotStatus = (id: string) => {
    setChatbots(chatbots.map(bot => {
      if (bot.id === id) {
        const newStatus = bot.status === "active" ? "inactive" : "active";
        return { ...bot, status: newStatus };
      }
      return bot;
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-primary" /> Chatbot
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Configure e gerencie os chatbots inteligentes para automatizar o atendimento. 
            Treine bots especializados para diferentes tipos de solicitações.
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Chatbot
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Bots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{chatbots.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bots Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-green-500" />
              <span className="text-2xl font-bold">{chatbots.filter(bot => bot.status === "active").length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversas Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold">324</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Precisão Média</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-purple-500" />
              <span className="text-2xl font-bold">
                {Math.round(chatbots.reduce((acc, bot) => acc + bot.accuracy, 0) / chatbots.length)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Bot Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Chatbot</CardTitle>
            <CardDescription>
              Configure um novo chatbot para automatizar o atendimento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="bot-name">Nome do Bot</Label>
              <Input 
                id="bot-name"
                value={newBotName}
                onChange={(e) => setNewBotName(e.target.value)}
                placeholder="Ex: Atendimento Financeiro"
              />
            </div>
            <div>
              <Label htmlFor="bot-description">Descrição</Label>
              <Textarea 
                id="bot-description"
                value={newBotDescription}
                onChange={(e) => setNewBotDescription(e.target.value)}
                placeholder="Descreva o propósito e especialidade do chatbot..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateBot}>Criar Chatbot</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chatbots List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {chatbots.map((bot) => (
          <Card key={bot.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Bot className="w-6 h-6 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{bot.name}</CardTitle>
                    <CardDescription>{bot.description}</CardDescription>
                  </div>
                </div>
                <Badge className={`${getStatusColor(bot.status)} text-white`}>
                  {getStatusText(bot.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Bot Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{bot.conversations}</div>
                  <div className="text-xs text-muted-foreground">Conversas</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{bot.accuracy}%</div>
                  <div className="text-xs text-muted-foreground">Precisão</div>
                </div>
                <div>
                  <div className="text-sm font-semibold">{bot.lastTrained}</div>
                  <div className="text-xs text-muted-foreground">Último Treino</div>
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={bot.status === "active" ? "destructive" : "default"}
                  onClick={() => toggleBotStatus(bot.id)}
                  className="flex items-center gap-1"
                >
                  {bot.status === "active" ? (
                    <>
                      <Pause className="w-3 h-3" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      Ativar
                    </>
                  )}
                </Button>
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  <Edit className="w-3 h-3" />
                  Editar
                </Button>
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  <Settings className="w-3 h-3" />
                  Configurar
                </Button>
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Treinar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
