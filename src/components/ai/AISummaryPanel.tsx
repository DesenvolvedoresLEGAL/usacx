import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Loader2, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AISummaryPanel: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState('');
  const [detailLevel, setDetailLevel] = useState<'brief' | 'medium' | 'detailed'>('medium');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const { toast } = useToast();

  // Buscar conversas finalizadas
  React.useEffect(() => {
    const fetchConversations = async () => {
      const { data } = await supabase
        .from('conversations')
        .select('id, client:clients(name)')
        .eq('status', 'finished')
        .order('finished_at', { ascending: false })
        .limit(10);

      if (data) {
        setConversations(data);
      }
    };

    fetchConversations();
  }, []);

  const handleGenerateSummary = async () => {
    if (!selectedConversation) {
      toast({
        title: 'Selecione uma conversa',
        description: 'Escolha uma conversa finalizada para resumir.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setSummary('');

    try {
      const { data, error } = await supabase.functions.invoke('ai-summarize-conversation', {
        body: {
          conversationId: selectedConversation,
          detailLevel,
        },
      });

      if (error) throw error;

      if (data?.summary) {
        setSummary(data.summary);
        toast({
          title: 'Resumo gerado',
          description: 'Resumo da conversa criado com sucesso.',
        });
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: 'Erro ao gerar resumo',
        description: error instanceof Error ? error.message : 'Tente novamente em alguns instantes.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          Teste de Resumo de Conversas
        </CardTitle>
        <CardDescription>
          Selecione uma conversa finalizada para gerar um resumo automático
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Conversa</Label>
            <Select value={selectedConversation} onValueChange={setSelectedConversation}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma conversa" />
              </SelectTrigger>
              <SelectContent>
                {conversations.map((conv) => (
                  <SelectItem key={conv.id} value={conv.id}>
                    {conv.client?.name || 'Cliente Desconhecido'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Nível de Detalhe</Label>
            <Select value={detailLevel} onValueChange={(v: any) => setDetailLevel(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brief">Breve (2-3 frases)</SelectItem>
                <SelectItem value="medium">Médio (1 parágrafo)</SelectItem>
                <SelectItem value="detailed">Detalhado (completo)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleGenerateSummary}
          disabled={loading || !selectedConversation}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando resumo...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Gerar Resumo com IA
            </>
          )}
        </Button>

        {summary && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">Resumo Gerado pela IA:</p>
                  <p className="text-sm leading-relaxed">{summary}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};
