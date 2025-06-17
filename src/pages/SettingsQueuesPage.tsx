
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  ListOrdered, 
  Plus, 
  Pencil, 
  Trash2, 
  Save, 
  Settings, 
  Users, 
  Clock, 
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Search,
  Filter
} from 'lucide-react';

const SettingsQueuesPage = () => {
  const { toast } = useToast();
  
  // Estados para filas
  const [queues, setQueues] = useState([
    { 
      id: 1, 
      name: 'Suporte Geral', 
      description: 'Atendimento geral de suporte', 
      priority: 1, 
      maxAgents: 5, 
      currentAgents: 3,
      waitingClients: 12,
      avgWaitTime: '3m 45s',
      maxWaitTime: 15,
      active: true,
      autoAssign: true,
      department: 'Suporte'
    },
    { 
      id: 2, 
      name: 'Vendas', 
      description: 'Atendimento de vendas e oportunidades', 
      priority: 2, 
      maxAgents: 8, 
      currentAgents: 6,
      waitingClients: 5,
      avgWaitTime: '1m 20s',
      maxWaitTime: 10,
      active: true,
      autoAssign: true,
      department: 'Comercial'
    },
    { 
      id: 3, 
      name: 'Suporte Técnico', 
      description: 'Questões técnicas especializadas', 
      priority: 3, 
      maxAgents: 3, 
      currentAgents: 2,
      waitingClients: 8,
      avgWaitTime: '5m 12s',
      maxWaitTime: 20,
      active: true,
      autoAssign: false,
      department: 'Técnico'
    },
    { 
      id: 4, 
      name: 'VIP', 
      description: 'Atendimento prioritário para clientes VIP', 
      priority: 0, 
      maxAgents: 2, 
      currentAgents: 1,
      waitingClients: 2,
      avgWaitTime: '0m 45s',
      maxWaitTime: 5,
      active: true,
      autoAssign: true,
      department: 'Especial'
    }
  ]);

  // Estados para regras de roteamento
  const [routingRules, setRoutingRules] = useState([
    { id: 1, name: 'Cliente VIP', condition: 'tag:VIP', action: 'Fila VIP', priority: 1, active: true },
    { id: 2, name: 'Horário Comercial', condition: 'time:09:00-18:00', action: 'Fila Vendas', priority: 2, active: true },
    { id: 3, name: 'Palavra-chave Técnica', condition: 'keyword:erro,bug,problema', action: 'Fila Técnica', priority: 3, active: true },
    { id: 4, name: 'Fora do Horário', condition: 'time:18:00-09:00', action: 'Fila Suporte', priority: 4, active: false }
  ]);

  // Estados para configurações globais
  const [globalSettings, setGlobalSettings] = useState({
    enableQueueRouting: true,
    maxQueueSize: 50,
    defaultQueue: 'Suporte Geral',
    redistributeOnOverflow: true,
    notifyOnLongWait: true,
    longWaitThreshold: 10,
    enablePriorityBoost: true,
    priorityBoostTime: 5
  });

  // Estados para formulários
  const [newQueue, setNewQueue] = useState({ 
    name: '', 
    description: '', 
    priority: 1, 
    maxAgents: 5, 
    maxWaitTime: 15,
    department: '',
    autoAssign: true 
  });
  const [newRule, setNewRule] = useState({ name: '', condition: '', action: '', priority: 1 });
  const [searchTerm, setSearchTerm] = useState('');

  const handleSaveQueue = () => {
    if (!newQueue.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome da fila é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    const queue = {
      id: Date.now(),
      ...newQueue,
      currentAgents: 0,
      waitingClients: 0,
      avgWaitTime: '0m 0s',
      active: true
    };

    setQueues(prev => [...prev, queue]);
    setNewQueue({ 
      name: '', 
      description: '', 
      priority: 1, 
      maxAgents: 5, 
      maxWaitTime: 15,
      department: '',
      autoAssign: true 
    });
    
    toast({
      title: "Fila criada",
      description: "Nova fila de atendimento foi adicionada com sucesso."
    });
  };

  const handleSaveRule = () => {
    if (!newRule.name.trim() || !newRule.condition.trim() || !newRule.action.trim()) {
      toast({
        title: "Erro",
        description: "Todos os campos da regra são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const rule = {
      id: Date.now(),
      ...newRule,
      active: true
    };

    setRoutingRules(prev => [...prev, rule]);
    setNewRule({ name: '', condition: '', action: '', priority: 1 });
    
    toast({
      title: "Regra criada",
      description: "Nova regra de roteamento foi adicionada com sucesso."
    });
  };

  const handleDeleteQueue = (id) => {
    setQueues(prev => prev.filter(queue => queue.id !== id));
    toast({
      title: "Fila removida",
      description: "Fila foi removida com sucesso."
    });
  };

  const handleDeleteRule = (id) => {
    setRoutingRules(prev => prev.filter(rule => rule.id !== id));
    toast({
      title: "Regra removida",
      description: "Regra foi removida com sucesso."
    });
  };

  const handleToggleQueueStatus = (id) => {
    setQueues(prev => prev.map(queue => 
      queue.id === id ? { ...queue, active: !queue.active } : queue
    ));
  };

  const handleToggleRuleStatus = (id) => {
    setRoutingRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, active: !rule.active } : rule
    ));
  };

  const handleMovePriority = (id, direction) => {
    const queueIndex = queues.findIndex(q => q.id === id);
    if (queueIndex === -1) return;

    const newQueues = [...queues];
    if (direction === 'up' && queueIndex > 0) {
      [newQueues[queueIndex], newQueues[queueIndex - 1]] = [newQueues[queueIndex - 1], newQueues[queueIndex]];
    } else if (direction === 'down' && queueIndex < newQueues.length - 1) {
      [newQueues[queueIndex], newQueues[queueIndex + 1]] = [newQueues[queueIndex + 1], newQueues[queueIndex]];
    }

    setQueues(newQueues);
  };

  const handleSaveGlobalSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "Configurações globais foram atualizadas com sucesso."
    });
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      0: { label: 'Máxima', class: 'bg-red-100 text-red-800' },
      1: { label: 'Alta', class: 'bg-orange-100 text-orange-800' },
      2: { label: 'Média', class: 'bg-yellow-100 text-yellow-800' },
      3: { label: 'Baixa', class: 'bg-green-100 text-green-800' }
    };
    return badges[priority] || badges[1];
  };

  // Filtrar filas
  const filteredQueues = queues.filter(queue => 
    queue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    queue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    queue.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ListOrdered className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Configurações - Filas de Atendimento</h1>
          </div>
          <p className="text-muted-foreground">
            Gerencie filas, regras de roteamento e configurações de distribuição de atendimentos.
          </p>
        </div>
      </div>

      <Tabs defaultValue="queues" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="queues" className="flex items-center gap-2">
            <ListOrdered className="w-4 h-4" />
            Filas
          </TabsTrigger>
          <TabsTrigger value="routing" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Roteamento
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        {/* Filas */}
        <TabsContent value="queues" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListOrdered className="w-5 h-5" />
                Filas de Atendimento
              </CardTitle>
              <CardDescription>
                Configure e gerencie filas para organizar e distribuir atendimentos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Formulário para nova fila */}
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 p-4 border rounded-lg">
                <div>
                  <Label htmlFor="queueName">Nome da Fila</Label>
                  <Input
                    id="queueName"
                    placeholder="Ex: Suporte, Vendas..."
                    value={newQueue.name}
                    onChange={(e) => setNewQueue(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="queueDescription">Descrição</Label>
                  <Input
                    id="queueDescription"
                    placeholder="Descrição da fila"
                    value={newQueue.description}
                    onChange={(e) => setNewQueue(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="queueDepartment">Departamento</Label>
                  <Input
                    id="queueDepartment"
                    placeholder="Ex: Comercial"
                    value={newQueue.department}
                    onChange={(e) => setNewQueue(prev => ({ ...prev, department: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="queuePriority">Prioridade</Label>
                  <Select value={newQueue.priority.toString()} onValueChange={(value) => setNewQueue(prev => ({ ...prev, priority: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Máxima</SelectItem>
                      <SelectItem value="1">Alta</SelectItem>
                      <SelectItem value="2">Média</SelectItem>
                      <SelectItem value="3">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="maxAgents">Máx. Agentes</Label>
                  <Input
                    id="maxAgents"
                    type="number"
                    min="1"
                    value={newQueue.maxAgents}
                    onChange={(e) => setNewQueue(prev => ({ ...prev, maxAgents: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxWaitTime">Tempo Máx. (min)</Label>
                  <Input
                    id="maxWaitTime"
                    type="number"
                    min="1"
                    value={newQueue.maxWaitTime}
                    onChange={(e) => setNewQueue(prev => ({ ...prev, maxWaitTime: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSaveQueue} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </div>

              {/* Busca */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar filas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Lista de filas */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Agentes</TableHead>
                    <TableHead>Fila</TableHead>
                    <TableHead>Tempo Médio</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQueues.map((queue) => {
                    const priorityBadge = getPriorityBadge(queue.priority);
                    return (
                      <TableRow key={queue.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{queue.name}</div>
                            <div className="text-sm text-muted-foreground">{queue.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>{queue.department}</TableCell>
                        <TableCell>
                          <Badge className={priorityBadge.class}>
                            {priorityBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {queue.currentAgents}/{queue.maxAgents}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {queue.waitingClients}
                          </div>
                        </TableCell>
                        <TableCell>{queue.avgWaitTime}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleQueueStatus(queue.id)}
                          >
                            {queue.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMovePriority(queue.id, 'up')}
                            >
                              <ArrowUp className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMovePriority(queue.id, 'down')}
                            >
                              <ArrowDown className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteQueue(queue.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
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

        {/* Regras de Roteamento */}
        <TabsContent value="routing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Regras de Roteamento
              </CardTitle>
              <CardDescription>
                Configure regras automáticas para direcionamento de atendimentos para filas específicas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Formulário para nova regra */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                <div>
                  <Label htmlFor="ruleName">Nome da Regra</Label>
                  <Input
                    id="ruleName"
                    placeholder="Ex: Cliente VIP"
                    value={newRule.name}
                    onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="ruleCondition">Condição</Label>
                  <Input
                    id="ruleCondition"
                    placeholder="Ex: tag:VIP, time:09:00-18:00"
                    value={newRule.condition}
                    onChange={(e) => setNewRule(prev => ({ ...prev, condition: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="ruleAction">Ação</Label>
                  <Select value={newRule.action} onValueChange={(value) => setNewRule(prev => ({ ...prev, action: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a fila..." />
                    </SelectTrigger>
                    <SelectContent>
                      {queues.map((queue) => (
                        <SelectItem key={queue.id} value={queue.name}>
                          {queue.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="rulePriority">Prioridade</Label>
                  <Input
                    id="rulePriority"
                    type="number"
                    min="1"
                    value={newRule.priority}
                    onChange={(e) => setNewRule(prev => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSaveRule} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </div>

              {/* Lista de regras */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Condição</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routingRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-2 py-1 rounded">{rule.condition}</code>
                      </TableCell>
                      <TableCell>{rule.action}</TableCell>
                      <TableCell>{rule.priority}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleRuleStatus(rule.id)}
                        >
                          {rule.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteRule(rule.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações Globais */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações Globais de Filas
              </CardTitle>
              <CardDescription>
                Configure comportamentos globais do sistema de filas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="maxQueueSize">Tamanho Máximo da Fila</Label>
                  <Input
                    id="maxQueueSize"
                    type="number"
                    min="1"
                    value={globalSettings.maxQueueSize}
                    onChange={(e) => setGlobalSettings(prev => ({ ...prev, maxQueueSize: parseInt(e.target.value) || 1 }))}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Número máximo de clientes aguardando em uma fila
                  </p>
                </div>
                <div>
                  <Label htmlFor="defaultQueue">Fila Padrão</Label>
                  <Select 
                    value={globalSettings.defaultQueue} 
                    onValueChange={(value) => setGlobalSettings(prev => ({ ...prev, defaultQueue: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {queues.map((queue) => (
                        <SelectItem key={queue.id} value={queue.name}>
                          {queue.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    Fila padrão quando nenhuma regra se aplicar
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="longWaitThreshold">Limite de Espera Longa (min)</Label>
                  <Input
                    id="longWaitThreshold"
                    type="number"
                    min="1"
                    value={globalSettings.longWaitThreshold}
                    onChange={(e) => setGlobalSettings(prev => ({ ...prev, longWaitThreshold: parseInt(e.target.value) || 1 }))}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Tempo para considerar espera como longa
                  </p>
                </div>
                <div>
                  <Label htmlFor="priorityBoostTime">Tempo para Aumento de Prioridade (min)</Label>
                  <Input
                    id="priorityBoostTime"
                    type="number"
                    min="1"
                    value={globalSettings.priorityBoostTime}
                    onChange={(e) => setGlobalSettings(prev => ({ ...prev, priorityBoostTime: parseInt(e.target.value) || 1 }))}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Tempo para aumentar automaticamente a prioridade
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableQueueRouting">Habilitar Roteamento de Filas</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir roteamento automático baseado em regras
                    </p>
                  </div>
                  <Switch
                    id="enableQueueRouting"
                    checked={globalSettings.enableQueueRouting}
                    onCheckedChange={(checked) => setGlobalSettings(prev => ({ ...prev, enableQueueRouting: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="redistributeOnOverflow">Redistribuir em Sobrecarga</Label>
                    <p className="text-sm text-muted-foreground">
                      Redistribuir clientes quando fila atingir limite máximo
                    </p>
                  </div>
                  <Switch
                    id="redistributeOnOverflow"
                    checked={globalSettings.redistributeOnOverflow}
                    onCheckedChange={(checked) => setGlobalSettings(prev => ({ ...prev, redistributeOnOverflow: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifyOnLongWait">Notificar em Espera Longa</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar notificação quando espera exceder limite
                    </p>
                  </div>
                  <Switch
                    id="notifyOnLongWait"
                    checked={globalSettings.notifyOnLongWait}
                    onCheckedChange={(checked) => setGlobalSettings(prev => ({ ...prev, notifyOnLongWait: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enablePriorityBoost">Aumento Automático de Prioridade</Label>
                    <p className="text-sm text-muted-foreground">
                      Aumentar prioridade de clientes em espera longa
                    </p>
                  </div>
                  <Switch
                    id="enablePriorityBoost"
                    checked={globalSettings.enablePriorityBoost}
                    onCheckedChange={(checked) => setGlobalSettings(prev => ({ ...prev, enablePriorityBoost: checked }))}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveGlobalSettings}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsQueuesPage;
