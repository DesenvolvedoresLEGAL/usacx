import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, User, Shield, Database, MessageSquare, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Settings } from "@/types/settings";
import { ProfileTab } from "@/components/settings/ProfileTab";
import { NotificationsTab } from "@/components/settings/NotificationsTab";
import { SecurityTab } from "@/components/settings/SecurityTab";
import { SystemTab } from "@/components/settings/SystemTab";
import { ChatTab } from "@/components/settings/ChatTab";
import { AppearanceTab } from "@/components/settings/AppearanceTab";

const SettingsPage = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>({
    notifications: {
      email: true,
      push: false,
      sound: true,
    },
    profile: {
      name: "Admin User",
      email: "admin@humanoid-os.ai",
      phone: "+55 11 99999-9999",
    },
    system: {
      language: "pt-BR",
      timezone: "America/Sao_Paulo",
      autoLogout: "30",
    },
  });

  const handleSave = (section: string) => {
    toast({
      title: "Configurações salvas",
      description: `As configurações de ${section} foram atualizadas com sucesso.`,
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as configurações da sua conta e do sistema.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Sistema
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Aparência
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileTab
            settings={settings.profile}
            onSettingsChange={(profileSettings) => setSettings((prev) => ({ ...prev, profile: profileSettings }))}
            onSave={() => handleSave("perfil")}
          />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationsTab
            settings={settings.notifications}
            onSettingsChange={(notificationSettings) =>
              setSettings((prev) => ({ ...prev, notifications: notificationSettings }))
            }
            onSave={() => handleSave("notificações")}
          />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecurityTab />
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <SystemTab
            settings={settings.system}
            onSettingsChange={(systemSettings) => setSettings((prev) => ({ ...prev, system: systemSettings }))}
            onSave={() => handleSave("sistema")}
          />
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <ChatTab onSave={() => handleSave("chat")} />
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <AppearanceTab onSave={() => handleSave("aparência")} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
