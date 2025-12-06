import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Clock, 
  Users, 
  Target, 
  Save, 
  Loader2,
  Calendar,
  MessageSquare,
  Timer,
  Star,
  TrendingUp
} from "lucide-react";

interface WorkSchedule {
  enabled: boolean;
  start: string;
  end: string;
}

interface OperationalSettings {
  workSchedule: {
    monday: WorkSchedule;
    tuesday: WorkSchedule;
    wednesday: WorkSchedule;
    thursday: WorkSchedule;
    friday: WorkSchedule;
    saturday: WorkSchedule;
    sunday: WorkSchedule;
  };
  limits: {
    maxSimultaneousConversations: number;
    maxDailyConversations: number;
    autoAssignEnabled: boolean;
  };
  goals: {
    dailyConversations: number;
    avgResponseTimeSeconds: number;
    minSatisfactionRating: number;
    resolutionRate: number;
  };
}

const defaultSettings: OperationalSettings = {
  workSchedule: {
    monday: { enabled: true, start: "09:00", end: "18:00" },
    tuesday: { enabled: true, start: "09:00", end: "18:00" },
    wednesday: { enabled: true, start: "09:00", end: "18:00" },
    thursday: { enabled: true, start: "09:00", end: "18:00" },
    friday: { enabled: true, start: "09:00", end: "18:00" },
    saturday: { enabled: false, start: "09:00", end: "13:00" },
    sunday: { enabled: false, start: "09:00", end: "13:00" },
  },
  limits: {
    maxSimultaneousConversations: 5,
    maxDailyConversations: 50,
    autoAssignEnabled: true,
  },
  goals: {
    dailyConversations: 30,
    avgResponseTimeSeconds: 120,
    minSatisfactionRating: 4,
    resolutionRate: 85,
  },
};

const dayLabels: Record<string, string> = {
  monday: "Segunda-feira",
  tuesday: "Terça-feira",
  wednesday: "Quarta-feira",
  thursday: "Quinta-feira",
  friday: "Sexta-feira",
  saturday: "Sábado",
  sunday: "Domingo",
};

