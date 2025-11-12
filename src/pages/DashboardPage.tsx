import { MetricCard } from "@/components/dashboard/MetricCard";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { ChannelChart } from "@/components/dashboard/ChannelChart";
import { LiveActivityTable } from "@/components/dashboard/LiveActivityTable";
import { MessageSquare, Users, Clock, TrendingUp, UserCheck, PhoneCall, Star, BarChart3 } from "lucide-react";

const DashboardPage = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Ultimate SAC</h1>
          <p className="text-muted-foreground">Visão geral do sistema de atendimento</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Última atualização</p>
          <p className="text-sm font-medium">{new Date().toLocaleTimeString("pt-BR")}</p>
        </div>
      </div>

      {/* Alertas em Destaque */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <AlertCard />
        </div>
        <MetricCard
          title="SLA Atendimento"
          value="87%"
          change="-3% vs ontem"
          changeType="negative"
          icon={Clock}
          description="Meta: 90%"
        />
      </div>

      {/* Métricas Principais */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Atendimentos Ativos"
          value="23"
          change="+15% vs média"
          changeType="positive"
          icon={MessageSquare}
        />
        <MetricCard title="Agentes Online" value="8" change="2 ausentes" changeType="neutral" icon={Users} />
        <MetricCard
          title="Tempo Médio Espera"
          value="3m 45s"
          change="+45s vs ontem"
          changeType="negative"
          icon={Clock}
        />
        <MetricCard title="Taxa Resolução" value="94%" change="+2% vs semana" changeType="positive" icon={TrendingUp} />
      </div>

      {/* Métricas Secundárias */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Atendimentos Hoje"
          value="342"
          change="+28 vs ontem"
          changeType="positive"
          icon={BarChart3}
        />
        <MetricCard title="Agentes Ativos" value="6" description="75% da equipe" icon={UserCheck} />
        <MetricCard title="Chamadas Perdidas" value="4" change="-2 vs média" changeType="positive" icon={PhoneCall} />
        <MetricCard title="CSAT Médio" value="4.7" change="+0.2 vs semana" changeType="positive" icon={Star} />
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        <AttendanceChart />
        <ChannelChart />
      </div>

      {/* Tabela de Atividades */}
      <LiveActivityTable />
    </div>
  );
};

export default DashboardPage;
