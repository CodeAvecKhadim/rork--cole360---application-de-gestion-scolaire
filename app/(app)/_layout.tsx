import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/hooks/auth-store';
import { SubscriptionProvider } from '@/hooks/subscription-store';

export default function AppLayout() {
  const { isAuthenticated, loading } = useAuth();

  // Attendre que l'authentification soit chargée
  if (loading) {
    return null;
  }

  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <SubscriptionProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="profile" options={{ headerShown: true, title: 'Profil' }} />
        <Stack.Screen name="notifications" options={{ headerShown: true, title: 'Notifications' }} />
        <Stack.Screen name="messages" options={{ headerShown: true, title: 'Messages' }} />
        <Stack.Screen name="conversation/[id]" options={{ headerShown: true, title: 'Conversation' }} />
        <Stack.Screen name="class/[id]" options={{ headerShown: true, title: 'Détails de la classe' }} />
        <Stack.Screen name="student/[id]" options={{ headerShown: true, title: 'Détails de l\'élève' }} />
        <Stack.Screen name="school/[id]" options={{ headerShown: true, title: 'Détails de l\'école' }} />
        <Stack.Screen name="bulletin/[studentId]" options={{ headerShown: true, title: 'Bulletin de l\'élève' }} />
        <Stack.Screen name="security-dashboard" options={{ headerShown: true, title: 'Sécurité' }} />
        <Stack.Screen name="subscription" options={{ headerShown: false }} />
        <Stack.Screen name="payment" options={{ headerShown: false }} />
        <Stack.Screen name="manage-schools" options={{ headerShown: true, title: 'Gérer les écoles' }} />
      </Stack>
    </SubscriptionProvider>
  );
}