import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Send, Search, Phone, Mail, Clock, CheckCircle, User, Bot } from "lucide-react";

export default function HelpChatPage() {
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const faqs = [
    {
      id: 1,
      question: "Como criar um novo atendimento?",
      answer: "Para criar um novo atendimento, acesse o menu Gestão > Atendimentos e clique em 'Novo Atendimento'.",
      category: "Básico",
    },
    {
      id: 2,
      question: "Como configurar notificações?",
      answer: "Acesse Configurações > Notificações para personalizar seus alertas.",
      category: "Configurações",
    },
    {
      id: 3,
      question: "Como gerar relatórios?",
      answer: "Vá até o menu Relatórios e selecione o tipo de relatório desejado.",
      category: "Relatórios",
    },
    {
      id: 4,
      question: "Como redefinir minha senha?",
      answer: "Clique em 'Esqueci minha senha' na tela de login.",
      category: "Conta",
    },
  ];

  const tickets = [
    {
      id: "#12345",
      subject: "Problema com integração",
      status: "Em andamento",
      created: "2 horas atrás",
      priority: "Alta",
    },
    {
      id: "#12344",
      subject: "Dúvida sobre relatórios",
      status: "Resolvido",
      created: "1 dia atrás",
      priority: "Média",
    },
    {
      id: "#12343",
      subject: "Erro ao exportar dados",
      status: "Aguardando",
      created: "2 dias atrás",
      priority: "Baixa",
    },
  ];

  const chatMessages = [
    { id: 1, type: "bot", message: "Olá! Sou o assistente virtual do USAC. Como posso ajudá-lo hoje?", time: "14:30" },
    { id: 2, type: "user", message: "Preciso de ajuda para configurar as filas de atendimento", time: "14:32" },
    {
      id: 3,
      type: "bot",
      message:
        "Claro! Vou te ajudar com a configuração de filas. Você pode acessar em Configurações > Filas de Atendimento. Precisa de alguma configuração específica?",
      time: "14:33",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Ajuda - Chat</h1>
          </div>
          <p className="text-muted-foreground">Central de ajuda e suporte técnico</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Phone className="w-4 h-4 mr-2" />
            Ligar para Suporte
          </Button>
          <Button>
            <Mail className="w-4 h-4 mr-2" />
            Abrir Ticket
          </Button>
        </div>
      </div>

      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chat">Chat ao Vivo</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="tickets">Meus Tickets</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Window */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      Suporte Online
                    </CardTitle>
                    <Badge variant="default">Conectado</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  {/* Messages */}
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.type === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {msg.type === "bot" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            <span className="text-xs">{msg.time}</span>
                          </div>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Digite sua mensagem..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && setMessage("")}
                      />
                      <Button size="icon" onClick={() => setMessage("")}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Novo Ticket
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Search className="w-4 h-4 mr-2" />
                    Base de Conhecimento
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="w-4 h-4 mr-2" />
                    Agendar Ligação
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Horário de Atendimento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Segunda - Sexta</span>
                    <span>8h - 18h</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Sábados</span>
                    <span>9h - 14h</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600 mt-3">
                    <Clock className="w-4 h-4" />
                    <span>Online agora</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          {/* Search FAQ */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar perguntas frequentes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* FAQ List */}
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                    <Badge variant="secondary">{faq.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      Útil
                    </Button>
                    <Button variant="outline" size="sm">
                      Não útil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Meus Tickets de Suporte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{ticket.id}</span>
                        <Badge
                          variant={
                            ticket.status === "Resolvido"
                              ? "default"
                              : ticket.status === "Em andamento"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {ticket.status}
                        </Badge>
                      </div>
                      <Badge variant="outline">{ticket.priority}</Badge>
                    </div>
                    <h4 className="font-medium mb-2">{ticket.subject}</h4>
                    <p className="text-sm text-muted-foreground">{ticket.created}</p>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                      {ticket.status !== "Resolvido" && (
                        <Button variant="outline" size="sm">
                          Adicionar Resposta
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Telefone</p>
                    <p className="text-sm text-muted-foreground">(11) 1234-5678</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">suporte@humanoid-os.ai</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Horário</p>
                    <p className="text-sm text-muted-foreground">Seg-Sex: 8h-18h, Sáb: 9h-14h</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Níveis de Suporte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span className="font-medium">Crítico</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-5">Resposta imediata (até 15 min)</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full" />
                    <span className="font-medium">Alto</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-5">Resposta em até 1 hora</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="font-medium">Médio</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-5">Resposta em até 4 horas</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full" />
                    <span className="font-medium">Baixo</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-5">Resposta em até 24 horas</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
