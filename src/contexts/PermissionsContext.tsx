import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import type { Permission } from '@/types/permissions';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '@/types/permissions';

interface PermissionsContextType {
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  hasRole: (roles: string | string[]) => boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within PermissionsProvider');
  }
  return context;
};

export const PermissionsProvider = ({ children }: { children: ReactNode }) => {
  const { role } = useAuth();

  const checkPermission = (permission: Permission): boolean => {
    return hasPermission(role, permission);
  };

  const checkAnyPermission = (permissions: Permission[]): boolean => {
    return hasAnyPermission(role, permissions);
  };

  const checkAllPermissions = (permissions: Permission[]): boolean => {
    return hasAllPermissions(role, permissions);
  };

  const checkRole = (roles: string | string[]): boolean => {
    if (!role) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(role);
  };

  const value = {
    hasPermission: checkPermission,
    hasAnyPermission: checkAnyPermission,
    hasAllPermissions: checkAllPermissions,
    hasRole: checkRole,
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};
