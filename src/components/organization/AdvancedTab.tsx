import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Key, Database, Globe, Shield, Settings, Eye, EyeOff, RefreshCw, Trash2, Plus, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  lastUsed: string;
  created: string;
  status: "active" | "inactive";
}

const AdvancedTab = () => {
  const { organization } = useAuth();

  // API Keys state
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
  const [webhookUrl, setWebhookUrl] = useState("https://api.humanoid-os.ai/webhooks/events");
  const [isWebhookEnabled, setIsWebhookEnabled] = useState(true);
  const [rateLimitEnabled, setRateLimitEnabled] = useState(true);
  const [rateLimitValue, setRateLimitValue] = useState("1000");
  const [newKeyName, setNewKeyName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [apiSubTab, setApiSubTab] = useState("keys");

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "Chave Principal",
      key: "pk_live_abc123...def456",
      permissions: ["read", "write", "admin"],
      lastUsed: "2024-01-15 14:30:00",
      created: "2024-01-01 10:00:00",
      status: "active",
    },
    {
      id: "2",
      name: "Integração Mobile",
      key: "pk_test_xyz789...uvw012",
      permissions: ["read"],
      lastUsed: "2024-01-14 09:15:00",
      created: "2024-01-10 16:30:00",
      status: "active",
    },
  ]);

  const permissions = [
    { value: "read", label: "Leitura", description: "Visualizar dados" },
    { value: "write", label: "Escrita", description: "Criar e editar dados" },
    { value: "delete", label: "Exclusão", description: "Deletar dados" },
    { value: "admin", label: "Administrador", description: "Acesso total" },
  ];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`);
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys((prev) => ({
      ...prev,
      [keyId]: !prev[keyId],
    }));
  };

  const generateNewKey = () => {
    if (!newKeyName.trim()) {
      toast.error("Por favor, insira um nome para a chave API.");
      return;
    }

    if (selectedPermissions.length === 0) {
      toast.error("Selecione pelo menos uma permissão.");
      return;
    }

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `pk_live_${Math.random().toString(36).substr(2, 24)}...${Math.random().toString(36).substr(2, 6)}`,
      permissions: selectedPermissions,
      lastUsed: "Nunca usado",
      created: new Date().toLocaleString("pt-BR"),
      status: "active",
    };

    setApiKeys((prev) => [...prev, newKey]);
    setNewKeyName("");
    setSelectedPermissions([]);

    toast.success("Nova chave API foi gerada com sucesso.");
  };

  const revokeKey = (keyId: string) => {
    setApiKeys((prev) => prev.filter((key) => key.id !== keyId));
    toast.success("A chave API foi revogada com sucesso.");
  };

  const regenerateKey = (keyId: string) => {
    setApiKeys((prev) =>
      prev.map((key) =>
        key.id === keyId
          ? {
              ...key,
              key: `pk_live_${Math.random().toString(36).substr(2, 24)}...${Math.random().toString(36).substr(2, 6)}`,
            }
          : key,
      ),
    );
    toast.success("A chave API foi regenerada com sucesso.");
  };

  const testWebhook = async () => {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: "test",
          timestamp: new Date().toISOString(),
          data: { message: "Teste de webhook do USAC" },
        }),
      });

      if (response.ok) {
        toast.success("Webhook testado com sucesso!");
      } else {
        toast.error("Não foi possível conectar ao endpoint.");
      }
    } catch (error) {
      toast.error("Falha na conexão com o endpoint.");
    }
  };

  if (!organization) return null;

  return (
    <div className="space-y-6">
      {/* Organization Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Identificadores
          </CardTitle>
          <CardDescription>
            Informações técnicas da organização para integrações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>ID da Organização</Label>
            <div className="flex gap-2">
              <Input 
                value={organization.id} 
                readOnly 
                className="font-mono text-sm"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => copyToClipboard(organization.id, 'ID')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <div className="flex gap-2">
              <Input 
                value={organization.slug} 
                readOnly 
                className="font-mono text-sm"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => copyToClipboard(organization.slug, 'Slug')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              O slug é usado para URLs amigáveis e identificação única
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Plan Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Plano e Limites
          </CardTitle>
          <CardDescription>
            Detalhes do plano atual e recursos disponíveis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium">Plano Atual</p>
              <p className="text-sm text-muted-foreground">
                Funcionalidades e limites do seu plano
              </p>
            </div>
            <Badge className="text-lg px-4 py-1">
              {organization.plan.toUpperCase()}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Usuários</p>
              <p className="text-2xl font-bold">Ilimitado</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Conversas/mês</p>
              <p className="text-2xl font-bold">Ilimitado</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Canais</p>
              <p className="text-2xl font-bold">Ilimitado</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API & Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API e Integrações
            <Badge className="bg-blue-600 text-white ml-2">BETA</Badge>
          </CardTitle>
          <CardDescription>
            Gerencie chaves API, webhooks e configurações de integração
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={apiSubTab} onValueChange={setApiSubTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="keys" className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                Chaves API
              </TabsTrigger>
              <TabsTrigger value="webhooks" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Webhooks
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Segurança
              </TabsTrigger>
              <TabsTrigger value="docs" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Documentação
              </TabsTrigger>
            </TabsList>

            {/* API Keys Tab */}
            <TabsContent value="keys" className="space-y-6">
              {/* Create New Key */}
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold">Criar Nova Chave API</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome da Chave</Label>
                    <Input
                      placeholder="Ex: Integração CRM"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Permissões</Label>
                    <Select
                      onValueChange={(value) => {
                        if (!selectedPermissions.includes(value)) {
                          setSelectedPermissions([...selectedPermissions, value]);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar permissão" />
                      </SelectTrigger>
                      <SelectContent>
                        {permissions.map((perm) => (
                          <SelectItem key={perm.value} value={perm.value}>
                            {perm.label} - {perm.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {selectedPermissions.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {selectedPermissions.map((perm) => (
                      <Badge
                        key={perm}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => setSelectedPermissions((prev) => prev.filter((p) => p !== perm))}
                      >
                        {permissions.find((p) => p.value === perm)?.label} ×
                      </Badge>
                    ))}
                  </div>
                )}
                <Button onClick={generateNewKey} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Gerar Nova Chave
                </Button>
              </div>

              <Separator />

              {/* Existing Keys */}
              <div className="space-y-4">
                <h3 className="font-semibold">Chaves API Existentes</h3>
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{apiKey.name}</h4>
                        <Badge variant={apiKey.status === "active" ? "default" : "secondary"}>
                          {apiKey.status === "active" ? "Ativa" : "Inativa"}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => regenerateKey(apiKey.id)}>
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => revokeKey(apiKey.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        value={showKeys[apiKey.id] ? apiKey.key : apiKey.key.replace(/./g, "•")}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button variant="outline" size="sm" onClick={() => toggleKeyVisibility(apiKey.id)}>
                        {showKeys[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(apiKey.key, 'Chave API')}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>
                        Permissões:{" "}
                        {apiKey.permissions.map((p) => permissions.find((perm) => perm.value === p)?.label).join(", ")}
                      </div>
                      <div>Último uso: {apiKey.lastUsed}</div>
                      <div>Criada em: {apiKey.created}</div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Webhooks Tab */}
            <TabsContent value="webhooks" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Webhook Habilitado</Label>
                  <p className="text-sm text-muted-foreground">Receber notificações de eventos via webhook</p>
                </div>
                <Switch checked={isWebhookEnabled} onCheckedChange={setIsWebhookEnabled} />
              </div>

              {isWebhookEnabled && (
                <>
                  <div className="space-y-2">
                    <Label>URL do Endpoint</Label>
                    <div className="flex gap-2">
                      <Input
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        placeholder="https://api.seusite.com/webhook"
                      />
                      <Button onClick={testWebhook} variant="outline">
                        Testar
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Eventos Monitorados</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        "Novo atendimento",
                        "Atendimento finalizado",
                        "Mensagem recebida",
                        "Agent status change",
                        "Queue status change",
                        "System alerts",
                      ].map((event) => (
                        <div key={event} className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <label className="text-sm">{event}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rate Limiting</Label>
                  <p className="text-sm text-muted-foreground">Limitar número de requisições por minuto</p>
                </div>
                <Switch checked={rateLimitEnabled} onCheckedChange={setRateLimitEnabled} />
              </div>

              {rateLimitEnabled && (
                <div className="space-y-2">
                  <Label>Limite por Minuto</Label>
                  <Select value={rateLimitValue} onValueChange={setRateLimitValue}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100 requisições</SelectItem>
                      <SelectItem value="500">500 requisições</SelectItem>
                      <SelectItem value="1000">1.000 requisições</SelectItem>
                      <SelectItem value="5000">5.000 requisições</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <Label>IPs Permitidos</Label>
                <Textarea
                  placeholder="192.168.1.1&#10;10.0.0.0/8&#10;172.16.0.0/12"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Digite um IP ou CIDR por linha. Deixe vazio para permitir todos os IPs.
                </p>
              </div>
            </TabsContent>

            {/* Documentation Tab */}
            <TabsContent value="docs" className="space-y-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Autenticação</h3>
                  <p className="text-sm text-muted-foreground mb-3">Use sua chave API no header Authorization:</p>
                  <div className="bg-muted p-3 rounded font-mono text-sm">Authorization: Bearer sua_chave_api_aqui</div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Base URL</h3>
                  <div className="bg-muted p-3 rounded font-mono text-sm">https://api.humanoid-os.ai/v1/</div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Exemplo de Requisição</h3>
                  <div className="bg-muted p-3 rounded font-mono text-sm whitespace-pre">
                    {`curl -X GET "https://api.humanoid-os.ai/v1/attendances" \\
  -H "Authorization: Bearer sua_chave_api" \\
  -H "Content-Type: application/json"`}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Endpoints Principais</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <code className="bg-muted px-2 py-1 rounded">GET /attendances</code> - Listar atendimentos
                    </div>
                    <div>
                      <code className="bg-muted px-2 py-1 rounded">POST /attendances</code> - Criar atendimento
                    </div>
                    <div>
                      <code className="bg-muted px-2 py-1 rounded">GET /agents</code> - Listar agentes
                    </div>
                    <div>
                      <code className="bg-muted px-2 py-1 rounded">GET /reports</code> - Gerar relatórios
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full">Ver Documentação Completa</Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedTab;
