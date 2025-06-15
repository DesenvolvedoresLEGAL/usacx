
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock, CheckCircle, AlertCircle, Users, TrendingUp } from "lucide-react";

export const AttendanceStatsCards = () => {
  const stats = [
    {
      title: "Total de Atendimentos",
      value: "2,847",
      change: "+12% desde ontem",
      trend: "up",
      icon: MessageSquare,
      color: "blue"
    },
    {
      title: "Atendimentos Ativos",
      value: "47",
      change: "3 novos na última hora",
      trend: "up",
      icon: Users,
      color: "green"
    },
    {
      title: "Tempo Médio",
      value: "8m 32s",
      change: "-2m desde ontem",
      trend: "down",
      icon: Clock,
      color: "yellow"
    },
    {
      title: "Taxa de Resolução",
      value: "94.2%",
      change: "+1.2% esta semana",
      trend: "up",
      icon: CheckCircle,
      color: "green"
    },
    {
      title: "Pendentes",
      value: "23",
      change: "5 novos hoje",
      trend: "neutral",
      icon: AlertCircle,
      color: "orange"
    },
    {
      title: "Satisfação (CSAT)",
      value: "4.7/5",
      change: "+0.2 este mês",
      trend: "up",
      icon: TrendingUp,
      color: "purple"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue": return "text-blue-600 bg-blue-50";
      case "green": return "text-green-600 bg-green-50";
      case "yellow": return "text-yellow-600 bg-yellow-50";
      case "orange": return "text-orange-600 bg-orange-50";
      case "purple": return "text-purple-600 bg-purple-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return "↗";
    if (trend === "down") return "↘";
    return "→";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded ${getColorClasses(stat.color)}`}>
              <stat.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground mb-1">
              {stat.value}
            </div>
            <div className="flex items-center text-sm">
              <span className="mr-1">{getTrendIcon(stat.trend)}</span>
              <span className="text-muted-foreground">{stat.change}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
