
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const ATTENDANCES = [
  {
    id: "1",
    cliente: "Acme Corp",
    canal: "WhatsApp",
    agente: "João Lima",
    status: "finalizado",
    nota: 5,
    createdAt: "2024-06-02 14:12",
    tempo: "3m12s",
  },
  {
    id: "2",
    cliente: "Maria Silva",
    canal: "Email",
    agente: "Ana Silva",
    status: "finalizado",
    nota: 4,
    createdAt: "2024-06-02 15:10",
    tempo: "8m40s",
  },
  {
    id: "3",
    cliente: "Empresa XPTO",
    canal: "Chat Web",
    agente: "Carlos Souza",
    status: "em andamento",
    nota: null,
    createdAt: "2024-06-03 09:50",
    tempo: "--",
  },
];

const statusColors = {
  "finalizado": "bg-green-100 text-green-800",
  "em andamento": "bg-yellow-100 text-yellow-700",
  "pendente": "bg-gray-100 text-gray-700",
};

export function ReportAttendanceTable({ filters }: { filters: any }) {
  // Simulação: normalmente aplicaria filtros aqui.
  const data = ATTENDANCES;

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Canal</TableHead>
            <TableHead>Agente</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Nota</TableHead>
            <TableHead>Início</TableHead>
            <TableHead>Tempo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((a) => (
            <TableRow key={a.id}>
              <TableCell>{a.id}</TableCell>
              <TableCell>{a.cliente}</TableCell>
              <TableCell>{a.canal}</TableCell>
              <TableCell>{a.agente}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[a.status as keyof typeof statusColors]}`}>
                  {a.status}
                </span>
              </TableCell>
              <TableCell>
                {a.nota !== null ? (
                  <Badge variant="outline" className="text-sm">{a.nota}★</Badge>
                ) : "--"}
              </TableCell>
              <TableCell>{a.createdAt}</TableCell>
              <TableCell>{a.tempo}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
