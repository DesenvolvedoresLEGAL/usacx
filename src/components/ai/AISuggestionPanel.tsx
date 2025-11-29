import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Copy, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AISuggestionPanelProps {
  conversationId?: string;
}

export const AISuggestionPanel: React.FC<AISuggestionPanelProps> = ({ conversationId }) => {
  const [clientMessage, setClientMessage] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const handleGenerateSuggestions = async () => {
    if (!clientMessage.trim()) {
      toast({
        title: 'Mensagem vazia',
        description: 'Digite a mensagem do cliente para gerar sugestões.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setSuggestions([]);

    try {
      const { data, error } = await supabase.functions.invoke('ai-suggest-response', {
        body: {
          conversationContext: conversationId ? `Conversa ID: ${conversationId}` : 'Teste de funcionalidade',
          clientMessage: clientMessage,
          agentNotes: 'Cliente em teste de funcionalidade',
        },
      });

      if (error) throw error;

      if (data?.suggestions) {
        setSuggestions(data.suggestions);
        toast({
          title: 'Sugestões geradas',
          description: `${data.suggestions.length} sugestões de resposta criadas.`,
        });
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast({
        title: 'Erro ao gerar sugestões',
        description: error instanceof Error ? error.message : 'Tente novamente em alguns instantes.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopySuggestion = (suggestion: string, index: number) => {
    navigator.clipboard.writeText(suggestion);
    setCopiedIndex(index);
    toast({
      title: 'Copiado!',
      description: 'Sugestão copiada para a área de transferência.',
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Teste de Sugestões de IA
        </CardTitle>
        <CardDescription>
          Digite uma mensagem de cliente para gerar 3 sugestões de resposta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Ex: Olá, meu pedido ainda não chegou e já passou o prazo de entrega..."
            value={clientMessage}
            onChange={(e) => setClientMessage(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <Button 
            onClick={handleGenerateSuggestions} 
            disabled={loading || !clientMessage.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando sugestões...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Gerar Sugestões com IA
              </>
            )}
          </Button>
        </div>

        {suggestions.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <p className="text-sm font-medium text-muted-foreground">
              Sugestões geradas pela IA:
            </p>
            {suggestions.map((suggestion, index) => (
              <Card key={index} className="bg-muted/30">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <Badge variant="outline" className="mb-2">
                        Sugestão {index + 1}
                      </Badge>
                      <p className="text-sm">{suggestion}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopySuggestion(suggestion, index)}
                      className="flex-shrink-0"
                    >
                      {copiedIndex === index ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
