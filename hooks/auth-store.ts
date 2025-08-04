import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState } from 'react';
import { User, UserRole } from '@/types/auth';

// Authentification de démonstration pour École-360
const mockUsers = [
  {
    id: '1',
    email: 'admin@ecole-360.com',
    password: 'password',
    name: 'Administrateur Principal',
    role: 'admin' as UserRole,
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop',
    country: 'Sénégal',
    countryCode: 'SN',
    phone: '+221771234567',
    createdAt: Date.now(),
  },
  {
    id: '2',
    email: 'school@ecole-360.com',
    password: 'password',
    name: 'Directeur d\'École',
    role: 'schoolAdmin' as UserRole,
    schoolId: '1',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    country: 'Sénégal',
    countryCode: 'SN',
    phone: '+221771234568',
    createdAt: Date.now(),
  },
  {
    id: '3',
    email: 'teacher@ecole-360.com',
    password: 'password',
    name: 'Marie Dubois',
    role: 'teacher' as UserRole,
    schoolId: '1',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    country: 'France',
    countryCode: 'FR',
    phone: '+33612345678',
    createdAt: Date.now(),
  },
  {
    id: '4',
    email: 'parent@ecole-360.com',
    password: 'password',
    name: 'Jean Martin',
    role: 'parent' as UserRole,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    country: 'Côte d\'Ivoire',
    countryCode: 'CI',
    phone: '+2250712345678',
    createdAt: Date.now(),
  },
];

export const [AuthContext, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Failed to load user from storage', err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Email ou mot de passe incorrect');
      }
      
      // Remove password before storing
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Store user data
      await AsyncStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      // Store remember me preference
      if (rememberMe) {
        await AsyncStorage.setItem('rememberMe', 'true');
        await AsyncStorage.setItem('userEmail', email);
      } else {
        await AsyncStorage.removeItem('rememberMe');
        await AsyncStorage.removeItem('userEmail');
      }
      
      setUser(userWithoutPassword);
      
      return userWithoutPassword;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la connexion');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData: {
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
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if user already exists
      const existingUser = mockUsers.find(
        u => u.email.toLowerCase() === formData.email.toLowerCase()
      );
      
      if (existingUser) {
        throw new Error('Un compte avec cette adresse email existe déjà');
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role,
        avatar: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?q=80&w=200&auto=format&fit=crop`,
        schoolId: formData.role === 'schoolAdmin' ? Date.now().toString() : undefined,
        country: formData.country,
        countryCode: formData.countryCode,
        phone: formData.phone,
        createdAt: Date.now(),
      };
      
      // Add to mock users (in real app, this would be sent to server)
      mockUsers.push(newUser);
      
      console.log('Nouveau compte créé:', { ...newUser, password: '[HIDDEN]' });
      
      return newUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'inscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
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
  };

  const logout = async () => {
    try {
      setLoading(true);
      await AsyncStorage.removeItem('user');
      
      // Check if user wants to be remembered
      const rememberMe = await AsyncStorage.getItem('rememberMe');
      if (!rememberMe) {
        await AsyncStorage.removeItem('userEmail');
      }
      
      setUser(null);
    } catch (err) {
      console.error('Failed to logout', err);
    } finally {
      setLoading(false);
    }
  };

  const getRememberedEmail = async () => {
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
  };

  return {
    user,
    loading,
    error,
    login,
    signup,
    resetPassword,
    logout,
    getRememberedEmail,
    isAuthenticated: !!user,
  };
});