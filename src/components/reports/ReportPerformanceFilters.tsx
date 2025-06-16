
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import { Filter, X } from "lucide-react";

interface ReportPerformanceFiltersProps {
  value: any;
  onChange: (filters: any) => void;
}

export function ReportPerformanceFilters({ value, onChange }: ReportPerformanceFiltersProps) {
  const handleFilterChange = (key: string, newValue: any) => {
    onChange({ ...value, [key]: newValue });
  };

  const clearFilters = () => {
    onChange({
      dateRange: null,
      agent: null,
      department: null,
      metric: "all",
      period: "last_30_days",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filtros de Performance
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="w-4 h-4 mr-1" />
          Limpar
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Período */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Período</label>
            <Select
              value={value.period || "last_30_days"}
              onValueChange={(newValue) => handleFilterChange("period", newValue)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="yesterday">Ontem</SelectItem>
                <SelectItem value="last_7_days">Últimos 7 dias</SelectItem>
                <SelectItem value="last_30_days">Últimos 30 dias</SelectItem>
                <SelectItem value="last_90_days">Últimos 90 dias</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Agente */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Agente</label>
            <Select
              value={value.agent || ""}
              onValueChange={(newValue) => handleFilterChange("agent", newValue || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os agentes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os agentes</SelectItem>
                <SelectItem value="maria-silva">Maria Silva</SelectItem>
                <SelectItem value="joao-santos">João Santos</SelectItem>
                <SelectItem value="ana-costa">Ana Costa</SelectItem>
                <SelectItem value="pedro-oliveira">Pedro Oliveira</SelectItem>
                <SelectItem value="carla-souza">Carla Souza</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Departamento */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Departamento</label>
            <Select
              value={value.department || ""}
              onValueChange={(newValue) => handleFilterChange("department", newValue || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os departamentos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os departamentos</SelectItem>
                <SelectItem value="vendas">Vendas</SelectItem>
                <SelectItem value="suporte">Suporte</SelectItem>
                <SelectItem value="financeiro">Financeiro</SelectItem>
                <SelectItem value="comercial">Comercial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Métrica */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Métrica</label>
            <Select
              value={value.metric || "all"}
              onValueChange={(newValue) => handleFilterChange("metric", newValue)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as métricas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as métricas</SelectItem>
                <SelectItem value="response_time">Tempo de Resposta</SelectItem>
                <SelectItem value="resolution_time">Tempo de Resolução</SelectItem>
                <SelectItem value="satisfaction">Satisfação</SelectItem>
                <SelectItem value="productivity">Produtividade</SelectItem>
                <SelectItem value="availability">Disponibilidade</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data Range (se período for customizado) */}
          {value.period === "custom" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Intervalo de Datas</label>
              <CalendarDateRangePicker
                value={value.dateRange}
                onChange={(newValue) => handleFilterChange("dateRange", newValue)}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
