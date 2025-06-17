
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
import { Hash, Plus, Edit, Trash2, Search, Filter, Download, Settings, Tag, TrendingUp } from "lucide-react";

export default function SettingsHashtagsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const hashtags = [
    { id: 1, name: "#suporte", category: "Atendimento", color: "#3B82F6", usageCount: 245, description: "Para questões de suporte técnico", active: true },
    { id: 2, name: "#vendas", category: "Comercial", color: "#10B981", usageCount: 189, description: "Relacionado a vendas e propostas", active: true },
    { id: 3, name: "#urgente", category: "Prioridade", color: "#EF4444", usageCount: 87, description: "Casos urgentes que precisam de atenção imediata", active: true },
    { id: 4, name: "#financeiro", category: "Financeiro", color: "#F59E0B", usageCount: 156, description: "Questões financeiras e cobrança", active: true },
    { id: 5, name: "#feedback", category: "Qualidade", color: "#8B5CF6", usageCount: 134, description: "Feedback dos clientes", active: false },
  ];

  const categories = [
    { name: "Atendimento", count: 15, color: "#3B82F6" },
    { name: "Comercial", count: 8, color: "#10B981" },
    { name: "Prioridade", count: 5, color: "#EF4444" },
    { name: "Financeiro", count: 12, color: "#F59E0B" },
    { name: "Qualidade", count: 6, color: "#8B5CF6" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Configurações - Hashtags</h1>
          </div>
          <p className="text-muted-foreground">
            Gerencie hashtags para categorização e organização de atendimentos
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
                Nova Hashtag
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Hashtag</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="hashtag-name">Nome da Hashtag</Label>
                  <Input id="hashtag-name" placeholder="#exemplo" />
                </div>
                <div>
                  <Label htmlFor="hashtag-category">Categoria</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="atendimento">Atendimento</SelectItem>
                      <SelectItem value="comercial">Comercial</SelectItem>
                      <SelectItem value="prioridade">Prioridade</SelectItem>
                      <SelectItem value="financeiro">Financeiro</SelectItem>
                      <SelectItem value="qualidade">Qualidade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="hashtag-color">Cor</Label>
                  <Input id="hashtag-color" type="color" defaultValue="#3B82F6" />
                </div>
                <div>
                  <Label htmlFor="hashtag-description">Descrição</Label>
                  <Textarea id="hashtag-description" placeholder="Descreva quando usar esta hashtag..." />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="hashtag-active" defaultChecked />
                  <Label htmlFor="hashtag-active">Ativa</Label>
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

      <Tabs defaultValue="hashtags" className="space-y-4">
        <TabsList>
          <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="hashtags" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Buscar hashtags..."
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
                    <SelectItem value="atendimento">Atendimento</SelectItem>
                    <SelectItem value="comercial">Comercial</SelectItem>
                    <SelectItem value="prioridade">Prioridade</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="qualidade">Qualidade</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabela de Hashtags */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Hashtags</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hashtag</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Uso</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hashtags.map((hashtag) => (
                    <TableRow key={hashtag.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: hashtag.color }}
                          />
                          <span className="font-medium">{hashtag.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{hashtag.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                          {hashtag.usageCount}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{hashtag.description}</TableCell>
                      <TableCell>
                        <Badge variant={hashtag.active ? "default" : "secondary"}>
                          {hashtag.active ? "Ativa" : "Inativa"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
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
                  <p className="text-sm text-muted-foreground">hashtags</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Hashtags</p>
                    <p className="text-2xl font-bold">46</p>
                  </div>
                  <Tag className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Hashtags Ativas</p>
                    <p className="text-2xl font-bold">38</p>
                  </div>
                  <Hash className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Uso Total</p>
                    <p className="text-2xl font-bold">811</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-suggest">Sugestão Automática</Label>
                  <p className="text-sm text-muted-foreground">
                    Sugerir hashtags automaticamente baseado no conteúdo
                  </p>
                </div>
                <Switch id="auto-suggest" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="mandatory-hashtag">Hashtag Obrigatória</Label>
                  <p className="text-sm text-muted-foreground">
                    Exigir pelo menos uma hashtag em cada atendimento
                  </p>
                </div>
                <Switch id="mandatory-hashtag" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="case-sensitive">Sensível a Maiúsculas</Label>
                  <p className="text-sm text-muted-foreground">
                    Diferenciar maiúsculas e minúsculas nas hashtags
                  </p>
                </div>
                <Switch id="case-sensitive" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
