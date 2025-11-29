import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Plus, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Team {
  id: string;
  name: string;
  manager_id: string | null;
  manager_name: string | null;
  member_count: number;
}

interface Manager {
  id: string;
  name: string;
}

export const TeamsTab = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState({ name: "", manager_id: "" });

  const loadTeams = async () => {
    try {
      setLoading(true);
      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select("*");

      if (teamsError) throw teamsError;

      const { data: profiles, error: profilesError } = await supabase
        .from("agent_profiles")
        .select("user_id, display_name, team_id");

      if (profilesError) throw profilesError;

      const teamsWithMembers: Team[] = teamsData.map((team) => {
        const members = profiles.filter((p) => p.team_id === team.id);
        const manager = profiles.find((p) => p.user_id === team.manager_id);

        return {
          id: team.id,
          name: team.name,
          manager_id: team.manager_id,
          manager_name: manager?.display_name || null,
          member_count: members.length,
        };
      });

      setTeams(teamsWithMembers);
    } catch (error: any) {
      console.error("Erro ao carregar times:", error);
      toast.error("Erro ao carregar times");
    } finally {
      setLoading(false);
    }
  };

  const loadManagers = async () => {
    try {
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .in("role", ["manager", "admin"]);

      if (rolesError) throw rolesError;

      const managerIds = roles.map((r) => r.user_id);

      const { data: profiles, error: profilesError } = await supabase
        .from("agent_profiles")
        .select("user_id, display_name")
        .in("user_id", managerIds);

      if (profilesError) throw profilesError;

      setManagers(profiles.map((p) => ({ id: p.user_id, name: p.display_name || "N/A" })));
    } catch (error: any) {
      console.error("Erro ao carregar gestores:", error);
    }
  };

  useEffect(() => {
    loadTeams();
    loadManagers();
  }, []);

  const handleCreate = () => {
    setEditingTeam(null);
    setFormData({ name: "", manager_id: "" });
    setShowDialog(true);
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setFormData({ name: team.name, manager_id: team.manager_id || "" });
    setShowDialog(true);
  };

  const handleSave = async () => {
    try {
      if (!formData.name.trim()) {
        toast.error("Nome do time é obrigatório");
        return;
      }

      if (editingTeam) {
        const { error } = await supabase
          .from("teams")
          .update({ name: formData.name, manager_id: formData.manager_id || null })
          .eq("id", editingTeam.id);

        if (error) throw error;
        toast.success("Time atualizado com sucesso");
      } else {
        const { error } = await supabase
          .from("teams")
          .insert({ name: formData.name, manager_id: formData.manager_id || null });

        if (error) throw error;
        toast.success("Time criado com sucesso");
      }

      setShowDialog(false);
      loadTeams();
    } catch (error: any) {
      console.error("Erro ao salvar time:", error);
      toast.error("Erro ao salvar time");
    }
  };

  const handleDelete = async (teamId: string) => {
    if (!confirm("Tem certeza que deseja excluir este time?")) return;

    try {
      const { error } = await supabase.from("teams").delete().eq("id", teamId);

      if (error) throw error;
      toast.success("Time excluído com sucesso");
      loadTeams();
    } catch (error: any) {
      console.error("Erro ao excluir time:", error);
      toast.error("Erro ao excluir time");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Times e Departamentos</CardTitle>
              <CardDescription>Organize usuários em times e atribua gestores</CardDescription>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Time
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Time</TableHead>
                <TableHead>Gestor</TableHead>
                <TableHead>Membros</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : teams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Nenhum time cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                teams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        {team.name}
                      </div>
                    </TableCell>
                    <TableCell>{team.manager_name || "Sem gestor"}</TableCell>
                    <TableCell>{team.member_count} membros</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(team)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(team.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTeam ? "Editar Time" : "Novo Time"}</DialogTitle>
            <DialogDescription>Preencha os dados do time</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Time</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Vendas, Suporte, Atendimento"
              />
            </div>
            <div>
              <Label htmlFor="manager">Gestor (opcional)</Label>
              <Select value={formData.manager_id} onValueChange={(value) => setFormData({ ...formData, manager_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um gestor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sem gestor</SelectItem>
                  {managers.map((manager) => (
                    <SelectItem key={manager.id} value={manager.id}>
                      {manager.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
