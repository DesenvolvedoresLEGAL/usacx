import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Crown, Shield, User, Trash2, Loader2 } from 'lucide-react';
import type { OrgRole } from '@/types/auth';

interface Member {
  id: string;
  user_id: string;
  org_role: OrgRole;
  is_owner: boolean;
  created_at: string;
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
  app_role: string | null;
}

const OrganizationMembersTab = () => {
  const { organization, orgMembership, user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const isOwner = orgMembership?.is_owner;

  useEffect(() => {
    if (organization) {
      fetchMembers();
    }
  }, [organization]);

  const fetchMembers = async () => {
    if (!organization) return;
    
    setLoading(true);
    try {
      // Get organization members
      const { data: membersData, error: membersError } = await supabase
        .from('organization_members')
        .select('*')
        .eq('organization_id', organization.id);

      if (membersError) throw membersError;

      // Get profiles for each member
      const memberIds = membersData.map(m => m.user_id);
      
      const { data: profiles, error: profilesError } = await supabase
        .from('agent_profiles')
        .select('user_id, display_name, avatar_url')
        .in('user_id', memberIds);

      if (profilesError) throw profilesError;

      // Get roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', memberIds);

      if (rolesError) throw rolesError;

      // Combine data
      const enrichedMembers: Member[] = membersData.map(member => {
        const profile = profiles?.find(p => p.user_id === member.user_id);
        const role = roles?.find(r => r.user_id === member.user_id);
        return {
          ...member,
          org_role: member.org_role as OrgRole,
          display_name: profile?.display_name || null,
          avatar_url: profile?.avatar_url || null,
          email: null, // Email not available through public schema
          app_role: role?.role || null,
        };
      });

      // Sort: owners first, then admins, then members
      enrichedMembers.sort((a, b) => {
        if (a.is_owner !== b.is_owner) return a.is_owner ? -1 : 1;
        if (a.org_role !== b.org_role) {
          const order = { owner: 0, admin: 1, member: 2 };
          return order[a.org_role] - order[b.org_role];
        }
        return 0;
      });

      setMembers(enrichedMembers);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Erro ao carregar membros');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: OrgRole) => {
    if (!isOwner) return;

    setUpdating(memberId);
    try {
      const { error } = await supabase
        .from('organization_members')
        .update({ org_role: newRole })
        .eq('id', memberId);

      if (error) throw error;

      setMembers(prev => prev.map(m => 
        m.id === memberId ? { ...m, org_role: newRole } : m
      ));
      toast.success('Função atualizada');
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Erro ao atualizar função');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!isOwner) return;

    setUpdating(memberId);
    try {
      const { error } = await supabase
        .from('organization_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      setMembers(prev => prev.filter(m => m.id !== memberId));
      toast.success('Membro removido');
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Erro ao remover membro');
    } finally {
      setUpdating(null);
    }
  };

  const getRoleIcon = (role: OrgRole, isOwner: boolean) => {
    if (isOwner) return <Crown className="h-4 w-4 text-amber-500" />;
    if (role === 'admin') return <Shield className="h-4 w-4 text-blue-500" />;
    return <User className="h-4 w-4 text-muted-foreground" />;
  };

  const getRoleBadge = (role: OrgRole, isOwnerMember: boolean) => {
    if (isOwnerMember) {
      return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">Owner</Badge>;
    }
    if (role === 'admin') {
      return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">Admin</Badge>;
    }
    return <Badge variant="outline">Membro</Badge>;
  };

  const getAppRoleBadge = (role: string | null) => {
    if (!role) return null;
    const colors: Record<string, string> = {
      admin: 'bg-red-500/10 text-red-600 border-red-500/20',
      manager: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      agent: 'bg-green-500/10 text-green-600 border-green-500/20',
    };
    return (
      <Badge variant="outline" className={colors[role] || ''}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  if (!organization) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Membros da Organização</CardTitle>
        <CardDescription>
          {members.length} {members.length === 1 ? 'membro' : 'membros'} na organização
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Membro</TableHead>
                <TableHead>Função na Org</TableHead>
                <TableHead>Função no Sistema</TableHead>
                {isOwner && <TableHead className="w-[100px]">Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={member.avatar_url || undefined} />
                        <AvatarFallback>
                          {(member.display_name || 'U').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          {member.display_name || 'Usuário'}
                          {getRoleIcon(member.org_role, member.is_owner)}
                        </p>
                        {member.user_id === user?.id && (
                          <p className="text-xs text-muted-foreground">Você</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {isOwner && !member.is_owner ? (
                      <Select
                        value={member.org_role}
                        onValueChange={(value) => handleRoleChange(member.id, value as OrgRole)}
                        disabled={updating === member.id}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="member">Membro</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      getRoleBadge(member.org_role, member.is_owner)
                    )}
                  </TableCell>
                  <TableCell>
                    {getAppRoleBadge(member.app_role)}
                  </TableCell>
                  {isOwner && (
                    <TableCell>
                      {!member.is_owner && member.user_id !== user?.id && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              disabled={updating === member.id}
                            >
                              {updating === member.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remover membro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação irá remover {member.display_name || 'este usuário'} da organização.
                                O usuário perderá acesso a todos os recursos.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRemoveMember(member.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default OrganizationMembersTab;