import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MessageSquare, Pause, Play, ArrowRightLeft, Loader2 } from "lucide-react";
import { useActiveAgents } from "@/hooks/useActiveAgents";
import { TransferConversationsDialog } from "./TransferConversationsDialog";

export const ActiveAgentsTable = () => {
  const { agents, loading, pauseAgent, resumeAgent } = useActiveAgents();
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<{ id: string; name: string } | null>(null);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  const handlePauseAgent = async (agentId: string) => {
    setActionLoading(prev => ({ ...prev, [agentId]: true }));
    await pauseAgent(agentId);
    setActionLoading(prev => ({ ...prev, [agentId]: false }));
  };

  const handleResumeAgent = async (agentId: string) => {
    setActionLoading(prev => ({ ...prev, [agentId]: true }));
    await resumeAgent(agentId);
    setActionLoading(prev => ({ ...prev, [agentId]: false }));
  };

  const handleTransferClick = (agentId: string, agentName: string) => {
    setSelectedAgent({ id: agentId, name: agentName });
    setTransferDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      online: { label: "Online", className: "bg-green-500" },
      busy: { label: "Ocupado", className: "bg-yellow-500" },
      away: { label: "Ausente", className: "bg-gray-500" },
      paused: { label: "Pausado", className: "bg-orange-500" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.away;
    
    return (
      <Badge className={`${config.className} text-white`}>
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-ping-primary" />
            Agentes Ativos
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
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-ping-primary" />
            Agentes Ativos
            {agents.length > 0 && (
              <Badge variant="secondary">{agents.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {agents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nenhum agente ativo no momento</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agente</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Chats Ativos</TableHead>
                  <TableHead>Total Hoje</TableHead>
                  <TableHead>Tempo Médio</TableHead>
                  <TableHead>Última Atividade</TableHead>
                  <TableHead className="w-[140px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={agent.avatarUrl || undefined} />
                        <AvatarFallback>
                          {agent.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </AvatarFallback>
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
                    <TableCell>{agent.avgResponseTime}</TableCell>
                    <TableCell>{agent.lastActivity}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {agent.activeChats > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTransferClick(agent.id, agent.name)}
                            title="Transferir conversas"
                          >
                            <ArrowRightLeft className="h-3 w-3" />
                          </Button>
                        )}
                        {agent.status === 'paused' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleResumeAgent(agent.id)}
                            disabled={actionLoading[agent.id]}
                            title="Retomar agente"
                          >
                            {actionLoading[agent.id] ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Play className="h-3 w-3" />
                            )}
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePauseAgent(agent.id)}
                            disabled={actionLoading[agent.id]}
                            title="Pausar agente"
                          >
                            {actionLoading[agent.id] ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Pause className="h-3 w-3" />
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedAgent && (
        <TransferConversationsDialog
          open={transferDialogOpen}
          onOpenChange={setTransferDialogOpen}
          sourceAgentId={selectedAgent.id}
          sourceAgentName={selectedAgent.name}
        />
      )}
    </>
  );
};
