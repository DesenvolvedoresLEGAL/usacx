
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageSquare } from "lucide-react";

const liveActivities = [
  { client: 'Maria Silva', agent: 'João Santos', channel: 'WhatsApp', duration: '2m 15s', status: 'ativo' },
  { client: 'Pedro Costa', agent: 'Ana Oliveira', channel: 'Chat Web', duration: '5m 42s', status: 'ativo' },
  { client: 'Carla Souza', agent: 'Carlos Lima', channel: 'Facebook', duration: '1m 30s', status: 'ativo' },
  { client: 'Roberto Alves', agent: '-', channel: 'WhatsApp', duration: '8m 20s', status: 'aguardando' },
  { client: 'Lucia Santos', agent: '-', channel: 'Instagram', duration: '12m 05s', status: 'aguardando' },
];

export const LiveActivityTable = () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-ping-primary" />
          Atividade em Tempo Real
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Agente</TableHead>
              <TableHead>Canal</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {liveActivities.map((activity, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{activity.client}</TableCell>
                <TableCell>{activity.agent || 'Não atribuído'}</TableCell>
                <TableCell>{activity.channel}</TableCell>
                <TableCell className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {activity.duration}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={activity.status === 'ativo' ? 'default' : 'destructive'}
                    className={activity.status === 'ativo' ? 'bg-green-500' : ''}
                  >
                    {activity.status === 'ativo' ? 'Em Atendimento' : 'Aguardando'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
