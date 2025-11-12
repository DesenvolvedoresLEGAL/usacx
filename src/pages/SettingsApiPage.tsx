import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy, Eye, EyeOff, Key, RefreshCw, Trash2, Plus, Settings, Shield, Globe } from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  lastUsed: string;
  created: string;
  status: "active" | "inactive";
}

const SettingsApiPage = () => {
  const { toast } = useToast();
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
  const [webhookUrl, setWebhookUrl] = useState("https://api.humanoid-os.ai/webhooks/events");
  const [isWebhookEnabled, setIsWebhookEnabled] = useState(true);
  const [rateLimitEnabled, setRateLimitEnabled] = useState(true);
  const [rateLimitValue, setRateLimitValue] = useState("1000");
  const [newKeyName, setNewKeyName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

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

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys((prev) => ({
      ...prev,
      [keyId]: !prev[keyId],
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Chave API copiada para a área de transferência.",
    });
  };

  const generateNewKey = () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um nome para a chave API.",
        variant: "destructive",
      });
      return;
    }

    if (selectedPermissions.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos uma permissão.",
        variant: "destructive",
      });
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

    toast({
      title: "Chave API criada!",
      description: "Nova chave API foi gerada com sucesso.",
    });
  };

  const revokeKey = (keyId: string) => {
    setApiKeys((prev) => prev.filter((key) => key.id !== keyId));
    toast({
      title: "Chave revogada",
      description: "A chave API foi revogada com sucesso.",
    });
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
    toast({
      title: "Chave regenerada",
      description: "A chave API foi regenerada com sucesso.",
    });
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
        toast({
          title: "Webhook testado com sucesso",
          description: "O webhook está funcionando corretamente.",
        });
      } else {
        toast({
          title: "Erro no teste do webhook",
          description: "Não foi possível conectar ao endpoint.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no teste do webhook",
        description: "Falha na conexão com o endpoint.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Configurações - API</h1>
          <Badge className="bg-blue-600 text-white animate-pulse">BLUE</Badge>
        </div>
        <p className="text-muted-foreground">Gerencie chaves API, webhooks e configurações de integração.</p>
      </div>

      <Tabs defaultValue="keys" className="space-y-6">
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
            <Settings className="w-4 h-4" />
            Documentação
          </TabsTrigger>
        </TabsList>

        {/* Chaves API */}
        <TabsContent value="keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Chaves API</CardTitle>
              <CardDescription>Crie e gerencie chaves API para integrar com sistemas externos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Criar Nova Chave */}
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

              {/* Lista de Chaves Existentes */}
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
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(apiKey.key)}>
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhooks */}
        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Webhook</CardTitle>
              <CardDescription>Configure endpoints para receber notificações de eventos em tempo real.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Segurança */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>Configure limites de rate e outras opções de segurança.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documentação */}
        <TabsContent value="docs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentação da API</CardTitle>
              <CardDescription>Guias e exemplos para integrar com a API do USAC.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsApiPage;
