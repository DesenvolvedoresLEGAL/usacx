import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook para obter informações da organização atual do usuário
 * Fornece o organizationId para filtros multi-tenant em queries
 */
export const useOrganization = () => {
  const { organization, orgMembership, loading } = useAuth();

  return {
    organizationId: organization?.id ?? null,
    organization,
    membership: orgMembership,
    isOwner: orgMembership?.is_owner ?? false,
    isAdmin: orgMembership?.org_role === 'admin' || orgMembership?.is_owner,
    loading,
  };
};

/**
 * Helper para adicionar filtro de organização em queries Supabase
 */
export const withOrgFilter = <T extends { eq: (column: string, value: string) => T }>(
  query: T,
  organizationId: string | null,
  column: string = 'organization_id'
): T => {
  if (!organizationId) return query;
  return query.eq(column, organizationId);
};
