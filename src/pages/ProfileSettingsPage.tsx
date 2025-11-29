import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCurrentAgent } from "@/hooks/useCurrentAgent";
import { supabase } from "@/integrations/supabase/client";
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Camera, 
  Key,
  Bell,
  Globe,
  Clock,
  Check,
  Loader2
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const ProfileSettingsPage = () => {
  const { toast } = useToast();
  const currentAgent = useCurrentAgent();
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  
  // Profile state
  const [displayName, setDisplayName] = useState(currentAgent?.displayName || "");
  const [email, setEmail] = useState(currentAgent?.email || "");
  const [phone, setPhone] = useState("");
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Preferences state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundNotifications, setSoundNotifications] = useState(false);
  const [language, setLanguage] = useState("pt-BR");
  const [timezone, setTimezone] = useState("America/Sao_Paulo");

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentAgent) return;

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O avatar deve ter no máximo 2MB.",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Formato inválido",
        description: "Por favor, envie apenas imagens.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${currentAgent.id}/avatar.${fileExt}`;

      // Remove old avatar if exists
      const { data: oldFiles } = await supabase.storage
        .from('avatars')
        .list(currentAgent.id);

      if (oldFiles && oldFiles.length > 0) {
        const oldFilePaths = oldFiles.map(f => `${currentAgent.id}/${f.name}`);
        await supabase.storage.from('avatars').remove(oldFilePaths);
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile
      const { error: updateError } = await supabase
        .from('agent_profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', currentAgent.id);

      if (updateError) throw updateError;

      toast({
        title: "Avatar atualizado",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });

      // Reload page to show new avatar
      window.location.reload();
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Erro ao atualizar avatar",
        description: error instanceof Error ? error.message : "Não foi possível atualizar sua foto de perfil.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!currentAgent) return;
    
    setIsSavingProfile(true);
    try {
      const { error } = await supabase
        .from('agent_profiles')
        .update({ 
          display_name: displayName,
        })
        .eq('user_id', currentAgent.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Não foi possível salvar suas informações.",
        variant: "destructive",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Senhas não conferem",
        description: "A nova senha e a confirmação devem ser iguais.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 8 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Senha alterada",
        description: "Sua senha foi atualizada com sucesso.",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: "Erro ao alterar senha",
        description: "Não foi possível alterar sua senha.",
        variant: "destructive",
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsSavingPreferences(true);
    
    // Simulate saving preferences (you can extend this to save to database)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Preferências salvas",
      description: "Suas preferências foram atualizadas com sucesso.",
    });
    
    setIsSavingPreferences(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Configurações de Perfil</h1>
          <p className="text-muted-foreground text-lg">
            Gerencie suas informações pessoais, segurança e preferências.
          </p>
        </div>

        {/* Profile Overview Card */}
        <Card className="border-2 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl">Informações do Perfil</CardTitle>
                <CardDescription>
                  Atualize sua foto e informações pessoais visíveis para outros usuários.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-medium">
                {currentAgent?.role?.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6 p-6 bg-muted/30 rounded-lg border">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                  <AvatarImage src={currentAgent?.avatarUrl || undefined} />
                  <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
                    {currentAgent?.displayName ? getInitials(currentAgent.displayName) : "U"}
                  </AvatarFallback>
                </Avatar>
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  ) : (
                    <Camera className="h-6 w-6 text-white" />
                  )}
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={isLoading}
                />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-semibold">{currentAgent?.displayName || "Usuário"}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {currentAgent?.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  Clique na foto para fazer upload de uma nova imagem (máx. 2MB)
                </p>
              </div>
            </div>

            <Separator />

            {/* Profile Form */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nome de Exibição
                </Label>
                <Input
                  id="displayName"
                  placeholder="Seu nome completo"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  disabled
                  className="h-11 bg-muted/50"
                />
                <p className="text-xs text-muted-foreground">
                  O e-mail não pode ser alterado nesta versão
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Telefone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+55 (11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Status da Conta
                </Label>
                <div className="flex items-center gap-2 h-11 px-3 border rounded-md bg-muted/50">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm">Ativa</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleSaveProfile}
                disabled={isSavingProfile}
                size="lg"
                className="min-w-32"
              >
                {isSavingProfile ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Key className="h-5 w-5" />
              Segurança e Senha
            </CardTitle>
            <CardDescription>
              Altere sua senha e gerencie as configurações de segurança da sua conta.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-1">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Digite sua senha atual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirme a nova senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleChangePassword}
                disabled={isSavingPassword || !currentPassword || !newPassword || !confirmPassword}
                size="lg"
                variant="secondary"
                className="min-w-32"
              >
                {isSavingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Alterando...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Alterar Senha
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preferences Card */}
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Preferências e Notificações
            </CardTitle>
            <CardDescription>
              Configure como você deseja receber notificações e suas preferências regionais.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Notifications Section */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notificações
              </h3>
              
              <div className="space-y-4 pl-6">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications" className="text-sm font-medium">
                      Notificações por E-mail
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Receba atualizações importantes por e-mail
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications" className="text-sm font-medium">
                      Notificações Push
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Receba notificações em tempo real no navegador
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="sound-notifications" className="text-sm font-medium">
                      Sons de Notificação
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Reproduzir som quando receber notificações
                    </p>
                  </div>
                  <Switch
                    id="sound-notifications"
                    checked={soundNotifications}
                    onCheckedChange={setSoundNotifications}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Regional Preferences */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Configurações Regionais
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2 pl-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language" className="h-11">
                      <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger id="timezone" className="h-11">
                      <SelectValue placeholder="Selecione o fuso horário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                      <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleSavePreferences}
                disabled={isSavingPreferences}
                size="lg"
                className="min-w-32"
              >
                {isSavingPreferences ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Salvar Preferências
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Info Card */}
        <Card className="border-2 shadow-lg border-muted/50">
          <CardHeader>
            <CardTitle className="text-xl">Informações da Conta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">ID do Usuário</p>
                <p className="font-mono text-xs bg-muted p-2 rounded">
                  {currentAgent?.id || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Função</p>
                <Badge variant="secondary" className="font-medium">
                  {currentAgent?.role || "N/A"}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Status</p>
                <Badge 
                  variant="outline" 
                  className={
                    currentAgent?.status === 'online' ? 'border-green-500 text-green-500' : 
                    currentAgent?.status === 'busy' ? 'border-yellow-500 text-yellow-500' :
                    currentAgent?.status === 'away' ? 'border-orange-500 text-orange-500' :
                    'border-gray-500 text-gray-500'
                  }
                >
                  {currentAgent?.status?.toUpperCase() || "OFFLINE"}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Equipe</p>
                <p className="font-medium">
                  {currentAgent?.teamId ? `Team ${currentAgent.teamId.slice(0, 8)}` : "Sem equipe"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
