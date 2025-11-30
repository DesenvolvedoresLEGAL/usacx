
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LiveActivity {
  id: string;
  status: string;
  startedAt: string;
  updatedAt: string;
  clientName: string;
  agentName: string | null;
  channelType: string;
}

interface LiveActivityTableProps {
  data?: LiveActivity[];
}

// Mapear tipos de canal para labels amigáveis
const channelLabels: Record<string, string> = {
  whatsapp: 'WhatsApp',
  webchat: 'Chat Web',
  messenger: 'Messenger',
  instagram: 'Instagram',
  telegram: 'Telegram',
};

export const LiveActivityTable = ({ data = [] }: LiveActivityTableProps) => {
  // Se não houver dados, mostrar mensagem
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        Nenhuma conversa ativa no momento
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return (
        <Badge variant="default" className="bg-green-500">
          Em Atendimento
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        {status}
      </Badge>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Agente</TableHead>
            <TableHead>Canal</TableHead>
            <TableHead>Tempo Ativo</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((activity) => {
            const duration = formatDistanceToNow(new Date(activity.startedAt), {
              locale: ptBR,
              addSuffix: false,
            });

            return (
              <TableRow key={activity.id}>
                <TableCell className="font-medium">{activity.clientName}</TableCell>
                <TableCell>{activity.agentName || 'Não atribuído'}</TableCell>
                <TableCell>{channelLabels[activity.channelType] || activity.channelType}</TableCell>
                <TableCell className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {duration}
                </TableCell>
                <TableCell>
                  {getStatusBadge(activity.status)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
