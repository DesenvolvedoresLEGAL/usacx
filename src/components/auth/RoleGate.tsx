import { ReactNode } from 'react';
import { usePermissions } from '@/contexts/PermissionsContext';

interface RoleGateProps {
  children: ReactNode;
  roles: string | string[];
  fallback?: ReactNode;
}

export const RoleGate = ({ 
  children, 
  roles,
  fallback = null 
}: RoleGateProps) => {
  const { hasRole } = usePermissions();

  if (!hasRole(roles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
