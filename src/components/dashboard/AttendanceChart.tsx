
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

const data = [
  { time: '08:00', atendimentos: 12 },
  { time: '09:00', atendimentos: 25 },
  { time: '10:00', atendimentos: 45 },
  { time: '11:00', atendimentos: 38 },
  { time: '12:00', atendimentos: 28 },
  { time: '13:00', atendimentos: 35 },
  { time: '14:00', atendimentos: 52 },
  { time: '15:00', atendimentos: 48 },
  { time: '16:00', atendimentos: 42 },
  { time: '17:00', atendimentos: 35 },
];

const chartConfig = {
  atendimentos: {
    label: "Atendimentos",
    color: "#020cbc",
  },
};

export const AttendanceChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Atendimentos por Hora - Hoje</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="time" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="atendimentos" 
                stroke="var(--color-atendimentos)" 
                strokeWidth={3}
                dot={{ fill: "#020cbc", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
