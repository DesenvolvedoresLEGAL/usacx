
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Calendar as CalendarIcon,
  Clock,
  Mail,
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const REPORT_TYPES = [
  { id: "attendances", name: "Atendimentos", description: "Dados completos de atendimentos realizados" },
  { id: "clients", name: "Clientes", description: "Informações de clientes e segmentação" },
  { id: "evaluations", name: "Avaliações", description: "Dados de satisfação e feedback" },
  { id: "breaks", name: "Pausas", description: "Histórico de pausas dos agentes" },
  { id: "performance", name: "Performance", description: "Métricas de desempenho dos agentes" },
  { id: "analytics", name: "Analítico", description: "Análises avançadas e insights" },
  { id: "audit", name: "Auditoria", description: "Logs de auditoria e conformidade" },
];

const EXPORT_FORMATS = [
  { id: "xlsx", name: "Excel (.xlsx)", icon: FileSpreadsheet, description: "Planilha Excel com formatação" },
  { id: "csv", name: "CSV (.csv)", icon: FileText, description: "Valores separados por vírgula" },
  { id: "pdf", name: "PDF (.pdf)", icon: FileText, description: "Documento formatado para impressão" },
];

const EXPORT_HISTORY = [
  {
    id: "1",
    name: "Relatório de Atendimentos - Junho 2024",
    format: "xlsx",
    size: "2.4 MB",
    status: "completed",
    createdAt: "2024-06-15 14:30",
    downloadUrl: "#"
  },
  {
    id: "2", 
    name: "Performance dos Agentes - Maio 2024",
    format: "pdf",
    size: "1.8 MB",
    status: "completed",
    createdAt: "2024-06-10 09:15",
    downloadUrl: "#"
  },
  {
    id: "3",
    name: "Análise de Satisfação - Q2 2024",
    format: "csv",
    size: "856 KB",
    status: "processing",
    createdAt: "2024-06-15 16:45",
    downloadUrl: null
  }
];

export default function ReportExportPage() {
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState("xlsx");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [emailNotification, setEmailNotification] = useState(true);
  const [exportName, setExportName] = useState("");
  const [description, setDescription] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const handleReportToggle = (reportId: string) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleExport = async () => {
    if (selectedReports.length === 0) return;
    
    setIsExporting(true);
    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExporting(false);
    
    // Reset form
    setSelectedReports([]);
    setExportName("");
    setDescription("");
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: { variant: "default" as const, icon: CheckCircle, text: "Concluído" },
      processing: { variant: "secondary" as const, icon: Loader2, text: "Processando" },
      error: { variant: "destructive" as const, icon: AlertCircle, text: "Erro" },
    };
    
    const config = variants[status as keyof typeof variants];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Relatórios - Exportar</h1>
          <p className="text-muted-foreground mt-1">
            Configure e exporte relatórios personalizados em diferentes formatos.
          </p>
        </div>
      </div>

      <Tabs defaultValue="new-export" className="space-y-6">
        <TabsList>
          <TabsTrigger value="new-export">Nova Exportação</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="scheduled">Agendamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="new-export" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Seleção de Relatórios */}
            <Card>
              <CardHeader>
                <CardTitle>Selecionar Relatórios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {REPORT_TYPES.map((report) => (
                  <div key={report.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={report.id}
                      checked={selectedReports.includes(report.id)}
                      onCheckedChange={() => handleReportToggle(report.id)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor={report.id} className="text-sm font-medium cursor-pointer">
                        {report.name}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {report.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Configurações de Exportação */}
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="export-name">Nome da Exportação</Label>
                  <Input
                    id="export-name"
                    placeholder="Ex: Relatório Mensal - Junho 2024"
                    value={exportName}
                    onChange={(e) => setExportName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Formato de Exportação</Label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPORT_FORMATS.map((format) => {
                        const Icon = format.icon;
                        return (
                          <SelectItem key={format.id} value={format.id}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              <div>
                                <div className="font-medium">{format.name}</div>
                                <div className="text-xs text-muted-foreground">{format.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Data Inicial</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateFrom && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Selecionar"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateFrom}
                          onSelect={setDateFrom}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Data Final</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateTo && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateTo ? format(dateTo, "dd/MM/yyyy") : "Selecionar"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateTo}
                          onSelect={setDateTo}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Adicione uma descrição para este relatório..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="email-notification"
                    checked={emailNotification}
                    onCheckedChange={setEmailNotification}
                  />
                  <Label htmlFor="email-notification">Notificar por email quando concluído</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="scheduled"
                    checked={isScheduled}
                    onCheckedChange={setIsScheduled}
                  />
                  <Label htmlFor="scheduled">Agendar exportação</Label>
                </div>

                {isScheduled && (
                  <div className="space-y-2">
                    <Label>Data/Hora do Agendamento</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !scheduledDate && "text-muted-foreground"
                          )}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {scheduledDate ? format(scheduledDate, "dd/MM/yyyy HH:mm") : "Selecionar data/hora"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={scheduledDate}
                          onSelect={setScheduledDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                <Button 
                  onClick={handleExport} 
                  disabled={selectedReports.length === 0 || isExporting}
                  className="w-full"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      {isScheduled ? "Agendar Exportação" : "Exportar Agora"}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Exportações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {EXPORT_HISTORY.map((export_item) => (
                  <div key={export_item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{export_item.name}</h4>
                        {getStatusBadge(export_item.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Formato: {export_item.format.toUpperCase()}</span>
                        <span>Tamanho: {export_item.size}</span>
                        <span>Criado em: {export_item.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {export_item.downloadUrl && (
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exportações Agendadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-4" />
                <p>Nenhuma exportação agendada encontrada.</p>
                <p className="text-sm">Use a aba "Nova Exportação" para agendar relatórios automáticos.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
