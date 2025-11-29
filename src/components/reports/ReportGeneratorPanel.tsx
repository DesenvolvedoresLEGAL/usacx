import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, Loader2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ReportGeneratorPanel: React.FC = () => {
  const [reportType, setReportType] = useState<string>('attendance_summary');
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [cached, setCached] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    setLoading(true);
    setReportData(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-report', {
        body: {
          reportType,
          filters: {},
          cacheMinutes: 60,
        },
      });

      if (error) throw error;

      if (data?.data) {
        setReportData(data.data);
        setCached(data.cached);
        toast({
          title: data.cached ? 'Relatório do cache' : 'Relatório gerado',
          description: data.cached 
            ? 'Exibindo relatório em cache.' 
            : 'Novo relatório gerado com sucesso.',
        });
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: 'Erro ao gerar relatório',
        description: error instanceof Error ? error.message : 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderReportData = () => {
    if (!reportData) return null;

    switch (reportType) {
      case 'attendance_summary':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{reportData.total}</div>
                <p className="text-xs text-muted-foreground">Total</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-green-600">{reportData.finished}</div>
                <p className="text-xs text-muted-foreground">Finalizados</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-blue-600">{reportData.active}</div>
                <p className="text-xs text-muted-foreground">Ativos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-orange-600">{reportData.waiting}</div>
                <p className="text-xs text-muted-foreground">Aguardando</p>
              </CardContent>
            </Card>
          </div>
        );

      case 'agent_performance':
        return (
          <div className="space-y-3">
            <p className="text-sm font-medium">Performance por Agente ({reportData.totalConversations} conversas):</p>
            {reportData.agents?.map((agent: any, index: number) => (
              <Card key={index}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{agent.agent_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {agent.total} conversas | {agent.finished} finalizadas | {agent.active} ativas
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{agent.finished}</div>
                      <p className="text-xs text-muted-foreground">Concluídas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'channel_distribution':
        return (
          <div className="space-y-3">
            <p className="text-sm font-medium">Distribuição por Canal:</p>
            {reportData.channels?.map((ch: any, index: number) => (
              <Card key={index}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium capitalize">{ch.channel}</p>
                    <div className="text-2xl font-bold">{ch.count}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      default:
        return <pre className="text-xs">{JSON.stringify(reportData, null, 2)}</pre>;
    }
  };

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Gerador de Relatórios (com Cache)
        </CardTitle>
        <CardDescription>
          Gere relatórios analíticos com cache inteligente de 60 minutos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Tipo de Relatório</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="attendance_summary">Resumo de Atendimentos</SelectItem>
                <SelectItem value="agent_performance">Performance de Agentes</SelectItem>
                <SelectItem value="channel_distribution">Distribuição por Canal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button onClick={handleGenerateReport} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </>
              )}
            </Button>
          </div>
        </div>

        {reportData && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {cached ? '📦 Cache' : '✨ Novo'} - Relatório: {reportType.replace(/_/g, ' ')}
              </p>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
            {renderReportData()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
