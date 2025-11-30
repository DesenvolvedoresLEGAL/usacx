
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, TrendingUp, TrendingDown, ThumbsUp, MessageSquare } from "lucide-react";

export function ReportEvaluationStats({ filters }: { filters: any }) {
  const stats = {
    totalEvaluations: 0,
    averageRating: 0,
    satisfactionRate: 0,
    responseRate: 0,
    trend: {
      rating: "--",
      satisfaction: "--",
      response: "--",
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total de Avaliações */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total de Avaliações
          </CardTitle>
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalEvaluations.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            avaliações recebidas
          </p>
        </CardContent>
      </Card>

      {/* Nota Média */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Nota Média
          </CardTitle>
          <Star className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold flex items-center gap-1">
            {stats.averageRating}
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          </div>
          <div className="flex items-center gap-1 text-xs text-green-600">
            <TrendingUp className="w-3 h-3" />
            <span>{stats.trend.rating} vs período anterior</span>
          </div>
        </CardContent>
      </Card>

      {/* Taxa de Satisfação */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Taxa de Satisfação
          </CardTitle>
          <ThumbsUp className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.satisfactionRate}%</div>
          <div className="flex items-center gap-1 text-xs text-green-600">
            <TrendingUp className="w-3 h-3" />
            <span>{stats.trend.satisfaction} vs período anterior</span>
          </div>
        </CardContent>
      </Card>

      {/* Taxa de Resposta */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Taxa de Resposta
          </CardTitle>
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.responseRate}%</div>
          <div className="flex items-center gap-1 text-xs text-red-600">
            <TrendingDown className="w-3 h-3" />
            <span>{stats.trend.response} vs período anterior</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
