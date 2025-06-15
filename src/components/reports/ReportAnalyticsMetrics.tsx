
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Users, Clock, Star, Target } from "lucide-react";

const MOCK_METRICS = [
  {
    title: "Total de Atendimentos",
    value: "1,247",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    comparison: "vs período anterior",
  },
  {
    title: "Tempo Médio de Resposta",
    value: "2m 34s",
    change: "-8.2%",
    trend: "down",
    icon: Clock,
    comparison: "vs período anterior",
  },
  {
    title: "Satisfação Média",
    value: "4.7",
    change: "+0.3",
    trend: "up",
    icon: Star,
    comparison: "vs período anterior",
  },
  {
    title: "Taxa de Conversão",
    value: "68.9%",
    change: "0.0%",
    trend: "neutral",
    icon: Target,
    comparison: "vs período anterior",
  },
];

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    case "down":
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    default:
      return <Minus className="w-4 h-4 text-gray-500" />;
  }
};

const getTrendColor = (trend: string) => {
  switch (trend) {
    case "up":
      return "text-green-600";
    case "down":
      return "text-red-600";
    default:
      return "text-gray-500";
  }
};

export function ReportAnalyticsMetrics({ filters }: { filters: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {MOCK_METRICS.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <IconComponent className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                {getTrendIcon(metric.trend)}
                <span className={getTrendColor(metric.trend)}>
                  {metric.change}
                </span>
                <span>{metric.comparison}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
