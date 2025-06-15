
import { useState } from "react";
import { ReportAnalyticsFilters } from "@/components/reports/ReportAnalyticsFilters";
import { ReportAnalyticsCharts } from "@/components/reports/ReportAnalyticsCharts";
import { ReportAnalyticsMetrics } from "@/components/reports/ReportAnalyticsMetrics";
import { ReportAnalyticsInsights } from "@/components/reports/ReportAnalyticsInsights";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Filter, BarChart3 } from "lucide-react";

export default function ReportAnalyticsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: null,
    department: null,
    metric: "all",
    comparison: "previous_period",
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Relatórios - Analítico</h1>
          </div>
          <p className="text-muted-foreground">
            Análises detalhadas e insights avançados sobre o desempenho da plataforma.
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
        <ReportAnalyticsFilters value={filters} onChange={setFilters} />
      )}

      {/* Métricas principais */}
      <ReportAnalyticsMetrics filters={filters} />

      {/* Gráficos e análises */}
      <ReportAnalyticsCharts filters={filters} />

      {/* Insights e recomendações */}
      <ReportAnalyticsInsights filters={filters} />
    </div>
  );
}
