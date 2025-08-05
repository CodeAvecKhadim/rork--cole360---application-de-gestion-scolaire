// Système de sécurité avancé pour École-360
// Gère les permissions, sessions, tentatives de connexion et logs de sécurité
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { UserRole, UserPermissions, UserSession, LoginAttempt, SecurityLog } from '@/types/auth';

// Configuration de sécurité
const SECURITY_CONFIG = {
  MAX_LOGIN_ATTEMPTS: 5, // Nombre maximum de tentatives de connexion
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes en millisecondes
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 heures en millisecondes
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_SPECIAL: true,
  PASSWORD_REQUIRE_NUMBER: true,
  PASSWORD_REQUIRE_UPPERCASE: true,
};

// Définition des permissions par rôle
const ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  admin: {
    canViewStudents: true,
    canEditStudents: true,
    canViewGrades: true,
    canEditGrades: true,
    canViewAttendance: true,
    canEditAttendance: true,
    canViewMessages: true,
    canSendMessages: true,
    canManageSchool: true,
    canManageUsers: true,
    canViewReports: true,
    canExportData: true,
  },
  schoolAdmin: {
    canViewStudents: true,
    canEditStudents: true,
    canViewGrades: true,
    canEditGrades: true,
    canViewAttendance: true,
    canEditAttendance: true,
    canViewMessages: true,
    canSendMessages: true,
    canManageSchool: true,
    canManageUsers: true,
    canViewReports: true,
    canExportData: true,
  },
  teacher: {
    canViewStudents: true,
    canEditStudents: false,
    canViewGrades: true,
    canEditGrades: true,
    canViewAttendance: true,
    canEditAttendance: true,
    canViewMessages: true,
    canSendMessages: true,
    canManageSchool: false,
    canManageUsers: false,
    canViewReports: true,
    canExportData: false,
  },
  parent: {
    canViewStudents: true,
    canEditStudents: false,
    canViewGrades: true,
    canEditGrades: false,
    canViewAttendance: true,
    canEditAttendance: false,
    canViewMessages: true,
    canSendMessages: true,
    canManageSchool: false,
    canManageUsers: false,
    canViewReports: false,
    canExportData: false,
  },
};

