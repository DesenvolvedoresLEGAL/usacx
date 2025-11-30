import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Timer, Plus, Trash2, Eye, EyeOff, Clock, Coffee, Utensils, Heart, GraduationCap, Phone, Loader2 } from 'lucide-react';
import { usePauseSettings } from '@/hooks/usePauseSettings';

const SettingsPausesPage = () => {
  const { pauseReasons, isLoading, createPauseReason, deletePauseReason, togglePauseStatus } = usePauseSettings();
  
  const [newPause, setNewPause] = useState({ 
    label: '', 
    description: '', 
    icon: 'clock' 
  });

  const iconOptions = [
    { value: 'clock', label: 'Relógio', icon: Clock },
    { value: 'coffee', label: 'Café', icon: Coffee },
    { value: 'utensils', label: 'Alimentação', icon: Utensils },
    { value: 'heart', label: 'Saúde', icon: Heart },
    { value: 'graduation-cap', label: 'Treinamento', icon: GraduationCap },
    { value: 'phone', label: 'Telefone', icon: Phone }
  ];

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption ? iconOption.icon : Clock;
  };

  const handleCreatePause = async () => {
    if (!newPause.label.trim()) return;

    try {
      await createPauseReason({
        label: newPause.label,
        description: newPause.description,
        icon: newPause.icon,
      });
      setNewPause({ label: '', description: '', icon: 'clock' });
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDeletePause = async (id: string) => {
    try {
      await deletePauseReason(id);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await togglePauseStatus(id);
    } catch (error) {
      // Error handled in hook
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Timer className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Configurações - Motivos de Pausa</h1>
          </div>
          <p className="text-muted-foreground">
            Gerencie os motivos de pausa disponíveis para os agentes.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="w-5 h-5" />
            Motivos de Pausa
          </CardTitle>
          <CardDescription>
            Configure os diferentes motivos de pausa disponíveis para os agentes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Formulário para novo motivo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
            <div>
              <Label htmlFor="label">Nome do Motivo</Label>
              <Input
                id="label"
                placeholder="Ex: Almoço, Intervalo..."
                value={newPause.label}
                onChange={(e) => setNewPause(prev => ({ ...prev, label: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                placeholder="Descrição do motivo"
                value={newPause.description}
                onChange={(e) => setNewPause(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="icon">Ícone</Label>
              <Select value={newPause.icon} onValueChange={(value) => setNewPause(prev => ({ ...prev, icon: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className="w-4 h-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleCreatePause} className="w-full" disabled={!newPause.label.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>

          {/* Lista de motivos */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Ícone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pauseReasons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Nenhum motivo de pausa encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  pauseReasons.map((pause) => {
                    const IconComponent = getIconComponent(pause.icon);
                    return (
                      <TableRow key={pause.id}>
                        <TableCell className="font-medium">{pause.label}</TableCell>
                        <TableCell>{pause.description || '-'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4" />
                            <span className="text-sm text-muted-foreground capitalize">
                              {pause.icon.replace('-', ' ')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(pause.id)}
                          >
                            {pause.is_active ? (
                              <Eye className="w-4 h-4 text-green-600" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-muted-foreground" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeletePause(pause.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPausesPage;
