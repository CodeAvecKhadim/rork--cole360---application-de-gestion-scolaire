// Layout des onglets principaux - École-360
// Ce fichier définit la navigation par onglets avec des permissions basées sur les rôles
import { Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";
import { School, MessageSquare, MapPin, User, GraduationCap, Home, Users } from "lucide-react-native";
import { COLORS } from "@/constants/colors";
import { useAuth } from "@/hooks/auth-store";
import SubscriptionGuard from "@/components/SubscriptionGuard";

// Composant de layout pour la navigation par onglets
export default function TabLayout() {
  const { user } = useAuth();
  const role = user?.role; // Rôle de l'utilisateur connecté (admin, schoolAdmin, teacher, parent)

  return (
    <SubscriptionGuard>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: '#8B8B8B',
          headerShown: true,
          tabBarStyle: {
            backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.95)' : COLORS.white,
            borderTopWidth: 0,
            elevation: 25,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -6 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            height: Platform.OS === 'ios' ? 95 : 75,
            paddingBottom: Platform.OS === 'ios' ? 30 : 15,
            paddingTop: 12,
            paddingHorizontal: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '700',
            marginTop: 6,
            letterSpacing: 0.3,
          },
          tabBarIconStyle: {
            marginTop: 2,
          },
          tabBarItemStyle: {
            paddingVertical: 4,
            borderRadius: 12,
            marginHorizontal: 2,
          },
          tabBarActiveBackgroundColor: `${COLORS.primary}08`,
          headerStyle: {
            backgroundColor: COLORS.primary,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: COLORS.white,
          headerTitleStyle: {
            fontWeight: '800',
            fontSize: 19,
            letterSpacing: 0.5,
          },
        }}
      >
      {/* Onglet Tableau de bord - Visible pour tous les utilisateurs */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Tableau de bord",
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: focused ? `${COLORS.primary}15` : 'transparent',
            }}>
              <Home size={focused ? 22 : 20} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />

      {/* Onglet Écoles - Visible uniquement pour les administrateurs et directeurs d'école */}
      {(role === "admin" || role === "schoolAdmin") && (
        <Tabs.Screen
          name="schools"
          options={{
            title: "Écoles",
            tabBarIcon: ({ color, focused }) => (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: focused ? `${COLORS.primary}15` : 'transparent',
              }}>
                <School size={focused ? 22 : 20} color={color} strokeWidth={focused ? 2.5 : 2} />
              </View>
            ),
          }}
        />
      )}

      {/* Onglet Classes - Visible pour les enseignants et directeurs d'école */}
      {(role === "teacher" || role === "schoolAdmin") && (
        <Tabs.Screen
          name="classes"
          options={{
            title: "Classes",
            tabBarIcon: ({ color, focused }) => (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: focused ? `${COLORS.primary}15` : 'transparent',
              }}>
                <Users size={focused ? 22 : 20} color={color} strokeWidth={focused ? 2.5 : 2} />
              </View>
            ),
          }}
        />
      )}

      {/* Onglet Élèves - Visible uniquement pour les parents */}
      {role === "parent" && (
        <Tabs.Screen
          name="students"
          options={{
            title: "Mes Enfants",
            tabBarIcon: ({ color, focused }) => (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: focused ? `${COLORS.primary}15` : 'transparent',
              }}>
                <GraduationCap size={focused ? 22 : 20} color={color} strokeWidth={focused ? 2.5 : 2} />
              </View>
            ),
          }}
        />
      )}

      {/* Onglet Localisation - Visible uniquement pour les parents */}
      {role === "parent" && (
        <Tabs.Screen
          name="location"
          options={{
            title: "Localisation",
            tabBarIcon: ({ color, focused }) => (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: focused ? `${COLORS.primary}15` : 'transparent',
              }}>
                <MapPin size={focused ? 22 : 20} color={color} strokeWidth={focused ? 2.5 : 2} />
              </View>
            ),
          }}
        />
      )}

      {/* Onglet Messages - Visible pour tous les utilisateurs */}
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: focused ? `${COLORS.primary}15` : 'transparent',
            }}>
              <MessageSquare size={focused ? 22 : 20} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />

      {/* Onglet Profil - Visible pour tous les utilisateurs */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: focused ? `${COLORS.primary}15` : 'transparent',
            }}>
              <User size={focused ? 22 : 20} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      </Tabs>
    </SubscriptionGuard>
  );
}