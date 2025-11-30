
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const statusColors = {
  "finalizado": "bg-green-100 text-green-800",
  "em andamento": "bg-yellow-100 text-yellow-700",
  "pendente": "bg-gray-100 text-gray-700",
};

export function ReportAttendanceTable({ filters }: { filters: any }) {
  const data: any[] = [];

  if (data.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">Nenhum atendimento encontrado para o período selecionado.</p>
      </div>
    );
  }

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
