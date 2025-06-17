
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Plus, Edit, Trash2, Search, Filter, Download, ArrowUp, ArrowDown, ChevronUp } from "lucide-react";

export default function SettingsPrioritiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const priorities = [
    { 
      id: 1, 
      name: "Crítica", 
      level: 1, 
      color: "#EF4444", 
      description: "Problemas que afetam a operação crítica", 
      autoAssign: true,
      slaHours: 1,
      active: true
    },
    { 
      id: 2, 
      name: "Alta", 
      level: 2, 
      color: "#F59E0B", 
      description: "Problemas importantes que precisam de atenção rápida", 
      autoAssign: true,
      slaHours: 4,
      active: true
    },
    { 
      id: 3, 
      name: "Média", 
      level: 3, 
      color: "#10B981", 
      description: "Problemas padrão do dia a dia", 
      autoAssign: false,
      slaHours: 24,
      active: true
    },
    { 
      id: 4, 
      name: "Baixa", 
      level: 4, 
      color: "#6B7280", 
      description: "Questões não urgentes", 
      autoAssign: false,
      slaHours: 72,
      active: true
    },
  ];

  const rules = [
    { id: 1, name: "Palavra-chave 'urgente'", condition: "Contém 'urgente'", priority: "Alta", active: true },
    { id: 2, name: "Cliente VIP", condition: "Cliente tem tag VIP", priority: "Crítica", active: true },
    { id: 3, name: "Falha no sistema", condition: "Contém 'erro' ou 'falha'", priority: "Alta", active: true },
    { id: 4, name: "Dúvida simples", condition: "Contém 'como fazer'", priority: "Baixa", active: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Configurações - Prioridades</h1>
          </div>
          <p className="text-muted-foreground">
            Gerencie níveis de prioridade e regras de atribuição automática
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Prioridade
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Nova Prioridade</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="priority-name">Nome da Prioridade</Label>
                  <Input id="priority-name" placeholder="Nome da prioridade" />
                </div>
                <div>
                  <Label htmlFor="priority-level">Nível (1-10)</Label>
                  <Input id="priority-level" type="number" min="1" max="10" placeholder="5" />
                </div>
                <div>
                  <Label htmlFor="priority-color">Cor</Label>
                  <Input id="priority-color" type="color" defaultValue="#10B981" />
                </div>
                <div>
                  <Label htmlFor="sla-hours">SLA (horas)</Label>
                  <Input id="sla-hours" type="number" placeholder="24" />
                </div>
                <div>
                  <Label htmlFor="priority-description">Descrição</Label>
                  <Textarea id="priority-description" placeholder="Descrição da prioridade..." />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="auto-assign" />
                  <Label htmlFor="auto-assign">Atribuição Automática</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="priority-active" defaultChecked />
                  <Label htmlFor="priority-active">Ativa</Label>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">Salvar</Button>
                  <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="priorities" className="space-y-4">
        <TabsList>
          <TabsTrigger value="priorities">Prioridades</TabsTrigger>
          <TabsTrigger value="rules">Regras</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="priorities" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Buscar prioridades..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os níveis</SelectItem>
                    <SelectItem value="1-2">Crítica/Alta (1-2)</SelectItem>
                    <SelectItem value="3-4">Média/Baixa (3-4)</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabela de Prioridades */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Prioridades</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Nível</TableHead>
                    <TableHead>SLA</TableHead>
                    <TableHead>Auto-atribuição</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {priorities.map((priority) => (
                    <TableRow key={priority.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: priority.color }}
                          />
                          <span className="font-medium">{priority.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {priority.level <= 2 ? (
                            <ChevronUp className="w-4 h-4 text-red-500" />
                          ) : (
                            <ArrowDown className="w-4 h-4 text-gray-500" />
                          )}
                          {priority.level}
                        </div>
                      </TableCell>
                      <TableCell>{priority.slaHours}h</TableCell>
                      <TableCell>
                        <Badge variant={priority.autoAssign ? "default" : "secondary"}>
                          {priority.autoAssign ? "Sim" : "Não"}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{priority.description}</TableCell>
                      <TableCell>
                        <Badge variant={priority.active ? "default" : "secondary"}>
                          {priority.active ? "Ativa" : "Inativa"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <ArrowDown className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
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

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Regras de Prioridade</CardTitle>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Regra
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome da Regra</TableHead>
                    <TableHead>Condição</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>{rule.condition}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{rule.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={rule.active ? "default" : "secondary"}>
                          {rule.active ? "Ativa" : "Inativa"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
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

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Crítica</p>
                    <p className="text-2xl font-bold text-red-600">12</p>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Alta</p>
                    <p className="text-2xl font-bold text-orange-600">28</p>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Média</p>
                    <p className="text-2xl font-bold text-green-600">156</p>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Baixa</p>
                    <p className="text-2xl font-bold text-gray-600">89</p>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-gray-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-priority">Prioridade Automática</Label>
                  <p className="text-sm text-muted-foreground">
                    Definir prioridade automaticamente baseada em regras
                  </p>
                </div>
                <Switch id="auto-priority" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="escalate-high">Escalação Automática</Label>
                  <p className="text-sm text-muted-foreground">
                    Escalar prioridades altas automaticamente
                  </p>
                </div>
                <Switch id="escalate-high" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notify-critical">Notificar Críticas</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificar imediatamente sobre prioridades críticas
                  </p>
                </div>
                <Switch id="notify-critical" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
