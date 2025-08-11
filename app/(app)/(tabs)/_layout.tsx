// Layout des onglets principaux - École-360
// Ce fichier définit la navigation par onglets avec des permissions basées sur les rôles
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { Home, User, Book, School, MessageSquare, MapPin } from "lucide-react-native";
import { COLORS } from "@/constants/colors";
import { useAuth } from "@/hooks/auth-store";

// Composant de layout pour la navigation par onglets
export default function TabLayout() {
  const { user } = useAuth();
  const role = user?.role; // Rôle de l'utilisateur connecté (admin, schoolAdmin, teacher, parent)

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary, // Couleur de l'onglet actif
        tabBarInactiveTintColor: COLORS.gray, // Couleur de l'onglet inactif
        headerShown: true, // Afficher l'en-tête
        tabBarStyle: {
          backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.9)' : COLORS.white,
          borderTopWidth: 0, // Supprimer la bordure supérieure
          elevation: 20, // Ombre sur Android
          shadowColor: '#000', // Ombre sur iOS
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: COLORS.primary,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
      }}
    >
      {/* Onglet Tableau de bord - Visible pour tous les utilisateurs */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Tableau de bord",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />

      {/* Onglet Écoles - Visible uniquement pour les administrateurs et directeurs d'école */}
      {(role === "admin" || role === "schoolAdmin") && (
        <Tabs.Screen
          name="schools"
          options={{
            title: "Écoles",
            tabBarIcon: ({ color }) => <School size={24} color={color} />,
          }}
        />
      )}

      {/* Onglet Classes - Visible pour les enseignants et directeurs d'école */}
      {(role === "teacher" || role === "schoolAdmin") && (
        <Tabs.Screen
          name="classes"
          options={{
            title: "Classes",
            tabBarIcon: ({ color }) => <Book size={24} color={color} />,
          }}
        />
      )}

      {/* Onglet Élèves - Visible uniquement pour les parents */}
      {role === "parent" && (
        <Tabs.Screen
          name="students"
          options={{
            title: "Élèves",
            tabBarIcon: ({ color }) => <User size={24} color={color} />,
          }}
        />
      )}

      {/* Onglet Localisation - Visible uniquement pour les parents */}
      {role === "parent" && (
        <Tabs.Screen
          name="location"
          options={{
            title: "Localisation",
            tabBarIcon: ({ color }) => <MapPin size={24} color={color} />,
          }}
        />
      )}

      {/* Onglet Messages - Visible pour tous les utilisateurs */}
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color }) => <MessageSquare size={24} color={color} />,
        }}
      />

      {/* Onglet Profil - Visible pour tous les utilisateurs */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}