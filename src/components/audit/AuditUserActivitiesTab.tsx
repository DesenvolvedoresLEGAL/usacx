import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import { Icons } from "@/components/icons";
import { DateRange } from "react-day-picker";

interface UserActivity {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target: string;
  changes?: string;
  category: "user" | "role" | "permission" | "team";
}

const mockActivities: UserActivity[] = [
  {
    id: "1",
    timestamp: "2024-01-15 15:30:00",
    user: "admin@empresa.com",
    action: "Criou usuário",
    target: "novo.agente@empresa.com",
    category: "user"
  },
  {
    id: "2",
    timestamp: "2024-01-15 15:25:00",
    user: "admin@empresa.com",
    action: "Alterou permissões",
    target: "agente01@empresa.com",
    changes: "Adicionou: reports:view_all",
    category: "permission"
  },
  {
    id: "3",
    timestamp: "2024-01-15 15:20:00",
    user: "manager@empresa.com",
    action: "Editou time",
    target: "Time Vendas",
    changes: "Adicionou 2 membros",
    category: "team"
  },
  {
    id: "4",
    timestamp: "2024-01-15 15:15:00",
    user: "admin@empresa.com",
    action: "Alterou role",
    target: "supervisor@empresa.com",
    changes: "De 'agent' para 'manager'",
    category: "role"
  }
];

export const AuditUserActivitiesTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedUser, setSelectedUser] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [activities] = useState<UserActivity[]>(mockActivities);

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = searchTerm === "" || 
      activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || activity.category === selectedCategory;
    const matchesUser = selectedUser === "all" || activity.user === selectedUser;

    return matchesSearch && matchesCategory && matchesUser;
  });

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "user":
        return { variant: "default" as const, label: "Usuário", icon: Icons.users };
      case "role":
        return { variant: "secondary" as const, label: "Role", icon: Icons.userCog };
      case "permission":
        return { variant: "outline" as const, label: "Permissão", icon: Icons.shieldCheck };
      case "team":
        return { variant: "outline" as const, label: "Time", icon: Icons.users2 };
      default:
        return { variant: "outline" as const, label: category, icon: Icons.info };
    }
  };

  const exportActivities = () => {
    console.log("Exportando atividades de usuários...");
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Atividades</CardTitle>
            <Icons.history className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Modificados</CardTitle>
            <Icons.users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">
              Criações e edições
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alterações de Permissão</CardTitle>
            <Icons.shieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              Últimos 7 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mudanças de Role</CardTitle>
            <Icons.userCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">
              Promoções e alterações
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ações */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={exportActivities}>
          <Icons.download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtre as atividades administrativas por categoria, usuário ou período
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Input
                placeholder="Buscar por usuário ou ação..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                <SelectItem value="user">Usuários</SelectItem>
                <SelectItem value="role">Roles</SelectItem>
                <SelectItem value="permission">Permissões</SelectItem>
                <SelectItem value="team">Times</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Administrador" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os admins</SelectItem>
                <SelectItem value="admin@empresa.com">admin@empresa.com</SelectItem>
                <SelectItem value="manager@empresa.com">manager@empresa.com</SelectItem>
              </SelectContent>
            </Select>

            <CalendarDateRangePicker
              value={dateRange}
              onChange={setDateRange}
              className="lg:col-span-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Atividades */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades de Usuários</CardTitle>
          <CardDescription>
            {filteredActivities.length} atividades encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Administrador</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Alvo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Alterações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.map((activity) => {
                  const categoryBadge = getCategoryBadge(activity.category);
                  const CategoryIcon = categoryBadge.icon;
                  
                  return (
                    <TableRow key={activity.id}>
                      <TableCell className="font-mono text-sm">
                        {activity.timestamp}
                      </TableCell>
                      <TableCell className="font-medium">
                        {activity.user}
                      </TableCell>
                      <TableCell>{activity.action}</TableCell>
                      <TableCell className="font-medium">
                        {activity.target}
                      </TableCell>
                      <TableCell>
                        <Badge variant={categoryBadge.variant}>
                          <CategoryIcon className="mr-1 h-3 w-3" />
                          {categoryBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {activity.changes || "-"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredActivities.length === 0 && (
            <div className="text-center py-8">
              <Icons.history className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">Nenhuma atividade encontrada</h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros para ver mais resultados.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
