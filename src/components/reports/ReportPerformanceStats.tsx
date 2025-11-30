
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Target, Star, TrendingUp, TrendingDown, Users, Timer, Zap } from "lucide-react";

export function ReportPerformanceStats({ filters }: { filters: any }) {
  const stats = {
    avgResponseTime: "--",
    avgResolutionTime: "--",
    avgSatisfaction: 0,
    productivity: "--",
    availability: "--",
    totalTickets: 0,
    resolvedTickets: 0,
    activeAgents: 0,
    trends: {
      responseTime: "--",
      resolutionTime: "--",
      satisfaction: "--",
      productivity: "--",
      availability: "--",
      totalTickets: "--",
      resolvedTickets: "--",
      activeAgents: "--",
    }
  };

  const statCards = [
    {
      title: "Tempo Médio de Resposta",
      value: stats.avgResponseTime,
      trend: stats.trends.responseTime,
      icon: Clock,
      trendType: "down", // menor é melhor
    },
    {
      title: "Tempo Médio de Resolução",
      value: stats.avgResolutionTime,
      trend: stats.trends.resolutionTime,
      icon: Timer,
      trendType: "down", // menor é melhor
    },
    {
      title: "Satisfação Média",
      value: stats.avgSatisfaction.toFixed(1),
      trend: stats.trends.satisfaction,
      icon: Star,
      trendType: "up", // maior é melhor
    },
    {
      title: "Produtividade",
      value: stats.productivity,
      trend: stats.trends.productivity,
      icon: Zap,
      trendType: "up", // maior é melhor
    },
    {
      title: "Disponibilidade",
      value: stats.availability,
      trend: stats.trends.availability,
      icon: Target,
      trendType: "up", // maior é melhor
    },
    {
      title: "Total de Tickets",
      value: stats.totalTickets.toLocaleString(),
      trend: stats.trends.totalTickets,
      icon: Users,
      trendType: "up", // maior é melhor
    },
    {
      title: "Tickets Resolvidos",
      value: stats.resolvedTickets.toLocaleString(),
      trend: stats.trends.resolvedTickets,
      icon: Target,
      trendType: "up", // maior é melhor
    },
    {
      title: "Agentes Ativos",
      value: stats.activeAgents.toString(),
      trend: stats.trends.activeAgents,
      icon: Users,
      trendType: "neutral",
    },
  ];

  const getTrendIcon = (trend: string, trendType: string) => {
    const isPositiveTrend = trend.startsWith("+");
    const isGoodTrend = (trendType === "up" && isPositiveTrend) || (trendType === "down" && !isPositiveTrend);
    
    if (trendType === "neutral") {
      return <TrendingUp className="w-3 h-3 text-blue-600" />;
    }
    
    return isGoodTrend ? 
      <TrendingUp className="w-3 h-3 text-green-600" /> : 
      <TrendingDown className="w-3 h-3 text-red-600" />;
  };

  const getTrendColor = (trend: string, trendType: string) => {
    const isPositiveTrend = trend.startsWith("+");
    const isGoodTrend = (trendType === "up" && isPositiveTrend) || (trendType === "down" && !isPositiveTrend);
    
    if (trendType === "neutral") {
      return "text-blue-600";
    }
    
    return isGoodTrend ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <IconComponent className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                {getTrendIcon(stat.trend, stat.trendType)}
                <span className={getTrendColor(stat.trend, stat.trendType)}>
                  {stat.trend}
                </span>
                <span>vs período anterior</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
