import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentAgent } from '@/hooks/useCurrentAgent';
import { useTeam } from '@/hooks/useTeam';
import { useTeamMetrics } from '@/hooks/useTeamMetrics';
import { MetricCard } from './MetricCard';
import { Users, Clock, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';
import { AttendanceChart } from './AttendanceChart';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ManagerMetricsSkeleton, 
  ChartSkeleton, 
  AgentListSkeleton,
  AlertSkeleton 
} from '@/components/skeletons';

export const ManagerDashboard = () => {
  const agent = useCurrentAgent();
  const { team, members, loading: teamLoading } = useTeam();
  const { 
    activeConversations,
    finishedToday,
    conversationsInQueue,
    avgResponseTime,
    agentConversations,
    topPerformers,
    nearSlaCount,
    weeklyPerformance,
    loading: metricsLoading,
    error 
  } = useTeamMetrics(agent?.teamId || null);

  const loading = teamLoading || metricsLoading;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'away':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'busy':
        return 'Ocupado';
      case 'away':
        return 'Ausente';
      default:
        return 'Offline';
    }
  };

  // Mostrar erro se houver
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Visão do Time - {team?.name || 'Carregando...'}
          </h2>
          <p className="text-muted-foreground">
            Gerencie e monitore o desempenho da sua equipe.
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
          Visão do Time - {team?.name || 'Carregando...'}
        </h2>
        <p className="text-muted-foreground">
          Gerencie e monitore o desempenho da sua equipe.
        </p>
      </div>

      {/* Métricas do Time */}
      {loading ? (
        <ManagerMetricsSkeleton />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <MetricCard
            title="Total de Agentes"
            value={members.length.toString()}
            description="Membros do time"
            icon={Users}
          />
          <MetricCard
            title="Ativos Agora"
            value={members.filter(m => m.status === 'online').length.toString()}
            description="Agentes online"
            icon={CheckCircle2}
          />
          <MetricCard
            title="Tempo Médio"
            value={avgResponseTime}
            description="Resposta do time"
            icon={Clock}
          />
          <MetricCard
            title="Finalizadas Hoje"
            value={finishedToday.toString()}
            description="Conversas concluídas"
            icon={TrendingUp}
          />
          <MetricCard
            title="Fila"
            value={conversationsInQueue.toString()}
            description="Aguardando atendimento"
            icon={AlertCircle}
          />
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-7">
        {/* Gráfico de Performance do Time */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Performance do Time</CardTitle>
            <CardDescription>
              Conversas finalizadas nos últimos 7 dias
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {loading ? (
              <ChartSkeleton />
            ) : (
              <AttendanceChart data={weeklyPerformance} />
            )}
          </CardContent>
        </Card>

        {/* Status dos Agentes */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Agentes do Time</CardTitle>
            <CardDescription>Status atual de cada membro</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <AgentListSkeleton />
            ) : members.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground">
                Nenhum agente no time
              </div>
            ) : (
              <div className="space-y-4">
                {members.map((member) => {
                  const agentConvCount = agentConversations.find(
                    ac => ac.agentId === member.id
                  )?.activeCount || 0;

                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between space-x-4"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={member.avatar_url || ''} />
                            <AvatarFallback>
                              {member.display_name?.[0]?.toUpperCase() || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <span
                            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(
                              member.status
                            )}`}
                          />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium leading-none">
                            {member.display_name || 'Agente'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getStatusLabel(member.status)}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {agentConvCount} {agentConvCount === 1 ? 'conversa' : 'conversas'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Ações Rápidas */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Alertas do Time</CardTitle>
            <CardDescription>Ações que requerem atenção</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <AlertSkeleton />
            ) : (
              <>
                {conversationsInQueue > 0 && (
                  <div className="flex items-start space-x-3 rounded-lg border p-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-500" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        {conversationsInQueue} {conversationsInQueue === 1 ? 'conversa' : 'conversas'} na fila
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Aguardando distribuição para agentes
                      </p>
                    </div>
                  </div>
                )}
                {nearSlaCount > 0 && (
                  <div className="flex items-start space-x-3 rounded-lg border p-3">
                    <Clock className="mt-0.5 h-5 w-5 text-orange-500" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        {nearSlaCount} {nearSlaCount === 1 ? 'atendimento próximo' : 'atendimentos próximos'} ao SLA
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Conversas ativas há mais de 30 minutos
                      </p>
                    </div>
                  </div>
                )}
                {conversationsInQueue === 0 && nearSlaCount === 0 && (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    Tudo certo! Nenhum alerta no momento 🎉
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>Melhores agentes do dia</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <AgentListSkeleton />
            ) : topPerformers.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                Nenhuma conversa finalizada hoje
              </div>
            ) : (
              <>
                {topPerformers.map((performer, index) => {
                  const medalColors = [
                    { bg: 'bg-yellow-100', text: 'text-yellow-600' },
                    { bg: 'bg-gray-100', text: 'text-gray-600' },
                    { bg: 'bg-orange-100', text: 'text-orange-600' },
                  ];
                  const colors = medalColors[index] || medalColors[2];

                  return (
                    <div key={performer.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${colors.bg} ${colors.text} font-medium`}>
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium">
                          {performer.displayName || 'Agente'}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {performer.conversationsCount} {performer.conversationsCount === 1 ? 'conversa' : 'conversas'}
                      </span>
                    </div>
                  );
                })}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
