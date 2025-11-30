import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentAgent } from '@/hooks/useCurrentAgent';
import { useAgentMetrics } from '@/hooks/useAgentMetrics';
import { MetricCard } from './MetricCard';
import { MessageSquare, Clock, CheckCircle2, TrendingUp, Loader2 } from 'lucide-react';
import { AttendanceChart } from './AttendanceChart';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const AgentDashboard = () => {
  const agent = useCurrentAgent();
  const { 
    activeConversations, 
    finishedToday, 
    avgResponseTime, 
    weeklyPerformance,
    loading, 
    error 
  } = useAgentMetrics();

  // Mostrar erro se houver
  if (error) {
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
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar métricas: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
          value={loading ? '--' : activeConversations.toString()}
          description="Atendimentos em andamento"
          icon={loading ? Loader2 : MessageSquare}
        />
        <MetricCard
          title="Tempo Médio"
          value={loading ? '--' : avgResponseTime}
          description="Tempo médio de resposta"
          icon={loading ? Loader2 : Clock}
        />
        <MetricCard
          title="Finalizadas Hoje"
          value={loading ? '--' : finishedToday.toString()}
          description="Conversas concluídas"
          icon={loading ? Loader2 : CheckCircle2}
        />
        <MetricCard
          title="Satisfação"
          value="Em breve"
          description="Aguardando avaliações"
          icon={TrendingUp}
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
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <AttendanceChart data={weeklyPerformance} />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Objetivos Diários</CardTitle>
            <CardDescription>Progresso das suas metas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Conversas</span>
                    <span className="font-medium">{finishedToday}/15</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div 
                      className="h-full rounded-full bg-primary transition-all" 
                      style={{ width: `${Math.min((finishedToday / 15) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Satisfação</span>
                    <span className="font-medium">Em breve</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div className="h-full w-0 rounded-full bg-green-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tempo Resposta</span>
                    <span className="font-medium">{avgResponseTime}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div 
                      className="h-full rounded-full bg-green-500 transition-all" 
                      style={{ width: avgResponseTime === '--' ? '0%' : '85%' }}
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status e Horário - TODO: Implementar time tracking real */}
      <Card>
        <CardHeader>
          <CardTitle>Minha Jornada Hoje</CardTitle>
          <CardDescription>Registro de ponto e pausas (em desenvolvimento)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Entrada
              </p>
              <p className="text-2xl font-bold text-muted-foreground">--:--</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Tempo Trabalhado
              </p>
              <p className="text-2xl font-bold text-muted-foreground">--h --m</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Pausas Hoje
              </p>
              <p className="text-2xl font-bold text-muted-foreground">-- (--m)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
