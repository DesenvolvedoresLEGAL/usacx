import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import type { Permission } from '@/types/permissions';

interface RouteGuardProps {
  children: ReactNode;
  permission?: Permission;
  roles?: string[];
  redirectTo?: string;
}

export const RouteGuard = ({ 
  children, 
  permission, 
  roles,
  redirectTo = '/dashboard' 
}: RouteGuardProps) => {
  const { user, loading, role } = useAuth();
  const { hasPermission, hasRole } = usePermissions();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check permission if provided
  if (permission && !hasPermission(permission)) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check roles if provided
  if (roles && !hasRole(roles)) {
    // Redirect based on user role
    if (role === 'agent') {
      return <Navigate to="/conversations" replace />;
    }
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
