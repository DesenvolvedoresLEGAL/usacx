
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PauseCircle } from "lucide-react";

const MOCK_BREAKS = [
  {
    id: "1",
    agente: "João Lima",
    tipo: "Almoço",
    inicio: "2024-06-15 12:00",
    fim: "2024-06-15 13:00",
    duracao: "1h 00m",
    departamento: "Vendas",
    status: "finalizada",
  },
  {
    id: "2",
    agente: "Ana Silva",
    tipo: "Lanche",
    inicio: "2024-06-15 15:30",
    fim: "2024-06-15 15:45",
    duracao: "15m",
    departamento: "Suporte",
    status: "finalizada",
  },
  {
    id: "3",
    agente: "Carlos Souza",
    tipo: "Reunião",
    inicio: "2024-06-15 14:00",
    fim: "2024-06-15 15:30",
    duracao: "1h 30m",
    departamento: "Técnico",
    status: "finalizada",
  },
  {
    id: "4",
    agente: "Maria Santos",
    tipo: "Treinamento",
    inicio: "2024-06-15 16:00",
    fim: null,
    duracao: "45m",
    departamento: "Vendas",
    status: "em andamento",
  },
  {
    id: "5",
    agente: "Pedro Costa",
    tipo: "Banheiro",
    inicio: "2024-06-15 10:15",
    fim: "2024-06-15 10:20",
    duracao: "5m",
    departamento: "Suporte",
    status: "finalizada",
  },
];

const getBreakTypeBadge = (tipo: string) => {
  const colors = {
    "Almoço": "bg-blue-100 text-blue-800",
    "Lanche": "bg-green-100 text-green-800",
    "Banheiro": "bg-yellow-100 text-yellow-800",
    "Treinamento": "bg-purple-100 text-purple-800",
    "Reunião": "bg-orange-100 text-orange-800",
    "Técnica": "bg-red-100 text-red-800",
  };

  return (
    <Badge variant="outline" className={colors[tipo as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
      {tipo}
    </Badge>
  );
};

const getStatusBadge = (status: string) => {
  const colors = {
    "finalizada": "bg-green-100 text-green-800",
    "em andamento": "bg-yellow-100 text-yellow-800",
    "cancelada": "bg-red-100 text-red-800",
  };

  return (
    <Badge variant="outline" className={colors[status as keyof typeof colors]}>
      {status}
    </Badge>
  );
};

const getDepartmentBadge = (department: string) => {
  const colors = {
    "Vendas": "bg-purple-100 text-purple-800",
    "Suporte": "bg-blue-100 text-blue-800",
    "Técnico": "bg-gray-100 text-gray-800",
    "Financeiro": "bg-green-100 text-green-800",
  };

  return (
    <Badge variant="outline" className={colors[department as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
      {department}
    </Badge>
  );
};

export function ReportBreakTable({ filters }: { filters: any }) {
  // Simulação: normalmente aplicaria filtros aqui
  const data = MOCK_BREAKS;

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Histórico de Pausas</h3>
        <p className="text-sm text-muted-foreground">
          Registro detalhado das pausas realizadas pelos agentes
        </p>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Agente</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Início</TableHead>
            <TableHead>Fim</TableHead>
            <TableHead>Duração</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((breakRecord) => (
            <TableRow key={breakRecord.id}>
              <TableCell className="font-medium">{breakRecord.agente}</TableCell>
              <TableCell>{getBreakTypeBadge(breakRecord.tipo)}</TableCell>
              <TableCell>{getDepartmentBadge(breakRecord.departamento)}</TableCell>
              <TableCell>{breakRecord.inicio}</TableCell>
              <TableCell>{breakRecord.fim || "--"}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <PauseCircle className="w-4 h-4 text-muted-foreground" />
                  {breakRecord.duracao}
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(breakRecord.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
