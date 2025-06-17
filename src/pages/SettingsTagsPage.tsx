
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Tags, 
  Plus, 
  Pencil, 
  Trash2, 
  Save, 
  Settings, 
  Palette, 
  Filter,
  Hash,
  Eye,
  EyeOff,
  Search
} from 'lucide-react';

const SettingsTagsPage = () => {
  const { toast } = useToast();
  
  // Estados para etiquetas
  const [tags, setTags] = useState([
    { id: 1, name: 'Urgente', description: 'Atendimentos urgentes', color: 'red', category: 'Prioridade', active: true, useCount: 45 },
    { id: 2, name: 'VIP', description: 'Clientes VIP', color: 'gold', category: 'Cliente', active: true, useCount: 23 },
    { id: 3, name: 'Suporte Técnico', description: 'Questões técnicas', color: 'blue', category: 'Tipo', active: true, useCount: 67 },
    { id: 4, name: 'Vendas', description: 'Oportunidades de venda', color: 'green', category: 'Departamento', active: true, useCount: 34 },
    { id: 5, name: 'Reclamação', description: 'Reclamações de clientes', color: 'orange', category: 'Tipo', active: true, useCount: 12 },
    { id: 6, name: 'Cancelamento', description: 'Solicitações de cancelamento', color: 'purple', category: 'Tipo', active: false, useCount: 8 }
  ]);

  // Estados para categorias
  const [categories, setCategories] = useState([
    { id: 1, name: 'Prioridade', description: 'Níveis de prioridade', active: true },
    { id: 2, name: 'Cliente', description: 'Tipos de cliente', active: true },
    { id: 3, name: 'Tipo', description: 'Tipos de atendimento', active: true },
    { id: 4, name: 'Departamento', description: 'Departamentos responsáveis', active: true }
  ]);

  // Estados para configurações de aplicação
  const [autoTagSettings, setAutoTagSettings] = useState({
    enableAutoTagging: true,
    keywordMatching: true,
    sentimentAnalysis: false,
    priorityDetection: true,
    requireConfirmation: false
  });

  // Estados para formulários
  const [newTag, setNewTag] = useState({ name: '', description: '', color: 'blue', category: '' });
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const handleSaveTag = () => {
    if (!newTag.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome da etiqueta é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    if (!newTag.category) {
      toast({
        title: "Erro",
        description: "Categoria é obrigatória.",
        variant: "destructive"
      });
      return;
    }

    const tag = {
      id: Date.now(),
      ...newTag,
      active: true,
      useCount: 0
    };

    setTags(prev => [...prev, tag]);
    setNewTag({ name: '', description: '', color: 'blue', category: '' });
    
    toast({
      title: "Etiqueta criada",
      description: "Nova etiqueta foi adicionada com sucesso."
    });
  };

  const handleSaveCategory = () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome da categoria é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    const category = {
      id: Date.now(),
      ...newCategory,
      active: true
    };

    setCategories(prev => [...prev, category]);
    setNewCategory({ name: '', description: '' });
    
    toast({
      title: "Categoria criada",
      description: "Nova categoria foi adicionada com sucesso."
    });
  };

  const handleDeleteTag = (id) => {
    setTags(prev => prev.filter(tag => tag.id !== id));
    toast({
      title: "Etiqueta removida",
      description: "Etiqueta foi removida com sucesso."
    });
  };

  const handleDeleteCategory = (id) => {
    // Verificar se existem etiquetas usando esta categoria
    const tagsUsingCategory = tags.filter(tag => tag.category === categories.find(cat => cat.id === id)?.name);
    
    if (tagsUsingCategory.length > 0) {
      toast({
        title: "Erro",
        description: "Não é possível remover categoria que possui etiquetas associadas.",
        variant: "destructive"
      });
      return;
    }

    setCategories(prev => prev.filter(cat => cat.id !== id));
    toast({
      title: "Categoria removida",
      description: "Categoria foi removida com sucesso."
    });
  };

  const handleToggleTagStatus = (id) => {
    setTags(prev => prev.map(tag => 
      tag.id === id ? { ...tag, active: !tag.active } : tag
    ));
  };

  const handleSaveAutoTagSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "Configurações de aplicação automática foram atualizadas."
    });
  };

  const getColorClass = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      purple: 'bg-purple-100 text-purple-800',
      gold: 'bg-yellow-100 text-yellow-800',
      red: 'bg-red-100 text-red-800',
      orange: 'bg-orange-100 text-orange-800'
    };
    return colors[color] || colors.blue;
  };

  // Filtrar etiquetas
  const filteredTags = tags.filter(tag => {
    const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tag.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || tag.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Tags className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Configurações - Etiquetas</h1>
          </div>
          <p className="text-muted-foreground">
            Gerencie etiquetas, categorias e configurações de aplicação automática.
          </p>
        </div>
      </div>

      <Tabs defaultValue="tags" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tags" className="flex items-center gap-2">
            <Hash className="w-4 h-4" />
            Etiquetas
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Categorias
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Automação
          </TabsTrigger>
        </TabsList>

        {/* Etiquetas */}
        <TabsContent value="tags" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Gerenciar Etiquetas
              </CardTitle>
              <CardDescription>
                Crie e organize etiquetas para categorizar atendimentos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Formulário para nova etiqueta */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                <div>
                  <Label htmlFor="tagName">Nome da Etiqueta</Label>
                  <Input
                    id="tagName"
                    placeholder="Ex: Urgente, VIP..."
                    value={newTag.name}
                    onChange={(e) => setNewTag(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="tagDescription">Descrição</Label>
                  <Input
                    id="tagDescription"
                    placeholder="Descrição da etiqueta"
                    value={newTag.description}
                    onChange={(e) => setNewTag(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="tagColor">Cor</Label>
                  <Select value={newTag.color} onValueChange={(value) => setNewTag(prev => ({ ...prev, color: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Azul</SelectItem>
                      <SelectItem value="green">Verde</SelectItem>
                      <SelectItem value="purple">Roxo</SelectItem>
                      <SelectItem value="gold">Dourado</SelectItem>
                      <SelectItem value="red">Vermelho</SelectItem>
                      <SelectItem value="orange">Laranja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tagCategory">Categoria</Label>
                  <Select value={newTag.category} onValueChange={(value) => setNewTag(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSaveTag} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </div>

              {/* Filtros */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar etiquetas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Lista de etiquetas */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Cor</TableHead>
                    <TableHead>Uso</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTags.map((tag) => (
                    <TableRow key={tag.id}>
                      <TableCell className="font-medium">{tag.name}</TableCell>
                      <TableCell>{tag.description}</TableCell>
                      <TableCell>{tag.category}</TableCell>
                      <TableCell>
                        <Badge className={getColorClass(tag.color)}>
                          {tag.color}
                        </Badge>
                      </TableCell>
                      <TableCell>{tag.useCount} vezes</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleTagStatus(tag.id)}
                        >
                          {tag.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteTag(tag.id)}
                          >
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

        {/* Categorias */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Categorias de Etiquetas
              </CardTitle>
              <CardDescription>
                Organize suas etiquetas em categorias para melhor gestão.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Formulário para nova categoria */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                <div>
                  <Label htmlFor="categoryName">Nome da Categoria</Label>
                  <Input
                    id="categoryName"
                    placeholder="Ex: Prioridade, Tipo..."
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="categoryDescription">Descrição</Label>
                  <Input
                    id="categoryDescription"
                    placeholder="Descrição da categoria"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSaveCategory} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </div>

              {/* Lista de categorias */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Etiquetas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell>
                        {tags.filter(tag => tag.category === category.name).length} etiquetas
                      </TableCell>
                      <TableCell>
                        <Badge variant={category.active ? "default" : "secondary"}>
                          {category.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
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

        {/* Automação */}
        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Aplicação Automática de Etiquetas
              </CardTitle>
              <CardDescription>
                Configure regras para aplicação automática de etiquetas em atendimentos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableAutoTagging">Habilitar Etiquetagem Automática</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir aplicação automática de etiquetas
                    </p>
                  </div>
                  <Switch
                    id="enableAutoTagging"
                    checked={autoTagSettings.enableAutoTagging}
                    onCheckedChange={(checked) => setAutoTagSettings(prev => ({ ...prev, enableAutoTagging: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="keywordMatching">Correspondência por Palavras-chave</Label>
                    <p className="text-sm text-muted-foreground">
                      Aplicar etiquetas baseado em palavras-chave nas mensagens
                    </p>
                  </div>
                  <Switch
                    id="keywordMatching"
                    checked={autoTagSettings.keywordMatching}
                    onCheckedChange={(checked) => setAutoTagSettings(prev => ({ ...prev, keywordMatching: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sentimentAnalysis">Análise de Sentimento</Label>
                    <p className="text-sm text-muted-foreground">
                      Aplicar etiquetas baseado no sentimento das mensagens
                    </p>
                  </div>
                  <Switch
                    id="sentimentAnalysis"
                    checked={autoTagSettings.sentimentAnalysis}
                    onCheckedChange={(checked) => setAutoTagSettings(prev => ({ ...prev, sentimentAnalysis: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="priorityDetection">Detecção de Prioridade</Label>
                    <p className="text-sm text-muted-foreground">
                      Detectar automaticamente a prioridade do atendimento
                    </p>
                  </div>
                  <Switch
                    id="priorityDetection"
                    checked={autoTagSettings.priorityDetection}
                    onCheckedChange={(checked) => setAutoTagSettings(prev => ({ ...prev, priorityDetection: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireConfirmation">Exigir Confirmação</Label>
                    <p className="text-sm text-muted-foreground">
                      Solicitar confirmação antes de aplicar etiquetas automaticamente
                    </p>
                  </div>
                  <Switch
                    id="requireConfirmation"
                    checked={autoTagSettings.requireConfirmation}
                    onCheckedChange={(checked) => setAutoTagSettings(prev => ({ ...prev, requireConfirmation: checked }))}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveAutoTagSettings}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsTagsPage;
