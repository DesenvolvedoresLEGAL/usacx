import { ReactNode } from 'react';
import { usePermissions } from '@/contexts/PermissionsContext';
import type { Permission } from '@/types/permissions';

interface PermissionGateProps {
  children: ReactNode;
  permission: Permission;
  fallback?: ReactNode;
}

export const PermissionGate = ({ 
  children, 
  permission,
  fallback = null 
}: PermissionGateProps) => {
  const { hasPermission } = usePermissions();

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
