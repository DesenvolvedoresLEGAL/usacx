import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import { Icons } from "@/components/icons";
import { DateRange } from "react-day-picker";
import { logger } from "@/lib/logger";

interface AccessLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  status: "success" | "failed" | "blocked";
  details?: string;
}

const mockLogs: AccessLog[] = [
  {
    id: "1",
    timestamp: "2024-01-15 14:30:25",
    user: "admin@empresa.com",
    action: "Login",
    resource: "/dashboard",
    ipAddress: "192.168.1.100",
    userAgent: "Chrome 120.0.0.0",
    status: "success"
  },
  {
    id: "2",
    timestamp: "2024-01-15 14:25:10",
    user: "agente01@empresa.com",
    action: "View",
    resource: "/gestao/atendimentos",
    ipAddress: "192.168.1.101",
    userAgent: "Firefox 121.0.0.0",
    status: "success"
  },
  {
    id: "3",
    timestamp: "2024-01-15 14:20:45",
    user: "supervisor@empresa.com",
    action: "Update",
    resource: "/configuracoes/agentes",
    ipAddress: "192.168.1.102",
    userAgent: "Chrome 120.0.0.0",
    status: "success"
  },
  {
    id: "4",
    timestamp: "2024-01-15 14:15:30",
    user: "usuario@empresa.com",
    action: "Login",
    resource: "/login",
    ipAddress: "10.0.0.50",
    userAgent: "Safari 17.2.1",
    status: "failed",
    details: "Senha incorreta"
  },
  {
    id: "5",
    timestamp: "2024-01-15 14:10:15",
    user: "malicious@external.com",
    action: "Login",
    resource: "/login",
    ipAddress: "203.0.113.45",
    userAgent: "curl/7.68.0",
    status: "blocked",
    details: "IP bloqueado por tentativas suspeitas"
  }
];

export const AuditAccessLogsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState("all");
  const [selectedAction, setSelectedAction] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [logs] = useState<AccessLog[]>(mockLogs);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === "" || 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm);
    
    const matchesUser = selectedUser === "all" || log.user === selectedUser;
    const matchesAction = selectedAction === "all" || log.action === selectedAction;
    const matchesStatus = selectedStatus === "all" || log.status === selectedStatus;

    return matchesSearch && matchesUser && matchesAction && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "success":
        return "default";
      case "failed":
        return "destructive";
      case "blocked":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      case "blocked":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  const exportLogs = () => {
    logger.info("Exportando logs de acesso...");
  };

  const clearLogs = () => {
    logger.info("Limpando logs antigos...");
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Acessos</CardTitle>
            <Icons.history className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acessos com Sucesso</CardTitle>
            <Icons.shieldCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">1,180</div>
            <p className="text-xs text-muted-foreground">
              95.6% de taxa de sucesso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tentativas Falharam</CardTitle>
            <Icons.alertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">39</div>
            <p className="text-xs text-muted-foreground">
              3.2% de tentativas falharam
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IPs Bloqueados</CardTitle>
            <Icons.xOctagon className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">15</div>
            <p className="text-xs text-muted-foreground">
              +3 novos bloqueios hoje
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ações */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={exportLogs}>
          <Icons.download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
        <Button variant="outline" onClick={clearLogs}>
          <Icons.history className="mr-2 h-4 w-4" />
          Limpar Antigos
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtre os logs por usuário, ação, status ou período
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <div className="lg:col-span-2">
              <Input
                placeholder="Buscar por usuário, recurso ou IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Usuário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os usuários</SelectItem>
                <SelectItem value="admin@empresa.com">admin@empresa.com</SelectItem>
                <SelectItem value="agente01@empresa.com">agente01@empresa.com</SelectItem>
                <SelectItem value="supervisor@empresa.com">supervisor@empresa.com</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedAction} onValueChange={setSelectedAction}>
              <SelectTrigger>
                <SelectValue placeholder="Ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as ações</SelectItem>
                <SelectItem value="Login">Login</SelectItem>
                <SelectItem value="Logout">Logout</SelectItem>
                <SelectItem value="View">Visualizar</SelectItem>
                <SelectItem value="Update">Atualizar</SelectItem>
                <SelectItem value="Delete">Excluir</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="success">Sucesso</SelectItem>
                <SelectItem value="failed">Falhou</SelectItem>
                <SelectItem value="blocked">Bloqueado</SelectItem>
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

      {/* Tabela de Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Registros de Acesso</CardTitle>
          <CardDescription>
            {filteredLogs.length} registros encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Recurso</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>User Agent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      {log.timestamp}
                    </TableCell>
                    <TableCell className="font-medium">
                      {log.user}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {log.resource}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {log.ipAddress}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">
                      {log.userAgent}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(log.status)}>
                        <span className={getStatusColor(log.status)}>
                          {log.status === "success" && "Sucesso"}
                          {log.status === "failed" && "Falhou"}
                          {log.status === "blocked" && "Bloqueado"}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {log.details || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8">
              <Icons.history className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">Nenhum log encontrado</h3>
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
