import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ListOrdered, Plus, Trash2, Eye, EyeOff, Search, Users, Clock, Loader2 } from 'lucide-react';
import { useQueuesSettings } from '@/hooks/useQueuesSettings';

const SettingsQueuesPage = () => {
  const { queues, isLoading, createQueue, deleteQueue, toggleQueueStatus } = useQueuesSettings();
  
  const [newQueue, setNewQueue] = useState({ 
    name: '', 
    description: '', 
    priority: 1, 
    max_queue_size: 50
  });
  const [searchTerm, setSearchTerm] = useState('');

  const handleSaveQueue = async () => {
    if (!newQueue.name.trim()) return;

    try {
      await createQueue({
        name: newQueue.name,
        description: newQueue.description,
        priority: newQueue.priority,
        max_queue_size: newQueue.max_queue_size,
      });
      setNewQueue({ 
        name: '', 
        description: '', 
        priority: 1, 
        max_queue_size: 50
      });
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDeleteQueue = async (id: string) => {
    try {
      await deleteQueue(id);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleQueueStatus(id);
    } catch (error) {
      // Error handled in hook
    }
  };

  const getPriorityBadge = (priority: number) => {
    const badges: Record<number, { label: string; class: string }> = {
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
    (queue.description && queue.description.toLowerCase().includes(searchTerm.toLowerCase()))
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
            Gerencie filas para organizar e distribuir atendimentos.
          </p>
        </div>
      </div>

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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
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
              <Label htmlFor="maxQueueSize">Tamanho Máx.</Label>
              <Input
                id="maxQueueSize"
                type="number"
                min="1"
                value={newQueue.max_queue_size}
                onChange={(e) => setNewQueue(prev => ({ ...prev, max_queue_size: parseInt(e.target.value) || 50 }))}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSaveQueue} className="w-full" disabled={!newQueue.name.trim()}>
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
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Aguardando</TableHead>
                  <TableHead>Agentes Online</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQueues.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Nenhuma fila encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQueues.map((queue) => {
                    const priorityBadge = getPriorityBadge(queue.priority);
                    return (
                      <TableRow key={queue.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{queue.name}</div>
                            <div className="text-sm text-muted-foreground">{queue.description || '-'}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={priorityBadge.class}>
                            {priorityBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            {queue.waiting_count || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            {queue.active_agents || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(queue.id)}
                          >
                            {queue.is_active ? (
                              <Eye className="w-4 h-4 text-green-600" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-muted-foreground" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
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
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsQueuesPage;
