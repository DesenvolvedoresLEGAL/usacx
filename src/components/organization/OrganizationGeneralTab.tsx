import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Building2, Upload, Save, Loader2 } from 'lucide-react';

const OrganizationGeneralTab = () => {
  const { organization, orgMembership, refreshProfile } = useAuth();
  const [name, setName] = useState(organization?.name || '');
  const [logoUrl, setLogoUrl] = useState(organization?.logo_url || '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const isOwnerOrAdmin = orgMembership?.is_owner || orgMembership?.org_role === 'admin';

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !organization) return;

    // Validate file
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo 2MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Apenas imagens são permitidas.');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${organization.id}/logo.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setLogoUrl(publicUrl);
      toast.success('Logo carregado. Clique em Salvar para confirmar.');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Erro ao carregar logo');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!organization || !isOwnerOrAdmin) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          name,
          logo_url: logoUrl || null,
        })
        .eq('id', organization.id);

      if (error) throw error;

      await refreshProfile();
      toast.success('Organização atualizada com sucesso');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Erro ao salvar alterações');
    } finally {
      setSaving(false);
    }
  };

  if (!organization) return null;

  const planColors: Record<string, string> = {
    free: 'bg-muted text-muted-foreground',
    starter: 'bg-blue-500/10 text-blue-500',
    pro: 'bg-primary/10 text-primary',
    enterprise: 'bg-amber-500/10 text-amber-500',
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações da Organização</CardTitle>
          <CardDescription>
            Dados básicos da sua organização
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border-2 border-border">
              <AvatarImage src={logoUrl} alt={organization.name} />
              <AvatarFallback className="text-2xl bg-primary/10">
                <Building2 className="h-10 w-10 text-primary" />
              </AvatarFallback>
            </Avatar>
            
            {isOwnerOrAdmin && (
              <div className="space-y-2">
                <Label htmlFor="logo-upload" className="cursor-pointer">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    disabled={uploading}
                    asChild
                  >
                    <span>
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      {uploading ? 'Carregando...' : 'Alterar Logo'}
                    </span>
                  </Button>
                </Label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                  disabled={uploading}
                />
                <p className="text-xs text-muted-foreground">
                  PNG, JPG ou GIF. Máximo 2MB.
                </p>
              </div>
            )}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="org-name">Nome da Organização</Label>
            <Input
              id="org-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isOwnerOrAdmin}
              placeholder="Nome da organização"
            />
          </div>

          {/* Plan Badge */}
          <div className="space-y-2">
            <Label>Plano Atual</Label>
            <div>
              <Badge className={planColors[organization.plan] || planColors.free}>
                {organization.plan.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Save Button */}
          {isOwnerOrAdmin && (
            <Button
              onClick={handleSave}
              disabled={saving || name === organization.name && logoUrl === organization.logo_url}
              className="gap-2"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationGeneralTab;