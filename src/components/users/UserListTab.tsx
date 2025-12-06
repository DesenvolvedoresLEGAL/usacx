import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, UserPlus, MoreVertical, UserCog, Mail, RefreshCw } from "lucide-react";
import { UserFormDialog } from "./UserFormDialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { AppRole } from "@/types/auth";

interface UserData {
  id: string;
  email: string;
  display_name: string | null;
  role: AppRole;
  team_id: string | null;
  team_name: string | null;
  status: string | null;
  last_sign_in_at: string | null;
}

export const UserListTab = () => {
  const { organization } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  const loadUsers = async () => {
    if (!organization?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // 1. Get org members
      const { data: members, error: membersError } = await supabase
        .from("organization_members")
        .select("user_id")
        .eq("organization_id", organization.id);

      if (membersError) throw membersError;

      const userIds = members?.map(m => m.user_id) || [];
      
      if (userIds.length === 0) {
        setUsers([]);
        return;
      }

      // 2. Get profiles with teams (using explicit FK hint)
      const { data: profiles, error: profilesError } = await supabase
        .from("agent_profiles")
        .select(`
          id,
          user_id,
          display_name,
          status,
          team_id,
          teams!fk_agent_profiles_team (
            name
          )
        `)
        .in("user_id", userIds);

      if (profilesError) throw profilesError;

      // 3. Get roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .in("user_id", userIds);

      if (rolesError) throw rolesError;

      // 4. Get auth user data via edge function
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const { data: { session } } = await supabase.auth.getSession();
      
      let authResponse = null;
      let authError = null;
      
      try {
        const response = await fetch(
          `${supabaseUrl}/functions/v1/list-users?organization_id=${organization.id}`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${session?.access_token}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        if (response.ok) {
          authResponse = await response.json();
        } else {
          const errorData = await response.json();
          authError = new Error(errorData.error || "Erro ao buscar usuários");
        }
      } catch (e: any) {
        authError = e;
      }

      // Handle auth error gracefully - we can still show profiles without email
      let authUserMap = new Map<string, { email: string; last_sign_in_at: string | null }>();
      
      if (!authError && authResponse?.users) {
        authUserMap = new Map(
          authResponse.users.map((u: any) => [u.id, { email: u.email, last_sign_in_at: u.last_sign_in_at }])
        );
      } else {
        console.warn("Could not fetch auth users:", authError);
      }

      // 5. Combine data
      const usersData: UserData[] = (profiles || []).map((profile: any) => {
        const role = roles?.find((r: any) => r.user_id === profile.user_id);
        const authUser = authUserMap.get(profile.user_id);
        const teamData = profile.teams;

        return {
          id: profile.user_id,
          email: authUser?.email || "N/A",
          display_name: profile.display_name,
          role: (role?.role as AppRole) || "agent",
          team_id: profile.team_id,
          team_name: teamData?.name || null,
          status: profile.status,
          last_sign_in_at: authUser?.last_sign_in_at || null,
        };
      });

      setUsers(usersData);
    } catch (error: any) {
      console.error("Erro ao carregar usuários:", error);
      toast.error("Erro ao carregar usuários: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [organization?.id]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.display_name?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: AppRole) => {
    const variants: Record<AppRole, "default" | "secondary" | "destructive"> = {
      admin: "destructive",
      manager: "default",
      agent: "secondary",
    };
    const labels: Record<AppRole, string> = {
      admin: "Admin",
      manager: "Gestor",
      agent: "Agente",
    };
    return <Badge variant={variants[role]}>{labels[role]}</Badge>;
  };

  const getStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="outline">Offline</Badge>;
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      online: "default",
      away: "secondary",
      busy: "secondary",
      offline: "outline",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const handleEdit = (user: UserData) => {
    setEditingUser(user);
    setShowUserDialog(true);
  };

  const handleCreate = () => {
    setEditingUser(null);
    setShowUserDialog(true);
  };

  const handleResetPassword = async (userId: string, email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toast.success("Email de redefinição de senha enviado");
    } catch (error: any) {
      console.error("Erro ao enviar email:", error);
      toast.error("Erro ao enviar email de redefinição");
    }
  };

  if (!organization) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Nenhuma organização encontrada
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Usuários</CardDescription>
            <CardTitle className="text-3xl">{users.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Administradores</CardDescription>
            <CardTitle className="text-3xl">{users.filter((u) => u.role === "admin").length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Gestores</CardDescription>
            <CardTitle className="text-3xl">{users.filter((u) => u.role === "manager").length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Agentes</CardDescription>
            <CardTitle className="text-3xl">{users.filter((u) => u.role === "agent").length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* FILTROS */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por nome ou email..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={loadUsers}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            <Button onClick={handleCreate}>
              <UserPlus className="w-4 h-4 mr-2" />
              Novo Usuário
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* TABELA */}
      <Card className="flex-1 overflow-hidden">
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>Gerencie todos os usuários da organização</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto max-h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.display_name || "N/A"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{user.team_name || "-"}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(user)}>
                              <UserCog className="mr-2 w-4 h-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleResetPassword(user.id, user.email)}>
                              <Mail className="mr-2 w-4 h-4" />
                              Resetar Senha
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <UserFormDialog
        open={showUserDialog}
        onOpenChange={setShowUserDialog}
        user={editingUser}
        onSuccess={loadUsers}
      />
    </div>
  );
};
