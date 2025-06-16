
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, TrendingUp, TrendingDown, Star } from "lucide-react";

const MOCK_PERFORMANCE_DATA = [
  {
    id: 1,
    agent: "Maria Silva",
    department: "Vendas",
    totalTickets: 156,
    resolvedTickets: 152,
    avgResponseTime: "1m 12s",
    avgResolutionTime: "12m 34s",
    satisfaction: 4.8,
    productivity: 97.4,
    availability: 98.2,
    status: "online",
    trend: "up"
  },
  {
    id: 2,
    agent: "João Santos",
    department: "Suporte",
    totalTickets: 142,
    resolvedTickets: 138,
    avgResponseTime: "1m 28s",
    avgResolutionTime: "14m 15s",
    satisfaction: 4.6,
    productivity: 94.2,
    availability: 96.8,
    status: "online",
    trend: "up"
  },
  {
    id: 3,
    agent: "Ana Costa",
    department: "Financeiro",
    totalTickets: 138,
    resolvedTickets: 135,
    avgResponseTime: "1m 35s",
    avgResolutionTime: "13m 52s",
    satisfaction: 4.7,
    productivity: 93.8,
    availability: 97.1,
    status: "busy",
    trend: "stable"
  },
  {
    id: 4,
    agent: "Pedro Oliveira",
    department: "Comercial",
    totalTickets: 134,
    resolvedTickets: 129,
    avgResponseTime: "1m 45s",
    avgResolutionTime: "15m 08s",
    satisfaction: 4.5,
    productivity: 91.2,
    availability: 95.3,
    status: "online",
    trend: "down"
  },
  {
    id: 5,
    agent: "Carla Souza",
    department: "Suporte",
    totalTickets: 129,
    resolvedTickets: 124,
    avgResponseTime: "1m 52s",
    avgResolutionTime: "16m 23s",
    satisfaction: 4.4,
    productivity: 89.7,
    availability: 94.2,
    status: "away",
    trend: "down"
  },
  {
    id: 6,
    agent: "Lucas Ferreira",
    department: "Vendas",
    totalTickets: 125,
    resolvedTickets: 121,
    avgResponseTime: "2m 05s",
    avgResolutionTime: "17m 14s",
    satisfaction: 4.3,
    productivity: 87.5,
    availability: 93.8,
    status: "offline",
    trend: "stable"
  }
];

export function ReportPerformanceTable({ filters }: { filters: any }) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      online: { label: "Online", variant: "default" as const },
      busy: { label: "Ocupado", variant: "secondary" as const },
      away: { label: "Ausente", variant: "outline" as const },
      offline: { label: "Offline", variant: "destructive" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.offline;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <div className="w-4 h-4" />;
    }
  };

  const getPerformanceColor = (value: number) => {
    if (value >= 95) return "text-green-600 font-semibold";
    if (value >= 85) return "text-yellow-600 font-semibold";
    return "text-red-600 font-semibold";
  };

  const getSatisfactionStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Detalhada dos Agentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agente</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Tickets</TableHead>
                <TableHead>Resolvidos</TableHead>
                <TableHead>Tempo Resposta</TableHead>
                <TableHead>Tempo Resolução</TableHead>
                <TableHead>Satisfação</TableHead>
                <TableHead>Produtividade</TableHead>
                <TableHead>Disponibilidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tendência</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_PERFORMANCE_DATA.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="font-medium">{agent.agent}</TableCell>
                  <TableCell>{agent.department}</TableCell>
                  <TableCell>{agent.totalTickets}</TableCell>
                  <TableCell>{agent.resolvedTickets}</TableCell>
                  <TableCell>{agent.avgResponseTime}</TableCell>
                  <TableCell>{agent.avgResolutionTime}</TableCell>
                  <TableCell>{getSatisfactionStars(agent.satisfaction)}</TableCell>
                  <TableCell className={getPerformanceColor(agent.productivity)}>
                    {agent.productivity.toFixed(1)}%
                  </TableCell>
                  <TableCell className={getPerformanceColor(agent.availability)}>
                    {agent.availability.toFixed(1)}%
                  </TableCell>
                  <TableCell>{getStatusBadge(agent.status)}</TableCell>
                  <TableCell>{getTrendIcon(agent.trend)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
