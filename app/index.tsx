import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/auth-store';

export default function RootIndex() {
  const { isAuthenticated, loading } = useAuth();

  // Attendre que l'authentification soit chargée
  if (loading) {
    return null;
  }

  // Rediriger vers l'app ou l'authentification selon l'état
  if (isAuthenticated) {
    return <Redirect href="/(app)/(tabs)/dashboard" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}