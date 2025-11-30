
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface ChannelData {
  channelName: string;
  channelType: string;
  count: number;
}

interface ChannelChartProps {
  data?: ChannelData[];
}

// Cores por tipo de canal
const channelColors: Record<string, string> = {
  whatsapp: '#25D366',
  webchat: '#020cbc',
  messenger: '#1877F2',
  instagram: '#E4405F',
  telegram: '#0088cc',
};

export const ChannelChart = ({ data = [] }: ChannelChartProps) => {
  // Mapear dados para formato do chart
  const chartData = data.map(item => ({
    name: item.channelName,
    value: item.count,
    color: channelColors[item.channelType] || '#666666',
  }));

  // Se não houver dados, mostrar mensagem
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
        Nenhum canal com conversas nos últimos 30 dias
      </div>
    );
  }

  const chartConfig = chartData.reduce((config, item, index) => {
    config[`channel${index}`] = {
      label: item.name,
      color: item.color,
    };
    return config;
  }, {} as Record<string, { label: string; color: string }>);

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, value, percent }) => 
              `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
            }
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
