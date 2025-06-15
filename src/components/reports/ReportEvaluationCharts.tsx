
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const ratingDistribution = [
  { rating: "5★", count: 856, percentage: 46.4 },
  { rating: "4★", count: 623, percentage: 33.7 },
  { rating: "3★", count: 245, percentage: 13.3 },
  { rating: "2★", count: 89, percentage: 4.8 },
  { rating: "1★", count: 34, percentage: 1.8 },
];

const satisfactionTrend = [
  { month: "Jan", rating: 4.3, evaluations: 142 },
  { month: "Fev", rating: 4.4, evaluations: 156 },
  { month: "Mar", rating: 4.2, evaluations: 189 },
  { month: "Abr", rating: 4.5, evaluations: 203 },
  { month: "Mai", rating: 4.6, evaluations: 178 },
  { month: "Jun", rating: 4.6, evaluations: 201 },
];

const channelSatisfaction = [
  { name: "WhatsApp", value: 4.7, color: "#25D366" },
  { name: "Chat Web", value: 4.5, color: "#735DF8" },
  { name: "Email", value: 4.3, color: "#4285F4" },
  { name: "Telefone", value: 4.1, color: "#FF6B6B" },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function ReportEvaluationCharts({ filters }: { filters: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Distribuição das Avaliações */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Distribuição das Avaliações</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'count' ? `${value} avaliações` : `${value}%`,
                  name === 'count' ? 'Quantidade' : 'Percentual'
                ]}
              />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Evolução da Satisfação */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Evolução da Satisfação</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={satisfactionTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[3.5, 5]} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'rating' ? `${value} ★` : `${value} avaliações`,
                  name === 'rating' ? 'Nota Média' : 'Total de Avaliações'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="rating" 
                stroke="#8884d8" 
                strokeWidth={3}
                dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Satisfação por Canal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Satisfação por Canal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {channelSatisfaction.map((channel, index) => (
              <div key={channel.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: channel.color }}
                  />
                  <span className="font-medium">{channel.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="font-bold">{channel.value} ★</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumo Geral */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumo por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ratingDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ rating, percentage }) => `${rating} (${percentage}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {ratingDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} avaliações`, 'Quantidade']} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
