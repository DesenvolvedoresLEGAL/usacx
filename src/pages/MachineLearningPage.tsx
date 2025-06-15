
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, History, BarChart2 } from "lucide-react";

export default function MachineLearningPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Brain className="w-8 h-8 text-primary" /> Machine Learning
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Central de aprendizado dos agentes de IA do sistema. Aqui você poderá treinar a inteligência artificial com base nas solicitações, analisar o histórico de interações e avaliar o desempenho dos modelos.
        </p>
      </div>

      {/* Objetivos / Cards de informação */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card>
          <CardHeader>
            <BarChart2 className="w-6 h-6 text-primary mb-2"/>
            <CardTitle>Treinamento Inteligente</CardTitle>
            <CardDescription>
              Ensine os agentes de IA com dados reais de atendimentos para melhorar o entendimento das solicitações.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <History className="w-6 h-6 text-primary mb-2"/>
            <CardTitle>Análise de Histórico</CardTitle>
            <CardDescription>
              Use o histórico das interações para identificar padrões, tópicos frequentes e oportunidades de automação.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Brain className="w-6 h-6 text-primary mb-2"/>
            <CardTitle>Performance e Sugestões</CardTitle>
            <CardDescription>
              Avalie sugestões automáticas da IA e acompanhe métricas de evolução dos modelos treinados.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Espaço para ações futuras */}
      <div>
        <Button variant="default" size="lg" disabled>
          Em breve: Treinar IA nos atendimentos
        </Button>
        <span className="ml-4 text-sm text-muted-foreground">Funcionalidade em desenvolvimento</span>
      </div>
    </div>
  );
}
