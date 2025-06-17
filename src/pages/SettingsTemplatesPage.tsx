
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquarePlus, Plus, Edit, Trash2, Search, Filter, Download, Copy, Star } from "lucide-react";

export default function SettingsTemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const templates = [
    { 
      id: 1, 
      title: "Boas-vindas", 
      category: "Saudação", 
      content: "Olá! Seja bem-vindo(a) ao nosso atendimento. Como posso ajudá-lo(a) hoje?", 
      usageCount: 342, 
      favorite: true, 
      active: true 
    },
    { 
      id: 2, 
      title: "Aguardar resposta", 
      category: "Padrão", 
      content: "Obrigado por entrar em contato. Estou verificando suas informações e retorno em breve.", 
      usageCount: 198, 
      favorite: false, 
      active: true 
    },
    { 
      id: 3, 
      title: "Transferir para financeiro", 
      category: "Transferência", 
      content: "Vou transferir você para nossa equipe financeira que poderá ajudá-lo melhor com essa questão.", 
      usageCount: 87, 
      favorite: false, 
      active: true 
    },
    { 
      id: 4, 
      title: "Problema resolvido", 
      category: "Finalização", 
      content: "Fico feliz em saber que conseguimos resolver sua questão. Há mais alguma coisa que posso ajudar?", 
      usageCount: 256, 
      favorite: true, 
      active: true 
    },
    { 
      id: 5, 
      title: "Horário de funcionamento", 
      category: "Informativa", 
      content: "Nosso horário de atendimento é de segunda a sexta, das 8h às 18h. Fora desse horário, retornaremos assim que possível.", 
      usageCount: 134, 
      favorite: false, 
      active: false 
    },
  ];

  const categories = [
    { name: "Saudação", count: 5, color: "#10B981" },
    { name: "Padrão", count: 12, color: "#3B82F6" },
    { name: "Transferência", count: 8, color: "#F59E0B" },
    { name: "Finalização", count: 6, color: "#8B5CF6" },
    { name: "Informativa", count: 15, color: "#6B7280" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MessageSquarePlus className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Configurações - Mensagens Prontas</h1>
          </div>
          <p className="text-muted-foreground">
            Gerencie templates de mensagens para agilizar o atendimento
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Mensagem
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nova Mensagem Pronta</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="template-title">Título</Label>
                    <Input id="template-title" placeholder="Nome da mensagem..." />
                  </div>
                  <div>
                    <Label htmlFor="template-category">Categoria</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="saudacao">Saudação</SelectItem>
                        <SelectItem value="padrao">Padrão</SelectItem>
                        <SelectItem value="transferencia">Transferência</SelectItem>
                        <SelectItem value="finalizacao">Finalização</SelectItem>
                        <SelectItem value="informativa">Informativa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="template-content">Conteúdo da Mensagem</Label>
                  <Textarea 
                    id="template-content" 
                    placeholder="Digite o conteúdo da mensagem..." 
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use variáveis: {"{nome}"}, {"{empresa}"}, {"{protocolo}"}, {"{data}"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="template-active" defaultChecked />
                    <Label htmlFor="template-active">Ativa</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="template-favorite" />
                    <Label htmlFor="template-favorite">Favorita</Label>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">Salvar</Button>
                  <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Mensagens</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="variables">Variáveis</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Buscar mensagens..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    <SelectItem value="saudacao">Saudação</SelectItem>
                    <SelectItem value="padrao">Padrão</SelectItem>
                    <SelectItem value="transferencia">Transferência</SelectItem>
                    <SelectItem value="finalizacao">Finalização</SelectItem>
                    <SelectItem value="informativa">Informativa</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabela de Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Mensagens</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Conteúdo</TableHead>
                    <TableHead>Uso</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {template.favorite && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                          <span className="font-medium">{template.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{template.category}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate text-sm">{template.content}</p>
                      </TableCell>
                      <TableCell>{template.usageCount}</TableCell>
                      <TableCell>
                        <Badge variant={template.active ? "default" : "secondary"}>
                          {template.active ? "Ativa" : "Inativa"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: category.color }}
                      />
                      <h3 className="font-semibold">{category.name}</h3>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{category.count}</p>
                  <p className="text-sm text-muted-foreground">mensagens</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="variables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Variáveis Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Dados do Cliente</h4>
                  <div className="space-y-1 text-sm">
                    <p><code className="bg-muted px-1 rounded">{"{nome}"}</code> - Nome do cliente</p>
                    <p><code className="bg-muted px-1 rounded">{"{email}"}</code> - Email do cliente</p>
                    <p><code className="bg-muted px-1 rounded">{"{telefone}"}</code> - Telefone do cliente</p>
                    <p><code className="bg-muted px-1 rounded">{"{empresa}"}</code> - Empresa do cliente</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Dados do Atendimento</h4>
                  <div className="space-y-1 text-sm">
                    <p><code className="bg-muted px-1 rounded">{"{protocolo}"}</code> - Número do protocolo</p>
                    <p><code className="bg-muted px-1 rounded">{"{data}"}</code> - Data atual</p>
                    <p><code className="bg-muted px-1 rounded">{"{hora}"}</code> - Hora atual</p>
                    <p><code className="bg-muted px-1 rounded">{"{agente}"}</code> - Nome do agente</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Mensagens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-complete">Auto-completar</Label>
                  <p className="text-sm text-muted-foreground">
                    Sugerir mensagens prontas enquanto o agente digita
                  </p>
                </div>
                <Switch id="auto-complete" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="preview-variables">Preview de Variáveis</Label>
                  <p className="text-sm text-muted-foreground">
                    Mostrar preview das variáveis antes de enviar
                  </p>
                </div>
                <Switch id="preview-variables" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="shortcut-keys">Atalhos de Teclado</Label>
                  <p className="text-sm text-muted-foreground">
                    Permitir uso de atalhos para inserir mensagens
                  </p>
                </div>
                <Switch id="shortcut-keys" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
