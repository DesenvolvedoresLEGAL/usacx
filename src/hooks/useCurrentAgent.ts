import { useAuth } from '@/contexts/AuthContext';
import type { AgentProfile, AppRole } from '@/types/auth';

interface CurrentAgent {
  id: string;
  email: string | undefined;
  displayName: string | null;
  avatarUrl: string | null;
  status: 'online' | 'offline' | 'away' | 'busy';
  role: AppRole | null;
  teamId: string | null;
  profile: AgentProfile | null;
}

/**
 * Hook que retorna os dados completos do agente logado
 * Combina informações do user, profile e role em um único objeto
 */
export const useCurrentAgent = (): CurrentAgent | null => {
  const { user, profile, role } = useAuth();

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    displayName: profile?.display_name || null,
    avatarUrl: profile?.avatar_url || null,
    status: profile?.status || 'offline',
    role,
    teamId: profile?.team_id || null,
    profile,
  };
};
