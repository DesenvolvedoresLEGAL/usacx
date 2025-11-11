import { Client } from '@/types/conversations';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Phone, Mail, Tag, FileText, Clock, UserX, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ClientInfoSidebarProps {
  client: Client | null;
}

export function ClientInfoSidebar({ client }: ClientInfoSidebarProps) {
  const { toast } = useToast();

  if (!client) {
    return (
      <div className="w-80 border-l bg-background flex items-center justify-center p-6">
        <p className="text-sm text-muted-foreground text-center">
          Selecione uma conversa para ver as informações do cliente
        </p>
      </div>
    );
  }

  const handleAction = (action: string) => {
    toast({
      title: "Em desenvolvimento",
      description: `Funcionalidade "${action}" em breve disponível`,
    });
  };

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
                onClick={() => handleAction('Transferir')}
              >
                <ArrowRight className="h-4 w-4" />
                Transferir conversa
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => handleAction('Finalizar')}
              >
                <UserX className="h-4 w-4" />
                Finalizar atendimento
              </Button>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