// Utilitaires de sécurité
class SecurityUtils {
  // Validation de mot de passe
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
      errors.push(`Le mot de passe doit contenir au moins ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} caractères`);
    }
    
    if (SECURITY_CONFIG.PASSWORD_REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une majuscule');
    }
    
    if (SECURITY_CONFIG.PASSWORD_REQUIRE_NUMBER && !/\d/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre');
    }
    
    if (SECURITY_CONFIG.PASSWORD_REQUIRE_SPECIAL && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un caractère spécial');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  // Génération d'un ID de device
  static generateDeviceId(): string {
    return `${Platform.OS}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Obtenir les informations du device
  static getDeviceInfo(): { name: string; userAgent: string } {
    const deviceName = Platform.select({
      ios: 'iPhone/iPad',
      android: 'Android Device',
      web: 'Navigateur Web',
      default: 'Unknown Device'
    });
    
    const userAgent = Platform.select({
      web: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      default: `${Platform.OS} ${Platform.Version}`
    });
    
    return { name: deviceName, userAgent };
  }
  
  // Simulation d'obtention de l'adresse IP
  static async getIPAddress(): Promise<string> {
    // En production, vous utiliseriez un service pour obtenir l'IP réelle
    return '192.168.1.1';
  }
  
  // Hachage simple pour les mots de passe (en production, utilisez bcrypt)
  static hashPassword(password: string): string {
    // Simulation d'un hachage - en production, utilisez une vraie fonction de hachage
    return btoa(password + 'salt_secret_key');
  }
  
  // Vérification du mot de passe
  static verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  }
}

// Store de sécurité principal
export const [SecurityContext, useSecurity] = createContextHook(() => {
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [activeSessions, setActiveSessions] = useState<UserSession[]>([]);
  const [deviceId] = useState<string>(SecurityUtils.generateDeviceId());
  
  // Charger les données de sécurité depuis le stockage
  useEffect(() => {
    const loadSecurityData = async () => {
      try {
        const storedAttempts = await AsyncStorage.getItem('loginAttempts');
        const storedLogs = await AsyncStorage.getItem('securityLogs');
        const storedSessions = await AsyncStorage.getItem('activeSessions');
        
        if (storedAttempts) {
          setLoginAttempts(JSON.parse(storedAttempts));
        }
        if (storedLogs) {
          setSecurityLogs(JSON.parse(storedLogs));
        }
        if (storedSessions) {
          setActiveSessions(JSON.parse(storedSessions));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données de sécurité:', error);
      }
    };
    
    loadSecurityData();
  }, []);
  
  // Enregistrer une tentative de connexion
  const logLoginAttempt = async (email: string, success: boolean, failureReason?: string) => {
    const ipAddress = await SecurityUtils.getIPAddress();
    const { userAgent } = SecurityUtils.getDeviceInfo();
    
    const attempt: LoginAttempt = {
      id: Date.now().toString(),
      email,
      ipAddress,
      userAgent,
      success,
      failureReason,
      timestamp: Date.now(),
    };
    
    const updatedAttempts = [...loginAttempts, attempt];
    setLoginAttempts(updatedAttempts);
    
    // Garder seulement les 100 dernières tentatives
    const limitedAttempts = updatedAttempts.slice(-100);
    await AsyncStorage.setItem('loginAttempts', JSON.stringify(limitedAttempts));
    
    console.log('Tentative de connexion enregistrée:', {
      email,
      success,
      ipAddress,
      timestamp: new Date(attempt.timestamp).toISOString()
    });
  };
  
  // Enregistrer un log de sécurité
  const logSecurityEvent = async (action: string, resource: string, userId?: string, success: boolean = true, details?: any) => {
    const ipAddress = await SecurityUtils.getIPAddress();
    const { userAgent } = SecurityUtils.getDeviceInfo();
    
    const log: SecurityLog = {
      id: Date.now().toString(),
      userId,
      action,
      resource,
      ipAddress,
      userAgent,
      success,
      details,
      timestamp: Date.now(),
    };
    
    const updatedLogs = [...securityLogs, log];
    setSecurityLogs(updatedLogs);
    
    // Garder seulement les 500 derniers logs
    const limitedLogs = updatedLogs.slice(-500);
    await AsyncStorage.setItem('securityLogs', JSON.stringify(limitedLogs));
    
    console.log('Événement de sécurité enregistré:', {
      action,
      resource,
      userId,
      success,
      timestamp: new Date(log.timestamp).toISOString()
    });
  };
  
  // Créer une nouvelle session
  const createSession = async (userId: string): Promise<UserSession> => {
    const ipAddress = await SecurityUtils.getIPAddress();
    const { name: deviceName, userAgent } = SecurityUtils.getDeviceInfo();
    
    const session: UserSession = {
      id: Date.now().toString(),
      userId,
      deviceId,
      deviceName,
      ipAddress,
      userAgent,
      isActive: true,
      lastActivity: Date.now(),
      createdAt: Date.now(),
      expiresAt: Date.now() + SECURITY_CONFIG.SESSION_TIMEOUT,
    };
    
    const updatedSessions = [...activeSessions, session];
    setActiveSessions(updatedSessions);
    await AsyncStorage.setItem('activeSessions', JSON.stringify(updatedSessions));
    
    await logSecurityEvent('SESSION_CREATED', 'user_session', userId, true, {
      deviceId,
      deviceName,
      sessionId: session.id
    });
    
    return session;
  };
  
  // Terminer une session
  const terminateSession = async (sessionId: string, userId?: string) => {
    const updatedSessions = activeSessions.map(session => 
      session.id === sessionId 
        ? { ...session, isActive: false }
        : session
    );
    
    setActiveSessions(updatedSessions);
    await AsyncStorage.setItem('activeSessions', JSON.stringify(updatedSessions));
    
    await logSecurityEvent('SESSION_TERMINATED', 'user_session', userId, true, {
      sessionId
    });
  };
  
  // Vérifier si un utilisateur est verrouillé
  const isUserLocked = (email: string): boolean => {
    const now = Date.now();
    const recentAttempts = loginAttempts.filter(
      attempt => 
        attempt.email === email && 
        !attempt.success && 
        (now - attempt.timestamp) < SECURITY_CONFIG.LOCKOUT_DURATION
    );
    
    return recentAttempts.length >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS;
  };
  
  // Obtenir le temps restant de verrouillage
  const getLockoutTimeRemaining = (email: string): number => {
    const now = Date.now();
    const recentFailedAttempts = loginAttempts
      .filter(attempt => attempt.email === email && !attempt.success)
      .sort((a, b) => b.timestamp - a.timestamp);
    
    if (recentFailedAttempts.length >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
      const lastAttempt = recentFailedAttempts[0];
      const lockoutEnd = lastAttempt.timestamp + SECURITY_CONFIG.LOCKOUT_DURATION;
      return Math.max(0, lockoutEnd - now);
    }
    
    return 0;
  };
  
  // Obtenir les permissions pour un rôle
  const getPermissionsForRole = (role: UserRole): UserPermissions => {
    return ROLE_PERMISSIONS[role];
  };
  
  // Vérifier une permission spécifique
  const hasPermission = (userRole: UserRole, permission: keyof UserPermissions): boolean => {
    const permissions = getPermissionsForRole(userRole);
    return permissions[permission];
  };
  
  // Nettoyer les anciennes données
  const cleanupOldData = async () => {
    const now = Date.now();
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
    
    // Nettoyer les anciennes tentatives de connexion
    const recentAttempts = loginAttempts.filter(attempt => attempt.timestamp > oneWeekAgo);
    setLoginAttempts(recentAttempts);
    await AsyncStorage.setItem('loginAttempts', JSON.stringify(recentAttempts));
    
    // Nettoyer les anciens logs
    const recentLogs = securityLogs.filter(log => log.timestamp > oneWeekAgo);
    setSecurityLogs(recentLogs);
    await AsyncStorage.setItem('securityLogs', JSON.stringify(recentLogs));
    
    // Nettoyer les sessions expirées
    const activeSessionsFiltered = activeSessions.filter(session => session.expiresAt > now && session.isActive);
    setActiveSessions(activeSessionsFiltered);
    await AsyncStorage.setItem('activeSessions', JSON.stringify(activeSessionsFiltered));
  };
  
  // Nettoyer automatiquement les anciennes données au démarrage
  useEffect(() => {
    cleanupOldData();
  }, []);
  
  return {
    // Données
    loginAttempts,
    securityLogs,
    activeSessions,
    deviceId,
    
    // Fonctions de sécurité
    logLoginAttempt,
    logSecurityEvent,
    createSession,
    terminateSession,
    isUserLocked,
    getLockoutTimeRemaining,
    getPermissionsForRole,
    hasPermission,
    cleanupOldData,
    
    // Utilitaires
    SecurityUtils,
    SECURITY_CONFIG,
  };
});

// Hook pour vérifier les permissions
export const usePermissions = (userRole: UserRole) => {
  const { getPermissionsForRole, hasPermission } = useSecurity();
  
  const permissions = getPermissionsForRole(userRole);
  
  return {
    permissions,
    hasPermission: (permission: keyof UserPermissions) => hasPermission(userRole, permission),
    canViewStudents: permissions.canViewStudents,
    canEditStudents: permissions.canEditStudents,
    canViewGrades: permissions.canViewGrades,
    canEditGrades: permissions.canEditGrades,
    canViewAttendance: permissions.canViewAttendance,
    canEditAttendance: permissions.canEditAttendance,
    canViewMessages: permissions.canViewMessages,
    canSendMessages: permissions.canSendMessages,
    canManageSchool: permissions.canManageSchool,
    canManageUsers: permissions.canManageUsers,
    canViewReports: permissions.canViewReports,
    canExportData: permissions.canExportData,
  };
};

export default SecurityContext;