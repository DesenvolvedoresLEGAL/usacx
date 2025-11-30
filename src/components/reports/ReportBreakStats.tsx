
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, PauseCircle, TrendingUp, TrendingDown, Users, Timer } from "lucide-react";

export function ReportBreakStats({ filters }: { filters: any }) {
  const stats = {
    totalBreaks: 0,
    avgBreakDuration: "--",
    totalBreakTime: "--",
    agentsOnBreak: 0,
    trend: {
      breaks: "--",
      duration: "--",
      totalTime: "--",
      agents: "--",
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total de Pausas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total de Pausas
          </CardTitle>
          <PauseCircle className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalBreaks}</div>
          <div className="flex items-center gap-1 text-xs text-green-600">
            <TrendingUp className="w-3 h-3" />
            <span>{stats.trend.breaks} vs período anterior</span>
          </div>
        </CardContent>
      </Card>

      {/* Duração Média */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Duração Média
          </CardTitle>
          <Timer className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgBreakDuration}</div>
          <div className="flex items-center gap-1 text-xs text-green-600">
            <TrendingDown className="w-3 h-3" />
            <span>{stats.trend.duration} vs período anterior</span>
          </div>
        </CardContent>
      </Card>

      {/* Tempo Total em Pausas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Tempo Total em Pausas
          </CardTitle>
          <Clock className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalBreakTime}</div>
          <div className="flex items-center gap-1 text-xs text-red-600">
            <TrendingUp className="w-3 h-3" />
            <span>{stats.trend.totalTime} vs período anterior</span>
          </div>
        </CardContent>
      </Card>

      {/* Agentes em Pausa */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Agentes em Pausa
          </CardTitle>
          <Users className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.agentsOnBreak}</div>
          <div className="flex items-center gap-1 text-xs text-green-600">
            <TrendingUp className="w-3 h-3" />
            <span>{stats.trend.agents} vs período anterior</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
