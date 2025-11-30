import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, AlertTriangle, User, MessageSquare, ArrowRight, Loader2 } from "lucide-react";
import { useQueueMonitor } from "@/hooks/useQueueMonitor";
import { useAvailableAgents } from "@/hooks/useAvailableAgents";
import { useState } from "react";

export const QueueMonitor = () => {
  const { queueItems, loading, assignConversation } = useQueueMonitor();
  const { agents, loading: agentsLoading } = useAvailableAgents();
  const [selectedAgent, setSelectedAgent] = useState<Record<string, string>>({});
  const [assigning, setAssigning] = useState<Record<string, boolean>>({});

  const handleAssign = async (conversationId: string) => {
    const agentId = selectedAgent[conversationId];
    if (!agentId) return;

    setAssigning(prev => ({ ...prev, [conversationId]: true }));
    await assignConversation(conversationId, agentId);
    setAssigning(prev => ({ ...prev, [conversationId]: false }));
    setSelectedAgent(prev => {
      const newState = { ...prev };
      delete newState[conversationId];
      return newState;
    });
  };

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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-ping-primary" />
            Fila de Atendimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-ping-primary" />
            Fila de Atendimento
          </CardTitle>
          {queueItems.length > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {queueItems.length} aguardando
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {queueItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Nenhuma conversa aguardando na fila</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead>Tempo de Espera</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Assunto</TableHead>
                <TableHead className="w-[280px]">Ações</TableHead>
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
                    <div className="flex gap-1 items-center">
                      <Select
                        value={selectedAgent[item.conversationId] || ''}
                        onValueChange={(value) =>
                          setSelectedAgent(prev => ({ ...prev, [item.conversationId]: value }))
                        }
                        disabled={agentsLoading || assigning[item.conversationId]}
                      >
                        <SelectTrigger className="h-9 w-[140px]">
                          <SelectValue placeholder="Agente" />
                        </SelectTrigger>
                        <SelectContent>
                          {agents.map((agent) => (
                            <SelectItem key={agent.id} value={agent.id}>
                              {agent.displayName} ({agent.activeConversations})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        onClick={() => handleAssign(item.conversationId)}
                        disabled={!selectedAgent[item.conversationId] || assigning[item.conversationId]}
                      >
                        {assigning[item.conversationId] ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <>
                            <ArrowRight className="h-3 w-3 mr-1" />
                            Atribuir
                          </>
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
