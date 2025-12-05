import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import type { AppRole, AgentProfile, Organization, OrganizationMember, OrgRole, OrgPlan } from '@/types/auth';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  profile: AgentProfile | null;
  organization: Organization | null;
  orgMembership: OrganizationMember | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [orgMembership, setOrgMembership] = useState<OrganizationMember | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      logger.error('Error loading user role', { error });
      return null;
    }

    return data?.role as AppRole | null;
  };

  const loadUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('agent_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      logger.error('Error loading user profile', { error });
      return null;
    }

    return data as AgentProfile | null;
  };

  const loadUserOrganization = async (userId: string) => {
    // First get the membership
    const { data: memberData, error: memberError } = await supabase
      .from('organization_members')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (memberError || !memberData) {
      logger.error('Error loading organization membership', { error: memberError });
      return { organization: null, membership: null };
    }

    const membership: OrganizationMember = {
      id: memberData.id,
      organization_id: memberData.organization_id,
      user_id: memberData.user_id,
      org_role: memberData.org_role as OrgRole,
      is_owner: memberData.is_owner,
      created_at: memberData.created_at,
    };

    // Then get the organization
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', memberData.organization_id)
      .maybeSingle();

    if (orgError || !orgData) {
      logger.error('Error loading organization', { error: orgError });
      return { organization: null, membership };
    }

    const org: Organization = {
      id: orgData.id,
      slug: orgData.slug,
      name: orgData.name,
      logo_url: orgData.logo_url,
      settings: (typeof orgData.settings === 'object' && orgData.settings !== null && !Array.isArray(orgData.settings)) 
        ? orgData.settings as Record<string, any> 
        : {},
      plan: orgData.plan as OrgPlan,
      is_active: orgData.is_active,
      created_at: orgData.created_at,
      updated_at: orgData.updated_at,
    };

    return { organization: org, membership };
  };

  const refreshProfile = async () => {
    if (!user) return;
    
    const [userRole, userProfile, orgData] = await Promise.all([
      loadUserRole(user.id),
      loadUserProfile(user.id),
      loadUserOrganization(user.id),
    ]);

    setRole(userRole);
    setProfile(userProfile);
    setOrganization(orgData.organization);
    setOrgMembership(orgData.membership);
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          setTimeout(async () => {
            const [userRole, userProfile, orgData] = await Promise.all([
              loadUserRole(currentSession.user.id),
              loadUserProfile(currentSession.user.id),
              loadUserOrganization(currentSession.user.id),
            ]);
            setRole(userRole);
            setProfile(userProfile);
            setOrganization(orgData.organization);
            setOrgMembership(orgData.membership);
            setLoading(false);
          }, 0);
        } else {
          setRole(null);
          setProfile(null);
          setOrganization(null);
          setOrgMembership(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        setTimeout(async () => {
          const [userRole, userProfile, orgData] = await Promise.all([
            loadUserRole(currentSession.user.id),
            loadUserProfile(currentSession.user.id),
            loadUserOrganization(currentSession.user.id),
          ]);
          setRole(userRole);
          setProfile(userProfile);
          setOrganization(orgData.organization);
          setOrgMembership(orgData.membership);
          setLoading(false);
        }, 0);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      logger.error('Sign in error', { error });
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: displayName,
          },
        },
      });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      logger.error('Sign up error', { error });
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      setRole(null);
      setProfile(null);
      setOrganization(null);
      setOrgMembership(null);
      
      navigate('/login');
      toast.success('Logout realizado com sucesso');
    } catch (error) {
      logger.error('Sign out error', { error });
      toast.error('Erro ao fazer logout');
    }
  };

  const value = {
    user,
    session,
    role,
    profile,
    organization,
    orgMembership,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
