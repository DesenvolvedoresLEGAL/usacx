
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, X } from "lucide-react";
import { useState } from "react";

const segments = [
  { label: "Todos", value: null },
  { label: "VIP", value: "vip" },
  { label: "Premium", value: "premium" },
  { label: "Regular", value: "regular" },
  { label: "Novo", value: "new" },
];

const statuses = [
  { label: "Todos", value: null },
  { label: "Ativo", value: "active" },
  { label: "Inativo", value: "inactive" },
  { label: "Bloqueado", value: "blocked" },
];

const channels = [
  { label: "Todos", value: null },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Email", value: "email" },
  { label: "Chat Web", value: "webchat" },
  { label: "Telefone", value: "phone" },
];

export function ReportClientFilters({ value, onChange }: {
  value: any;
  onChange: (val: any) => void;
}) {
  const [localFilters, setLocalFilters] = useState(value);

  function handleApply() {
    onChange(localFilters);
  }

  function handleClear() {
    const clearedFilters = { dateRange: null, segment: null, status: null, channel: null };
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
            {localFilters.dateRange ? "Selecionado" : "Escolher data"}
          </Button>
        </div>
        
        {/* Segmento */}
        <div className="flex flex-col gap-1 w-full md:w-1/5">
          <label className="font-medium text-sm">Segmento</label>
          <select
            className="w-full rounded-md border px-3 h-10"
            value={localFilters.segment ?? ""}
            onChange={e => setLocalFilters(l => ({ ...l, segment: e.target.value || null }))}
          >
            {segments.map(opt => (
              <option key={opt.label} value={opt.value ?? ""}>{opt.label}</option>
            ))}
          </select>
        </div>
        
        {/* Status */}
        <div className="flex flex-col gap-1 w-full md:w-1/5">
          <label className="font-medium text-sm">Status</label>
          <select
            className="w-full rounded-md border px-3 h-10"
            value={localFilters.status ?? ""}
            onChange={e => setLocalFilters(l => ({ ...l, status: e.target.value || null }))}
          >
            {statuses.map(opt => (
              <option key={opt.label} value={opt.value ?? ""}>{opt.label}</option>
            ))}
          </select>
        </div>
        
        {/* Canal Preferido */}
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
        
        {/* Ações */}
        <div className="flex items-end gap-2 w-full md:w-1/5 justify-end">
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
