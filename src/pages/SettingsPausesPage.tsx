
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
import { Plus, Edit2, Trash2, Clock, Users, Settings, Timer, Coffee, Utensils, Heart, GraduationCap, Phone } from "lucide-react";

interface PauseType {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  maxDuration: number; // em minutos
  requiresApproval: boolean;
  isActive: boolean;
  category: 'productive' | 'unproductive' | 'personal';
  autoEnd: boolean;
  allowedTimes: string[];
}

interface PauseRule {
  id: string;
  name: string;
  description: string;
  pauseTypeId: string;
  maxDailyDuration: number;
  maxConsecutiveUses: number;
  cooldownPeriod: number;
  requiredRole: string;
  isActive: boolean;
}

const SettingsPausesPage = () => {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
  const [editingPause, setEditingPause] = useState<PauseType | null>(null);
  const [editingRule, setEditingRule] = useState<PauseRule | null>(null);

  const [pauseTypes, setPauseTypes] = useState<PauseType[]>([
    {
      id: '1',
      name: 'Almoço',
      description: 'Pausa para almoço',
      color: '#22c55e',
      icon: 'utensils',
      maxDuration: 60,
      requiresApproval: false,
      isActive: true,
      category: 'personal',
      autoEnd: true,
      allowedTimes: ['11:30', '12:00', '12:30', '13:00']
    },
    {
      id: '2',
      name: 'Intervalo',
      description: 'Pausa para descanso',
      color: '#3b82f6',
      icon: 'coffee',
      maxDuration: 15,
      requiresApproval: false,
      isActive: true,
      category: 'personal',
      autoEnd: true,
      allowedTimes: []
    },
    {
      id: '3',
      name: 'Treinamento',
      description: 'Pausa para treinamento',
      color: '#8b5cf6',
      icon: 'graduation-cap',
      maxDuration: 120,
      requiresApproval: true,
      isActive: true,
      category: 'productive',
      autoEnd: false,
      allowedTimes: []
    }
  ]);

  const [pauseRules, setPauseRules] = useState<PauseRule[]>([
    {
      id: '1',
      name: 'Limite Almoço',
      description: 'Máximo 1 hora de almoço por dia',
      pauseTypeId: '1',
      maxDailyDuration: 60,
      maxConsecutiveUses: 1,
      cooldownPeriod: 0,
      requiredRole: 'agent',
      isActive: true
    },
    {
      id: '2',
      name: 'Limite Intervalo',
      description: 'Máximo 30 minutos de intervalo por dia',
      pauseTypeId: '2',
      maxDailyDuration: 30,
      maxConsecutiveUses: 2,
      cooldownPeriod: 120,
      requiredRole: 'agent',
      isActive: true
    }
  ]);

  const [newPause, setNewPause] = useState<Partial<PauseType>>({
    name: '',
    description: '',
    color: '#3b82f6',
    icon: 'clock',
    maxDuration: 15,
    requiresApproval: false,
    isActive: true,
    category: 'personal',
    autoEnd: true,
    allowedTimes: []
  });

  const [newRule, setNewRule] = useState<Partial<PauseRule>>({
    name: '',
    description: '',
    pauseTypeId: '',
    maxDailyDuration: 30,
    maxConsecutiveUses: 1,
    cooldownPeriod: 0,
    requiredRole: 'agent',
    isActive: true
  });

  const iconOptions = [
    { value: 'clock', label: 'Relógio', icon: Clock },
    { value: 'coffee', label: 'Café', icon: Coffee },
    { value: 'utensils', label: 'Alimentação', icon: Utensils },
    { value: 'heart', label: 'Saúde', icon: Heart },
    { value: 'graduation-cap', label: 'Treinamento', icon: GraduationCap },
    { value: 'phone', label: 'Telefone', icon: Phone }
  ];

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption ? iconOption.icon : Clock;
  };

  const handleCreatePause = () => {
    if (!newPause.name || !newPause.description) {
      toast({
        title: "Erro",
        description: "Nome e descrição são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const pause: PauseType = {
      id: Math.random().toString(36).substr(2, 9),
      name: newPause.name!,
      description: newPause.description!,
      color: newPause.color!,
      icon: newPause.icon!,
      maxDuration: newPause.maxDuration!,
      requiresApproval: newPause.requiresApproval!,
      isActive: newPause.isActive!,
      category: newPause.category!,
      autoEnd: newPause.autoEnd!,
      allowedTimes: newPause.allowedTimes!
    };

    setPauseTypes([...pauseTypes, pause]);
    setNewPause({
      name: '',
      description: '',
      color: '#3b82f6',
      icon: 'clock',
      maxDuration: 15,
      requiresApproval: false,
      isActive: true,
      category: 'personal',
      autoEnd: true,
      allowedTimes: []
    });
    setIsCreateDialogOpen(false);

    toast({
      title: "Sucesso",
      description: "Tipo de pausa criado com sucesso.",
    });
  };

  const handleCreateRule = () => {
    if (!newRule.name || !newRule.pauseTypeId) {
      toast({
        title: "Erro",
        description: "Nome e tipo de pausa são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const rule: PauseRule = {
      id: Math.random().toString(36).substr(2, 9),
      name: newRule.name!,
      description: newRule.description!,
      pauseTypeId: newRule.pauseTypeId!,
      maxDailyDuration: newRule.maxDailyDuration!,
      maxConsecutiveUses: newRule.maxConsecutiveUses!,
      cooldownPeriod: newRule.cooldownPeriod!,
      requiredRole: newRule.requiredRole!,
      isActive: newRule.isActive!
    };

    setPauseRules([...pauseRules, rule]);
    setNewRule({
      name: '',
      description: '',
      pauseTypeId: '',
      maxDailyDuration: 30,
      maxConsecutiveUses: 1,
      cooldownPeriod: 0,
      requiredRole: 'agent',
      isActive: true
    });
    setIsRuleDialogOpen(false);

    toast({
      title: "Sucesso",
      description: "Regra de pausa criada com sucesso.",
    });
  };

  const handleDeletePause = (id: string) => {
    setPauseTypes(pauseTypes.filter(pause => pause.id !== id));
    toast({
      title: "Sucesso",
      description: "Tipo de pausa removido com sucesso.",
    });
  };

  const handleDeleteRule = (id: string) => {
    setPauseRules(pauseRules.filter(rule => rule.id !== id));
    toast({
      title: "Sucesso",
      description: "Regra de pausa removida com sucesso.",
    });
  };

  const getCategoryBadge = (category: string) => {
    const variants = {
      productive: { color: 'bg-green-100 text-green-800', label: 'Produtiva' },
      unproductive: { color: 'bg-red-100 text-red-800', label: 'Improdutiva' },
      personal: { color: 'bg-blue-100 text-blue-800', label: 'Pessoal' }
    };
    const variant = variants[category as keyof typeof variants] || variants.personal;
    return <Badge className={variant.color}>{variant.label}</Badge>;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configurações de Pausas</h1>
          <p className="text-muted-foreground">Gerencie tipos de pausas, regras e permissões</p>
        </div>
      </div>

      <Tabs defaultValue="types" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="types" className="flex items-center gap-2">
            <Timer className="w-4 h-4" />
            Tipos de Pausas
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Regras
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Configurações Gerais
          </TabsTrigger>
        </TabsList>

        <TabsContent value="types" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tipos de Pausas</CardTitle>
                  <CardDescription>Configure os diferentes tipos de pausas disponíveis</CardDescription>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Tipo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Criar Tipo de Pausa</DialogTitle>
                      <DialogDescription>Configure um novo tipo de pausa</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input
                          id="name"
                          value={newPause.name}
                          onChange={(e) => setNewPause({ ...newPause, name: e.target.value })}
                          placeholder="Ex: Almoço"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Categoria</Label>
                        <Select value={newPause.category} onValueChange={(value: any) => setNewPause({ ...newPause, category: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="personal">Pessoal</SelectItem>
                            <SelectItem value="productive">Produtiva</SelectItem>
                            <SelectItem value="unproductive">Improdutiva</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                          id="description"
                          value={newPause.description}
                          onChange={(e) => setNewPause({ ...newPause, description: e.target.value })}
                          placeholder="Descrição do tipo de pausa"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="icon">Ícone</Label>
                        <Select value={newPause.icon} onValueChange={(value) => setNewPause({ ...newPause, icon: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {iconOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center gap-2">
                                  <option.icon className="w-4 h-4" />
                                  {option.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="color">Cor</Label>
                        <Input
                          type="color"
                          id="color"
                          value={newPause.color}
                          onChange={(e) => setNewPause({ ...newPause, color: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxDuration">Duração Máxima (minutos)</Label>
                        <Input
                          type="number"
                          id="maxDuration"
                          value={newPause.maxDuration}
                          onChange={(e) => setNewPause({ ...newPause, maxDuration: parseInt(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="requiresApproval"
                            checked={newPause.requiresApproval}
                            onCheckedChange={(checked) => setNewPause({ ...newPause, requiresApproval: checked })}
                          />
                          <Label htmlFor="requiresApproval">Requer aprovação</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="autoEnd"
                            checked={newPause.autoEnd}
                            onCheckedChange={(checked) => setNewPause({ ...newPause, autoEnd: checked })}
                          />
                          <Label htmlFor="autoEnd">Encerramento automático</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="isActive"
                            checked={newPause.isActive}
                            onCheckedChange={(checked) => setNewPause({ ...newPause, isActive: checked })}
                          />
                          <Label htmlFor="isActive">Ativo</Label>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleCreatePause}>Criar Tipo</Button>
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
                    <TableHead>Categoria</TableHead>
                    <TableHead>Duração Máx.</TableHead>
                    <TableHead>Aprovação</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pauseTypes.map((pause) => {
                    const IconComponent = getIconComponent(pause.icon);
                    return (
                      <TableRow key={pause.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                              style={{ backgroundColor: pause.color }}
                            >
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-medium">{pause.name}</div>
                              <div className="text-sm text-muted-foreground">{pause.description}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getCategoryBadge(pause.category)}</TableCell>
                        <TableCell>{pause.maxDuration} min</TableCell>
                        <TableCell>
                          {pause.requiresApproval ? (
                            <Badge variant="outline">Requer</Badge>
                          ) : (
                            <Badge variant="secondary">Não requer</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {pause.isActive ? (
                            <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                          ) : (
                            <Badge variant="secondary">Inativo</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit2 className="w-4 h-4" />
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
                                    Tem certeza que deseja excluir o tipo de pausa "{pause.name}"?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeletePause(pause.id)}>
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Regras de Pausas</CardTitle>
                  <CardDescription>Configure regras e limites para os tipos de pausas</CardDescription>
                </div>
                <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Regra
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Criar Regra de Pausa</DialogTitle>
                      <DialogDescription>Configure uma nova regra para controlar o uso de pausas</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="ruleName">Nome da Regra</Label>
                        <Input
                          id="ruleName"
                          value={newRule.name}
                          onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                          placeholder="Ex: Limite de Almoço"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pauseType">Tipo de Pausa</Label>
                        <Select value={newRule.pauseTypeId} onValueChange={(value) => setNewRule({ ...newRule, pauseTypeId: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {pauseTypes.map((pause) => (
                              <SelectItem key={pause.id} value={pause.id}>
                                {pause.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="maxDaily">Duração Máxima Diária (min)</Label>
                          <Input
                            type="number"
                            id="maxDaily"
                            value={newRule.maxDailyDuration}
                            onChange={(e) => setNewRule({ ...newRule, maxDailyDuration: parseInt(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="maxConsecutive">Usos Consecutivos Máx.</Label>
                          <Input
                            type="number"
                            id="maxConsecutive"
                            value={newRule.maxConsecutiveUses}
                            onChange={(e) => setNewRule({ ...newRule, maxConsecutiveUses: parseInt(e.target.value) })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cooldown">Período de Espera (min)</Label>
                        <Input
                          type="number"
                          id="cooldown"
                          value={newRule.cooldownPeriod}
                          onChange={(e) => setNewRule({ ...newRule, cooldownPeriod: parseInt(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                          id="description"
                          value={newRule.description}
                          onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                          placeholder="Descrição da regra"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsRuleDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleCreateRule}>Criar Regra</Button>
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
                    <TableHead>Tipo de Pausa</TableHead>
                    <TableHead>Limite Diário</TableHead>
                    <TableHead>Usos Consecutivos</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pauseRules.map((rule) => {
                    const pauseType = pauseTypes.find(p => p.id === rule.pauseTypeId);
                    return (
                      <TableRow key={rule.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{rule.name}</div>
                            <div className="text-sm text-muted-foreground">{rule.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>{pauseType?.name || 'N/A'}</TableCell>
                        <TableCell>{rule.maxDailyDuration} min</TableCell>
                        <TableCell>{rule.maxConsecutiveUses}</TableCell>
                        <TableCell>
                          {rule.isActive ? (
                            <Badge className="bg-green-100 text-green-800">Ativa</Badge>
                          ) : (
                            <Badge variant="secondary">Inativa</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit2 className="w-4 h-4" />
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
                                    Tem certeza que deseja excluir a regra "{rule.name}"?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteRule(rule.id)}>
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Globais</CardTitle>
                <CardDescription>Configurações gerais para o sistema de pausas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Permitir pausas sobrepostas</Label>
                    <p className="text-sm text-muted-foreground">
                      Permite que agentes tenham múltiplas pausas ativas simultaneamente
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificar supervisores</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar notificações para supervisores quando pausas são iniciadas
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Log detalhado</Label>
                    <p className="text-sm text-muted-foreground">
                      Registrar logs detalhados de todas as atividades de pausa
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Validação automática de horários</Label>
                    <p className="text-sm text-muted-foreground">
                      Validar automaticamente se o horário da pausa está dentro dos limites permitidos
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Permissões por Função</CardTitle>
                <CardDescription>Configure permissões específicas por função</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground">
                    <div>Função</div>
                    <div>Criar Pausas</div>
                    <div>Aprovar Pausas</div>
                    <div>Ver Relatórios</div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <div>Agente</div>
                    <Switch defaultChecked />
                    <Switch />
                    <Switch />
                  </div>
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <div>Supervisor</div>
                    <Switch defaultChecked />
                    <Switch defaultChecked />
                    <Switch defaultChecked />
                  </div>
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <div>Gerente</div>
                    <Switch defaultChecked />
                    <Switch defaultChecked />
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPausesPage;
