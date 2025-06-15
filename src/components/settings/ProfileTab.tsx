
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileSettings } from "@/types/settings";

interface ProfileTabProps {
  settings: ProfileSettings;
  onSettingsChange: (settings: ProfileSettings) => void;
  onSave: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ settings, onSettingsChange, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Perfil</CardTitle>
        <CardDescription>
          Atualize suas informações pessoais e de contato.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={settings.name}
              onChange={(e) => onSettingsChange({ ...settings, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) => onSettingsChange({ ...settings, email: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={settings.phone}
            onChange={(e) => onSettingsChange({ ...settings, phone: e.target.value })}
          />
        </div>
        <Button onClick={onSave}>
          Salvar Alterações
        </Button>
      </CardContent>
    </Card>
  );
};
