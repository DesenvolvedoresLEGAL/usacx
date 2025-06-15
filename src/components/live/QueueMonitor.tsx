
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, AlertTriangle, User, MessageSquare, ArrowRight } from "lucide-react";

const queueItems = [
  {
    id: 1,
    customer: "Roberto Alves",
    channel: "WhatsApp",
    waitTime: "8m 20s",
    priority: "high",
    subject: "Problema com pedido",
    agent: null
  },
  {
    id: 2,
    customer: "Lucia Santos",
    channel: "Instagram",
    waitTime: "12m 05s",
    priority: "urgent",
    subject: "Cancelamento urgente",
    agent: null
  },
  {
    id: 3,
    customer: "Fernando Silva",
    channel: "Chat Web",
    waitTime: "5m 32s",
    priority: "normal",
    subject: "Dúvidas sobre produto",
    agent: null
  },
  {
    id: 4,
    customer: "Carla Mendes",
    channel: "Facebook",
    waitTime: "15m 18s",
    priority: "urgent",
    subject: "Cobrança indevida",
    agent: null
  }
];

export const QueueMonitor = () => {
  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      urgent: { label: "Urgente", className: "bg-red-500" },
      high: { label: "Alta", className: "bg-orange-500" },
      normal: { label: "Normal", className: "bg-blue-500" }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.normal;
    
    return (
      <Badge className={`${config.className} text-white`}>
        {config.label}
      </Badge>
    );
  };

  const getWaitTimeColor = (waitTime: string) => {
    const minutes = parseInt(waitTime.split('m')[0]);
    if (minutes > 10) return "text-red-600 font-semibold";
    if (minutes > 5) return "text-yellow-600 font-medium";
    return "text-green-600";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-ping-primary" />
            Fila de Atendimento
          </CardTitle>
          <Badge variant="destructive" className="animate-pulse">
            {queueItems.length} aguardando
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Canal</TableHead>
              <TableHead>Tempo de Espera</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Assunto</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queueItems.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/50">
                <TableCell className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{item.customer}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{item.channel}</Badge>
                </TableCell>
                <TableCell>
                  <div className={`flex items-center gap-1 ${getWaitTimeColor(item.waitTime)}`}>
                    <Clock className="h-3 w-3" />
                    {item.waitTime}
                  </div>
                </TableCell>
                <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                <TableCell className="max-w-[200px] truncate">{item.subject}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="default">
                      <ArrowRight className="h-3 w-3 mr-1" />
                      Atribuir
                    </Button>
                    <Button size="sm" variant="ghost">
                      <MessageSquare className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