export const OperationalConfigTab = () => {
  const { organization, orgMembership, refreshProfile } = useAuth();
  const [settings, setSettings] = useState<OperationalSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const isOwnerOrAdmin = orgMembership?.is_owner || orgMembership?.org_role === "admin";

  useEffect(() => {
    if (organization?.settings) {
      const orgSettings = organization.settings as any;
      if (orgSettings.operational) {
        setSettings({ ...defaultSettings, ...orgSettings.operational });
      }
    }
    setLoading(false);
  }, [organization]);

  const updateSettings = (updates: Partial<OperationalSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const updateWorkSchedule = (day: keyof OperationalSettings["workSchedule"], updates: Partial<WorkSchedule>) => {
    setSettings(prev => ({
      ...prev,
      workSchedule: {
        ...prev.workSchedule,
        [day]: { ...prev.workSchedule[day], ...updates },
      },
    }));
    setHasChanges(true);
  };

  const updateLimits = (updates: Partial<OperationalSettings["limits"]>) => {
    setSettings(prev => ({
      ...prev,
      limits: { ...prev.limits, ...updates },
    }));
    setHasChanges(true);
  };

  const updateGoals = (updates: Partial<OperationalSettings["goals"]>) => {
    setSettings(prev => ({
      ...prev,
      goals: { ...prev.goals, ...updates },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!organization || !isOwnerOrAdmin) return;

    setSaving(true);
    try {
      const currentSettings = (organization.settings || {}) as Record<string, any>;
      const newSettings = {
        ...currentSettings,
        operational: settings,
      };

      const { error } = await supabase
        .from("organizations")
        .update({ settings: newSettings as any })
        .eq("id", organization.id);

      if (error) throw error;

      await refreshProfile();
      setHasChanges(false);
      toast.success("Configurações operacionais salvas");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Save Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Configurações Operacionais</h3>
          <p className="text-sm text-muted-foreground">
            Defina horários, limites e metas para a organização
          </p>
        </div>
        {isOwnerOrAdmin && (
          <Button onClick={handleSave} disabled={saving || !hasChanges} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Salvar Alterações
          </Button>
        )}
      </div>

      {/* Work Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Horários de Trabalho
          </CardTitle>
          <CardDescription>
            Defina os horários de funcionamento da operação para cada dia da semana
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(Object.keys(settings.workSchedule) as Array<keyof typeof settings.workSchedule>).map((day) => (
            <div key={day} className="flex items-center gap-4 py-2">
              <div className="w-32">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings.workSchedule[day].enabled}
                    onCheckedChange={(enabled) => updateWorkSchedule(day, { enabled })}
                    disabled={!isOwnerOrAdmin}
                  />
                  <span className={`text-sm font-medium ${!settings.workSchedule[day].enabled ? "text-muted-foreground" : ""}`}>
                    {dayLabels[day]}
                  </span>
                </div>
              </div>
              {settings.workSchedule[day].enabled && (
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={settings.workSchedule[day].start}
                    onChange={(e) => updateWorkSchedule(day, { start: e.target.value })}
                    className="w-28"
                    disabled={!isOwnerOrAdmin}
                  />
                  <span className="text-muted-foreground">às</span>
                  <Input
                    type="time"
                    value={settings.workSchedule[day].end}
                    onChange={(e) => updateWorkSchedule(day, { end: e.target.value })}
                    className="w-28"
                    disabled={!isOwnerOrAdmin}
                  />
                </div>
              )}
              {!settings.workSchedule[day].enabled && (
                <Badge variant="secondary">Fechado</Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Limits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Limites de Atendimento
          </CardTitle>
          <CardDescription>
            Configure limites de capacidade para a operação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Max Simultaneous */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  Atendimentos Simultâneos por Agente
                </Label>
                <p className="text-sm text-muted-foreground">
                  Máximo de conversas ativas que um agente pode ter ao mesmo tempo
                </p>
              </div>
              <Badge variant="outline" className="text-lg px-3">
                {settings.limits.maxSimultaneousConversations}
              </Badge>
            </div>
            <Slider
              value={[settings.limits.maxSimultaneousConversations]}
              onValueChange={([value]) => updateLimits({ maxSimultaneousConversations: value })}
              min={1}
              max={15}
              step={1}
              disabled={!isOwnerOrAdmin}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>15</span>
            </div>
          </div>

          <Separator />

          {/* Max Daily */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Atendimentos Diários por Agente
                </Label>
                <p className="text-sm text-muted-foreground">
                  Limite máximo de conversas que um agente pode atender por dia
                </p>
              </div>
              <Badge variant="outline" className="text-lg px-3">
                {settings.limits.maxDailyConversations}
              </Badge>
            </div>
            <Slider
              value={[settings.limits.maxDailyConversations]}
              onValueChange={([value]) => updateLimits({ maxDailyConversations: value })}
              min={10}
              max={200}
              step={5}
              disabled={!isOwnerOrAdmin}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>10</span>
              <span>200</span>
            </div>
          </div>

          <Separator />

          {/* Auto Assign */}
          <div className="flex items-center justify-between py-2">
            <div>
              <Label className="flex items-center gap-2">
                Distribuição Automática
              </Label>
              <p className="text-sm text-muted-foreground">
                Atribuir conversas automaticamente aos agentes disponíveis
              </p>
            </div>
            <Switch
              checked={settings.limits.autoAssignEnabled}
              onCheckedChange={(autoAssignEnabled) => updateLimits({ autoAssignEnabled })}
              disabled={!isOwnerOrAdmin}
            />
          </div>
        </CardContent>
      </Card>

      {/* Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Metas de Performance
          </CardTitle>
          <CardDescription>
            Defina metas para acompanhar a performance da equipe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Daily Conversations Goal */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  Meta de Atendimentos Diários
                </Label>
                <p className="text-sm text-muted-foreground">
                  Quantidade ideal de conversas finalizadas por agente/dia
                </p>
              </div>
              <Badge variant="outline" className="text-lg px-3">
                {settings.goals.dailyConversations}
              </Badge>
            </div>
            <Slider
              value={[settings.goals.dailyConversations]}
              onValueChange={([value]) => updateGoals({ dailyConversations: value })}
              min={5}
              max={100}
              step={5}
              disabled={!isOwnerOrAdmin}
            />
          </div>

          <Separator />

          {/* Response Time Goal */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-muted-foreground" />
                  Tempo Médio de Resposta
                </Label>
                <p className="text-sm text-muted-foreground">
                  Meta de tempo para primeira resposta (em segundos)
                </p>
              </div>
              <Badge variant="outline" className="text-lg px-3">
                {Math.floor(settings.goals.avgResponseTimeSeconds / 60)}m {settings.goals.avgResponseTimeSeconds % 60}s
              </Badge>
            </div>
            <Slider
              value={[settings.goals.avgResponseTimeSeconds]}
              onValueChange={([value]) => updateGoals({ avgResponseTimeSeconds: value })}
              min={30}
              max={600}
              step={30}
              disabled={!isOwnerOrAdmin}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>30s</span>
              <span>10min</span>
            </div>
          </div>

          <Separator />

          {/* Satisfaction Goal */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  Satisfação Mínima
                </Label>
                <p className="text-sm text-muted-foreground">
                  Nota mínima de satisfação do cliente (1-5)
                </p>
              </div>
              <Badge variant="outline" className="text-lg px-3 flex items-center gap-1">
                {settings.goals.minSatisfactionRating}
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              </Badge>
            </div>
            <Slider
              value={[settings.goals.minSatisfactionRating]}
              onValueChange={([value]) => updateGoals({ minSatisfactionRating: value })}
              min={1}
              max={5}
              step={0.5}
              disabled={!isOwnerOrAdmin}
            />
          </div>

          <Separator />

          {/* Resolution Rate Goal */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Taxa de Resolução</Label>
                <p className="text-sm text-muted-foreground">
                  Percentual mínimo de conversas resolvidas na primeira interação
                </p>
              </div>
              <Badge variant="outline" className="text-lg px-3">
                {settings.goals.resolutionRate}%
              </Badge>
            </div>
            <Slider
              value={[settings.goals.resolutionRate]}
              onValueChange={([value]) => updateGoals({ resolutionRate: value })}
              min={50}
              max={100}
              step={5}
              disabled={!isOwnerOrAdmin}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OperationalConfigTab;
