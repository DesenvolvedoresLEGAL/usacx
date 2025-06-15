
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { NotificationSettings } from "@/types/settings";

interface NotificationsTabProps {
  settings: NotificationSettings;
  onSettingsChange: (settings: NotificationSettings) => void;
  onSave: () => void;
}

export const NotificationsTab: React.FC<NotificationsTabProps> = ({ settings, onSettingsChange, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências de Notificação</CardTitle>
        <CardDescription>
          Configure como você deseja receber notificações.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Notificações por E-mail</Label>
            <p className="text-sm text-muted-foreground">
              Receber notificações importantes por e-mail
            </p>
          </div>
          <Switch
            checked={settings.email}
            onCheckedChange={(checked) => onSettingsChange({ ...settings, email: checked })}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Notificações Push</Label>
            <p className="text-sm text-muted-foreground">
              Receber notificações push no navegador
            </p>
          </div>
          <Switch
            checked={settings.push}
            onCheckedChange={(checked) => onSettingsChange({ ...settings, push: checked })}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Som de Notificação</Label>
            <p className="text-sm text-muted-foreground">
              Reproduzir som ao receber notificações
            </p>
          </div>
          <Switch
            checked={settings.sound}
            onCheckedChange={(checked) => onSettingsChange({ ...settings, sound: checked })}
          />
        </div>
        <Button onClick={onSave}>
          Salvar Preferências
        </Button>
      </CardContent>
    </Card>
  );
};
