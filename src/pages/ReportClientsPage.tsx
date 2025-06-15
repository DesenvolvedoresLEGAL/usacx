
import { useState } from "react";
import { ReportClientFilters } from "@/components/reports/ReportClientFilters";
import { ReportClientStats } from "@/components/reports/ReportClientStats";
import { ReportClientTable } from "@/components/reports/ReportClientTable";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Filter, Users } from "lucide-react";

export default function ReportClientsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: null,
    segment: null,
    status: null,
    channel: null,
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Relatórios - Clientes</h1>
          </div>
          <p className="text-muted-foreground">
            Analise o comportamento, segmentação e performance dos seus clientes.
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
        <ReportClientFilters value={filters} onChange={setFilters} />
      )}

      {/* Métricas */}
      <ReportClientStats filters={filters} />

      {/* Tabela de clientes */}
      <ReportClientTable filters={filters} />
    </div>
  );
}
