
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export function ReportClientStats({ filters }: { filters: any }) {
  const stats = {
    totalClients: 0,
    newClients: 0,
    activeClients: 0,
    avgSatisfaction: 0,
    bySegment: [],
    byChannel: [],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Cards de métricas principais */}
      <Card>
        <CardContent className="py-4 flex flex-col gap-1 items-start">
          <span className="text-sm text-muted-foreground">Total de Clientes</span>
          <span className="font-bold text-2xl">{stats.totalClients.toLocaleString()}</span>
          <span className="text-xs text-green-600">+12% vs mês anterior</span>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="py-4 flex flex-col gap-1 items-start">
          <span className="text-sm text-muted-foreground">Novos Clientes</span>
          <span className="font-bold text-2xl">{stats.newClients}</span>
          <span className="text-xs text-green-600">+8% vs mês anterior</span>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="py-4 flex flex-col gap-1 items-start">
          <span className="text-sm text-muted-foreground">Clientes Ativos</span>
          <span className="font-bold text-2xl">{stats.activeClients.toLocaleString()}</span>
          <span className="text-xs text-yellow-600">-2% vs mês anterior</span>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="py-4 flex flex-col gap-1 items-start">
          <span className="text-sm text-muted-foreground">Satisfação Média</span>
          <span className="font-bold text-2xl">{stats.avgSatisfaction}★</span>
          <span className="text-xs text-green-600">+0.2 vs mês anterior</span>
        </CardContent>
      </Card>

      {/* Gráfico por segmento */}
      <Card className="md:col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Distribuição por Segmento</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie 
                data={stats.bySegment} 
                dataKey="value" 
                nameKey="name"
                cx="50%" cy="50%"
                outerRadius={80}
                innerRadius={40}
              >
                {stats.bySegment.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico por canal */}
      <Card className="md:col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Clientes por Canal Preferido</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.byChannel}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="clients" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
