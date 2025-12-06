import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAllTeams } from '@/hooks/useTeam';
import { useAdminMetrics } from '@/hooks/useAdminMetrics';
import { MetricCard } from './MetricCard';
import { GoalsDashboard } from './GoalsDashboard';
import { Users, Clock, CheckCircle2, TrendingUp, Building2, MessageSquare, Loader2 } from 'lucide-react';
import { AttendanceChart } from './AttendanceChart';
import { ChannelChart } from './ChannelChart';
import { LiveActivityTable } from './LiveActivityTable';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const AdminDashboard = () => {
  const { teams, loading: teamsLoading } = useAllTeams();
  const {
    totalAgents,
    agentsOnline,
    conversationsToday,
    conversationsMonth,
    resolutionRate,
    avgResponseTime,
    channelDistribution,
    teamPerformance,
    liveActivity,
    weeklyPerformance,
    loading: metricsLoading,
    error
  } = useAdminMetrics();

  const loading = teamsLoading || metricsLoading;

  // Mostrar erro se houver
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Visão Global - Administração
          </h2>
          <p className="text-muted-foreground">
            Painel completo de todas as operações da plataforma.
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Visão Global - Administração
          </h2>
          <p className="text-muted-foreground">
            Painel completo de todas as operações da plataforma.
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="goals">Metas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">

      {/* Métricas Globais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <MetricCard
          title="Total de Agentes"
          value={loading ? '--' : totalAgents.toString()}
          description="Todos os agentes"
          icon={loading ? Loader2 : Users}
        />
        <MetricCard
          title="Ativos Agora"
          value={loading ? '--' : agentsOnline.toString()}
          description="Agentes online"
          icon={loading ? Loader2 : CheckCircle2}
        />
        <MetricCard
          title="Times Ativos"
          value={loading ? '--' : teams.length.toString()}
          description="Total de equipes"
          icon={loading ? Loader2 : Building2}
        />
        <MetricCard
          title="Conversas Hoje"
          value={loading ? '--' : conversationsToday.toString()}
          description="Atendimentos do dia"
          icon={loading ? Loader2 : MessageSquare}
        />
        <MetricCard
          title="Total no Mês"
          value={loading ? '--' : conversationsMonth.toString()}
          description="Conversas iniciadas"
          icon={loading ? Loader2 : TrendingUp}
        />
        <MetricCard
          title="Taxa de Resolução"
          value={loading ? '--' : `${resolutionRate}%`}
          description="Conversas finalizadas"
          icon={loading ? Loader2 : CheckCircle2}
        />
      </div>

      {/* Gráficos Principais */}
      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Performance Global</CardTitle>
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
            <CardTitle>Canais de Atendimento</CardTitle>
            <CardDescription>Distribuição por canal (últimos 30 dias)</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ChannelChart data={channelDistribution} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Times e Performance */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance por Time</CardTitle>
            <CardDescription>Ranking de equipes</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : teamPerformance.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                Nenhuma conversa finalizada hoje
              </div>
            ) : (
              <div className="space-y-4">
                {teamPerformance.slice(0, 5).map((team, index) => (
                  <div
                    key={team.teamId}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{team.teamName}</p>
                        <p className="text-xs text-muted-foreground">
                          {team.agentCount} {team.agentCount === 1 ? 'agente' : 'agentes'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {team.conversationsCount} {team.conversationsCount === 1 ? 'conversa' : 'conversas'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        hoje
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estatísticas do Sistema</CardTitle>
            <CardDescription>Saúde geral da plataforma</CardDescription>
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
                    <span className="text-muted-foreground">Capacidade de Atendimento</span>
                    <span className="font-medium">
                      {agentsOnline > 0 ? Math.round((agentsOnline / totalAgents) * 100) : 0}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div 
                      className="h-full rounded-full bg-primary transition-all" 
                      style={{ width: `${agentsOnline > 0 ? Math.round((agentsOnline / totalAgents) * 100) : 0}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Taxa de Resolução</span>
                    <span className="font-medium">{resolutionRate}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div 
                      className="h-full rounded-full bg-green-500 transition-all" 
                      style={{ width: `${resolutionRate}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Conversas Ativas</span>
                    <span className="font-medium">{liveActivity.length}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div 
                      className="h-full rounded-full bg-blue-500 transition-all" 
                      style={{ width: `${Math.min((liveActivity.length / 50) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tempo Médio Resposta</span>
                    <span className={`font-medium ${avgResponseTime !== '--' ? 'text-green-600' : ''}`}>
                      {avgResponseTime}
                    </span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Atividade em Tempo Real */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade em Tempo Real</CardTitle>
          <CardDescription>
            Conversas ativas no momento
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <LiveActivityTable data={liveActivity} />
          )}
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="goals">
          <GoalsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};
