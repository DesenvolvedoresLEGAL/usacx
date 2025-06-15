
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, X } from "lucide-react";
import { useState } from "react";

const ratings = [
  { label: "Todas as notas", value: null },
  { label: "5 estrelas", value: "5" },
  { label: "4 estrelas", value: "4" },
  { label: "3 estrelas", value: "3" },
  { label: "2 estrelas", value: "2" },
  { label: "1 estrela", value: "1" },
];

const channels = [
  { label: "Todos os canais", value: null },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Email", value: "email" },
  { label: "Chat Web", value: "webchat" },
  { label: "Telefone", value: "phone" },
];

const agents = [
  { label: "Todos os agentes", value: null },
  { label: "João Lima", value: "joao" },
  { label: "Ana Silva", value: "ana" },
  { label: "Carlos Souza", value: "carlos" },
  { label: "Maria Santos", value: "maria" },
];

const departments = [
  { label: "Todos os departamentos", value: null },
  { label: "Atendimento", value: "support" },
  { label: "Vendas", value: "sales" },
  { label: "Técnico", value: "technical" },
  { label: "Financeiro", value: "financial" },
];

export function ReportEvaluationFilters({ value, onChange }: {
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
      rating: null, 
      channel: null, 
      agent: null, 
      department: null 
    };
    setLocalFilters(clearedFilters);
    onChange(clearedFilters);
  }

  return (
    <Card>
      <CardContent className="p-4 flex flex-col md:flex-row gap-4">
        {/* Período */}
        <div className="flex flex-col gap-1 w-full md:w-1/5">
          <label className="font-medium text-sm">Período</label>
          <Button variant="outline" className="w-full" disabled>
            <Calendar className="w-4 h-4 mr-2" />
            {localFilters.dateRange ? "Selecionado" : "Escolher período"}
          </Button>
        </div>
        
        {/* Avaliação */}
        <div className="flex flex-col gap-1 w-full md:w-1/5">
          <label className="font-medium text-sm">Avaliação</label>
          <select
            className="w-full rounded-md border px-3 h-10"
            value={localFilters.rating ?? ""}
            onChange={e => setLocalFilters(l => ({ ...l, rating: e.target.value || null }))}
          >
            {ratings.map(opt => (
              <option key={opt.label} value={opt.value ?? ""}>{opt.label}</option>
            ))}
          </select>
        </div>
        
        {/* Canal */}
        <div className="flex flex-col gap-1 w-full md:w-1/5">
          <label className="font-medium text-sm">Canal</label>
          <select
            className="w-full rounded-md border px-3 h-10"
            value={localFilters.channel ?? ""}
            onChange={e => setLocalFilters(l => ({ ...l, channel: e.target.value || null }))}
          >
            {channels.map(opt => (
              <option key={opt.label} value={opt.value ?? ""}>{opt.label}</option>
            ))}
          </select>
        </div>
        
        {/* Agente */}
        <div className="flex flex-col gap-1 w-full md:w-1/5">
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
        
        {/* Ações */}
        <div className="flex items-end gap-2 w-full md:w-auto justify-end">
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
