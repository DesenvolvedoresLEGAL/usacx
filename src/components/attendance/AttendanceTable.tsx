
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/components/ui/avatar";
import { 
  MoreHorizontal, 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  User,
  Eye,
  Edit,
  Archive,
  ExternalLink
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AttendanceTableProps {
  selectedAttendances: string[];
  onSelectionChange: (selected: string[]) => void;
}

export const AttendanceTable = ({ selectedAttendances, onSelectionChange }: AttendanceTableProps) => {
  const attendances = [
    {
      id: "ATD-2024-001",
      customer: {
        name: "Ana Maria Silva",
        avatar: "",
        phone: "+55 11 99999-1234"
      },
      subject: "Problema com entrega do produto",
      channel: "whatsapp",
      status: "active",
      priority: "high",
      agent: "Maria Santos",
      queue: "Suporte",
      createdAt: "2024-01-15 09:30",
      lastUpdate: "2024-01-15 10:45",
      duration: "1h 15m",
      messages: 8
    },
    {
      id: "ATD-2024-002",
      customer: {
        name: "João Pedro Costa",
        avatar: "",
        phone: "+55 11 88888-5678"
      },
      subject: "Dúvida sobre faturamento",
      channel: "email",
      status: "pending",
      priority: "normal",
      agent: "Carlos Lima",
      queue: "Financeiro",
      createdAt: "2024-01-15 08:15",
      lastUpdate: "2024-01-15 09:20",
      duration: "2h 30m",
      messages: 5
    },
    {
      id: "ATD-2024-003",
      customer: {
        name: "Empresa Tech Solutions",
        avatar: "",
        phone: "+55 11 77777-9012"
      },
      subject: "Proposta comercial para sistema",
      channel: "chat",
      status: "waiting",
      priority: "urgent",
      agent: "Ana Oliveira",
      queue: "Vendas",
      createdAt: "2024-01-15 07:45",
      lastUpdate: "2024-01-15 10:30",
      duration: "45m",
      messages: 12
    },
    {
      id: "ATD-2024-004",
      customer: {
        name: "Patricia Ferreira",
        avatar: "",
        phone: "+55 11 66666-3456"
      },
      subject: "Cancelamento de serviço",
      channel: "phone",
      status: "resolved",
      priority: "low",
      agent: "Pedro Silva",
      queue: "Geral",
      createdAt: "2024-01-14 16:20",
      lastUpdate: "2024-01-15 10:15",
      duration: "3h 45m",
      messages: 15
    },
    {
      id: "ATD-2024-005",
      customer: {
        name: "Marcos Roberto",
        avatar: "",
        phone: "+55 11 55555-7890"
      },
      subject: "Informações sobre novo produto",
      channel: "telegram",
      status: "closed",
      priority: "normal",
      agent: "Julia Mendes",
      queue: "Vendas",
      createdAt: "2024-01-14 14:30",
      lastUpdate: "2024-01-14 18:45",
      duration: "4h 15m",
      messages: 9
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string; color: string }> = {
      active: { variant: "default", label: "Ativo", color: "bg-green-500" },
      pending: { variant: "secondary", label: "Pendente", color: "bg-yellow-500" },
      waiting: { variant: "outline", label: "Aguardando", color: "bg-blue-500" },
      resolved: { variant: "outline", label: "Resolvido", color: "bg-purple-500" },
      closed: { variant: "secondary", label: "Fechado", color: "bg-gray-500" }
    };
    
    const config = variants[status] || variants.pending;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full ${config.color}`}></div>
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      low: { variant: "outline", label: "Baixa" },
      normal: { variant: "secondary", label: "Normal" },
      high: { variant: "destructive", label: "Alta" },
      urgent: { variant: "destructive", label: "Urgente" }
    };
    
    const config = variants[priority] || variants.normal;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getChannelIcon = (channel: string) => {
    const icons: Record<string, any> = {
      whatsapp: MessageSquare,
      email: Mail,
      chat: MessageSquare,
      phone: Phone,
      telegram: MessageSquare
    };
    
    const Icon = icons[channel] || MessageSquare;
    return <Icon className="h-4 w-4" />;
  };

  const handleSelectAll = () => {
    if (selectedAttendances.length === attendances.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(attendances.map(a => a.id));
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedAttendances.includes(id)) {
      onSelectionChange(selectedAttendances.filter(aid => aid !== id));
    } else {
      onSelectionChange([...selectedAttendances, id]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Lista de Atendimentos</span>
          <Badge variant="outline">{attendances.length} atendimentos</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedAttendances.length === attendances.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Protocolo</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Assunto</TableHead>
              <TableHead>Canal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Agente</TableHead>
              <TableHead>Fila</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead>Mensagens</TableHead>
              <TableHead>Última Atualização</TableHead>
              <TableHead className="w-12">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendances.map((attendance) => (
              <TableRow key={attendance.id} className="hover:bg-muted/50">
                <TableCell>
                  <Checkbox 
                    checked={selectedAttendances.includes(attendance.id)}
                    onCheckedChange={() => handleSelectOne(attendance.id)}
                  />
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {attendance.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <div className="bg-ping-primary text-white flex items-center justify-center h-full w-full text-sm">
                        {attendance.customer.name.charAt(0)}
                      </div>
                    </Avatar>
                    <div>
                      <div className="font-medium">{attendance.customer.name}</div>
                      <div className="text-sm text-muted-foreground">{attendance.customer.phone}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="max-w-48">
                  <div className="truncate" title={attendance.subject}>
                    {attendance.subject}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {getChannelIcon(attendance.channel)}
                    <span className="capitalize">{attendance.channel}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(attendance.status)}
                </TableCell>
                <TableCell>
                  {getPriorityBadge(attendance.priority)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {attendance.agent}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{attendance.queue}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {attendance.duration}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{attendance.messages}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {attendance.lastUpdate}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Abrir Chat
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        Transferir
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Archive className="mr-2 h-4 w-4" />
                        Arquivar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
