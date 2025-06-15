
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, Clock, AlertTriangle } from "lucide-react";

export const LiveStatsCards = () => {
  const stats = [
    {
      title: "Agentes Online",
      value: "12",
      total: "/15",
      icon: Users,
      status: "online",
      change: "+2 desde ontem"
    },
    {
      title: "Atendimentos Ativos",
      value: "28",
      icon: MessageSquare,
      status: "active",
      change: "5 novos nas últimas 2h"
    },
    {
      title: "Tempo Médio de Espera",
      value: "2m 15s",
      icon: Clock,
      status: "warning",
      change: "+30s desde ontem"
    },
    {
      title: "Atendimentos na Fila",
      value: "8",
      icon: AlertTriangle,
      status: "urgent",
      change: "3 aguardando >5min"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "active": return "bg-blue-500";
      case "warning": return "bg-yellow-500";
      case "urgent": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-ping-primary" />
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
