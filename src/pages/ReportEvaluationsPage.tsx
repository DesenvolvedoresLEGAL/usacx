
import { useState } from "react";
import { ReportEvaluationFilters } from "@/components/reports/ReportEvaluationFilters";
import { ReportEvaluationStats } from "@/components/reports/ReportEvaluationStats";
import { ReportEvaluationTable } from "@/components/reports/ReportEvaluationTable";
import { ReportEvaluationCharts } from "@/components/reports/ReportEvaluationCharts";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Filter, Star } from "lucide-react";

export default function ReportEvaluationsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: null,
    rating: null,
    channel: null,
    agent: null,
    department: null,
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Relatórios - Avaliações</h1>
          </div>
          <p className="text-muted-foreground">
            Análise completa das avaliações de satisfação dos atendimentos realizados.
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
        <ReportEvaluationFilters value={filters} onChange={setFilters} />
      )}

      {/* Métricas de satisfação */}
      <ReportEvaluationStats filters={filters} />

      {/* Gráficos de análise */}
      <ReportEvaluationCharts filters={filters} />

      {/* Tabela de avaliações */}
      <ReportEvaluationTable filters={filters} />
    </div>
  );
}
