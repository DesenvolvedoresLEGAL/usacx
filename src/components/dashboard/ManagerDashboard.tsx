import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentAgent } from '@/hooks/useCurrentAgent';
import { useTeam } from '@/hooks/useTeam';
import { MetricCard } from './MetricCard';
import { Users, Clock, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';
import { AttendanceChart } from './AttendanceChart';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export const ManagerDashboard = () => {
  const agent = useCurrentAgent();
  const { team, members, loading } = useTeam();

  // Mock data - será substituído por dados reais da API
  const teamMetrics = {
    totalAgents: members.length,
    activeNow: members.filter(m => m.status === 'online').length,
    avgResponseTime: '3m 15s',
    teamSatisfaction: 4.6,
    conversationsInQueue: 8,
  };

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="Total de Agentes"
          value={teamMetrics.totalAgents.toString()}
          description="Membros do time"
          icon={Users}
        />
        <MetricCard
          title="Ativos Agora"
          value={teamMetrics.activeNow.toString()}
          description="Agentes online"
          icon={CheckCircle2}
          change="+15% vs. ontem"
          changeType="positive"
        />
        <MetricCard
          title="Tempo Médio"
          value={teamMetrics.avgResponseTime}
          description="Resposta do time"
          icon={Clock}
          change="-5% vs. ontem"
          changeType="positive"
        />
        <MetricCard
          title="Satisfação"
          value={`${teamMetrics.teamSatisfaction}/5.0`}
          description="Avaliação do time"
          icon={TrendingUp}
          change="+3% vs. semana passada"
          changeType="positive"
        />
        <MetricCard
          title="Fila"
          value={teamMetrics.conversationsInQueue.toString()}
          description="Aguardando atendimento"
          icon={AlertCircle}
        />
      </div>

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
            <AttendanceChart />
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
              <div className="text-center text-sm text-muted-foreground">
                Carregando...
              </div>
            ) : members.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground">
                Nenhum agente no time
              </div>
            ) : (
              <div className="space-y-4">
                {members.map((member) => (
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
                      5 conversas
                    </Badge>
                  </div>
                ))}
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
            <div className="flex items-start space-x-3 rounded-lg border p-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-500" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">8 conversas na fila</p>
                <p className="text-xs text-muted-foreground">
                  Tempo médio de espera: 5 minutos
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 rounded-lg border p-3">
              <Clock className="mt-0.5 h-5 w-5 text-orange-500" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">3 atendimentos próximos ao SLA</p>
                <p className="text-xs text-muted-foreground">
                  Requerem intervenção em breve
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>Melhores agentes do dia</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                  1
                </div>
                <span className="text-sm font-medium">João Silva</span>
              </div>
              <span className="text-sm text-muted-foreground">18 conversas</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                  2
                </div>
                <span className="text-sm font-medium">Maria Santos</span>
              </div>
              <span className="text-sm text-muted-foreground">15 conversas</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  3
                </div>
                <span className="text-sm font-medium">Pedro Costa</span>
              </div>
              <span className="text-sm text-muted-foreground">14 conversas</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
