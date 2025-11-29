import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, TrendingUp, Target, MessageSquare, Clock, Users, Zap, Brain } from "lucide-react";

export default function AIAnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <PieChart className="w-8 h-8 text-primary" /> Analytics de IA
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Acompanhe métricas de performance dos agentes de IA, insights sobre conversas e oportunidades de melhoria através de análise preditiva.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Resolução IA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">87.4%</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-600" />
              +5.2% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tempo Médio de Resposta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1.2s</div>
            <p className="text-xs text-muted-foreground mt-1">
              98% abaixo de 2 segundos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversas Automatizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground mt-1">
              67% do total de atendimentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Satisfação do Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.6/5</div>
            <p className="text-xs text-muted-foreground mt-1">
              Baseado em 1,234 avaliações
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Tópicos Mais Frequentes
            </CardTitle>
            <CardDescription>Assuntos mais abordados pelos clientes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">Dúvidas sobre produtos</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary rounded-full h-2" style={{ width: '68%' }}></div>
                  </div>
                </div>
                <span className="text-sm font-semibold ml-4 text-muted-foreground">68%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">Status de pedido</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary rounded-full h-2" style={{ width: '52%' }}></div>
                  </div>
                </div>
                <span className="text-sm font-semibold ml-4 text-muted-foreground">52%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">Reclamações</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary rounded-full h-2" style={{ width: '34%' }}></div>
                  </div>
                </div>
                <span className="text-sm font-semibold ml-4 text-muted-foreground">34%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">Trocas e devoluções</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary rounded-full h-2" style={{ width: '28%' }}></div>
                  </div>
                </div>
                <span className="text-sm font-semibold ml-4 text-muted-foreground">28%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Performance por Agente
            </CardTitle>
            <CardDescription>Comparativo de precisão dos agentes de IA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="font-medium">Assistente Principal</span>
                </div>
                <span className="text-sm font-semibold">94.5%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="font-medium">Bot de Vendas</span>
                </div>
                <span className="text-sm font-semibold">91.2%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span className="font-medium">Suporte Técnico</span>
                </div>
                <span className="text-sm font-semibold">88.7%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Insights e Recomendações
          </CardTitle>
          <CardDescription>Análise preditiva e oportunidades de otimização</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900 rounded-lg">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Oportunidade de Automação
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    36% das conversas sobre "status de pedido" ainda são atendidas manualmente. Considere treinar o bot para automatizar esse fluxo.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 rounded-lg">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-900 dark:text-amber-100 mb-1">
                    Horário de Pico
                  </p>
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Volume de conversas aumenta 140% entre 14h-17h. Considere adicionar mais agentes IA neste período.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900 rounded-lg">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900 dark:text-green-100 mb-1">
                    Alta Satisfação
                  </p>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    O "Bot de Vendas" tem a maior taxa de conversão (23%) e satisfação (4.8/5). Analise suas estratégias para replicar nos outros agentes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center py-8 text-muted-foreground">
        <p className="font-medium">📊 Dados simulados para demonstração</p>
        <p className="text-sm mt-2">
          Em produção, métricas reais serão coletadas automaticamente das conversas dos agentes de IA
        </p>
      </div>
    </div>
  );
}
