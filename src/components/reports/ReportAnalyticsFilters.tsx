
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, X } from "lucide-react";
import { useState } from "react";

const departments = [
  { label: "Todos", value: null },
  { label: "Atendimento", value: "support" },
  { label: "Vendas", value: "sales" },
  { label: "Marketing", value: "marketing" },
  { label: "Técnico", value: "technical" },
];

const metrics = [
  { label: "Todas as métricas", value: "all" },
  { label: "Atendimentos", value: "attendance" },
  { label: "Satisfação", value: "satisfaction" },
  { label: "Performance", value: "performance" },
  { label: "Conversões", value: "conversions" },
];

const comparisons = [
  { label: "Período anterior", value: "previous_period" },
  { label: "Mesmo período ano anterior", value: "previous_year" },
  { label: "Média histórica", value: "historical_average" },
  { label: "Meta estabelecida", value: "target" },
];

export function ReportAnalyticsFilters({ value, onChange }: {
  value: any;
  onChange: (val: any) => void;
}) {
  const [localFilters, setLocalFilters] = useState(value);

  function handleApply() {
    onChange(localFilters);
  }

  function handleClear() {
    const clearedFilters = { 
      dateRange: null, 
      department: null, 
      metric: "all", 
      comparison: "previous_period" 
    };
    setLocalFilters(clearedFilters);
    onChange(clearedFilters);
  }

  return (
    <Card>
      <CardContent className="p-4 flex flex-col md:flex-row gap-4">
        {/* Período */}
        <div className="flex flex-col gap-1 w-full md:w-1/4">
          <label className="font-medium text-sm">Período</label>
          <Button variant="outline" className="w-full" disabled>
            <Calendar className="w-4 h-4 mr-2" />
            {localFilters.dateRange ? "Selecionado" : "Escolher período"}
          </Button>
        </div>
        
        {/* Departamento */}
        <div className="flex flex-col gap-1 w-full md:w-1/4">
          <label className="font-medium text-sm">Departamento</label>
          <select
            className="w-full rounded-md border px-3 h-10"
            value={localFilters.department ?? ""}
            onChange={e => setLocalFilters(l => ({ ...l, department: e.target.value || null }))}
          >
            {departments.map(opt => (
              <option key={opt.label} value={opt.value ?? ""}>{opt.label}</option>
            ))}
          </select>
        </div>
        
        {/* Métrica */}
        <div className="flex flex-col gap-1 w-full md:w-1/4">
          <label className="font-medium text-sm">Métrica</label>
          <select
            className="w-full rounded-md border px-3 h-10"
            value={localFilters.metric}
            onChange={e => setLocalFilters(l => ({ ...l, metric: e.target.value }))}
          >
            {metrics.map(opt => (
              <option key={opt.label} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        
        {/* Comparação */}
        <div className="flex flex-col gap-1 w-full md:w-1/4">
          <label className="font-medium text-sm">Comparar com</label>
          <select
            className="w-full rounded-md border px-3 h-10"
            value={localFilters.comparison}
            onChange={e => setLocalFilters(l => ({ ...l, comparison: e.target.value }))}
          >
            {comparisons.map(opt => (
              <option key={opt.label} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        
        {/* Ações */}
        <div className="flex items-end gap-2 justify-end">
          <Button variant="secondary" size="sm" onClick={handleApply}>
            Aplicar
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClear}>
            <X className="w-4 h-4 mr-1" /> Limpar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
