
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
import { Timer, Plus, Edit, Trash2, Search, Filter, Download, AlertTriangle, Clock, Target, TrendingUp } from "lucide-react";

export default function SettingsSLAsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const slas = [
    { 
      id: 1, 
      name: "Suporte Crítico", 
      category: "Crítico", 
      firstResponse: 15, 
      resolution: 120, 
      escalation: 60,
      active: true,
      compliance: 95
    },
    { 
      id: 2, 
      name: "Suporte Alto", 
      category: "Alto", 
      firstResponse: 30, 
      resolution: 240, 
      escalation: 120,
      active: true,
      compliance: 88
    },
    { 
      id: 3, 
      name: "Suporte Médio", 
      category: "Médio", 
      firstResponse: 60, 
      resolution: 480, 
      escalation: 240,
      active: true,
      compliance: 92
    },
    { 
      id: 4, 
      name: "Suporte Baixo", 
      category: "Baixo", 
      firstResponse: 120, 
      resolution: 720, 
      escalation: 360,
      active: true,
      compliance: 89
    },
  ];

  const violations = [
    { id: 1, ticket: "#12345", agent: "João Silva", sla: "Suporte Crítico", violation: "Primeira Resposta", delay: "25 min" },
    { id: 2, ticket: "#12346", agent: "Maria Santos", sla: "Suporte Alto", violation: "Resolução", delay: "2.5 horas" },
    { id: 3, ticket: "#12347", agent: "Pedro Costa", sla: "Suporte Médio", violation: "Escalação", delay: "45 min" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Timer className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Configurações - SLAs</h1>
          </div>
          <p className="text-muted-foreground">
            Gerencie Service Level Agreements e tempos de resposta
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
                Novo SLA
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Novo SLA</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sla-name">Nome do SLA</Label>
                  <Input id="sla-name" placeholder="Nome do SLA" />
                </div>
                <div>
                  <Label htmlFor="sla-category">Categoria</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critico">Crítico</SelectItem>
                      <SelectItem value="alto">Alto</SelectItem>
                      <SelectItem value="medio">Médio</SelectItem>
                      <SelectItem value="baixo">Baixo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="first-response">Primeira Resposta (minutos)</Label>
                  <Input id="first-response" type="number" placeholder="15" />
                </div>
                <div>
                  <Label htmlFor="resolution">Resolução (minutos)</Label>
                  <Input id="resolution" type="number" placeholder="120" />
                </div>
                <div>
                  <Label htmlFor="escalation">Escalação (minutos)</Label>
                  <Input id="escalation" type="number" placeholder="60" />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea id="description" placeholder="Descrição do SLA..." />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="sla-active" defaultChecked />
                  <Label htmlFor="sla-active">Ativo</Label>
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

      <Tabs defaultValue="slas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="slas">SLAs</TabsTrigger>
          <TabsTrigger value="violations">Violações</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="slas" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Buscar SLAs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    <SelectItem value="critico">Crítico</SelectItem>
                    <SelectItem value="alto">Alto</SelectItem>
                    <SelectItem value="medio">Médio</SelectItem>
                    <SelectItem value="baixo">Baixo</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabela de SLAs */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de SLAs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>1ª Resposta</TableHead>
                    <TableHead>Resolução</TableHead>
                    <TableHead>Escalação</TableHead>
                    <TableHead>Compliance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {slas.map((sla) => (
                    <TableRow key={sla.id}>
                      <TableCell className="font-medium">{sla.name}</TableCell>
                      <TableCell>
                        <Badge variant={sla.category === "Crítico" ? "destructive" : "secondary"}>
                          {sla.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{sla.firstResponse} min</TableCell>
                      <TableCell>{sla.resolution} min</TableCell>
                      <TableCell>{sla.escalation} min</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className={sla.compliance >= 90 ? "text-green-600" : "text-red-600"}>
                            {sla.compliance}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={sla.active ? "default" : "secondary"}>
                          {sla.active ? "Ativo" : "Inativo"}
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

        <TabsContent value="violations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Violações de SLA</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket</TableHead>
                    <TableHead>Agente</TableHead>
                    <TableHead>SLA</TableHead>
                    <TableHead>Tipo de Violação</TableHead>
                    <TableHead>Atraso</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {violations.map((violation) => (
                    <TableRow key={violation.id}>
                      <TableCell className="font-medium">{violation.ticket}</TableCell>
                      <TableCell>{violation.agent}</TableCell>
                      <TableCell>{violation.sla}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">{violation.violation}</Badge>
                      </TableCell>
                      <TableCell className="text-red-600">{violation.delay}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Compliance Geral</p>
                    <p className="text-2xl font-bold text-green-600">91%</p>
                  </div>
                  <Target className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Violações Hoje</p>
                    <p className="text-2xl font-bold text-red-600">8</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tempo Médio Resposta</p>
                    <p className="text-2xl font-bold">18 min</p>
                  </div>
                  <Clock className="w-8 h-8 text-muted-foreground" />
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
                  <Label htmlFor="auto-escalation">Escalação Automática</Label>
                  <p className="text-sm text-muted-foreground">
                    Escalar automaticamente quando SLA for violado
                  </p>
                </div>
                <Switch id="auto-escalation" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Notificações</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar notificações antes de vencer SLA
                  </p>
                </div>
                <Switch id="notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekend-count">Contar Fins de Semana</Label>
                  <p className="text-sm text-muted-foreground">
                    Incluir fins de semana no cálculo de SLA
                  </p>
                </div>
                <Switch id="weekend-count" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
