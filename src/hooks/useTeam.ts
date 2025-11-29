import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Team, AgentProfile } from '@/types/auth';

interface TeamData {
  team: Team | null;
  members: AgentProfile[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook que retorna dados do time do usuário
 * - Para gestores: retorna o time que eles gerenciam + membros
 * - Para agentes: retorna o time ao qual pertencem + membros
 * - Para admin: retorna todos os times (usar com parâmetro teamId)
 */
export const useTeam = (teamId?: string): TeamData => {
  const { user, profile, role } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<AgentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadTeamData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let targetTeamId = teamId;

        // Se não foi fornecido teamId, determinar baseado no role
        if (!targetTeamId) {
          if (role === 'manager') {
            // Gestor: buscar time onde é manager
            const { data: managedTeams, error: teamError } = await supabase
              .from('teams')
              .select('*')
              .eq('manager_id', user.id)
              .maybeSingle();

            if (teamError) throw teamError;
            targetTeamId = managedTeams?.id;
          } else if (role === 'agent') {
            // Agente: usar o team_id do profile
            targetTeamId = profile?.team_id || undefined;
          }
        }

        if (!targetTeamId) {
          setTeam(null);
          setMembers([]);
          setLoading(false);
          return;
        }

        // Buscar dados do time
        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .select('*')
          .eq('id', targetTeamId)
          .maybeSingle();

        if (teamError) throw teamError;
        setTeam(teamData);

        // Buscar membros do time
        const { data: teamMembers, error: membersError } = await supabase
          .from('agent_profiles')
          .select('*')
          .eq('team_id', targetTeamId);

        if (membersError) throw membersError;
        setMembers((teamMembers || []) as AgentProfile[]);
      } catch (err) {
        console.error('Error loading team data:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
  }, [user, profile, role, teamId]);

  return { team, members, loading, error };
};

/**
 * Hook que retorna todos os times (para admins)
 */
export const useAllTeams = () => {
  const { role } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadAllTeams = async () => {
      if (role !== 'admin') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: teamsError } = await supabase
          .from('teams')
          .select('*')
          .order('name');

        if (teamsError) throw teamsError;
        setTeams(data || []);
      } catch (err) {
        console.error('Error loading all teams:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadAllTeams();
  }, [role]);

  return { teams, loading, error };
};
