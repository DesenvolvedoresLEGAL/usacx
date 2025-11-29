import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sparkles, Lightbulb, MessageSquare, TrendingUp, Zap, Brain } from "lucide-react";
import { AISuggestionPanel } from "@/components/ai/AISuggestionPanel";
import { AISummaryPanel } from "@/components/ai/AISummaryPanel";

export default function AICopilotPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-primary" /> Copiloto do Agente
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Assistente de IA que ajuda agentes humanos com sugestões em tempo real, resumos automáticos e análise de sentimento durante conversas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <Lightbulb className="w-6 h-6 text-primary mb-2"/>
            <CardTitle>Sugestões Inteligentes</CardTitle>
            <CardDescription>
              O copiloto sugere respostas baseadas no contexto da conversa e histórico do cliente.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <MessageSquare className="w-6 h-6 text-primary mb-2"/>
            <CardTitle>Resumos Automáticos</CardTitle>
            <CardDescription>
              Gera resumos de conversas longas para facilitar o entendimento rápido do contexto.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <TrendingUp className="w-6 h-6 text-primary mb-2"/>
            <CardTitle>Análise de Sentimento</CardTitle>
            <CardDescription>
              Detecta emoções e urgência nas mensagens para priorizar atendimentos críticos.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Configurações do Copiloto
          </CardTitle>
          <CardDescription>
            Configure como o copiloto irá auxiliar seus agentes durante os atendimentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Sugestões em Tempo Real</Label>
                <p className="text-sm text-muted-foreground">
                  Mostrar sugestões de resposta enquanto o agente digita
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Resumos Automáticos</Label>
                <p className="text-sm text-muted-foreground">
                  Gerar resumo automático ao abrir conversas antigas
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Detecção de Sentimento</Label>
                <p className="text-sm text-muted-foreground">
                  Alertar quando cliente demonstrar frustração ou urgência
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Sugestão de Produtos</Label>
                <p className="text-sm text-muted-foreground">
                  Recomendar produtos com base no contexto da conversa
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Auto-Categorização</Label>
                <p className="text-sm text-muted-foreground">
                  Sugerir automaticamente etiquetas e categorias para conversas
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button disabled>
              Salvar Configurações
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Preview de Funcionalidades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2">💬 Exemplo de Sugestão em Tempo Real:</p>
              <p className="text-sm text-muted-foreground italic">
                "Com base no histórico deste cliente, ele demonstrou interesse em produtos premium. Considere oferecer a linha exclusiva."
              </p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2">📊 Exemplo de Análise de Sentimento:</p>
              <p className="text-sm text-muted-foreground italic">
                "⚠️ Cliente demonstrando frustração (confiança: 87%). Sugestão: Escalar para supervisor ou oferecer compensação."
              </p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2">✨ Exemplo de Resumo Automático:</p>
              <p className="text-sm text-muted-foreground italic">
                "Resumo: Cliente solicitou reembolso de R$ 299,90 referente ao pedido #12345. Produto chegou com defeito. Aguardando análise do setor financeiro há 3 dias."
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Painel de Testes de IA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AISuggestionPanel />
        <AISummaryPanel />
      </div>

      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <Brain className="w-12 h-12 mx-auto text-primary opacity-50" />
            <p className="font-medium text-foreground">✨ Funcionalidades de IA Ativas</p>
            <p className="text-sm text-muted-foreground">
              As funções de IA estão prontas e podem ser testadas acima. Em breve serão integradas automaticamente no painel de conversas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
