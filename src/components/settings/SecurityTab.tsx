
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const SecurityTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Segurança da Conta</CardTitle>
        <CardDescription>
          Configure as opções de segurança da sua conta.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Alterar Senha</Label>
          <div className="space-y-2">
            <Input type="password" placeholder="Senha atual" />
            <Input type="password" placeholder="Nova senha" />
            <Input type="password" placeholder="Confirmar nova senha" />
          </div>
          <Button variant="outline">Alterar Senha</Button>
        </div>
        <Separator />
        <div className="space-y-2">
          <Label>Autenticação de Dois Fatores</Label>
          <p className="text-sm text-muted-foreground">
            Adicione uma camada extra de segurança à sua conta.
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Desabilitado</Badge>
            <Button variant="outline" size="sm">Configurar 2FA</Button>
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <Label>Sessões Ativas</Label>
          <p className="text-sm text-muted-foreground">
            Gerencie dispositivos e sessões conectadas à sua conta.
          </p>
          <Button variant="outline">Ver Sessões Ativas</Button>
        </div>
      </CardContent>
    </Card>
  );
};
