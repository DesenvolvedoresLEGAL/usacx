
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MessageSquare, Pause, Settings } from "lucide-react";

const activeAgents = [
  { 
    id: 1, 
    name: "João Santos", 
    avatar: "", 
    status: "online", 
    activeChats: 3, 
    totalToday: 15, 
    avgResponse: "45s",
    lastActivity: "Agora"
  },
  { 
    id: 2, 
    name: "Ana Oliveira", 
    avatar: "", 
    status: "busy", 
    activeChats: 5, 
    totalToday: 22, 
    avgResponse: "1m 12s",
    lastActivity: "2min"
  },
  { 
    id: 3, 
    name: "Carlos Lima", 
    avatar: "", 
    status: "online", 
    activeChats: 2, 
    totalToday: 18, 
    avgResponse: "32s",
    lastActivity: "Agora"
  },
  { 
    id: 4, 
    name: "Maria Silva", 
    avatar: "", 
    status: "away", 
    activeChats: 1, 
    totalToday: 8, 
    avgResponse: "2m 45s",
    lastActivity: "15min"
  },
  { 
    id: 5, 
    name: "Pedro Costa", 
    avatar: "", 
    status: "online", 
    activeChats: 4, 
    totalToday: 20, 
    avgResponse: "58s",
    lastActivity: "1min"
  }
];

export const ActiveAgentsTable = () => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      online: { label: "Online", className: "bg-green-500" },
      busy: { label: "Ocupado", className: "bg-yellow-500" },
      away: { label: "Ausente", className: "bg-gray-500" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.away;
    
    return (
      <Badge className={`${config.className} text-white`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-ping-primary" />
          Agentes Ativos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Chats Ativos</TableHead>
              <TableHead>Total Hoje</TableHead>
              <TableHead>Tempo Médio</TableHead>
              <TableHead>Última Atividade</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeAgents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={agent.avatar} />
                    <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{agent.name}</span>
                </TableCell>
                <TableCell>{getStatusBadge(agent.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {agent.activeChats}
                  </div>
                </TableCell>
                <TableCell>{agent.totalToday}</TableCell>
                <TableCell>{agent.avgResponse}</TableCell>
                <TableCell>{agent.lastActivity}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Pause className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-3 w-3" />
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
