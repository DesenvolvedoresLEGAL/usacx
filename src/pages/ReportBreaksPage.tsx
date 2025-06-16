
import { useState } from "react";
import { ReportBreakFilters } from "@/components/reports/ReportBreakFilters";
import { ReportBreakStats } from "@/components/reports/ReportBreakStats";
import { ReportBreakTable } from "@/components/reports/ReportBreakTable";
import { ReportBreakCharts } from "@/components/reports/ReportBreakCharts";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Filter, PauseCircle } from "lucide-react";

export default function ReportBreaksPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: null,
    breakType: null,
    agent: null,
    department: null,
    duration: null,
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <PauseCircle className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Relatórios - Pausas</h1>
          </div>
          <p className="text-muted-foreground">
            Análise detalhada das pausas realizadas pelos agentes durante os atendimentos.
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
        <ReportBreakFilters value={filters} onChange={setFilters} />
      )}

      {/* Estatísticas de pausas */}
      <ReportBreakStats filters={filters} />

      {/* Gráficos de análise */}
      <ReportBreakCharts filters={filters} />

      {/* Tabela de pausas */}
      <ReportBreakTable filters={filters} />
    </div>
  );
}
