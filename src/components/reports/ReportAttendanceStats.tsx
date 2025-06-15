
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const MOCK_STATS = {
  total: 254,
  avgTime: "6m 24s",
  sla: "91%",
  csat: "4.4",
  byChannel: [
    { name: "WhatsApp", value: 120, color: "#25D366" },
    { name: "Email", value: 54, color: "#4285F4" },
    { name: "Chat Web", value: 80, color: "#735DF8" },
  ],
};

export function ReportAttendanceStats({ filters }: { filters: any }) {
  // No fetch ainda, só simulação.
  const stats = MOCK_STATS;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      {/* Total atendimentos */}
      <Card>
        <CardContent className="py-4 flex flex-col gap-1 items-start">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="font-bold text-2xl">{stats.total}</span>
        </CardContent>
      </Card>
      {/* Tempo Médio */}
      <Card>
        <CardContent className="py-4 flex flex-col gap-1 items-start">
          <span className="text-sm text-muted-foreground">Tempo Médio</span>
          <span className="font-bold text-2xl">{stats.avgTime}</span>
        </CardContent>
      </Card>
      {/* SLA */}
      <Card>
        <CardContent className="py-4 flex flex-col gap-1 items-start">
          <span className="text-sm text-muted-foreground">SLA (%)</span>
          <span className="font-bold text-2xl">{stats.sla}</span>
        </CardContent>
      </Card>
      {/* CSAT + pizza canais */}
      <Card>
        <CardContent className="py-2 flex flex-col gap-2 items-start">
          <span className="text-sm text-muted-foreground">CSAT</span>
          <span className="font-bold text-2xl">{stats.csat}</span>
          <div className="w-full mt-2">
            <ResponsiveContainer width="100%" height={60}>
              <PieChart>
                <Pie 
                  data={stats.byChannel} 
                  dataKey="value" 
                  nameKey="name"
                  cx="50%" cy="50%"
                  outerRadius={24}
                  innerRadius={18}
                 >
                  {stats.byChannel.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip cursor={false} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
