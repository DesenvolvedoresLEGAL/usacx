
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const MOCK_EVALUATIONS = [
  {
    id: "1",
    cliente: "João Silva",
    agente: "Ana Lima",
    canal: "WhatsApp",
    rating: 5,
    comentario: "Excelente atendimento, muito rápido e eficiente!",
    data: "2024-06-15 14:30",
    departamento: "Vendas",
  },
  {
    id: "2",
    cliente: "Maria Santos",
    agente: "Carlos Souza",
    canal: "Chat Web",
    rating: 4,
    comentario: "Bom atendimento, resolveu minha dúvida.",
    data: "2024-06-15 13:45",
    departamento: "Suporte",
  },
  {
    id: "3",
    cliente: "Pedro Costa",
    agente: "João Lima",
    canal: "Email",
    rating: 3,
    comentario: "Atendimento ok, mas demorou um pouco para responder.",
    data: "2024-06-15 12:20",
    departamento: "Técnico",
  },
  {
    id: "4",
    cliente: "Ana Paula",
    agente: "Maria Santos",
    canal: "WhatsApp",
    rating: 5,
    comentario: "Perfeito! Adorei o atendimento.",
    data: "2024-06-15 11:15",
    departamento: "Vendas",
  },
  {
    id: "5",
    cliente: "Roberto Lima",
    agente: "Carlos Souza",
    canal: "Telefone",
    rating: 2,
    comentario: "Não conseguiram resolver meu problema.",
    data: "2024-06-15 10:30",
    departamento: "Suporte",
  },
];

const getRatingBadge = (rating: number) => {
  const colors = {
    5: "bg-green-100 text-green-800",
    4: "bg-blue-100 text-blue-800", 
    3: "bg-yellow-100 text-yellow-800",
    2: "bg-orange-100 text-orange-800",
    1: "bg-red-100 text-red-800",
  };

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colors[rating as keyof typeof colors]}`}>
      <Star className="w-3 h-3 fill-current" />
      {rating}
    </div>
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

export function ReportEvaluationTable({ filters }: { filters: any }) {
  // Simulação: normalmente aplicaria filtros aqui
  const data = MOCK_EVALUATIONS;

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Avaliações Recentes</h3>
        <p className="text-sm text-muted-foreground">
          Listagem detalhada das avaliações recebidas
        </p>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Agente</TableHead>
            <TableHead>Canal</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Avaliação</TableHead>
            <TableHead>Comentário</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((evaluation) => (
            <TableRow key={evaluation.id}>
              <TableCell className="font-medium">{evaluation.cliente}</TableCell>
              <TableCell>{evaluation.agente}</TableCell>
              <TableCell>{evaluation.canal}</TableCell>
              <TableCell>{getDepartmentBadge(evaluation.departamento)}</TableCell>
              <TableCell>{getRatingBadge(evaluation.rating)}</TableCell>
              <TableCell className="max-w-xs truncate" title={evaluation.comentario}>
                {evaluation.comentario}
              </TableCell>
              <TableCell>{evaluation.data}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
