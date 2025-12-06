import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Key, Database, Globe } from 'lucide-react';
import { toast } from 'sonner';

const AdvancedTab = () => {
  const { organization } = useAuth();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`);
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

      {/* API Keys (placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Chaves de API
          </CardTitle>
          <CardDescription>
            Gerencie chaves de API para integrações externas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Key className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">
              A gestão de chaves de API estará disponível em breve
            </p>
            <Button variant="outline" disabled>
              Gerar Nova Chave
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedTab;
