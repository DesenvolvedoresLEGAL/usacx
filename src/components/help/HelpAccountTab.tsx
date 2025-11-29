import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Download, MessageSquare, Phone, CheckCircle } from "lucide-react";

export const HelpAccountTab = () => {
  const [cancellationStep, setCancellationStep] = useState(1);
  const [cancellationReason, setCancellationReason] = useState("");
  const [feedback, setFeedback] = useState("");
  const [confirmationChecked, setConfirmationChecked] = useState(false);

  const reasons = [
    "Preço muito alto",
    "Funcionalidades insuficientes",
    "Dificuldade de uso",
    "Problemas técnicos frequentes",
    "Mudança para outro fornecedor",
    "Não precisamos mais do serviço",
    "Problemas com suporte",
    "Outros",
  ];

  const currentPlan = {
    name: "Plano Professional",
    price: "R$ 299,00/mês",
    users: "25 usuários",
    nextBilling: "15 de Fevereiro, 2024",
    contract: "Mensal",
  };

  const alternatives = [
    {
      title: "Mudar para Plano Básico",
      description: "Reduzir custos mantendo funcionalidades essenciais",
      price: "R$ 99,00/mês",
      savings: "Economize R$ 200,00/mês",
    },
    {
      title: "Pausar Temporariamente",
      description: "Suspender a conta por até 3 meses sem perder dados",
      price: "Gratuito",
      savings: "Economize durante a pausa",
    },
    {
      title: "Desconto Especial",
      description: "30% de desconto nos próximos 6 meses",
      price: "R$ 209,30/mês",
      savings: "Economize R$ 89,70/mês",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Action buttons */}
      <div className="flex gap-2">
        <Button variant="outline">
          <Phone className="w-4 h-4 mr-2" />
          Falar com Suporte
        </Button>
        <Button variant="outline">
          <MessageSquare className="w-4 h-4 mr-2" />
          Chat ao Vivo
        </Button>
      </div>

      <Tabs defaultValue="alternatives" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alternatives">Alternativas</TabsTrigger>
          <TabsTrigger value="process">Processo de Cancelamento</TabsTrigger>
          <TabsTrigger value="data">Backup de Dados</TabsTrigger>
          <TabsTrigger value="support">Suporte</TabsTrigger>
        </TabsList>

        <TabsContent value="alternatives" className="space-y-4">
          {/* Current Plan Info */}
          <Card>
            <CardHeader>
              <CardTitle>Plano Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Plano</p>
                  <p className="font-medium">{currentPlan.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Preço</p>
                  <p className="font-medium">{currentPlan.price}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Usuários</p>
                  <p className="font-medium">{currentPlan.users}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Próxima Cobrança</p>
                  <p className="font-medium">{currentPlan.nextBilling}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Before you cancel */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Antes de cancelar,</strong> considere as alternativas abaixo que podem atender melhor às suas
              necessidades.
            </AlertDescription>
          </Alert>

          {/* Alternatives */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {alternatives.map((alternative, index) => (
              <Card key={index} className="relative">
                <CardHeader>
                  <CardTitle className="text-lg">{alternative.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{alternative.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-2xl font-bold text-primary">{alternative.price}</p>
                      <p className="text-sm text-green-600 font-medium">{alternative.savings}</p>
                    </div>
                    <Button className="w-full">Escolher Esta Opção</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Still want to cancel */}
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-medium mb-2">Ainda deseja cancelar?</h3>
              <p className="text-muted-foreground mb-4">
                Nossa equipe de sucesso do cliente pode ajudar a resolver qualquer problema.
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Falar com Especialista
                </Button>
                <Button variant="destructive">Continuar Cancelamento</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="process" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Processo de Cancelamento</CardTitle>
            </CardHeader>
            <CardContent>
              {cancellationStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="reason">Motivo do Cancelamento *</Label>
                    <Select value={cancellationReason} onValueChange={setCancellationReason}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o motivo" />
                      </SelectTrigger>
                      <SelectContent>
                        {reasons.map((reason) => (
                          <SelectItem key={reason} value={reason}>
                            {reason}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="feedback">Feedback Adicional</Label>
                    <Textarea
                      id="feedback"
                      placeholder="Conte-nos mais sobre sua experiência e como podemos melhorar..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Importante:</strong> Após o cancelamento, você terá acesso até {currentPlan.nextBilling}.
                      Seus dados serão mantidos por 90 dias para possível reativação.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-3">
                    <Button onClick={() => setCancellationStep(2)} disabled={!cancellationReason} className="flex-1">
                      Continuar
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Cancelar Processo
                    </Button>
                  </div>
                </div>
              )}

              {cancellationStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-2">Confirmação de Cancelamento</h3>
                    <p className="text-muted-foreground">
                      Por favor, confirme que você entende as consequências do cancelamento:
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 space-y-3">
                      <h4 className="font-medium">O que acontecerá:</h4>
                      <ul className="text-sm space-y-2 text-muted-foreground">
                        <li>• Acesso será mantido até {currentPlan.nextBilling}</li>
                        <li>• Não haverá cobrança no próximo ciclo</li>
                        <li>• Dados serão mantidos por 90 dias</li>
                        <li>• Você pode reativar a qualquer momento</li>
                        <li>• Todas as integrações serão desabilitadas</li>
                      </ul>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="confirmation"
                        checked={confirmationChecked}
                        onCheckedChange={(checked) => setConfirmationChecked(checked === true)}
                      />
                      <Label htmlFor="confirmation" className="text-sm">
                        Eu entendo e confirmo que desejo cancelar minha assinatura
                      </Label>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => setCancellationStep(3)}
                      disabled={!confirmationChecked}
                      variant="destructive"
                      className="flex-1"
                    >
                      Confirmar Cancelamento
                    </Button>
                    <Button variant="outline" onClick={() => setCancellationStep(1)} className="flex-1">
                      Voltar
                    </Button>
                  </div>
                </div>
              )}

              {cancellationStep === 3 && (
                <div className="text-center space-y-6">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  <div>
                    <h3 className="text-lg font-medium mb-2">Cancelamento Processado</h3>
                    <p className="text-muted-foreground">
                      Sua assinatura foi cancelada com sucesso. Você receberá um email de confirmação em breve.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Próximos Passos:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Continue usando até {currentPlan.nextBilling}</li>
                      <li>• Faça backup de seus dados importantes</li>
                      <li>• Entre em contato se precisar reativar</li>
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Baixar Dados
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Voltar ao Dashboard
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backup de Dados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Download className="h-4 w-4" />
                <AlertDescription>
                  Recomendamos fazer backup de todos os seus dados importantes antes do cancelamento.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Dados de Atendimentos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Histórico completo de tickets, conversas e interações
                    </p>
                    <Button className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Baixar (CSV)
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Dados de Clientes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Lista de clientes, informações de contato e histórico
                    </p>
                    <Button className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Baixar (CSV)
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Relatórios</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Relatórios de performance, analytics e métricas
                    </p>
                    <Button className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Baixar (PDF)
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Configurações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Backup de todas as configurações do sistema</p>
                    <Button className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Baixar (JSON)
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Backup Completo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Faça o download de todos os seus dados em um arquivo único
                  </p>
                  <Button className="w-full" size="lg">
                    <Download className="w-5 h-5 mr-2" />
                    Baixar Backup Completo (ZIP)
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Entre em Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Nossa equipe está aqui para ajudar com qualquer dúvida sobre o cancelamento.
                </p>

                <div className="space-y-3">
                  <Button className="w-full justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat ao Vivo (Disponível 24/7)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="w-4 h-4 mr-2" />
                    Telefone: (11) 1234-5678
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Perguntas Frequentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Posso reativar depois?</h4>
                  <p className="text-sm text-muted-foreground">
                    Sim, você pode reativar em até 90 dias sem perder dados.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Haverá reembolso?</h4>
                  <p className="text-sm text-muted-foreground">
                    Reembolsos são analisados caso a caso, entre em contato.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Como funciona a migração?</h4>
                  <p className="text-sm text-muted-foreground">
                    Oferecemos suporte para migração de dados se necessário.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
