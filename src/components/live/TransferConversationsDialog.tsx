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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MessageSquare } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Conversation {
  id: string;
  clientName: string;
  channel: string;
  status: string;
  startedAt: Date;
}

interface TransferConversationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceAgentId: string;
  sourceAgentName: string;
}

export const TransferConversationsDialog = ({
  open,
  onOpenChange,
  sourceAgentId,
  sourceAgentName,
}: TransferConversationsDialogProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversations, setSelectedConversations] = useState<string[]>([]);
  const [targetAgentId, setTargetAgentId] = useState<string>('');
  const [availableAgents, setAvailableAgents] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchConversations();
      fetchAvailableAgents();
    }
  }, [open, sourceAgentId]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          status,
          started_at,
          clients:client_id (name),
          channels:channel_id (type)
        `)
        .eq('assigned_agent_id', sourceAgentId)
        .in('status', ['active', 'paused'])
        .order('started_at', { ascending: false });

      if (error) throw error;

      const formattedConversations: Conversation[] = (data || []).map((conv: any) => ({
        id: conv.id,
        clientName: conv.clients?.name || 'Cliente Desconhecido',
        channel: conv.channels?.type || 'webchat',
        status: conv.status,
        startedAt: new Date(conv.started_at),
      }));

      setConversations(formattedConversations);
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar conversas',
        description: 'Não foi possível carregar as conversas do agente.',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('agent_profiles')
        .select('id, display_name')
        .in('status', ['online', 'away'])
        .neq('id', sourceAgentId)
        .order('display_name');

      if (error) throw error;

      setAvailableAgents(
        (data || []).map((agent) => ({
          id: agent.id,
          name: agent.display_name || 'Sem nome',
        }))
      );
    } catch (error) {
      console.error('Erro ao buscar agentes:', error);
    }
  };

  const handleTransfer = async () => {
    if (!targetAgentId || selectedConversations.length === 0) return;

    setTransferring(true);
    try {
      const { error } = await supabase
        .from('conversations')
        .update({
          assigned_agent_id: targetAgentId,
          assigned_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .in('id', selectedConversations);

      if (error) throw error;

      toast({
        title: 'Conversas transferidas',
        description: `${selectedConversations.length} conversa(s) transferida(s) com sucesso.`,
      });

      onOpenChange(false);
      setSelectedConversations([]);
      setTargetAgentId('');
    } catch (error) {
      console.error('Erro ao transferir conversas:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao transferir',
        description: 'Não foi possível transferir as conversas.',
      });
    } finally {
      setTransferring(false);
    }
  };

  const toggleConversation = (conversationId: string) => {
    setSelectedConversations((prev) =>
      prev.includes(conversationId)
        ? prev.filter((id) => id !== conversationId)
        : [...prev, conversationId]
    );
  };

  const selectAll = () => {
    setSelectedConversations(conversations.map((c) => c.id));
  };

  const deselectAll = () => {
    setSelectedConversations([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Transferir Conversas</DialogTitle>
          <DialogDescription>
            Selecione as conversas de <strong>{sourceAgentName}</strong> para transferir para outro agente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Agente de Destino</label>
            <Select value={targetAgentId} onValueChange={setTargetAgentId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um agente" />
              </SelectTrigger>
              <SelectContent>
                {availableAgents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">
                Conversas ({selectedConversations.length}/{conversations.length})
              </label>
              <div className="space-x-2">
                <Button variant="ghost" size="sm" onClick={selectAll}>
                  Todas
                </Button>
                <Button variant="ghost" size="sm" onClick={deselectAll}>
                  Nenhuma
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
                Nenhuma conversa ativa para transferir
              </div>
            ) : (
              <ScrollArea className="h-[300px] border rounded-md p-4">
                <div className="space-y-3">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                      onClick={() => toggleConversation(conv.id)}
                    >
                      <Checkbox
                        checked={selectedConversations.includes(conv.id)}
                        onCheckedChange={() => toggleConversation(conv.id)}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{conv.clientName}</p>
                        <p className="text-xs text-muted-foreground">
                          {conv.channel} • {conv.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={transferring}>
            Cancelar
          </Button>
          <Button
            onClick={handleTransfer}
            disabled={!targetAgentId || selectedConversations.length === 0 || transferring}
          >
            {transferring ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Transferindo...
              </>
            ) : (
              `Transferir ${selectedConversations.length} conversa(s)`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
