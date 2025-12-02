import { useState } from 'react';
import { Client, Conversation } from '@/types/conversations';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Phone, Mail, Tag, FileText, Clock, UserX, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TransferConversationDialog } from './TransferConversationDialog';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ClientInfoSidebarProps {
  client: Client | null;
  conversation: Conversation | null;
  onConversationUpdate?: () => void;
}

export function ClientInfoSidebar({ client, conversation, onConversationUpdate }: ClientInfoSidebarProps) {
  const { toast } = useToast();
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [finishDialogOpen, setFinishDialogOpen] = useState(false);
  const [finishing, setFinishing] = useState(false);

  if (!client) {
    return (
      <div className="w-80 border-l bg-background flex items-center justify-center p-6">
        <p className="text-sm text-muted-foreground text-center">
          Selecione uma conversa para ver as informações do cliente
        </p>
      </div>
    );
  }

  const handleFinishConversation = async () => {
    if (!conversation) return;

    setFinishing(true);
    try {
      const { data, error } = await supabase.rpc('finish_conversation', {
        _conversation_id: conversation.id,
      });

      if (error) throw error;

      if (data) {
        toast({
          title: 'Atendimento finalizado',
          description: `Conversa com ${client.name} foi finalizada com sucesso.`,
        });
        setFinishDialogOpen(false);
        onConversationUpdate?.();
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro ao finalizar',
          description: 'A conversa não pôde ser finalizada. Verifique o status atual.',
        });
      }
    } catch (error) {
      console.error('Erro ao finalizar conversa:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao finalizar',
        description: 'Não foi possível finalizar o atendimento. Tente novamente.',
      });
    } finally {
      setFinishing(false);
    }
  };

  const isConversationActive = conversation && ['active', 'paused'].includes(conversation.status);

  return (
    <div className="w-80 border-l bg-background flex flex-col">
      <div className="p-6 border-b">
        <div className="flex flex-col items-center text-center space-y-3">
          <Avatar className="h-20 w-20">
            <AvatarImage src={client.avatar} />
            <AvatarFallback className="text-2xl">{client.name[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{client.name}</h3>
            {client.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-center">
                {client.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Informações de Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {client.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{client.phone}</span>
                </div>
              )}
              {client.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{client.email}</span>
                </div>
              )}
              {client.lastInteraction && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Última interação: {client.lastInteraction}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              {client.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {client.tags.map(tag => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma tag</p>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Notas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {client.notes ? (
                <p className="text-sm text-muted-foreground">{client.notes}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma nota</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => setTransferDialogOpen(true)}
                disabled={!isConversationActive}
              >
                <ArrowRight className="h-4 w-4" />
                Transferir conversa
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => setFinishDialogOpen(true)}
                disabled={!isConversationActive}
              >
                <UserX className="h-4 w-4" />
                Finalizar atendimento
              </Button>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      {/* Transfer Dialog */}
      {conversation && (
        <TransferConversationDialog
          open={transferDialogOpen}
          onOpenChange={setTransferDialogOpen}
          conversationId={conversation.id}
          clientName={client.name}
          onTransferComplete={onConversationUpdate}
        />
      )}

      {/* Finish Confirmation Dialog */}
      <AlertDialog open={finishDialogOpen} onOpenChange={setFinishDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finalizar atendimento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja finalizar o atendimento com <strong>{client.name}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={finishing}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleFinishConversation}
              disabled={finishing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {finishing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finalizando...
                </>
              ) : (
                'Finalizar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
