
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SystemSettings } from "@/types/settings";

interface SystemTabProps {
  settings: SystemSettings;
  onSettingsChange: (settings: SystemSettings) => void;
  onSave: () => void;
}

export const SystemTab: React.FC<SystemTabProps> = ({ settings, onSettingsChange, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Sistema</CardTitle>
        <CardDescription>
          Configure preferências globais do sistema.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Idioma</Label>
            <Select value={settings.language} onValueChange={(value) => onSettingsChange({ ...settings, language: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="es-ES">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Fuso Horário</Label>
            <Select value={settings.timezone} onValueChange={(value) => onSettingsChange({ ...settings, timezone: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/Sao_Paulo">São Paulo (UTC-3)</SelectItem>
                <SelectItem value="America/New_York">New York (UTC-5)</SelectItem>
                <SelectItem value="Europe/London">London (UTC+0)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Logout Automático (minutos)</Label>
          <Select value={settings.autoLogout} onValueChange={(value) => onSettingsChange({ ...settings, autoLogout: value })}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutos</SelectItem>
              <SelectItem value="30">30 minutos</SelectItem>
              <SelectItem value="60">1 hora</SelectItem>
              <SelectItem value="120">2 horas</SelectItem>
              <SelectItem value="0">Nunca</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={onSave}>
          Salvar Configurações
        </Button>
      </CardContent>
    </Card>
  );
};
