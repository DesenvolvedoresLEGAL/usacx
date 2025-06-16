
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, X } from "lucide-react";
import { useState } from "react";

const breakTypes = [
  { label: "Todos", value: null },
  { label: "Almoço", value: "lunch" },
  { label: "Lanche", value: "snack" },
  { label: "Banheiro", value: "bathroom" },
  { label: "Treinamento", value: "training" },
  { label: "Reunião", value: "meeting" },
  { label: "Técnica", value: "technical" },
];

const agents = [
  { label: "Todos", value: null },
  { label: "João Lima", value: "joao" },
  { label: "Ana Silva", value: "ana" },
  { label: "Carlos Souza", value: "carlos" },
  { label: "Maria Santos", value: "maria" },
];

const departments = [
  { label: "Todos", value: null },
  { label: "Vendas", value: "sales" },
  { label: "Suporte", value: "support" },
  { label: "Técnico", value: "technical" },
  { label: "Financeiro", value: "finance" },
];

const durations = [
  { label: "Todas", value: null },
  { label: "Até 15 min", value: "short" },
  { label: "15-30 min", value: "medium" },
  { label: "30-60 min", value: "long" },
  { label: "Acima de 1h", value: "very_long" },
];

export function ReportBreakFilters({ value, onChange }: {
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
      breakType: null, 
      agent: null, 
      department: null,
      duration: null 
    };
    setLocalFilters(clearedFilters);
    onChange(clearedFilters);
  }

  return (
    <Card>
      <CardContent className="p-4 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Data */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm">Período</label>
            <Button variant="outline" className="w-full" disabled>
              <Calendar className="w-4 h-4 mr-2" />
              {localFilters.dateRange ? "Selecionado" : "Escolher data"}
            </Button>
          </div>
          
          {/* Tipo de Pausa */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm">Tipo de Pausa</label>
            <select
              className="w-full rounded-md border px-3 h-10"
              value={localFilters.breakType ?? ""}
              onChange={e => setLocalFilters(l => ({ ...l, breakType: e.target.value || null }))}
            >
              {breakTypes.map(opt => (
                <option key={opt.label} value={opt.value ?? ""}>{opt.label}</option>
              ))}
            </select>
          </div>
          
          {/* Agente */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm">Agente</label>
            <select
              className="w-full rounded-md border px-3 h-10"
              value={localFilters.agent ?? ""}
              onChange={e => setLocalFilters(l => ({ ...l, agent: e.target.value || null }))}
            >
              {agents.map(opt => (
                <option key={opt.label} value={opt.value ?? ""}>{opt.label}</option>
              ))}
            </select>
          </div>
          
          {/* Departamento */}
          <div className="flex flex-col gap-1">
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
          
          {/* Duração */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm">Duração</label>
            <select
              className="w-full rounded-md border px-3 h-10"
              value={localFilters.duration ?? ""}
              onChange={e => setLocalFilters(l => ({ ...l, duration: e.target.value || null }))}
            >
              {durations.map(opt => (
                <option key={opt.label} value={opt.value ?? ""}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Ações */}
        <div className="flex gap-2 justify-end">
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
