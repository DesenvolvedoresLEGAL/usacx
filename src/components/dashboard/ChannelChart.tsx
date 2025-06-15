
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: 'WhatsApp', value: 150, color: '#25D366' },
  { name: 'Chat Web', value: 80, color: '#020cbc' },
  { name: 'Facebook', value: 45, color: '#1877F2' },
  { name: 'Instagram', value: 30, color: '#E4405F' },
];

const chartConfig = {
  whatsapp: { label: "WhatsApp", color: "#25D366" },
  chat: { label: "Chat Web", color: "#020cbc" },
  facebook: { label: "Facebook", color: "#1877F2" },
  instagram: { label: "Instagram", color: "#E4405F" },
};

export const ChannelChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Atendimentos por Canal</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
