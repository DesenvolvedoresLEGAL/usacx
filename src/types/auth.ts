import type { User, Session } from '@supabase/supabase-js';

export type AppRole = 'agent' | 'manager' | 'admin';

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  manager_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface AgentProfile {
  id: string;
  user_id: string;
  team_id: string | null;
  display_name: string | null;
  avatar_url: string | null;
  status: 'online' | 'offline' | 'away' | 'busy';
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  profile: AgentProfile | null;
  loading: boolean;
}
