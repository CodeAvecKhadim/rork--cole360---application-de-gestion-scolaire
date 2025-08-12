import React from 'react';
import { useAuth } from '@/hooks/auth-store';
import { UserRole } from '@/types/auth';

interface RoleBasedComponentProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export default function RoleBasedComponent({ 
  children, 
  allowedRoles, 
  fallback = null 
}: RoleBasedComponentProps) {
  const { user } = useAuth();
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

export function useRoleAccess() {
  const { user } = useAuth();
  
  const hasRole = (roles: UserRole | UserRole[]) => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };
  
  const isAdmin = () => hasRole('admin');
  const isSchoolAdmin = () => hasRole('schoolAdmin');
  const isTeacher = () => hasRole('teacher');
  const isParent = () => hasRole('parent');
  const isEducator = () => hasRole(['teacher', 'schoolAdmin']);
  const isManager = () => hasRole(['admin', 'schoolAdmin']);
  
  return {
    user,
    hasRole,
    isAdmin,
    isSchoolAdmin,
    isTeacher,
    isParent,
    isEducator,
    isManager,
  };
}