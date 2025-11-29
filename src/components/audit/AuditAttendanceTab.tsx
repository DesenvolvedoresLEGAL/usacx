import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, RefreshCw } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_values: any;
  new_values: any;
  created_at: string;
  user_display_name?: string;
}

const actionLabels: Record<string, string> = {
  create: 'Criação',
  update: 'Atualização',
  delete: 'Exclusão',
  assign: 'Atribuição',
  finish: 'Finalização',
  pause: 'Pausa',
  resume: 'Retomada',
};

const actionColors: Record<string, string> = {
  create: "bg-blue-100 text-blue-800",
  update: "bg-yellow-100 text-yellow-800",
  delete: "bg-red-100 text-red-700",
  assign: "bg-green-100 text-green-800",
  finish: "bg-purple-100 text-purple-800",
  pause: "bg-orange-100 text-orange-800",
  resume: "bg-green-100 text-green-800",
};

export const AuditAttendanceTab = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionFilter, setActionFilter] = useState<'assign' | 'create' | 'delete' | 'finish' | 'update' | null>(null);
  const { toast } = useToast();

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('audit_logs')
        .select('*')
        .eq('entity_type', 'conversation')
        .order('created_at', { ascending: false })
        .limit(50);

      if (date?.from) {
        query = query.gte('created_at', date.from.toISOString());
      }
      if (date?.to) {
        query = query.lte('created_at', date.to.toISOString());
      }
      if (actionFilter) {
        query = query.eq('action', actionFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        setLogs(data);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast({
        title: 'Erro ao carregar logs',
        description: 'Não foi possível carregar os logs de auditoria.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [date, actionFilter]);

  const stats = {
    total: logs.length,
    updates: logs.filter(l => l.action === 'update').length,
    assigns: logs.filter(l => l.action === 'assign').length,
    finishes: logs.filter(l => l.action === 'finish').length,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Resumo de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Total de Ações</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.updates}</div>
            <p className="text-xs text-muted-foreground mt-1">Atualizações</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.assigns}</div>
            <p className="text-xs text-muted-foreground mt-1">Atribuições</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.finishes}</div>
            <p className="text-xs text-muted-foreground mt-1">Finalizações</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros de ação */}
      <div className="flex flex-wrap gap-2 items-center">
        <CalendarDateRangePicker value={date} onChange={setDate} />
        
        <Button 
          variant={actionFilter === null ? "default" : "outline"} 
          size="sm" 
          onClick={() => setActionFilter(null)}
        >
          <FileText className="w-4 h-4 mr-2" />
          Todas
        </Button>
        <Button 
          variant={actionFilter === "assign" ? "default" : "outline"} 
          size="sm" 
          onClick={() => setActionFilter("assign")}
        >
          Atribuições
        </Button>
        <Button 
          variant={actionFilter === "update" ? "default" : "outline"} 
          size="sm" 
          onClick={() => setActionFilter("update")}
        >
          Atualizações
        </Button>
        <Button 
          variant={actionFilter === "finish" ? "default" : "outline"} 
          size="sm" 
          onClick={() => setActionFilter("finish")}
        >
          Finalizações
        </Button>

        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchAuditLogs} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Tabela de auditoria */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Conversa ID</TableHead>
                <TableHead>Alterações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {loading ? 'Carregando logs...' : 'Nenhum log de auditoria encontrado no período selecionado.'}
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs">
                      {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss')}
                    </TableCell>
                    <TableCell>
                      {log.user_id || 'Sistema'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={actionColors[log.action] || "bg-gray-100 text-gray-800"}>
                        {actionLabels[log.action] || log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.entity_id ? log.entity_id.slice(0, 8) + '...' : '-'}
                    </TableCell>
                    <TableCell className="text-xs">
                      {log.old_values && log.new_values && (
                        <div className="space-y-1">
                          <div className="text-muted-foreground">
                            De: <span className="font-mono">{JSON.stringify(log.old_values).slice(0, 50)}</span>
                          </div>
                          <div className="text-foreground">
                            Para: <span className="font-mono">{JSON.stringify(log.new_values).slice(0, 50)}</span>
                          </div>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
