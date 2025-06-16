
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

const PRODUCTIVITY_BY_AGENT_DATA = [
  { agent: "Maria Silva", tickets: 156, avgTime: 12.5, satisfaction: 4.8 },
  { agent: "João Santos", tickets: 142, avgTime: 14.2, satisfaction: 4.6 },
  { agent: "Ana Costa", tickets: 138, avgTime: 13.8, satisfaction: 4.7 },
  { agent: "Pedro Oliveira", tickets: 134, avgTime: 15.1, satisfaction: 4.5 },
  { agent: "Carla Souza", tickets: 129, avgTime: 16.3, satisfaction: 4.4 },
  { agent: "Lucas Ferreira", tickets: 125, avgTime: 17.2, satisfaction: 4.3 },
];

const PERFORMANCE_TREND_DATA = [
  { date: "01/12", responseTime: 1.2, resolutionTime: 14.5, satisfaction: 4.5 },
  { date: "02/12", responseTime: 1.1, resolutionTime: 15.2, satisfaction: 4.6 },
  { date: "03/12", responseTime: 1.3, resolutionTime: 13.8, satisfaction: 4.7 },
  { date: "04/12", responseTime: 1.0, resolutionTime: 14.1, satisfaction: 4.6 },
  { date: "05/12", responseTime: 1.2, resolutionTime: 15.8, satisfaction: 4.5 },
  { date: "06/12", responseTime: 0.9, resolutionTime: 12.9, satisfaction: 4.8 },
  { date: "07/12", responseTime: 1.1, resolutionTime: 13.5, satisfaction: 4.7 },
];

const DEPARTMENT_PERFORMANCE_DATA = [
  { department: "Vendas", value: 92, color: "#8884d8" },
  { department: "Suporte", value: 88, color: "#82ca9d" },
  { department: "Financeiro", value: 85, color: "#ffc658" },
  { department: "Comercial", value: 90, color: "#ff7300" },
];

const AGENT_RADAR_DATA = [
  { metric: "Produtividade", maria: 95, joao: 85, ana: 90 },
  { metric: "Qualidade", maria: 88, joao: 92, ana: 87 },
  { metric: "Velocidade", maria: 90, joao: 78, ana: 85 },
  { metric: "Satisfação", maria: 96, joao: 92, ana: 94 },
  { metric: "Disponibilidade", maria: 98, joao: 95, ana: 97 },
];

export function ReportPerformanceCharts({ filters }: { filters: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Produtividade por Agente */}
      <Card>
        <CardHeader>
          <CardTitle>Produtividade por Agente</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={PRODUCTIVITY_BY_AGENT_DATA}>
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
                data={DEPARTMENT_PERFORMANCE_DATA}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ department, value }) => `${department}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {DEPARTMENT_PERFORMANCE_DATA.map((entry, index) => (
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
            <LineChart data={PERFORMANCE_TREND_DATA}>
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
            <RadarChart data={AGENT_RADAR_DATA}>
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
