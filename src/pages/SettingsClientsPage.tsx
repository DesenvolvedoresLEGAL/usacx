
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
  Users2, 
  Plus, 
  Pencil, 
  Trash2, 
  Save, 
  Settings, 
  Shield, 
  Mail, 
  Phone, 
  MessageSquare,
  Eye,
  EyeOff,
  Tag,
  Filter,
  UserPlus
} from 'lucide-react';

const SettingsClientsPage = () => {
  const { toast } = useToast();
  
  // Estados para categorias de clientes
  const [clientCategories, setClientCategories] = useState([
    { id: 1, name: 'VIP', description: 'Clientes prioritários', color: 'gold', active: true },
    { id: 2, name: 'Premium', description: 'Clientes premium', color: 'purple', active: true },
    { id: 3, name: 'Regular', description: 'Clientes regulares', color: 'blue', active: true },
    { id: 4, name: 'Novo', description: 'Novos clientes', color: 'green', active: true }
  ]);

  // Estados para campos personalizados
  const [customFields, setCustomFields] = useState([
    { id: 1, name: 'CPF/CNPJ', type: 'text', required: true, visible: true },
    { id: 2, name: 'Data de Nascimento', type: 'date', required: false, visible: true },
    { id: 3, name: 'Empresa', type: 'text', required: false, visible: true },
    { id: 4, name: 'Cargo', type: 'text', required: false, visible: false }
  ]);

  // Estados para configurações de privacidade
  const [privacySettings, setPrivacySettings] = useState({
    dataRetention: '365', // dias
    anonymizeAfter: '730', // dias
    allowDataExport: true,
    requireConsent: true,
    trackingEnabled: false
  });

  // Estados para configurações de comunicação
  const [communicationSettings, setCommunicationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    whatsappNotifications: true,
    marketingEmails: false,
    autoResponse: true,
    responseTemplate: 'Olá! Recebemos sua mensagem e retornaremos em breve.'
  });

  // Estados para formulários
  const [newCategory, setNewCategory] = useState({ name: '', description: '', color: 'blue' });
  const [newField, setNewField] = useState({ name: '', type: 'text', required: false });
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingField, setEditingField] = useState(null);

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

    setClientCategories(prev => [...prev, category]);
    setNewCategory({ name: '', description: '', color: 'blue' });
    
    toast({
      title: "Categoria criada",
      description: "Nova categoria de cliente foi adicionada com sucesso."
    });
  };

  const handleSaveField = () => {
    if (!newField.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do campo é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    const field = {
      id: Date.now(),
      ...newField,
      visible: true
    };

    setCustomFields(prev => [...prev, field]);
    setNewField({ name: '', type: 'text', required: false });
    
    toast({
      title: "Campo criado",
      description: "Novo campo personalizado foi adicionado com sucesso."
    });
  };

  const handleDeleteCategory = (id) => {
    setClientCategories(prev => prev.filter(cat => cat.id !== id));
    toast({
      title: "Categoria removida",
      description: "Categoria foi removida com sucesso."
    });
  };

  const handleDeleteField = (id) => {
    setCustomFields(prev => prev.filter(field => field.id !== id));
    toast({
      title: "Campo removido",
      description: "Campo personalizado foi removido com sucesso."
    });
  };

  const handleSavePrivacySettings = () => {
    toast({
      title: "Configurações salvas",
      description: "Configurações de privacidade foram atualizadas com sucesso."
    });
  };

  const handleSaveCommunicationSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "Configurações de comunicação foram atualizadas com sucesso."
    });
  };

  const getColorClass = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      purple: 'bg-purple-100 text-purple-800',
      gold: 'bg-yellow-100 text-yellow-800',
      red: 'bg-red-100 text-red-800'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users2 className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Configurações - Clientes</h1>
          </div>
          <p className="text-muted-foreground">
            Gerencie categorias, campos personalizados e configurações de privacidade dos clientes.
          </p>
        </div>
      </div>

      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Categorias
          </TabsTrigger>
          <TabsTrigger value="fields" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Campos
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Privacidade
          </TabsTrigger>
          <TabsTrigger value="communication" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Comunicação
          </TabsTrigger>
        </TabsList>

        {/* Categorias de Clientes */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Categorias de Clientes
              </CardTitle>
              <CardDescription>
                Crie e gerencie categorias para organizar seus clientes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Formulário para nova categoria */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                <div>
                  <Label htmlFor="categoryName">Nome da Categoria</Label>
                  <Input
                    id="categoryName"
                    placeholder="Ex: VIP, Premium..."
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
                <div>
                  <Label htmlFor="categoryColor">Cor</Label>
                  <Select value={newCategory.color} onValueChange={(value) => setNewCategory(prev => ({ ...prev, color: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Azul</SelectItem>
                      <SelectItem value="green">Verde</SelectItem>
                      <SelectItem value="purple">Roxo</SelectItem>
                      <SelectItem value="gold">Dourado</SelectItem>
                      <SelectItem value="red">Vermelho</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <TableHead>Cor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell>
                        <Badge className={getColorClass(category.color)}>
                          {category.color}
                        </Badge>
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

        {/* Campos Personalizados */}
        <TabsContent value="fields" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Campos Personalizados
              </CardTitle>
              <CardDescription>
                Configure campos personalizados para coletar informações específicas dos clientes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Formulário para novo campo */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                <div>
                  <Label htmlFor="fieldName">Nome do Campo</Label>
                  <Input
                    id="fieldName"
                    placeholder="Ex: CPF, Empresa..."
                    value={newField.name}
                    onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="fieldType">Tipo do Campo</Label>
                  <Select value={newField.type} onValueChange={(value) => setNewField(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texto</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Telefone</SelectItem>
                      <SelectItem value="date">Data</SelectItem>
                      <SelectItem value="number">Número</SelectItem>
                      <SelectItem value="select">Lista de Opções</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 mt-6">
                  <Switch
                    id="fieldRequired"
                    checked={newField.required}
                    onCheckedChange={(checked) => setNewField(prev => ({ ...prev, required: checked }))}
                  />
                  <Label htmlFor="fieldRequired">Obrigatório</Label>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSaveField} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </div>

              {/* Lista de campos */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Campo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Obrigatório</TableHead>
                    <TableHead>Visível</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customFields.map((field) => (
                    <TableRow key={field.id}>
                      <TableCell className="font-medium">{field.name}</TableCell>
                      <TableCell>{field.type}</TableCell>
                      <TableCell>
                        <Badge variant={field.required ? "default" : "secondary"}>
                          {field.required ? "Sim" : "Não"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          {field.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
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
                            onClick={() => handleDeleteField(field.id)}
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

        {/* Configurações de Privacidade */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Configurações de Privacidade
              </CardTitle>
              <CardDescription>
                Configure políticas de privacidade e proteção de dados dos clientes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="dataRetention">Retenção de Dados (dias)</Label>
                  <Input
                    id="dataRetention"
                    type="number"
                    value={privacySettings.dataRetention}
                    onChange={(e) => setPrivacySettings(prev => ({ ...prev, dataRetention: e.target.value }))}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Tempo para manter os dados ativos do cliente
                  </p>
                </div>
                <div>
                  <Label htmlFor="anonymizeAfter">Anonimizar Após (dias)</Label>
                  <Input
                    id="anonymizeAfter"
                    type="number"
                    value={privacySettings.anonymizeAfter}
                    onChange={(e) => setPrivacySettings(prev => ({ ...prev, anonymizeAfter: e.target.value }))}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Tempo para anonimizar dados inativos
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowDataExport">Permitir Exportação de Dados</Label>
                    <p className="text-sm text-muted-foreground">
                      Clientes podem solicitar exportação de seus dados
                    </p>
                  </div>
                  <Switch
                    id="allowDataExport"
                    checked={privacySettings.allowDataExport}
                    onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, allowDataExport: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireConsent">Exigir Consentimento</Label>
                    <p className="text-sm text-muted-foreground">
                      Solicitar consentimento para coleta de dados
                    </p>
                  </div>
                  <Switch
                    id="requireConsent"
                    checked={privacySettings.requireConsent}
                    onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, requireConsent: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="trackingEnabled">Rastreamento Habilitado</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir rastreamento de atividades do cliente
                    </p>
                  </div>
                  <Switch
                    id="trackingEnabled"
                    checked={privacySettings.trackingEnabled}
                    onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, trackingEnabled: checked }))}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSavePrivacySettings}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Comunicação */}
        <TabsContent value="communication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Configurações de Comunicação
              </CardTitle>
              <CardDescription>
                Configure como se comunicar com os clientes através de diferentes canais.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <div>
                      <Label htmlFor="emailNotifications">Notificações por Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Enviar notificações importantes por email
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={communicationSettings.emailNotifications}
                    onCheckedChange={(checked) => setCommunicationSettings(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <div>
                      <Label htmlFor="smsNotifications">Notificações por SMS</Label>
                      <p className="text-sm text-muted-foreground">
                        Enviar notificações via SMS
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={communicationSettings.smsNotifications}
                    onCheckedChange={(checked) => setCommunicationSettings(prev => ({ ...prev, smsNotifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <div>
                      <Label htmlFor="whatsappNotifications">Notificações por WhatsApp</Label>
                      <p className="text-sm text-muted-foreground">
                        Enviar notificações via WhatsApp Business
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="whatsappNotifications"
                    checked={communicationSettings.whatsappNotifications}
                    onCheckedChange={(checked) => setCommunicationSettings(prev => ({ ...prev, whatsappNotifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketingEmails">Emails de Marketing</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir envio de emails promocionais
                    </p>
                  </div>
                  <Switch
                    id="marketingEmails"
                    checked={communicationSettings.marketingEmails}
                    onCheckedChange={(checked) => setCommunicationSettings(prev => ({ ...prev, marketingEmails: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoResponse">Resposta Automática</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar mensagem automática quando cliente entrar em contato
                    </p>
                  </div>
                  <Switch
                    id="autoResponse"
                    checked={communicationSettings.autoResponse}
                    onCheckedChange={(checked) => setCommunicationSettings(prev => ({ ...prev, autoResponse: checked }))}
                  />
                </div>
              </div>

              {communicationSettings.autoResponse && (
                <div>
                  <Label htmlFor="responseTemplate">Template de Resposta Automática</Label>
                  <Textarea
                    id="responseTemplate"
                    placeholder="Digite a mensagem automática..."
                    value={communicationSettings.responseTemplate}
                    onChange={(e) => setCommunicationSettings(prev => ({ ...prev, responseTemplate: e.target.value }))}
                    className="mt-2"
                  />
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={handleSaveCommunicationSettings}>
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

export default SettingsClientsPage;
