
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const MOCK_TREND_DATA = [
  { name: "Jan", atendimentos: 980, satisfacao: 4.2, conversao: 65 },
  { name: "Fev", atendimentos: 1120, satisfacao: 4.4, conversao: 68 },
  { name: "Mar", atendimentos: 1050, satisfacao: 4.3, conversao: 67 },
  { name: "Abr", atendimentos: 1200, satisfacao: 4.6, conversao: 70 },
  { name: "Mai", atendimentos: 1350, satisfacao: 4.5, conversao: 72 },
  { name: "Jun", atendimentos: 1247, satisfacao: 4.7, conversao: 69 },
];

const MOCK_CHANNEL_DATA = [
  { name: "WhatsApp", value: 45, color: "#10B981" },
  { name: "Chat Web", value: 30, color: "#3B82F6" },
  { name: "Email", value: 15, color: "#F59E0B" },
  { name: "Telefone", value: 10, color: "#EF4444" },
];

const MOCK_AGENT_PERFORMANCE = [
  { agente: "Ana Silva", atendimentos: 145, satisfacao: 4.8, eficiencia: 92 },
  { agente: "João Lima", atendimentos: 132, satisfacao: 4.6, eficiencia: 88 },
  { agente: "Maria Costa", atendimentos: 128, satisfacao: 4.7, eficiencia: 90 },
  { agente: "Pedro Santos", atendimentos: 118, satisfacao: 4.5, eficiencia: 85 },
  { agente: "Carla Oliveira", atendimentos: 110, satisfacao: 4.9, eficiencia: 94 },
];

export function ReportAnalyticsCharts({ filters }: { filters: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Tendência de Atendimentos */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Tendência de Atendimentos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={MOCK_TREND_DATA}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="atendimentos" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.1}
                name="Atendimentos"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Distribuição por Canal */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Canal</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={MOCK_CHANNEL_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {MOCK_CHANNEL_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, "Participação"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance dos Agentes */}
      <Card>
        <CardHeader>
          <CardTitle>Performance dos Agentes</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={MOCK_AGENT_PERFORMANCE} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="agente" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="atendimentos" fill="#3B82F6" name="Atendimentos" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Evolução da Satisfação */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Evolução da Satisfação e Conversão</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={MOCK_TREND_DATA}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="satisfacao" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Satisfação"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="conversao" 
                stroke="#F59E0B" 
                strokeWidth={2}
                name="Conversão (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
