
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

export function ReportPerformanceCharts({ filters }: { filters: any }) {
  const productivityByAgentData: any[] = [];
  const performanceTrendData: any[] = [];
  const departmentPerformanceData: any[] = [];
  const agentRadarData: any[] = [];

  if (productivityByAgentData.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">Nenhum dado de performance disponível no momento.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Produtividade por Agente */}
      <Card>
        <CardHeader>
          <CardTitle>Produtividade por Agente</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productivityByAgentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="agent" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tickets" fill="#8884d8" name="Tickets Processados" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance por Departamento */}
      <Card>
        <CardHeader>
          <CardTitle>Performance por Departamento</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentPerformanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ department, value }) => `${department}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {departmentPerformanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Performance']} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tendência de Performance */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Tendência de Performance - Últimos 7 Dias</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="time" orientation="left" label={{ value: 'Tempo (min)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="satisfaction" orientation="right" label={{ value: 'Satisfação', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Line yAxisId="time" type="monotone" dataKey="responseTime" stroke="#8884d8" name="Tempo de Resposta (min)" strokeWidth={2} />
              <Line yAxisId="time" type="monotone" dataKey="resolutionTime" stroke="#82ca9d" name="Tempo de Resolução (min)" strokeWidth={2} />
              <Line yAxisId="satisfaction" type="monotone" dataKey="satisfaction" stroke="#ffc658" name="Satisfação" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Radar de Performance dos Top 3 Agentes */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Comparativo de Performance - Top 3 Agentes</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={agentRadarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={18} domain={[0, 100]} />
              <Radar name="Maria Silva" dataKey="maria" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} strokeWidth={2} />
              <Radar name="João Santos" dataKey="joao" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.2} strokeWidth={2} />
              <Radar name="Ana Costa" dataKey="ana" stroke="#ffc658" fill="#ffc658" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
