import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { User, UserRole, UserPermissions } from '@/types/auth';
import { useSecurity } from '@/hooks/security-store';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/libs/firebase';
import { authService } from '@/services/auth';

// Fonction pour générer les permissions par défaut selon le rôle
const getDefaultPermissions = (role: UserRole): UserPermissions => {
  const basePermissions = {
    canViewStudents: false,
    canEditStudents: false,
    canViewGrades: false,
    canEditGrades: false,
    canViewAttendance: false,
    canEditAttendance: false,
    canViewMessages: false,
    canSendMessages: false,
    canManageSchool: false,
    canManageUsers: false,
    canViewReports: false,
    canExportData: false,
  };

  switch (role) {
    case 'admin':
      return {
        ...basePermissions,
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
      };
    case 'schoolAdmin':
      return {
        ...basePermissions,
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
      };
    case 'teacher':
      return {
        ...basePermissions,
        canViewStudents: true,
        canViewGrades: true,
        canEditGrades: true,
        canViewAttendance: true,
        canEditAttendance: true,
        canViewMessages: true,
        canSendMessages: true,
        canViewReports: true,
      };
    case 'parent':
      return {
        ...basePermissions,
        canViewStudents: true,
        canViewGrades: true,
        canViewAttendance: true,
        canViewMessages: true,
        canSendMessages: true,
      };
    default:
      return basePermissions;
  }
};

