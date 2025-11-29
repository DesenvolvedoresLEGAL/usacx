import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Users, Coffee, Play, Plus, Bell, ChevronDown, LayoutDashboard, Settings, HelpCircle, LogOut, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCurrentAgent } from '@/hooks/useCurrentAgent';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface ConversationHeaderProps {
  onAttendNext: () => void;
}

interface PauseReason {
  id: string;
  label: string;
  icon: string;
}

export function ConversationHeader({ onAttendNext }: ConversationHeaderProps) {
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
  const [pauseReasons, setPauseReasons] = useState<PauseReason[]>([]);
  const [queueSize, setQueueSize] = useState(0);
  const { toast } = useToast();
  const currentAgent = useCurrentAgent();
  const { user, profile, signOut } = useAuth();

  const userInitials = profile?.display_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || '??';

  // Buscar motivos de pausa do banco
  useEffect(() => {
    const fetchPauseReasons = async () => {
      const { data } = await supabase
        .from('pause_reasons')
        .select('*')
        .eq('is_active', true)
        .order('label');
      
      if (data) {
        setPauseReasons(data);
      }
    };

    fetchPauseReasons();
  }, []);

  // Buscar tamanho da fila
  useEffect(() => {
    const fetchQueueSize = async () => {
      const { count } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'waiting');
      
      setQueueSize(count || 0);
    };

    fetchQueueSize();

    // Atualizar em realtime
    const channel = supabase
      .channel('queue-size')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: 'status=eq.waiting',
        },
        () => {
          fetchQueueSize();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handlePause = (reason: PauseReason) => {
    toast({
      title: "Pausa solicitada",
      description: `Você entrou em pausa: ${reason.label}`,
    });
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
        {/* LADO ESQUERDO - Logo USAC */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-primary">USAC</h1>
        </div>

        {/* LADO DIREITO - Ações Agrupadas */}
        <div className="flex items-center gap-3">
          {/* Badge de Fila */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Fila</span>
            <Badge variant={queueSize > 0 ? "destructive" : "secondary"}>
              {queueSize}
            </Badge>
          </div>

          {/* Botão Primário - Atender Próximo */}
          <Button size="sm" className="gap-2" onClick={onAttendNext}>
            <Play className="h-4 w-4" />
            Atender próximo
          </Button>

          {/* Notificações */}
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
          </Button>

          {/* Avatar com Dropdown do Usuário - com status dot */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 rounded-full p-0 relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                {/* Status dot - estilo Slack/Discord */}
                <div className={cn(
                  "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                  profile?.status === 'online' ? 'bg-green-500' :
                  profile?.status === 'away' ? 'bg-yellow-500' :
                  profile?.status === 'busy' ? 'bg-red-500' : 'bg-gray-400'
                )} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{profile?.display_name || 'Usuário'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard" className="cursor-pointer">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Meu Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/perfil/configuracoes" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/ajuda" className="cursor-pointer">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Suporte
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Dialog Novo Atendimento */}
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
