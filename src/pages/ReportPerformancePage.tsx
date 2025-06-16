
import { useState } from "react";
import { ReportPerformanceFilters } from "@/components/reports/ReportPerformanceFilters";
import { ReportPerformanceStats } from "@/components/reports/ReportPerformanceStats";
import { ReportPerformanceTable } from "@/components/reports/ReportPerformanceTable";
import { ReportPerformanceCharts } from "@/components/reports/ReportPerformanceCharts";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Filter, TrendingUp } from "lucide-react";

export default function ReportPerformancePage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: null,
    agent: null,
    department: null,
    metric: "all",
    period: "last_30_days",
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Relatórios - Performance</h1>
          </div>
          <p className="text-muted-foreground">
            Análise detalhada do desempenho e produtividade dos agentes e equipes.
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
        <ReportPerformanceFilters value={filters} onChange={setFilters} />
      )}

      {/* Métricas de performance */}
      <ReportPerformanceStats filters={filters} />

      {/* Gráficos de análise */}
      <ReportPerformanceCharts filters={filters} />

      {/* Tabela de performance */}
      <ReportPerformanceTable filters={filters} />
    </div>
  );
}
