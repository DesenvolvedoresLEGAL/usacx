
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const BREAK_BY_TYPE_DATA = [
  { name: "Almoço", value: 89, color: "#8884d8" },
  { name: "Lanche", value: 67, color: "#82ca9d" },
  { name: "Banheiro", value: 45, color: "#ffc658" },
  { name: "Treinamento", value: 34, color: "#ff7300" },
  { name: "Reunião", value: 28, color: "#00ff88" },
  { name: "Técnica", value: 79, color: "#ff8888" },
];

const BREAK_BY_HOUR_DATA = [
  { hour: "08:00", breaks: 12 },
  { hour: "09:00", breaks: 8 },
  { hour: "10:00", breaks: 15 },
  { hour: "11:00", breaks: 6 },
  { hour: "12:00", breaks: 45 },
  { hour: "13:00", breaks: 38 },
  { hour: "14:00", breaks: 22 },
  { hour: "15:00", breaks: 18 },
  { hour: "16:00", breaks: 14 },
  { hour: "17:00", breaks: 25 },
  { hour: "18:00", breaks: 9 },
];

const BREAK_DURATION_TREND_DATA = [
  { day: "Seg", avgDuration: 18.5 },
  { day: "Ter", avgDuration: 19.2 },
  { day: "Qua", avgDuration: 17.8 },
  { day: "Qui", avgDuration: 20.1 },
  { day: "Sex", avgDuration: 16.9 },
  { day: "Sáb", avgDuration: 15.2 },
  { day: "Dom", avgDuration: 14.8 },
];

export function ReportBreakCharts({ filters }: { filters: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pausas por Tipo */}
      <Card>
        <CardHeader>
          <CardTitle>Pausas por Tipo</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={BREAK_BY_TYPE_DATA}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {BREAK_BY_TYPE_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pausas por Horário */}
      <Card>
        <CardHeader>
          <CardTitle>Pausas por Horário</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={BREAK_BY_HOUR_DATA}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="breaks" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Duração Média das Pausas por Dia */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Duração Média das Pausas por Dia da Semana</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={BREAK_DURATION_TREND_DATA}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis label={{ value: 'Minutos', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value} min`, 'Duração Média']} />
              <Line type="monotone" dataKey="avgDuration" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
