import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAllTeams } from '@/hooks/useTeam';
import { MetricCard } from './MetricCard';
import { Users, Clock, CheckCircle2, TrendingUp, Building2, MessageSquare } from 'lucide-react';
import { AttendanceChart } from './AttendanceChart';
import { ChannelChart } from './ChannelChart';
import { LiveActivityTable } from './LiveActivityTable';

export const AdminDashboard = () => {
  const { teams, loading } = useAllTeams();

  // Mock data - será substituído por dados reais da API
  const globalMetrics = {
    totalAgents: 45,
    activeNow: 32,
    totalConversations: 1248,
    avgSatisfaction: 4.7,
    totalTeams: teams.length,
    conversationsToday: 156,
  };

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

      {/* Métricas Globais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <MetricCard
          title="Total de Agentes"
          value={globalMetrics.totalAgents.toString()}
          description="Todos os agentes"
          icon={Users}
        />
        <MetricCard
          title="Ativos Agora"
          value={globalMetrics.activeNow.toString()}
          description="Agentes online"
          icon={CheckCircle2}
          change="+12% vs. ontem"
          changeType="positive"
        />
        <MetricCard
          title="Times Ativos"
          value={globalMetrics.totalTeams.toString()}
          description="Total de equipes"
          icon={Building2}
        />
        <MetricCard
          title="Conversas Hoje"
          value={globalMetrics.conversationsToday.toString()}
          description="Atendimentos do dia"
          icon={MessageSquare}
          change="+8% vs. ontem"
          changeType="positive"
        />
        <MetricCard
          title="Total no Mês"
          value={globalMetrics.totalConversations.toString()}
          description="Conversas finalizadas"
          icon={CheckCircle2}
          change="+15% vs. mês anterior"
          changeType="positive"
        />
        <MetricCard
          title="Satisfação Geral"
          value={`${globalMetrics.avgSatisfaction}/5.0`}
          description="Avaliação média"
          icon={TrendingUp}
          change="+2% vs. mês anterior"
          changeType="positive"
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
            <AttendanceChart />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Canais de Atendimento</CardTitle>
            <CardDescription>Distribuição por canal</CardDescription>
          </CardHeader>
          <CardContent>
            <ChannelChart />
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
              <div className="text-center text-sm text-muted-foreground">
                Carregando times...
              </div>
            ) : teams.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground">
                Nenhum time cadastrado
              </div>
            ) : (
              <div className="space-y-4">
                {teams.slice(0, 5).map((team, index) => (
                  <div
                    key={team.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{team.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {Math.floor(Math.random() * 10) + 5} agentes
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {Math.floor(Math.random() * 50) + 100} conversas
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(4 + Math.random()).toFixed(1)}/5.0 ⭐
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
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Capacidade de Atendimento</span>
                <span className="font-medium">78%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary">
                <div className="h-full w-[78%] rounded-full bg-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Taxa de Resolução</span>
                <span className="font-medium">92%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary">
                <div className="h-full w-[92%] rounded-full bg-green-500" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">SLA Cumprido</span>
                <span className="font-medium">95%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary">
                <div className="h-full w-[95%] rounded-full bg-green-500" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tempo Médio Resposta</span>
                <span className="font-medium text-green-600">2m 45s</span>
              </div>
            </div>
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
          <LiveActivityTable />
        </CardContent>
      </Card>
    </div>
  );
};
