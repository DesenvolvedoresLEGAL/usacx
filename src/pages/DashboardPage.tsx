
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { BarChart2, MessageSquare, Users, Clock } from "lucide-react";

const DashboardPage = () => {
  const stats = [
    { title: "Atendimentos Ativos", value: "12", icon: MessageSquare, color: "text-blue-500" },
    { title: "Agentes Online", value: "8", icon: Users, color: "text-green-500" },
    { title: "Tempo Médio de Espera", value: "2m 15s", icon: Clock, color: "text-yellow-500" },
    { title: "Satisfação (CSAT)", value: "92%", icon: BarChart2, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Volume de Atendimentos</CardTitle>
            <CardDescription>Últimas 24 horas</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
            {/* Placeholder for chart */}
            <BarChart2 className="h-16 w-16" />
            <span className="ml-2">Gráfico de Volume de Atendimentos</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Desempenho dos Agentes</CardTitle>
            <CardDescription>Visão geral do dia</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
            {/* Placeholder for chart or list */}
            <Users className="h-16 w-16" />
            <span className="ml-2">Visão Geral do Desempenho dos Agentes</span>
          </CardContent>
        </Card>
      </div>
      
      {/* Reminder about Supabase */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-700">Próximos Passos: Backend e Dados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-600">
            Este é um painel visual. Para funcionalidades completas como autenticação real,
            gerenciamento de conversas em tempo real e métricas dinâmicas,
            será necessário integrar com o backend (FastAPI) e o banco de dados (Supabase).
          </p>
          <p className="text-sm text-blue-600 mt-2">
            Lembre-se de conectar seu projeto Lovable ao Supabase para habilitar essas funcionalidades.
            Você pode fazer isso clicando no botão verde do Supabase na interface do Lovable.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
