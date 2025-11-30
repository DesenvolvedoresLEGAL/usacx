
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, TrendingUp, TrendingDown, Star } from "lucide-react";

export function ReportPerformanceTable({ filters }: { filters: any }) {
  const performanceData: any[] = [];
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
              {performanceData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center text-muted-foreground py-8">
                    Nenhum dado de performance disponível no momento.
                  </TableCell>
                </TableRow>
              ) : performanceData.map((agent) => (
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
