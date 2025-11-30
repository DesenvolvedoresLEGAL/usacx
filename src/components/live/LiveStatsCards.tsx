
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { useLiveStats } from "@/hooks/useLiveStats";

export const LiveStatsCards = () => {
  const liveStats = useLiveStats();

  const stats = [
    {
      title: "Agentes Online",
      value: liveStats.isLoading ? "..." : liveStats.onlineAgents.toString(),
      total: liveStats.isLoading ? "" : `/${liveStats.totalAgents}`,
      icon: liveStats.isLoading ? Loader2 : Users,
      status: "online",
      change: `${liveStats.onlineAgents} de ${liveStats.totalAgents} disponíveis`
    },
    {
      title: "Atendimentos Ativos",
      value: liveStats.isLoading ? "..." : liveStats.activeConversations.toString(),
      icon: liveStats.isLoading ? Loader2 : MessageSquare,
      status: "active",
      change: "Em andamento agora"
    },
    {
      title: "Tempo Médio de Espera",
      value: liveStats.isLoading ? "..." : liveStats.averageWaitTime,
      icon: liveStats.isLoading ? Loader2 : Clock,
      status: liveStats.queueSize > 5 ? "urgent" : "warning",
      change: liveStats.queueSize > 0 ? `${liveStats.queueSize} na fila` : "Sem espera"
    },
    {
      title: "Atendimentos na Fila",
      value: liveStats.isLoading ? "..." : liveStats.queueSize.toString(),
      icon: liveStats.isLoading ? Loader2 : AlertTriangle,
      status: liveStats.queueSize > 5 ? "urgent" : liveStats.queueSize > 0 ? "warning" : "online",
      change: liveStats.queueSize === 0 ? "Nenhum aguardando" : `${liveStats.queueSize} aguardando`
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "active": return "bg-blue-500";
      case "warning": return "bg-yellow-500";
      case "urgent": return "bg-red-500";
      default: return "bg-muted";
    }
  };

  const isLoading = (icon: any) => icon.name === 'Loader2';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 text-ping-primary ${isLoading(stat.icon) ? 'animate-spin' : ''}`} />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                  {stat.total && <span className="text-sm text-muted-foreground">{stat.total}</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.change}
                </p>
              </div>
              <Badge className={`${getStatusColor(stat.status)} text-white`}>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1"></div>
                Ao Vivo
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
