
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Users,
  Shield,
  Key,
  Clock,
  Search,
  Filter,
  UserPlus,
  Settings,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

// Mock data for agents
const mockAgents = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@empresa.com",
    role: "Supervisor",
    status: "online",
    lastAccess: "2024-01-15 14:30",
    permissions: ["read", "write", "delete", "admin"],
    isBlocked: false,
    loginAttempts: 0,
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria.santos@empresa.com",
    role: "Agente",
    status: "offline",
    lastAccess: "2024-01-15 12:15",
    permissions: ["read", "write"],
    isBlocked: false,
    loginAttempts: 1,
  },
  {
    id: 3,
    name: "Pedro Costa",
    email: "pedro.costa@empresa.com",
    role: "Agente",
    status: "away",
    lastAccess: "2024-01-15 13:45",
    permissions: ["read"],
    isBlocked: true,
    loginAttempts: 3,
  },
];

const AccessAgentsPage = () => {
  const [agents, setAgents] = useState(mockAgents);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || agent.role.toLowerCase() === filterRole;
    const matchesStatus = filterStatus === "all" || agent.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleAccess = (agentId: number) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId ? { ...agent, isBlocked: !agent.isBlocked } : agent
    ));
    toast.success("Status de acesso atualizado com sucesso!");
  };

  const handleResetPassword = (agentId: number) => {
    toast.success("Email de redefinição de senha enviado!");
  };

  const handleUpdatePermissions = (agentId: number, permissions: string[]) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId ? { ...agent, permissions } : agent
    ));
    toast.success("Permissões atualizadas com sucesso!");
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      online: "bg-green-100 text-green-800",
      offline: "bg-gray-100 text-gray-800",
      away: "bg-yellow-100 text-yellow-800",
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      "Supervisor": "bg-blue-100 text-blue-800",
      "Agente": "bg-purple-100 text-purple-800",
      "Admin": "bg-red-100 text-red-800",
    };
    return <Badge className={variants[role as keyof typeof variants]}>{role}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Acesso de Agentes</h1>
          <p className="text-muted-foreground">
            Gerencie permissões e controle de acesso dos agentes
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Agente
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Agentes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {agents.filter(a => a.status === "online").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bloqueados</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {agents.filter(a => a.isBlocked).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tentativas Falhas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {agents.reduce((sum, a) => sum + a.loginAttempts, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="agents">Agentes</TabsTrigger>
          <TabsTrigger value="permissions">Permissões</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="audit">Auditoria</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Agentes</CardTitle>
              <CardDescription>
                Gerencie o acesso e permissões de todos os agentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar agentes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="agente">Agente</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="away">Ausente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Agents Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agente</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Último Acesso</TableHead>
                    <TableHead>Permissões</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAgents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div>
                            <div className="font-medium">{agent.name}</div>
                            <div className="text-sm text-muted-foreground">{agent.email}</div>
                          </div>
                          {agent.isBlocked && (
                            <Lock className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(agent.role)}</TableCell>
                      <TableCell>{getStatusBadge(agent.status)}</TableCell>
                      <TableCell>{agent.lastAccess}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {agent.permissions.map((perm) => (
                            <Badge key={perm} variant="outline" className="text-xs">
                              {perm}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedAgent(agent);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleAccess(agent.id)}
                          >
                            {agent.isBlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleResetPassword(agent.id)}
                          >
                            <Key className="h-4 w-4" />
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

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Permissões</CardTitle>
              <CardDescription>
                Configure os níveis de permissão por função
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Agente</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="agent-read" defaultChecked />
                      <Label htmlFor="agent-read">Visualizar atendimentos</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="agent-write" defaultChecked />
                      <Label htmlFor="agent-write">Criar atendimentos</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="agent-update" />
                      <Label htmlFor="agent-update">Editar configurações</Label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Supervisor</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="super-read" defaultChecked />
                      <Label htmlFor="super-read">Visualizar relatórios</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="super-manage" defaultChecked />
                      <Label htmlFor="super-manage">Gerenciar agentes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="super-export" defaultChecked />
                      <Label htmlFor="super-export">Exportar dados</Label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Administrador</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="admin-full" defaultChecked />
                      <Label htmlFor="admin-full">Acesso completo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="admin-config" defaultChecked />
                      <Label htmlFor="admin-config">Configurar sistema</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="admin-audit" defaultChecked />
                      <Label htmlFor="admin-audit">Visualizar auditoria</Label>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Button>Salvar Configurações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Políticas de Segurança</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="require-2fa">Exigir autenticação em duas etapas</Label>
                  <Switch id="require-2fa" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password-expire">Expiração de senha (90 dias)</Label>
                  <Switch id="password-expire" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-logout">Logout automático (inatividade)</Label>
                  <Switch id="auto-logout" defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Máximo de tentativas de login</Label>
                  <Select defaultValue="3">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 tentativas</SelectItem>
                      <SelectItem value="5">5 tentativas</SelectItem>
                      <SelectItem value="10">10 tentativas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações de Sessão</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Duração da sessão</Label>
                  <Select defaultValue="8">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 horas</SelectItem>
                      <SelectItem value="4">4 horas</SelectItem>
                      <SelectItem value="8">8 horas</SelectItem>
                      <SelectItem value="24">24 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tempo de inatividade até logout</Label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="120">2 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="concurrent-sessions">Permitir sessões simultâneas</Label>
                  <Switch id="concurrent-sessions" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Log de Atividades de Acesso</CardTitle>
              <CardDescription>
                Histórico detalhado das atividades de acesso dos agentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Agente</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>15/01/2024 14:30</TableCell>
                    <TableCell>João Silva</TableCell>
                    <TableCell>Login</TableCell>
                    <TableCell>192.168.1.100</TableCell>
                    <TableCell><Badge className="bg-green-100 text-green-800">Sucesso</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>15/01/2024 14:25</TableCell>
                    <TableCell>Maria Santos</TableCell>
                    <TableCell>Tentativa de login</TableCell>
                    <TableCell>192.168.1.105</TableCell>
                    <TableCell><Badge className="bg-red-100 text-red-800">Falha</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>15/01/2024 13:45</TableCell>
                    <TableCell>Pedro Costa</TableCell>
                    <TableCell>Logout</TableCell>
                    <TableCell>192.168.1.110</TableCell>
                    <TableCell><Badge className="bg-green-100 text-green-800">Sucesso</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Agent Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Permissões do Agente</DialogTitle>
            <DialogDescription>
              Configure as permissões de acesso para {selectedAgent?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Permissões</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="edit-read" defaultChecked />
                  <Label htmlFor="edit-read">Leitura</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="edit-write" />
                  <Label htmlFor="edit-write">Escrita</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="edit-delete" />
                  <Label htmlFor="edit-delete">Exclusão</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="edit-admin" />
                  <Label htmlFor="edit-admin">Administração</Label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Função</Label>
              <Select defaultValue={selectedAgent?.role.toLowerCase()}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agente">Agente</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              setIsEditDialogOpen(false);
              toast.success("Permissões atualizadas com sucesso!");
            }}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccessAgentsPage;
