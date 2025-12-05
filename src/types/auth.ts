import type { User, Session } from '@supabase/supabase-js';

export type AppRole = 'agent' | 'manager' | 'admin';
export type OrgRole = 'owner' | 'admin' | 'member';
export type OrgPlan = 'free' | 'starter' | 'pro' | 'enterprise';

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface Organization {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  settings: Record<string, any>;
  plan: OrgPlan;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  org_role: OrgRole;
  is_owner: boolean;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  manager_id: string | null;
  organization_id: string | null;
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
  organization: Organization | null;
  orgMembership: OrganizationMember | null;
  loading: boolean;
}

export interface AuthUser {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  profile: AgentProfile | null;
  loading: boolean;
}
