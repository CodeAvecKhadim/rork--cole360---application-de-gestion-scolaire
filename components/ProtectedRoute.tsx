// Composant de protection des routes basé sur les permissions
// Contrôle l'accès aux fonctionnalités selon le rôle et les permissions de l'utilisateur
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/hooks/auth-store';
import { usePermissions } from '@/hooks/security-store';
import { UserPermissions, UserRole } from '@/types/auth';
import { COLORS } from '@/constants/colors';
import { Shield, AlertTriangle } from 'lucide-react-native';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: keyof UserPermissions;
  requiredRole?: UserRole;
  allowedRoles?: UserRole[];
  fallback?: React.ReactNode;
  showError?: boolean;
}

// Composant principal de protection des routes
export default function ProtectedRoute({
  children,
  requiredPermission,
  requiredRole,
  allowedRoles,
  fallback,
  showError = true,
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  
  // Toujours appeler usePermissions, même si user est null
  const permissions = usePermissions(user?.role || 'parent');
  
  // Si l'utilisateur n'est pas connecté, ne pas afficher le contenu
  if (!isAuthenticated || !user) {
    return fallback || (showError ? <UnauthorizedView message="Connexion requise" /> : null);
  }
  
  // Vérifier les permissions spécifiques
  if (requiredPermission && !permissions.hasPermission(requiredPermission)) {
    return fallback || (showError ? <UnauthorizedView message="Permission insuffisante" /> : null);
  }
  
  // Vérifier le rôle requis
  if (requiredRole && user.role !== requiredRole) {
    return fallback || (showError ? <UnauthorizedView message="Rôle insuffisant" /> : null);
  }
  
  // Vérifier les rôles autorisés
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return fallback || (showError ? <UnauthorizedView message="Accès non autorisé" /> : null);
  }
  
  // Si toutes les vérifications passent, afficher le contenu
  return <>{children}</>;
}

// Composant d'affichage pour les accès non autorisés
function UnauthorizedView({ message }: { message: string }) {
  return (
    <View style={styles.unauthorizedContainer}>
      <View style={styles.iconContainer}>
        <Shield size={64} color={COLORS.danger} />
      </View>
      <Text style={styles.unauthorizedTitle}>Accès restreint</Text>
      <Text style={styles.unauthorizedMessage}>{message}</Text>
      <View style={styles.warningContainer}>
        <AlertTriangle size={20} color={COLORS.warning} />
        <Text style={styles.warningText}>
          Contactez votre administrateur si vous pensez que c&apos;est une erreur
        </Text>
      </View>
    </View>
  );
}

// Hook personnalisé pour vérifier les permissions dans les composants
export function usePermissionCheck() {
  const { user } = useAuth();
  // Toujours appeler usePermissions avec un rôle par défaut
  const permissions = usePermissions(user?.role || 'parent');
  
  return {
    hasPermission: (permission: keyof UserPermissions) => {
      return user ? permissions.hasPermission(permission) : false;
    },
    hasRole: (role: UserRole) => {
      return user?.role === role;
    },
    hasAnyRole: (roles: UserRole[]) => {
      return user ? roles.includes(user.role) : false;
    },
    isAdmin: user?.role === 'admin',
    isSchoolAdmin: user?.role === 'schoolAdmin',
    isTeacher: user?.role === 'teacher',
    isParent: user?.role === 'parent',
    canManage: user?.role === 'admin' || user?.role === 'schoolAdmin',
    permissions,
    userRole: user?.role,
  };
}

// Composant pour afficher conditionnellement du contenu basé sur les permissions
interface ConditionalRenderProps {
  children: React.ReactNode;
  requiredPermission?: keyof UserPermissions;
  requiredRole?: UserRole;
  allowedRoles?: UserRole[];
  fallback?: React.ReactNode;
}

export function ConditionalRender({
  children,
  requiredPermission,
  requiredRole,
  allowedRoles,
  fallback = null,
}: ConditionalRenderProps) {
  const { hasPermission, hasRole, hasAnyRole } = usePermissionCheck();
  
  // Vérifier les permissions
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <>{fallback}</>;
  }
  
  // Vérifier le rôle requis
  if (requiredRole && !hasRole(requiredRole)) {
    return <>{fallback}</>;
  }
  
  // Vérifier les rôles autorisés
  if (allowedRoles && !hasAnyRole(allowedRoles)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

// Composant pour afficher des badges de permissions
interface PermissionBadgeProps {
  permission: keyof UserPermissions;
  label: string;
  style?: any;
}

export function PermissionBadge({ permission, label, style }: PermissionBadgeProps) {
  const { hasPermission } = usePermissionCheck();
  const isGranted = hasPermission(permission);
  
  return (
    <View style={[styles.permissionBadge, isGranted ? styles.permissionGranted : styles.permissionDenied, style]}>
      <Text style={[styles.permissionText, isGranted ? styles.permissionTextGranted : styles.permissionTextDenied]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: COLORS.background,
  },
  iconContainer: {
    marginBottom: 24,
    padding: 20,
    borderRadius: 50,
    backgroundColor: COLORS.light,
  },
  unauthorizedTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  unauthorizedMessage: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  warningText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  permissionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  permissionGranted: {
    backgroundColor: COLORS.success + '20',
    borderColor: COLORS.success,
  },
  permissionDenied: {
    backgroundColor: COLORS.danger + '20',
    borderColor: COLORS.danger,
  },
  permissionText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  permissionTextGranted: {
    color: COLORS.success,
  },
  permissionTextDenied: {
    color: COLORS.danger,
  },
});