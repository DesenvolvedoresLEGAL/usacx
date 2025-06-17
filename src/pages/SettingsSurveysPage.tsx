
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, Star, MessageSquare, BarChart, Settings, Eye, Send } from "lucide-react";

interface Survey {
  id: string;
  name: string;
  description: string;
  type: 'csat' | 'nps' | 'custom';
  status: 'active' | 'inactive' | 'draft';
  trigger: 'end_chat' | 'manual' | 'scheduled';
  questions: SurveyQuestion[];
  channels: string[];
  responseRate: number;
  createdAt: string;
}

interface SurveyQuestion {
  id: string;
  type: 'rating' | 'multiple_choice' | 'text' | 'yes_no';
  question: string;
  required: boolean;
  options?: string[];
  scale?: { min: number; max: number; labels?: string[] };
}

interface SurveyTemplate {
  id: string;
  name: string;
  description: string;
  type: 'csat' | 'nps' | 'custom';
  questions: SurveyQuestion[];
}

const SettingsSurveysPage = () => {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null);

  const [surveys, setSurveys] = useState<Survey[]>([
    {
      id: '1',
      name: 'CSAT Pós-Atendimento',
      description: 'Pesquisa de satisfação enviada após o encerramento do atendimento',
      type: 'csat',
      status: 'active',
      trigger: 'end_chat',
      questions: [
        {
          id: '1',
          type: 'rating',
          question: 'Como você avalia o atendimento recebido?',
          required: true,
          scale: { min: 1, max: 5, labels: ['Muito Insatisfeito', 'Insatisfeito', 'Neutro', 'Satisfeito', 'Muito Satisfeito'] }
        },
        {
          id: '2',
          type: 'text',
          question: 'Deixe um comentário sobre o atendimento (opcional)',
          required: false
        }
      ],
      channels: ['whatsapp', 'chat', 'email'],
      responseRate: 78.5,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'NPS Mensal',
      description: 'Pesquisa NPS enviada mensalmente para clientes',
      type: 'nps',
      status: 'active',
      trigger: 'scheduled',
      questions: [
        {
          id: '1',
          type: 'rating',
          question: 'Qual a probabilidade de você recomendar nossa empresa?',
          required: true,
          scale: { min: 0, max: 10 }
        },
        {
          id: '2',
          type: 'text',
          question: 'O que podemos melhorar?',
          required: false
        }
      ],
      channels: ['email'],
      responseRate: 23.4,
      createdAt: '2024-02-01'
    }
  ]);

  const [templates] = useState<SurveyTemplate[]>([
    {
      id: '1',
      name: 'CSAT Padrão',
      description: 'Template padrão para pesquisa de satisfação',
      type: 'csat',
      questions: [
        {
          id: '1',
          type: 'rating',
          question: 'Como você avalia o atendimento recebido?',
          required: true,
          scale: { min: 1, max: 5 }
        }
      ]
    },
    {
      id: '2',
      name: 'NPS Padrão',
      description: 'Template padrão para pesquisa NPS',
      type: 'nps',
      questions: [
        {
          id: '1',
          type: 'rating',
          question: 'Qual a probabilidade de você recomendar nossa empresa?',
          required: true,
          scale: { min: 0, max: 10 }
        }
      ]
    }
  ]);

  const [newSurvey, setNewSurvey] = useState<Partial<Survey>>({
    name: '',
    description: '',
    type: 'csat',
    status: 'draft',
    trigger: 'end_chat',
    questions: [],
    channels: []
  });

  const handleCreateSurvey = () => {
    if (!newSurvey.name || !newSurvey.description) {
      toast({
        title: "Erro",
        description: "Nome e descrição são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const survey: Survey = {
      id: Math.random().toString(36).substr(2, 9),
      name: newSurvey.name!,
      description: newSurvey.description!,
      type: newSurvey.type!,
      status: newSurvey.status!,
      trigger: newSurvey.trigger!,
      questions: newSurvey.questions!,
      channels: newSurvey.channels!,
      responseRate: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setSurveys([...surveys, survey]);
    setNewSurvey({
      name: '',
      description: '',
      type: 'csat',
      status: 'draft',
      trigger: 'end_chat',
      questions: [],
      channels: []
    });
    setIsCreateDialogOpen(false);

    toast({
      title: "Sucesso",
      description: "Pesquisa criada com sucesso.",
    });
  };

  const handleDeleteSurvey = (id: string) => {
    setSurveys(surveys.filter(survey => survey.id !== id));
    toast({
      title: "Sucesso",
      description: "Pesquisa removida com sucesso.",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { color: 'bg-green-100 text-green-800', label: 'Ativa' },
      inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inativa' },
      draft: { color: 'bg-yellow-100 text-yellow-800', label: 'Rascunho' }
    };
    const variant = variants[status as keyof typeof variants] || variants.draft;
    return <Badge className={variant.color}>{variant.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      csat: { color: 'bg-blue-100 text-blue-800', label: 'CSAT' },
      nps: { color: 'bg-purple-100 text-purple-800', label: 'NPS' },
      custom: { color: 'bg-orange-100 text-orange-800', label: 'Personalizada' }
    };
    const variant = variants[type as keyof typeof variants] || variants.custom;
    return <Badge className={variant.color}>{variant.label}</Badge>;
  };

  const getTriggerLabel = (trigger: string) => {
    const labels = {
      end_chat: 'Fim do chat',
      manual: 'Manual',
      scheduled: 'Agendado'
    };
    return labels[trigger as keyof typeof labels] || trigger;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configurações de Pesquisas</h1>
          <p className="text-muted-foreground">Gerencie pesquisas de satisfação, NPS e questionários personalizados</p>
        </div>
      </div>

      <Tabs defaultValue="surveys" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="surveys" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Pesquisas
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart className="w-4 h-4" />
            Relatórios
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="surveys" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pesquisas Ativas</CardTitle>
                  <CardDescription>Gerencie suas pesquisas de satisfação e feedback</CardDescription>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Pesquisa
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Criar Nova Pesquisa</DialogTitle>
                      <DialogDescription>Configure uma nova pesquisa de feedback</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome da Pesquisa</Label>
                          <Input
                            id="name"
                            value={newSurvey.name}
                            onChange={(e) => setNewSurvey({ ...newSurvey, name: e.target.value })}
                            placeholder="Ex: CSAT Pós-Atendimento"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="type">Tipo</Label>
                          <Select value={newSurvey.type} onValueChange={(value: any) => setNewSurvey({ ...newSurvey, type: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="csat">CSAT (Satisfação)</SelectItem>
                              <SelectItem value="nps">NPS (Net Promoter Score)</SelectItem>
                              <SelectItem value="custom">Personalizada</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                          id="description"
                          value={newSurvey.description}
                          onChange={(e) => setNewSurvey({ ...newSurvey, description: e.target.value })}
                          placeholder="Descrição da pesquisa"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="trigger">Gatilho</Label>
                          <Select value={newSurvey.trigger} onValueChange={(value: any) => setNewSurvey({ ...newSurvey, trigger: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="end_chat">Fim do chat</SelectItem>
                              <SelectItem value="manual">Manual</SelectItem>
                              <SelectItem value="scheduled">Agendado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select value={newSurvey.status} onValueChange={(value: any) => setNewSurvey({ ...newSurvey, status: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Ativa</SelectItem>
                              <SelectItem value="inactive">Inativa</SelectItem>
                              <SelectItem value="draft">Rascunho</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleCreateSurvey}>Criar Pesquisa</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Gatilho</TableHead>
                    <TableHead>Taxa de Resposta</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {surveys.map((survey) => (
                    <TableRow key={survey.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{survey.name}</div>
                          <div className="text-sm text-muted-foreground">{survey.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(survey.type)}</TableCell>
                      <TableCell>{getTriggerLabel(survey.trigger)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${Math.min(survey.responseRate, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm">{survey.responseRate.toFixed(1)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(survey.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Send className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir a pesquisa "{survey.name}"?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteSurvey(survey.id)}>
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Templates de Pesquisas</CardTitle>
                  <CardDescription>Templates pré-configurados para criar pesquisas rapidamente</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        {getTypeBadge(template.type)}
                      </div>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {template.questions.length} pergunta(s)
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">Usar Template</Button>
                          <Button variant="outline" size="sm">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Resposta Média</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">65.2%</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CSAT Médio</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.3</div>
                <p className="text-xs text-muted-foreground">
                  +0.2 pontos este mês
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">NPS Score</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">
                  +5 pontos este mês
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Respostas</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">
                  +180 este mês
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Evolução das Métricas</CardTitle>
              <CardDescription>Acompanhe a evolução das suas métricas de satisfação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Gráfico de evolução das métricas será implementado aqui
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>Configurações globais para pesquisas de satisfação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Envio automático de pesquisas</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar automaticamente pesquisas após o encerramento de atendimentos
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Lembretes de pesquisa</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar lembretes para clientes que não responderam
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Anonimização de respostas</Label>
                    <p className="text-sm text-muted-foreground">
                      Anonimizar automaticamente as respostas após 90 dias
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeout">Tempo limite para resposta (dias)</Label>
                  <Input type="number" id="timeout" defaultValue="7" className="w-24" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequência máxima de pesquisas por cliente</Label>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">A cada 7 dias</SelectItem>
                      <SelectItem value="15">A cada 15 dias</SelectItem>
                      <SelectItem value="30">A cada 30 dias</SelectItem>
                      <SelectItem value="90">A cada 90 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>Configure notificações para eventos relacionados às pesquisas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Nova resposta recebida</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificar quando uma nova resposta for recebida
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Meta de resposta atingida</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificar quando a meta de taxa de resposta for atingida
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Avaliação negativa</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificar imediatamente quando receber avaliações baixas
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsSurveysPage;
