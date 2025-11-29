import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, RefreshCw } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import { Icons } from "@/components/icons";

const MOCK_RESUMO = [
  {
    label: "Auditorias Realizadas",
    value: 32,
  },
  {
    label: "Erros Encontrados",
    value: 8,
  },
  {
    label: "Aprovações",
    value: 20,
  },
  {
    label: "Pendências",
    value: 4,
  },
];

const MOCK_AUDITORIAS = [
  {
    id: 201,
    agente: "João Lima",
    acao: "Mensagem não autorizada",
    status: "erro",
    data: "2024-06-10 13:15",
    observacao: "Enviou mensagem fora do padrão.",
  },
  {
    id: 202,
    agente: "Maria Silva",
    acao: "Atendimento aprovado",
    status: "ok",
    data: "2024-06-10 14:52",
    observacao: "-",
  },
  {
    id: 203,
    agente: "Carlos Souza",
    acao: "Pendência",
    status: "pendente",
    data: "2024-06-11 09:23",
    observacao: "Análise em andamento.",
  },
];

const statusColors = {
  ok: "bg-green-100 text-green-800",
  erro: "bg-red-100 text-red-700",
  pendente: "bg-yellow-100 text-yellow-800",
};

export const AuditAttendanceTab = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const lista = MOCK_AUDITORIAS.filter((item) =>
    !statusFilter ? true : item.status === statusFilter
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Filtros de status e ações */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={statusFilter === null ? "default" : "outline"} 
          size="sm" 
          onClick={() => setStatusFilter(null)}
        >
          <FileText className="w-4 h-4 mr-2" />
          Todas
        </Button>
        <Button 
          variant={statusFilter === "ok" ? "default" : "outline"} 
          size="sm" 
          onClick={() => setStatusFilter("ok")}
        >
          <Badge className="mr-1 bg-green-100 text-green-800" variant="outline">OK</Badge>
          Aprovados
        </Button>
        <Button 
          variant={statusFilter === "erro" ? "default" : "outline"} 
          size="sm" 
          onClick={() => setStatusFilter("erro")}
        >
          <Badge className="mr-1 bg-red-100 text-red-700" variant="outline">Erro</Badge>
          Erros
        </Button>
        <Button 
          variant={statusFilter === "pendente" ? "default" : "outline"} 
          size="sm" 
          onClick={() => setStatusFilter("pendente")}
        >
          <Badge className="mr-1 bg-yellow-100 text-yellow-800" variant="outline">Pendente</Badge>
          Pendências
        </Button>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Filtro de período */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-muted-foreground">
              Período
            </label>
            <CalendarDateRangePicker
              value={date}
              onChange={setDate}
            />
          </div>
        </CardContent>
      </Card>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {MOCK_RESUMO.map((item) => (
          <Card key={item.label}>
            <CardContent className="py-4 flex flex-col gap-1 items-start">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className="font-bold text-2xl">{item.value}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabela de auditorias */}
      <Card>
        <CardContent className="pt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Agente</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Observação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lista.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                      <Icons.shieldCheck className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                      <p>Nenhum registro encontrado para os filtros selecionados.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  lista.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>{a.id}</TableCell>
                      <TableCell>{a.agente}</TableCell>
                      <TableCell>{a.acao}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[a.status as keyof typeof statusColors]}`}>
                          {a.status === "ok"
                            ? "Aprovado"
                            : a.status === "erro"
                            ? "Erro"
                            : "Pendente"}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{a.data}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{a.observacao}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