// Authentification de démonstration pour École-360 avec sécurité renforcée
const mockUsers = [
  {
    id: '1',
    email: 'admin@ecole-360.com',
    password: 'AdminSecure123!',
    name: 'Administrateur Principal',
    role: 'admin' as UserRole,
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop',
    country: 'Sénégal',
    countryCode: 'SN',
    phone: '+221771234567',
    permissions: getDefaultPermissions('admin'),
    isActive: true,
    emailVerified: true,
    phoneVerified: true,
    twoFactorEnabled: false,
    lastPasswordChange: Date.now(),
    failedLoginAttempts: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '2',
    email: 'school@ecole-360.com',
    password: 'SchoolAdmin123!',
    name: 'Directeur d\'École',
    role: 'schoolAdmin' as UserRole,
    schoolId: '1',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    country: 'Sénégal',
    countryCode: 'SN',
    phone: '+221771234568',
    permissions: getDefaultPermissions('schoolAdmin'),
    isActive: true,
    emailVerified: true,
    phoneVerified: true,
    twoFactorEnabled: false,
    lastPasswordChange: Date.now(),
    failedLoginAttempts: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '3',
    email: 'teacher@ecole-360.com',
    password: 'Teacher123!',
    name: 'Marie Dubois',
    role: 'teacher' as UserRole,
    schoolId: '1',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    country: 'France',
    countryCode: 'FR',
    phone: '+33612345678',
    permissions: getDefaultPermissions('teacher'),
    isActive: true,
    emailVerified: true,
    phoneVerified: true,
    twoFactorEnabled: false,
    lastPasswordChange: Date.now(),
    failedLoginAttempts: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '4',
    email: 'parent@ecole-360.com',
    password: 'Parent123!',
    name: 'Jean Martin',
    role: 'parent' as UserRole,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    country: 'Côte d\'Ivoire',
    countryCode: 'CI',
    phone: '+2250712345678',
    permissions: getDefaultPermissions('parent'),
    isActive: true,
    emailVerified: true,
    phoneVerified: true,
    twoFactorEnabled: false,
    lastPasswordChange: Date.now(),
    failedLoginAttempts: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export const [AuthContext, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  
  // Utilisation du système de sécurité
  const {
    logLoginAttempt,
    logSecurityEvent,
    createSession,
    terminateSession,
    isUserLocked,
    getLockoutTimeRemaining,
    SecurityUtils,
  } = useSecurity();

  // Écouter les changements d'état d'authentification Firebase
  useEffect(() => {
    let isMounted = true;
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (!isMounted) return;
      
      try {
        if (firebaseUser) {
          console.log('Firebase user connecté:', firebaseUser.uid);
          
          // Récupérer le profil utilisateur depuis Firestore
          const userProfile = await authService.getUserProfile(firebaseUser.uid);
          
          if (userProfile && isMounted) {
            // Convertir le profil Firebase vers le format local
            const localUser: User = {
              id: userProfile.uid,
              email: userProfile.email,
              name: `${userProfile.prenom} ${userProfile.nom}`,
              role: userProfile.role === 'prof' ? 'teacher' : 
                    userProfile.role === 'admin' ? 'admin' : 'parent',
              avatar: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?q=80&w=200&auto=format&fit=crop`,
              country: 'Sénégal',
              countryCode: 'SN',
              phone: '+221771234567',
              permissions: getDefaultPermissions(
                userProfile.role === 'prof' ? 'teacher' : 
                userProfile.role === 'admin' ? 'admin' : 'parent'
              ),
              isActive: userProfile.is_active,
              emailVerified: firebaseUser.emailVerified,
              phoneVerified: false,
              twoFactorEnabled: false,
              lastPasswordChange: Date.now(),
              failedLoginAttempts: 0,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            };
            
            setUser(localUser);
            await AsyncStorage.setItem('user', JSON.stringify(localUser));
            
            // Créer une session locale
            const session = await createSession(localUser.id);
            if (isMounted) {
              setCurrentSession(session.id);
              await AsyncStorage.setItem('currentSession', session.id);
              
              await logSecurityEvent('FIREBASE_SESSION_RESTORED', 'authentication', localUser.id, true, {
                firebaseUid: firebaseUser.uid
              });
            }
          }
        } else {
          console.log('Firebase user déconnecté');
          if (isMounted) {
            // Nettoyer l'état local quand Firebase se déconnecte
            setUser(null);
            setCurrentSession(null);
            await AsyncStorage.multiRemove(['user', 'currentSession']);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la synchronisation Firebase:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [createSession, logSecurityEvent]);

  const login = useCallback(async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Vérifier si l'utilisateur est verrouillé
      if (isUserLocked(email)) {
        const timeRemaining = getLockoutTimeRemaining(email);
        const minutes = Math.ceil(timeRemaining / (60 * 1000));
        const errorMessage = `Compte temporairement verrouillé. Réessayez dans ${minutes} minute(s).`;
        
        await logLoginAttempt(email, false, 'ACCOUNT_LOCKED');
        throw new Error(errorMessage);
      }
      
      // Simulation d'un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(
        u => u.email.toLowerCase() === email.toLowerCase()
      );
      
      // Vérifier si l'utilisateur existe
      if (!foundUser) {
        await logLoginAttempt(email, false, 'USER_NOT_FOUND');
        throw new Error('Email ou mot de passe incorrect');
      }
      
      // Vérifier si le compte est actif
      if (!foundUser.isActive) {
        await logLoginAttempt(email, false, 'ACCOUNT_DISABLED');
        throw new Error('Compte désactivé. Contactez l\'administrateur.');
      }
      
      // Vérifier le mot de passe
      if (!SecurityUtils.verifyPassword(password, SecurityUtils.hashPassword(foundUser.password))) {
        await logLoginAttempt(email, false, 'INVALID_PASSWORD');
        throw new Error('Email ou mot de passe incorrect');
      }
      
      // Connexion réussie
      await logLoginAttempt(email, true);
      
      // Créer une session
      const session = await createSession(foundUser.id);
      setCurrentSession(session.id);
      
      // Supprimer le mot de passe avant de stocker
      const { password: _, ...userWithoutPassword } = {
        ...foundUser,
        lastLogin: Date.now(),
        failedLoginAttempts: 0,
        updatedAt: Date.now(),
      };
      
      // Stocker les données utilisateur
      await AsyncStorage.setItem('user', JSON.stringify(userWithoutPassword));
      await AsyncStorage.setItem('currentSession', session.id);
      
      // Gérer l'option "Rester connecté"
      if (rememberMe) {
        await AsyncStorage.setItem('rememberMe', 'true');
        await AsyncStorage.setItem('userEmail', email);
      } else {
        await AsyncStorage.removeItem('rememberMe');
        await AsyncStorage.removeItem('userEmail');
      }
      
      // Enregistrer l'événement de sécurité
      await logSecurityEvent('USER_LOGIN', 'authentication', foundUser.id, true, {
        sessionId: session.id,
        rememberMe
      });
      
      setUser(userWithoutPassword);
      
      console.log('Connexion réussie pour:', {
        userId: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
        sessionId: session.id
      });
      
      return userWithoutPassword;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors de la connexion';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isUserLocked, getLockoutTimeRemaining, logLoginAttempt, createSession, logSecurityEvent, SecurityUtils]);

  const signup = useCallback(async (formData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    schoolName?: string;
    country: string;
    countryCode: string;
    phone: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      // Valider le mot de passe
      const passwordValidation = SecurityUtils.validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors.join('\n'));
      }
      
      // Simulation d'un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Vérifier si l'utilisateur existe déjà
      const existingUser = mockUsers.find(
        u => u.email.toLowerCase() === formData.email.toLowerCase()
      );
      
      if (existingUser) {
        await logSecurityEvent('SIGNUP_ATTEMPT', 'authentication', undefined, false, {
          email: formData.email,
          reason: 'EMAIL_ALREADY_EXISTS'
        });
        throw new Error('Un compte avec cette adresse email existe déjà');
      }
      
      // Créer un nouvel utilisateur avec sécurité renforcée
      const newUser = {
        id: Date.now().toString(),
        email: formData.email,
        password: formData.password, // En production, ceci serait haché côté serveur
        name: formData.name,
        role: formData.role,
        avatar: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?q=80&w=200&auto=format&fit=crop`,
        schoolId: formData.role === 'schoolAdmin' ? Date.now().toString() : undefined,
        country: formData.country,
        countryCode: formData.countryCode,
        phone: formData.phone,
        permissions: getDefaultPermissions(formData.role),
        isActive: true,
        emailVerified: false, // Nécessite une vérification email
        phoneVerified: false, // Nécessite une vérification SMS
        twoFactorEnabled: false,
        lastPasswordChange: Date.now(),
        failedLoginAttempts: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      // Ajouter aux utilisateurs fictifs (en production, envoyé au serveur)
      mockUsers.push(newUser);
      
      // Enregistrer l'événement de sécurité
      await logSecurityEvent('USER_SIGNUP', 'authentication', newUser.id, true, {
        role: formData.role,
        country: formData.country,
        hasSchool: !!formData.schoolName
      });
      
      console.log('Nouveau compte créé avec sécurité renforcée:', {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        permissions: newUser.permissions,
        securityFeatures: {
          emailVerified: newUser.emailVerified,
          phoneVerified: newUser.phoneVerified,
          twoFactorEnabled: newUser.twoFactorEnabled
        }
      });
      
      return newUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'inscription';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [SecurityUtils, logSecurityEvent]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if user exists
      const foundUser = mockUsers.find(
        u => u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (!foundUser) {
        throw new Error('Aucun compte trouvé avec cette adresse email');
      }
      
      // In real app, this would send an email
      console.log('Lien de réinitialisation envoyé à:', email);
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'envoi du lien');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      
      // Terminer la session active
      if (currentSession && user) {
        await terminateSession(currentSession, user.id);
        await logSecurityEvent('USER_LOGOUT', 'authentication', user.id, true, {
          sessionId: currentSession
        });
      }
      
      // Déconnexion Firebase
      await authService.signOut();
      
      // Supprimer les données utilisateur locales
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('currentSession');
      
      // Vérifier si l'utilisateur veut être mémorisé
      const rememberMe = await AsyncStorage.getItem('rememberMe');
      if (!rememberMe) {
        await AsyncStorage.removeItem('userEmail');
      }
      
      setUser(null);
      setCurrentSession(null);
      
      console.log('Déconnexion Firebase et locale réussie');
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    } finally {
      setLoading(false);
    }
  }, [currentSession, user, terminateSession, logSecurityEvent]);

  const getRememberedEmail = useCallback(async () => {
    try {
      const rememberMe = await AsyncStorage.getItem('rememberMe');
      if (rememberMe === 'true') {
        return await AsyncStorage.getItem('userEmail');
      }
      return null;
    } catch (err) {
      console.error('Failed to get remembered email', err);
      return null;
    }
  }, []);

  // Vérifier la validité de la session au chargement
  useEffect(() => {
    const validateSession = async () => {
      try {
        const storedSession = await AsyncStorage.getItem('currentSession');
        if (storedSession && user && !currentSession) {
          setCurrentSession(storedSession);
          
          // En production, vous vérifieriez la validité de la session côté serveur
          await logSecurityEvent('SESSION_VALIDATED', 'authentication', user.id, true, {
            sessionId: storedSession
          });
        }
      } catch (error) {
        console.error('Erreur lors de la validation de session:', error);
      }
    };
    
    if (user && !loading && !currentSession) {
      validateSession();
    }
  }, [user?.id, loading, currentSession, logSecurityEvent, user]);
  
  // Fonction pour changer le mot de passe
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Valider le nouveau mot de passe
      const passwordValidation = SecurityUtils.validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors.join('\n'));
      }
      
      // Vérifier le mot de passe actuel
      const foundUser = mockUsers.find(u => u.id === user.id);
      if (!foundUser || !SecurityUtils.verifyPassword(currentPassword, SecurityUtils.hashPassword(foundUser.password))) {
        await logSecurityEvent('PASSWORD_CHANGE_ATTEMPT', 'authentication', user.id, false, {
          reason: 'INVALID_CURRENT_PASSWORD'
        });
        throw new Error('Mot de passe actuel incorrect');
      }
      
      // Mettre à jour le mot de passe
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = {
          ...mockUsers[userIndex],
          password: newPassword,
          lastPasswordChange: Date.now(),
          updatedAt: Date.now(),
        };
      }
      
      await logSecurityEvent('PASSWORD_CHANGED', 'authentication', user.id, true);
      
      console.log('Mot de passe changé avec succès pour l\'utilisateur:', user.id);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du changement de mot de passe';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, SecurityUtils, logSecurityEvent]);
  
  return useMemo(() => ({
    // États
    user,
    loading,
    error,
    currentSession,
    
    // Fonctions d'authentification
    login,
    signup,
    resetPassword,
    logout,
    changePassword,
    getRememberedEmail,
    
    // Utilitaires
    isAuthenticated: !!user,
    hasPermission: (permission: keyof UserPermissions) => {
      return user?.permissions[permission] || false;
    },
    getUserRole: () => user?.role,
    getUserPermissions: () => user?.permissions,
  }), [user, loading, error, currentSession, login, signup, resetPassword, logout, changePassword, getRememberedEmail]);
});