
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
  UserPlus,
  Search,
  Filter,
  Settings,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

// Mock data for users
const mockUsers = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@empresa.com",
    phone: "(11) 99999-9999",
    role: "Administrador",
    department: "TI",
    status: "active",
    lastLogin: "2024-01-15 14:30",
    createdAt: "2023-06-15",
    permissions: ["full_access", "user_management", "reports"],
    isActive: true,
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria.santos@empresa.com",
    phone: "(11) 88888-8888",
    role: "Supervisor",
    department: "Atendimento",
    status: "active",
    lastLogin: "2024-01-15 12:15",
    createdAt: "2023-08-20",
    permissions: ["view_reports", "manage_agents"],
    isActive: true,
  },
  {
    id: 3,
    name: "Pedro Costa",
    email: "pedro.costa@empresa.com",
    phone: "(11) 77777-7777",
    role: "Usuário",
    department: "Vendas",
    status: "inactive",
    lastLogin: "2024-01-10 09:45",
    createdAt: "2023-09-12",
    permissions: ["view_only"],
    isActive: false,
  },
  {
    id: 4,
    name: "Ana Oliveira",
    email: "ana.oliveira@empresa.com",
    phone: "(11) 66666-6666",
    role: "Supervisor",
    department: "Suporte",
    status: "pending",
    lastLogin: "Nunca logou",
    createdAt: "2024-01-14",
    permissions: ["view_reports", "manage_tickets"],
    isActive: true,
  },
];

const AccessUsersPage = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role.toLowerCase().includes(filterRole.toLowerCase());
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    const matchesDepartment = filterDepartment === "all" || user.department === filterDepartment;
    
    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });

  const handleToggleStatus = (userId: number) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive, status: user.isActive ? "inactive" : "active" } : user
    ));
    toast.success("Status do usuário atualizado com sucesso!");
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    toast.success("Usuário removido com sucesso!");
  };

  const handleSendInvite = (userId: number) => {
    toast.success("Convite enviado por email!");
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
    };
    const labels = {
      active: "Ativo",
      inactive: "Inativo",
      pending: "Pendente",
    };
    return <Badge className={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      "Administrador": "bg-red-100 text-red-800",
      "Supervisor": "bg-blue-100 text-blue-800",
      "Usuário": "bg-purple-100 text-purple-800",
    };
    return <Badge className={variants[role as keyof typeof variants]}>{role}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie contas de usuário, permissões e acesso ao sistema
          </p>
        </div>
        <Button onClick={() => setIsNewUserDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {users.filter(u => u.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.role === "Administrador").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="roles">Funções</TabsTrigger>
          <TabsTrigger value="departments">Departamentos</TabsTrigger>
          <TabsTrigger value="activity">Atividade</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Usuários</CardTitle>
              <CardDescription>
                Gerencie contas de usuário e suas permissões
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar usuários..."
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
                    <SelectItem value="administrador">Administrador</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="usuário">Usuário</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="TI">TI</SelectItem>
                    <SelectItem value="Atendimento">Atendimento</SelectItem>
                    <SelectItem value="Vendas">Vendas</SelectItem>
                    <SelectItem value="Suporte">Suporte</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Users Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Último Login</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                          <div className="text-sm text-muted-foreground">{user.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(user.id)}
                          >
                            {user.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          {user.status === "pending" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSendInvite(user.id)}
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Funções e Permissões</CardTitle>
              <CardDescription>
                Configure as funções de usuário e suas permissões
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Administrador</CardTitle>
                    <CardDescription>Acesso completo ao sistema</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="admin-full" defaultChecked />
                      <Label htmlFor="admin-full">Acesso total</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="admin-users" defaultChecked />
                      <Label htmlFor="admin-users">Gerenciar usuários</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="admin-config" defaultChecked />
                      <Label htmlFor="admin-config">Configurações</Label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Supervisor</CardTitle>
                    <CardDescription>Gerenciamento de equipe</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="super-reports" defaultChecked />
                      <Label htmlFor="super-reports">Visualizar relatórios</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="super-team" defaultChecked />
                      <Label htmlFor="super-team">Gerenciar equipe</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="super-export" />
                      <Label htmlFor="super-export">Exportar dados</Label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Usuário</CardTitle>
                    <CardDescription>Acesso básico</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="user-view" defaultChecked />
                      <Label htmlFor="user-view">Visualizar dados</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="user-profile" defaultChecked />
                      <Label htmlFor="user-profile">Editar perfil</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="user-basic" defaultChecked />
                      <Label htmlFor="user-basic">Funcionalidades básicas</Label>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Button>Salvar Configurações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Departamentos</CardTitle>
              <CardDescription>
                Gerencie os departamentos da organização
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Usuários</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">TI</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>Tecnologia da Informação</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Atendimento</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>Atendimento ao Cliente</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Vendas</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>Equipe de Vendas</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Suporte</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>Suporte Técnico</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Log de Atividades</CardTitle>
              <CardDescription>
                Histórico de atividades dos usuários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Detalhes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>15/01/2024 14:30</TableCell>
                    <TableCell>João Silva</TableCell>
                    <TableCell>Login</TableCell>
                    <TableCell>Login realizado com sucesso</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>15/01/2024 14:25</TableCell>
                    <TableCell>Sistema</TableCell>
                    <TableCell>Usuário criado</TableCell>
                    <TableCell>Ana Oliveira adicionada ao sistema</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>15/01/2024 12:15</TableCell>
                    <TableCell>Maria Santos</TableCell>
                    <TableCell>Logout</TableCell>
                    <TableCell>Sessão encerrada</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Edite as informações e permissões do usuário {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input defaultValue={selectedUser?.name} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue={selectedUser?.email} />
            </div>
            <div className="space-y-2">
              <Label>Função</Label>
              <Select defaultValue={selectedUser?.role.toLowerCase()}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usuário">Usuário</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="administrador">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Departamento</Label>
              <Select defaultValue={selectedUser?.department}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TI">TI</SelectItem>
                  <SelectItem value="Atendimento">Atendimento</SelectItem>
                  <SelectItem value="Vendas">Vendas</SelectItem>
                  <SelectItem value="Suporte">Suporte</SelectItem>
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
              toast.success("Usuário atualizado com sucesso!");
            }}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New User Dialog */}
      <Dialog open={isNewUserDialogOpen} onOpenChange={setIsNewUserDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Usuário</DialogTitle>
            <DialogDescription>
              Crie uma nova conta de usuário no sistema
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input placeholder="Digite o nome completo" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input placeholder="Digite o email" type="email" />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input placeholder="(11) 99999-9999" />
            </div>
            <div className="space-y-2">
              <Label>Função</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usuário">Usuário</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="administrador">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Departamento</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TI">TI</SelectItem>
                  <SelectItem value="Atendimento">Atendimento</SelectItem>
                  <SelectItem value="Vendas">Vendas</SelectItem>
                  <SelectItem value="Suporte">Suporte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="send-invite" defaultChecked />
              <Label htmlFor="send-invite">Enviar convite por email</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewUserDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              setIsNewUserDialogOpen(false);
              toast.success("Usuário criado com sucesso!");
            }}>
              Criar Usuário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccessUsersPage;
