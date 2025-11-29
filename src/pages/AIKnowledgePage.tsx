import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, History, BarChart2, Upload, FileText, MessageSquare } from "lucide-react";

export default function AIKnowledgePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-primary" /> Base de Conhecimento
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Treine e aprimore seus agentes de IA com base nas conversas reais, gerenciando FAQ, intenções e o conhecimento da plataforma.
        </p>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Treinar com Conversas
            </CardTitle>
            <CardDescription>
              Selecione conversas bem-sucedidas para treinar os agentes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Conversas Disponíveis</p>
                <p className="text-sm text-muted-foreground">12,847 conversas finalizadas</p>
              </div>
              <Button variant="outline">Selecionar</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Conversas Treinadas</p>
                <p className="text-sm text-muted-foreground">3,241 usadas no último treinamento</p>
              </div>
              <Button variant="outline">Ver Histórico</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Gerenciar FAQ
            </CardTitle>
            <CardDescription>
              Configure perguntas e respostas frequentes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">FAQ Ativos</p>
                <p className="text-sm text-muted-foreground">87 perguntas configuradas</p>
              </div>
              <Button variant="outline">Gerenciar</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Sugestões Pendentes</p>
                <p className="text-sm text-muted-foreground">15 perguntas sugeridas pela IA</p>
              </div>
              <Button variant="outline">Revisar</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Importar Conhecimento
          </CardTitle>
          <CardDescription>
            Faça upload de documentos, manuais e materiais de treinamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">
              Arraste arquivos PDF, DOCX ou TXT ou clique para selecionar
            </p>
            <Button disabled>Fazer Upload</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Configurar Intenções
          </CardTitle>
          <CardDescription>
            Defina e gerencie as intenções que a IA deve reconhecer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="font-medium">Saudação</span>
                <span className="text-xs text-muted-foreground">23 variações</span>
              </div>
              <Button variant="ghost" size="sm">Editar</Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="font-medium">Consulta de Produto</span>
                <span className="text-xs text-muted-foreground">47 variações</span>
              </div>
              <Button variant="ghost" size="sm">Editar</Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="font-medium">Reclamação</span>
                <span className="text-xs text-muted-foreground">31 variações</span>
              </div>
              <Button variant="ghost" size="sm">Editar</Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span className="font-medium">Solicitação de Reembolso</span>
                <span className="text-xs text-muted-foreground">12 variações</span>
              </div>
              <Button variant="ghost" size="sm">Editar</Button>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full" disabled>
              <Brain className="w-4 h-4 mr-2" />
              Adicionar Nova Intenção
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <Button variant="default" size="lg" disabled>
          Iniciar Novo Treinamento
        </Button>
        <span className="ml-4 text-sm text-muted-foreground">Funcionalidade em desenvolvimento</span>
      </div>
    </div>
  );
}
