import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { AppRole } from "@/types/auth";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any | null;
  onSuccess: () => void;
}

export const UserFormDialog = ({ open, onOpenChange, user, onSuccess }: UserFormDialogProps) => {
  const { organization } = useAuth();
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);
  const [formData, setFormData] = useState({
    email: "",
    display_name: "",
    role: "agent" as AppRole,
    team_id: "",
  });

  useEffect(() => {
    if (organization?.id) {
      loadTeams();
    }
  }, [organization?.id]);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        display_name: user.display_name || "",
        role: user.role || "agent",
        team_id: user.team_id || "",
      });
    } else {
      setFormData({
        email: "",
        display_name: "",
        role: "agent",
        team_id: "",
      });
    }
  }, [user]);

  const loadTeams = async () => {
    if (!organization?.id) return;
    
    try {
      const { data, error } = await supabase
        .from("teams")
        .select("id, name")
        .eq("organization_id", organization.id);
      
      if (error) throw error;
      setTeams(data || []);
    } catch (error: any) {
      console.error("Erro ao carregar times:", error);
    }
  };

  const handleSave = async () => {
    if (!organization?.id) {
      toast.error("Organização não encontrada");
      return;
    }

    try {
      setLoading(true);

      if (!formData.email || !formData.display_name) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }

      if (user) {
        // Edit existing user
        const { error: profileError } = await supabase
          .from("agent_profiles")
          .update({
            display_name: formData.display_name,
            team_id: formData.team_id || null,
          })
          .eq("user_id", user.id);

        if (profileError) throw profileError;

        const { error: roleError } = await supabase
          .from("user_roles")
          .update({ role: formData.role })
          .eq("user_id", user.id);

        if (roleError) throw roleError;

        toast.success("Usuário atualizado com sucesso");
      } else {
        // Create new user via edge function
        const { data, error } = await supabase.functions.invoke("create-user", {
          body: {
            email: formData.email,
            display_name: formData.display_name,
            role: formData.role,
            team_id: formData.team_id || null,
            organization_id: organization.id,
          },
        });

        if (error) {
          console.error("Edge function error:", error);
          throw new Error(error.message || "Erro ao criar usuário");
        }

        if (data?.error) {
          throw new Error(data.error);
        }

        toast.success("Usuário criado com sucesso");
      }

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error("Erro ao salvar usuário:", error);
      toast.error(error.message || "Erro ao salvar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
          <DialogDescription>
            {user 
              ? "Atualize os dados do usuário" 
              : "Preencha os dados para criar um novo usuário. Um email será enviado para definição de senha."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              disabled={!!user}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="usuario@empresa.com"
            />
          </div>
          <div>
            <Label htmlFor="display_name">Nome de Exibição *</Label>
            <Input
              id="display_name"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              placeholder="Nome completo"
            />
          </div>
          <div>
            <Label htmlFor="role">Role *</Label>
            <Select value={formData.role} onValueChange={(value: AppRole) => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agent">Agente</SelectItem>
                <SelectItem value="manager">Gestor</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="team">Time (opcional)</Label>
            <Select 
              value={formData.team_id || "none"} 
              onValueChange={(value) => setFormData({ ...formData, team_id: value === "none" ? "" : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem time</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
