
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface ChatTabProps {
  onSave: () => void;
}

export const ChatTab: React.FC<ChatTabProps> = ({ onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Chat</CardTitle>
        <CardDescription>
          Configure as preferências para atendimento via chat.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Mensagem de Boas-vindas</Label>
          <Textarea 
            placeholder="Digite a mensagem de boas-vindas padrão..."
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label>Tempo limite para resposta (minutos)</Label>
          <Select defaultValue="5">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 minuto</SelectItem>
              <SelectItem value="5">5 minutos</SelectItem>
              <SelectItem value="10">10 minutos</SelectItem>
              <SelectItem value="15">15 minutos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Auto-atribuição de tickets</Label>
            <p className="text-sm text-muted-foreground">
              Distribuir automaticamente novos atendimentos
            </p>
          </div>
          <Switch defaultChecked />
        </div>
        <Button onClick={onSave}>
          Salvar Configurações
        </Button>
      </CardContent>
    </Card>
  );
};
