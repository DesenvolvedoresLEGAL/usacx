
import { useState } from "react";
import { ReportAttendanceFilters } from "@/components/reports/ReportAttendanceFilters";
import { ReportAttendanceStats } from "@/components/reports/ReportAttendanceStats";
import { ReportAttendanceTable } from "@/components/reports/ReportAttendanceTable";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Filter } from "lucide-react";

export default function ReportAttendancesPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: null,
    channel: null,
    agent: null,
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Relatórios - Atendimentos</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe e analise o desempenho dos atendimentos realizados na plataforma.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(v => !v)}>
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
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

      {/* Filtros */}
      {showFilters && (
        <ReportAttendanceFilters value={filters} onChange={setFilters} />
      )}

      {/* Métricas rápidas */}
      <ReportAttendanceStats filters={filters} />

      {/* Tabela de atendimentos */}
      <ReportAttendanceTable filters={filters} />
    </div>
  );
}
