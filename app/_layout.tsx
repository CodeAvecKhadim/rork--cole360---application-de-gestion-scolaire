// Layout principal de l'application École-360
// Ce fichier configure tous les providers et la navigation globale
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthContext } from "@/hooks/auth-store";
import { DataContext } from "@/hooks/data-store";

// Empêcher l'écran de démarrage de se cacher automatiquement
SplashScreen.preventAutoHideAsync();

// Configuration du client React Query pour la gestion des requêtes
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Nombre de tentatives en cas d'échec
      staleTime: 5 * 60 * 1000, // 5 minutes avant qu'une requête soit considérée comme obsolète
    },
  },
});

// Composant de navigation principal
function RootLayoutNav() {
  return (
    <Stack screenOptions={{ 
      headerBackTitle: "Retour", // Texte du bouton retour en français
      headerTitleStyle: { fontWeight: '600' }, // Style du titre
    }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}

// Composant racine de l'application avec tous les providers
export default function RootLayout() {
  useEffect(() => {
    // Cacher l'écran de démarrage une fois l'app chargée
    const hideSplashScreen = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (error) {
        console.warn('Erreur lors du masquage de l\'écran de démarrage:', error);
      }
    };
    
    hideSplashScreen();
  }, []);

  return (
    // Provider React Query (doit être le plus haut niveau)
    <QueryClientProvider client={queryClient}>
      {/* Provider d'authentification */}
      <AuthContext>
        {/* Provider de données */}
        <DataContext>
          {/* Provider pour les gestes (nécessaire pour certains composants) */}
          <GestureHandlerRootView style={{ flex: 1 }}>
            <RootLayoutNav />
          </GestureHandlerRootView>
        </DataContext>
      </AuthContext>
    </QueryClientProvider>
  );
}