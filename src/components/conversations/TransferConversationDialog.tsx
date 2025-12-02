import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowRight, User } from 'lucide-react';

interface AvailableAgent {
  id: string;
  displayName: string;
  status: string;
  avatarUrl: string | null;
  activeConversations: number;
}

interface TransferConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
  clientName: string;
  onTransferComplete?: () => void;
}

export function TransferConversationDialog({
  open,
  onOpenChange,
  conversationId,
  clientName,
  onTransferComplete,
}: TransferConversationDialogProps) {
  const [agents, setAgents] = useState<AvailableAgent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchAvailableAgents();
      setSelectedAgentId('');
    }
  }, [open, conversationId]);

  const fetchAvailableAgents = async () => {
    setLoading(true);
    try {
      // Get current conversation's agent to exclude from list
      const { data: currentConv } = await supabase
        .from('conversations')
        .select('assigned_agent_id')
        .eq('id', conversationId)
        .single();

      const currentAgentId = currentConv?.assigned_agent_id;

      // Fetch available agents with their conversation count
      const { data, error } = await supabase
        .from('agent_profiles')
        .select(`
          id,
          display_name,
          status,
          avatar_url
        `)
        .in('status', ['online', 'away'])
        .order('display_name');

      if (error) throw error;

      // Count active conversations for each agent
      const agentsWithCounts = await Promise.all(
        (data || [])
          .filter((agent) => agent.id !== currentAgentId)
          .map(async (agent) => {
            const { count } = await supabase
              .from('conversations')
              .select('*', { count: 'exact', head: true })
              .eq('assigned_agent_id', agent.id)
              .in('status', ['active', 'paused']);

            return {
              id: agent.id,
              displayName: agent.display_name || 'Sem nome',
              status: agent.status || 'offline',
              avatarUrl: agent.avatar_url,
              activeConversations: count || 0,
            };
          })
      );

      setAgents(agentsWithCounts);
    } catch (error) {
      console.error('Erro ao buscar agentes:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar agentes',
        description: 'Não foi possível carregar a lista de agentes disponíveis.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!selectedAgentId) return;

    setTransferring(true);
    try {
      const { error } = await supabase
        .from('conversations')
        .update({
          assigned_agent_id: selectedAgentId,
          assigned_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', conversationId);

      if (error) throw error;

      const selectedAgent = agents.find((a) => a.id === selectedAgentId);

      toast({
        title: 'Conversa transferida',
        description: `Conversa com ${clientName} transferida para ${selectedAgent?.displayName || 'outro agente'}.`,
      });

      onOpenChange(false);
      onTransferComplete?.();
    } catch (error) {
      console.error('Erro ao transferir conversa:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao transferir',
        description: 'Não foi possível transferir a conversa. Tente novamente.',
      });
    } finally {
      setTransferring(false);
    }
  };

  const selectedAgent = agents.find((a) => a.id === selectedAgentId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge variant="outline" className="text-green-600 border-green-600">Online</Badge>;
      case 'away':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Ausente</Badge>;
      default:
        return <Badge variant="outline">Offline</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Transferir Conversa
          </DialogTitle>
          <DialogDescription>
            Transferir conversa com <strong>{clientName}</strong> para outro agente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Selecione o agente de destino
            </label>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : agents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm border rounded-lg">
                <User className="h-8 w-8 mx-auto mb-2 opacity-30" />
                Nenhum agente disponível no momento
              </div>
            ) : (
              <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um agente">
                    {selectedAgent && (
                      <div className="flex items-center gap-2">
                        <span>{selectedAgent.displayName}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      <div className="flex items-center gap-3 py-1">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={agent.avatarUrl || undefined} />
                          <AvatarFallback>{agent.displayName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{agent.displayName}</p>
                          <p className="text-xs text-muted-foreground">
                            {agent.activeConversations} conversa(s) ativa(s)
                          </p>
                        </div>
                        {getStatusBadge(agent.status)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {selectedAgent && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Transferir para:</p>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedAgent.avatarUrl || undefined} />
                  <AvatarFallback>{selectedAgent.displayName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedAgent.displayName}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedAgent.activeConversations} conversa(s) em atendimento
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={transferring}>
            Cancelar
          </Button>
          <Button
            onClick={handleTransfer}
            disabled={!selectedAgentId || transferring}
          >
            {transferring ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Transferindo...
              </>
            ) : (
              <>
                <ArrowRight className="mr-2 h-4 w-4" />
                Transferir
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
