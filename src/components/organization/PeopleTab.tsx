import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Search, UserPlus, MoreVertical, UserCog, Mail, Trash2, Crown, Shield, User, Users, Loader2 } from "lucide-react";
import { UserFormDialog } from "@/components/users/UserFormDialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { AppRole } from "@/types/auth";

interface PersonData {
  id: string;
  user_id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  app_role: AppRole;
  team_id: string | null;
  team_name: string | null;
  status: string | null;
  is_owner: boolean;
  org_role: string | null;
}

export const PeopleTab = () => {
  const { organization, orgMembership, user } = useAuth();
  const [people, setPeople] = useState<PersonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [deletingPerson, setDeletingPerson] = useState<PersonData | null>(null);
  const [deleting, setDeleting] = useState(false);

  const isOwner = orgMembership?.is_owner;
  const isAdmin = orgMembership?.org_role === 'admin' || isOwner;

  const loadPeople = async () => {
    if (!organization?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // 1. Get org members
      const { data: members, error: membersError } = await supabase
        .from("organization_members")
        .select("*")
        .eq("organization_id", organization.id);

      if (membersError) throw membersError;

      const userIds = members?.map(m => m.user_id) || [];
      
      if (userIds.length === 0) {
        setPeople([]);
        return;
      }

      // 2. Get profiles with teams
      const { data: profiles, error: profilesError } = await supabase
        .from("agent_profiles")
        .select(`
          id,
          user_id,
          display_name,
          avatar_url,
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
      
      let authUserMap = new Map<string, { email: string }>();
      
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
          const authResponse = await response.json();
          authUserMap = new Map(
            authResponse.users?.map((u: any) => [u.id, { email: u.email }]) || []
          );
        }
      } catch (e) {
        console.warn("Could not fetch auth users:", e);
      }

      // 5. Combine data
      const peopleData: PersonData[] = (profiles || []).map((profile: any) => {
        const member = members?.find(m => m.user_id === profile.user_id);
        const role = roles?.find((r: any) => r.user_id === profile.user_id);
        const authUser = authUserMap.get(profile.user_id);
        const teamData = profile.teams;

        return {
          id: member?.id || profile.id,
          user_id: profile.user_id,
          email: authUser?.email || "N/A",
          display_name: profile.display_name,
          avatar_url: profile.avatar_url,
          app_role: (role?.role as AppRole) || "agent",
          team_id: profile.team_id,
          team_name: teamData?.name || null,
          status: profile.status,
          is_owner: member?.is_owner || false,
          org_role: member?.org_role || "member",
        };
      });

      // Sort: owners first, then by role
      peopleData.sort((a, b) => {
        if (a.is_owner !== b.is_owner) return a.is_owner ? -1 : 1;
        const roleOrder = { admin: 0, manager: 1, agent: 2 };
        return (roleOrder[a.app_role] || 2) - (roleOrder[b.app_role] || 2);
      });

      setPeople(peopleData);
    } catch (error: any) {
      console.error("Erro ao carregar pessoas:", error);
      toast.error("Erro ao carregar pessoas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPeople();
  }, [organization?.id]);

  const filteredPeople = people.filter((person) => {
    const matchesSearch =
      person.email.toLowerCase().includes(search.toLowerCase()) ||
      person.display_name?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const getRoleIcon = (role: AppRole, isOwner: boolean) => {
    if (isOwner) return <Crown className="h-4 w-4 text-amber-500" />;
    if (role === "admin") return <Shield className="h-4 w-4 text-red-500" />;
    if (role === "manager") return <UserCog className="h-4 w-4 text-purple-500" />;
    return <User className="h-4 w-4 text-muted-foreground" />;
  };

  const getRoleBadge = (role: AppRole, isOwnerFlag: boolean) => {
    if (isOwnerFlag) {
      return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">Owner</Badge>;
    }
    const variants: Record<AppRole, { bg: string; text: string; label: string }> = {
      admin: { bg: "bg-red-500/10", text: "text-red-600", label: "Admin" },
      manager: { bg: "bg-purple-500/10", text: "text-purple-600", label: "Gestor" },
      agent: { bg: "bg-blue-500/10", text: "text-blue-600", label: "Agente" },
    };
    const v = variants[role] || variants.agent;
    return <Badge variant="outline" className={`${v.bg} ${v.text} border-current/20`}>{v.label}</Badge>;
  };

  const getStatusIndicator = (status: string | null) => {
    const colors: Record<string, string> = {
      online: "bg-green-500",
      away: "bg-yellow-500",
      busy: "bg-red-500",
      offline: "bg-muted-foreground/50",
    };
    return (
      <span className={`inline-block w-2 h-2 rounded-full ${colors[status || "offline"]}`} />
    );
  };

  const handleEdit = (person: PersonData) => {
    setEditingUser({
      id: person.user_id,
      email: person.email,
      display_name: person.display_name,
      role: person.app_role,
      team_id: person.team_id,
      team_name: person.team_name,
      status: person.status,
    });
    setShowUserDialog(true);
  };

  const handleInvite = () => {
    setEditingUser(null);
    setShowUserDialog(true);
  };

  const handleResetPassword = async (email: string) => {
    if (email === "N/A") {
      toast.error("Email não disponível");
      return;
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toast.success("Email de redefinição de senha enviado");
    } catch (error: any) {
      toast.error("Erro ao enviar email de redefinição");
    }
  };

  const handleRemovePerson = async () => {
    if (!deletingPerson || !isOwner) return;
    
    setDeleting(true);
    try {
      const { error } = await supabase
        .from("organization_members")
        .delete()
        .eq("id", deletingPerson.id);

      if (error) throw error;

      setPeople(prev => prev.filter(p => p.id !== deletingPerson.id));
      toast.success("Pessoa removida da organização");
      setDeletingPerson(null);
    } catch (error: any) {
      toast.error("Erro ao remover pessoa");
    } finally {
      setDeleting(false);
    }
  };

  if (!organization) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Nenhuma organização encontrada
      </div>
    );
  }

  const stats = {
    total: people.length,
    admins: people.filter(p => p.app_role === "admin").length,
    managers: people.filter(p => p.app_role === "manager").length,
    agents: people.filter(p => p.app_role === "agent").length,
    online: people.filter(p => p.status === "online").length,
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total
            </CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-500" />
              Admins
            </CardDescription>
            <CardTitle className="text-2xl">{stats.admins}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <UserCog className="h-4 w-4 text-purple-500" />
              Gestores
            </CardDescription>
            <CardTitle className="text-2xl">{stats.managers}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-500" />
              Agentes
            </CardDescription>
            <CardTitle className="text-2xl">{stats.agents}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Online agora
            </CardDescription>
            <CardTitle className="text-2xl">{stats.online}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search + Actions */}
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
            {isAdmin && (
              <Button onClick={handleInvite} className="gap-2">
                <UserPlus className="w-4 h-4" />
                Convidar Pessoa
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* People Table */}
      <Card className="flex-1 overflow-hidden">
        <CardHeader>
          <CardTitle>Pessoas</CardTitle>
          <CardDescription>
            Todos os membros de {organization.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto max-h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pessoa</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  {isAdmin && <TableHead className="text-right">Ações</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : filteredPeople.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      Nenhuma pessoa encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPeople.map((person) => (
                    <TableRow key={person.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={person.avatar_url || undefined} />
                            <AvatarFallback>
                              {(person.display_name || person.email || "U").charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium flex items-center gap-2">
                              {person.display_name || "Sem nome"}
                              {getRoleIcon(person.app_role, person.is_owner)}
                            </p>
                            <p className="text-xs text-muted-foreground">{person.email}</p>
                            {person.user_id === user?.id && (
                              <Badge variant="secondary" className="text-xs mt-1">Você</Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(person.app_role, person.is_owner)}
                      </TableCell>
                      <TableCell>
                        {person.team_name || <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIndicator(person.status)}
                          <span className="text-sm capitalize">{person.status || "offline"}</span>
                        </div>
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(person)}>
                                <UserCog className="mr-2 w-4 h-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleResetPassword(person.email)}>
                                <Mail className="mr-2 w-4 h-4" />
                                Resetar Senha
                              </DropdownMenuItem>
                              {isOwner && !person.is_owner && person.user_id !== user?.id && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => setDeletingPerson(person)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="mr-2 w-4 h-4" />
                                    Remover
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* User Form Dialog */}
      <UserFormDialog
        open={showUserDialog}
        onOpenChange={setShowUserDialog}
        user={editingUser}
        onSuccess={loadPeople}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingPerson} onOpenChange={(open) => !open && setDeletingPerson(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover pessoa?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá remover {deletingPerson?.display_name || "esta pessoa"} da organização.
              A pessoa perderá acesso a todos os recursos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemovePerson}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleting}
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PeopleTab;
