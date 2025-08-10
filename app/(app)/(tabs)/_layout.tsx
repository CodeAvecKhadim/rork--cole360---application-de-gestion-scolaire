// Layout des onglets principaux - École-360
// Ce fichier définit la navigation par onglets avec des permissions basées sur les rôles
import { Tabs } from "expo-router";
import React from "react";
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
        headerShown: true, // Afficher l'en-tête
        tabBarStyle: {
          backgroundColor: COLORS.white, // Couleur de fond de la barre d'onglets
          borderTopColor: COLORS.border, // Couleur de la bordure supérieure
        },
      }}
    >
      {/* Onglet Tableau de bord - Visible pour tous les utilisateurs */}
      <Tabs.Screen
        name="index"
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