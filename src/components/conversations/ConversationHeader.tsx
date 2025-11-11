import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Coffee, Play, Plus } from 'lucide-react';
import { mockAgent, pauseReasons } from '@/data/mockConversations';
import { useToast } from '@/hooks/use-toast';

interface ConversationHeaderProps {
  onAttendNext: () => void;
}

export function ConversationHeader({ onAttendNext }: ConversationHeaderProps) {
  const [pauseDialogOpen, setPauseDialogOpen] = useState(false);
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
  const [selectedPauseReason, setSelectedPauseReason] = useState<string>('');
  const { toast } = useToast();

  const handlePauseRequest = () => {
    if (!selectedPauseReason) {
      toast({
        title: "Selecione um motivo",
        description: "Por favor, selecione o motivo da pausa.",
        variant: "destructive",
      });
      return;
    }

    const reason = pauseReasons.find(r => r.id === selectedPauseReason);
    toast({
      title: "Pausa solicitada",
      description: `Você entrou em pausa: ${reason?.label}`,
    });
    setPauseDialogOpen(false);
    setSelectedPauseReason('');
  };

  const handleNewChat = () => {
    toast({
      title: "Novo atendimento",
      description: "Funcionalidade em desenvolvimento",
    });
    setNewChatDialogOpen(false);
  };

  return (
    <>
      <header className="border-b bg-background px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium">{mockAgent.name}</span>
            <Badge variant="secondary" className="text-xs">
              Online
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Users className="h-4 w-4" />
            Clientes na fila
            <Badge variant="secondary" className="ml-1">{mockAgent.queueSize}</Badge>
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => setPauseDialogOpen(true)}
          >
            <Coffee className="h-4 w-4" />
            Solicitar pausa
          </Button>

          <Button 
            size="sm" 
            className="gap-2"
            onClick={onAttendNext}
          >
            <Play className="h-4 w-4" />
            Atender próximo
          </Button>

          <Button 
            size="sm" 
            variant="secondary"
            className="gap-2"
            onClick={() => setNewChatDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Novo atendimento
          </Button>
        </div>
      </header>

      <Dialog open={pauseDialogOpen} onOpenChange={setPauseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar Pausa</DialogTitle>
            <DialogDescription>
              Selecione o motivo da sua pausa
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select value={selectedPauseReason} onValueChange={setSelectedPauseReason}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o motivo" />
              </SelectTrigger>
              <SelectContent>
                {pauseReasons.map(reason => (
                  <SelectItem key={reason.id} value={reason.id}>
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPauseDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handlePauseRequest}>
                Confirmar pausa
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={newChatDialogOpen} onOpenChange={setNewChatDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Atendimento</DialogTitle>
            <DialogDescription>
              Iniciar um novo atendimento manualmente
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Esta funcionalidade permitirá iniciar conversas com novos clientes.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setNewChatDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleNewChat}>
                Criar atendimento
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
