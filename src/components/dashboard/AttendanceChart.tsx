
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface WeeklyData {
  day: string;
  count: number;
}

interface AttendanceChartProps {
  data?: WeeklyData[];
}

const chartConfig = {
  count: {
    label: "Conversas",
    color: "#020cbc",
  },
};

export const AttendanceChart = ({ data = [] }: AttendanceChartProps) => {
  // Formatar dados para o gráfico (dia da semana abreviado)
  const formatDay = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days[date.getDay()];
  };

  const chartData = data.map(item => ({
    day: formatDay(item.day),
    count: item.count,
  }));

  // Se não houver dados, mostrar mensagem
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
        Nenhuma conversa finalizada nos últimos 7 dias
      </div>
    );
  }
  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis 
            dataKey="day" 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="var(--color-count)" 
            strokeWidth={3}
            dot={{ fill: "#020cbc", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
