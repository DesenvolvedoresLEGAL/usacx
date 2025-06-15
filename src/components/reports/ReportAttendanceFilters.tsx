
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, X } from "lucide-react";
import { useState } from "react";

const channels = [
  { label: "Todos", value: null },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Email", value: "email" },
  { label: "Chat Web", value: "webchat" },
];

const agents = [
  { label: "Todos", value: null },
  { label: "João Lima", value: "joao" },
  { label: "Ana Silva", value: "ana" },
  { label: "Carlos Souza", value: "carlos" },
];

export function ReportAttendanceFilters({ value, onChange }: {
  value: any;
  onChange: (val: any) => void;
}) {
  const [localFilters, setLocalFilters] = useState(value);

  function handleApply() {
    onChange(localFilters);
  }

  function handleClear() {
    setLocalFilters({ dateRange: null, channel: null, agent: null });
    onChange({ dateRange: null, channel: null, agent: null });
  }

  return (
    <Card>
      <CardContent className="p-4 flex flex-col md:flex-row gap-4">
        {/* Data */}
        <div className="flex flex-col gap-1 w-full md:w-1/4">
          <label className="font-medium text-sm">Período</label>
          <Button variant="outline" className="w-full" disabled>
            <Calendar className="w-4 h-4 mr-2" />
            {localFilters.dateRange ? "Selecionado" : "Escolher data"}
          </Button>
        </div>
        {/* Canal */}
        <div className="flex flex-col gap-1 w-full md:w-1/4">
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
        <div className="flex flex-col gap-1 w-full md:w-1/4">
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
        <div className="flex items-end gap-2 w-full md:w-1/4 justify-end">
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
