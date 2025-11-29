import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentAgent } from '@/hooks/useCurrentAgent';
import { MetricCard } from './MetricCard';
import { MessageSquare, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import { AttendanceChart } from './AttendanceChart';

export const AgentDashboard = () => {
  const agent = useCurrentAgent();

  // Mock data - será substituído por dados reais da API
  const metrics = {
    activeConversations: 5,
    avgResponseTime: '2m 30s',
    completedToday: 12,
    satisfaction: 4.8,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Olá, {agent?.displayName || 'Agente'}!
        </h2>
        <p className="text-muted-foreground">
          Aqui está o resumo do seu desempenho hoje.
        </p>
      </div>

      {/* Métricas Pessoais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Conversas Ativas"
          value={metrics.activeConversations.toString()}
          description="Atendimentos em andamento"
          icon={MessageSquare}
          change="+12% vs. ontem"
          changeType="positive"
        />
        <MetricCard
          title="Tempo Médio"
          value={metrics.avgResponseTime}
          description="Tempo médio de resposta"
          icon={Clock}
          change="-8% vs. ontem"
          changeType="positive"
        />
        <MetricCard
          title="Finalizadas Hoje"
          value={metrics.completedToday.toString()}
          description="Conversas concluídas"
          icon={CheckCircle2}
          change="+20% vs. ontem"
          changeType="positive"
        />
        <MetricCard
          title="Satisfação"
          value={`${metrics.satisfaction}/5.0`}
          description="Avaliação média"
          icon={TrendingUp}
          change="+5% vs. semana passada"
          changeType="positive"
        />
      </div>

      {/* Gráfico de Atividade Pessoal */}
      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Meu Desempenho Semanal</CardTitle>
            <CardDescription>
              Conversas finalizadas nos últimos 7 dias
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <AttendanceChart />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Objetivos Diários</CardTitle>
            <CardDescription>Progresso das suas metas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Conversas</span>
                <span className="font-medium">12/15</span>
              </div>
              <div className="h-2 rounded-full bg-secondary">
                <div className="h-full w-4/5 rounded-full bg-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Satisfação</span>
                <span className="font-medium">4.8/5.0</span>
              </div>
              <div className="h-2 rounded-full bg-secondary">
                <div className="h-full w-[96%] rounded-full bg-green-500" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tempo Resposta</span>
                <span className="font-medium">Excelente</span>
              </div>
              <div className="h-2 rounded-full bg-secondary">
                <div className="h-full w-full rounded-full bg-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status e Horário */}
      <Card>
        <CardHeader>
          <CardTitle>Minha Jornada Hoje</CardTitle>
          <CardDescription>Registro de ponto e pausas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Entrada
              </p>
              <p className="text-2xl font-bold">08:00</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Tempo Trabalhado
              </p>
              <p className="text-2xl font-bold">6h 30m</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Pausas Hoje
              </p>
              <p className="text-2xl font-bold">3x (45m)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
