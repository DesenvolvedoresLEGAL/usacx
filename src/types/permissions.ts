import type { AppRole } from './auth';

export type Permission =
  // Conversations
  | 'conversations:view_own'
  | 'conversations:view_all'
  | 'conversations:transfer'
  | 'conversations:intervene'
  // Dashboard
  | 'dashboard:view_own'
  | 'dashboard:view_team'
  | 'dashboard:view_all'
  // Reports
  | 'reports:view_own'
  | 'reports:view_team'
  | 'reports:view_all'
  | 'reports:export'
  // Management
  | 'management:live'
  | 'management:agents'
  | 'management:channels'
  // Settings
  | 'settings:view'
  | 'settings:edit'
  // Access
  | 'access:agents'
  | 'access:users'
  | 'access:logs'
  // AI
  | 'ai:chatbot'
  | 'ai:ml';

export const ROLE_PERMISSIONS: Record<AppRole, Permission[]> = {
  agent: [
    'conversations:view_own',
    'dashboard:view_own',
    'reports:view_own',
  ],
  manager: [
    'conversations:view_own',
    'conversations:view_all',
    'conversations:transfer',
    'conversations:intervene',
    'dashboard:view_own',
    'dashboard:view_team',
    'management:live',
    'reports:view_own',
    'reports:view_team',
  ],
  admin: [
    'conversations:view_own',
    'conversations:view_all',
    'conversations:transfer',
    'conversations:intervene',
    'dashboard:view_own',
    'dashboard:view_team',
    'dashboard:view_all',
    'management:live',
    'management:agents',
    'management:channels',
    'reports:view_own',
    'reports:view_team',
    'reports:view_all',
    'reports:export',
    'settings:view',
    'settings:edit',
    'access:agents',
    'access:users',
    'access:logs',
    'ai:chatbot',
    'ai:ml',
  ],
};

export const hasPermission = (role: AppRole | null, permission: Permission): boolean => {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
};

export const hasAnyPermission = (role: AppRole | null, permissions: Permission[]): boolean => {
  if (!role) return false;
  return permissions.some(permission => hasPermission(role, permission));
};

export const hasAllPermissions = (role: AppRole | null, permissions: Permission[]): boolean => {
  if (!role) return false;
  return permissions.every(permission => hasPermission(role, permission));
};
