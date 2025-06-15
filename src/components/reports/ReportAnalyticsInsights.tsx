
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, Lightbulb, Target, Clock, Users } from "lucide-react";

const MOCK_INSIGHTS = [
  {
    type: "warning",
    icon: AlertTriangle,
    title: "Pico de Atendimentos Detectado",
    description: "Volume de atendimentos 35% acima da média nas últimas 2 horas.",
    action: "Considere alocar mais agentes para reduzir tempo de espera.",
    priority: "high",
  },
  {
    type: "positive",
    icon: TrendingUp,
    title: "Melhoria na Satisfação",
    description: "Satisfação do cliente aumentou 12% este mês comparado ao anterior.",
    action: "Identifique e replique as práticas que levaram a essa melhoria.",
    priority: "medium",
  },
  {
    type: "suggestion",
    icon: Lightbulb,
    title: "Oportunidade de Otimização",
    description: "Atendimentos via WhatsApp têm 20% mais satisfação que outros canais.",
    action: "Considere migrar mais atendimentos para WhatsApp.",
    priority: "low",
  },
  {
    type: "target",
    icon: Target,
    title: "Meta de Conversão",
    description: "Taxa de conversão está 2.1% abaixo da meta mensal.",
    action: "Revisar estratégias de follow-up e qualificação de leads.",
    priority: "high",
  },
];

const MOCK_RECOMMENDATIONS = [
  {
    title: "Horários de Pico",
    description: "Maior volume entre 14h-16h nos dias úteis",
    suggestion: "Alocar 2 agentes adicionais neste período",
  },
  {
    title: "Treinamento Sugerido",
    description: "Agentes com satisfação <4.5 precisam de capacitação",
    suggestion: "Programa de mentoria com top performers",
  },
  {
    title: "Automação",
    description: "30% das perguntas são sobre horário de funcionamento",
    suggestion: "Implementar resposta automática para FAQ",
  },
];

const getInsightColor = (type: string) => {
  switch (type) {
    case "warning":
      return "border-orange-200 bg-orange-50";
    case "positive":
      return "border-green-200 bg-green-50";
    case "suggestion":
      return "border-blue-200 bg-blue-50";
    case "target":
      return "border-red-200 bg-red-50";
    default:
      return "border-gray-200 bg-gray-50";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function ReportAnalyticsInsights({ filters }: { filters: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Insights Automatizados */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Insights Automatizados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {MOCK_INSIGHTS.map((insight, index) => {
              const IconComponent = insight.icon;
              return (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-5 h-5" />
                      <h4 className="font-semibold">{insight.title}</h4>
                    </div>
                    <Badge className={getPriorityColor(insight.priority)}>
                      {insight.priority === "high" ? "Alta" : 
                       insight.priority === "medium" ? "Média" : "Baixa"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {insight.description}
                  </p>
                  <p className="text-sm font-medium">
                    💡 {insight.action}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Recomendações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Recomendações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {MOCK_RECOMMENDATIONS.map((rec, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <h4 className="font-semibold text-sm mb-1">{rec.title}</h4>
              <p className="text-xs text-muted-foreground mb-2">
                {rec.description}
              </p>
              <p className="text-xs font-medium text-primary">
                → {rec.suggestion}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
