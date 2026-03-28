import React from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, APP_CONFIG } from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';
import Avatar from '@/components/Avatar';
import Card from '@/components/Card';
import { User, Mail, School, BookOpen, Phone, Globe, Settings, Shield, Bell, LogOut, Edit3, Star } from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnexion', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)' as any);
          }
        },
      ]
    );
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'admin':
        return 'Administrateur';
      case 'schoolAdmin':
        return 'Administrateur d\'école';
      case 'teacher':
        return 'Professeur';
      case 'parent':
        return 'Parent';
      default:
        return 'Utilisateur';
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={GRADIENTS.primary as any} style={styles.headerGradient}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Avatar 
              source={user?.avatar} 
              name={user?.name} 
              size={120} 
            />
            <LinearGradient
              colors={GRADIENTS.secondary as any}
              style={styles.roleIndicator}
            >
              <Star size={16} color={COLORS.white} />
            </LinearGradient>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <View style={styles.roleContainer}>
            <Text style={styles.role}>{getRoleLabel()}</Text>
          </View>
          <Text style={styles.slogan}>{APP_CONFIG.slogan}</Text>
        </View>
      </LinearGradient>
      
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        <Card title="Informations du compte" variant="elevated" headerGradient>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <LinearGradient colors={GRADIENTS.info as any} style={styles.infoIcon}>
                <User size={20} color={COLORS.white} />
              </LinearGradient>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nom complet</Text>
                <Text style={styles.infoValue}>{user?.name}</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <LinearGradient colors={GRADIENTS.warm as any} style={styles.infoIcon}>
                <Mail size={20} color={COLORS.white} />
              </LinearGradient>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Adresse email</Text>
                <Text style={styles.infoValue}>{user?.email}</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <LinearGradient colors={GRADIENTS.success as any} style={styles.infoIcon}>
                <Phone size={20} color={COLORS.white} />
              </LinearGradient>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Téléphone</Text>
                <Text style={styles.infoValue}>{user?.phone || 'Non renseigné'}</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <LinearGradient colors={GRADIENTS.primarySimple as any} style={styles.infoIcon}>
                <Globe size={20} color={COLORS.white} />
              </LinearGradient>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Pays</Text>
                <Text style={styles.infoValue}>{user?.country || 'Non renseigné'}</Text>
              </View>
            </View>
            
            {user?.role === 'schoolAdmin' && user?.schoolId && (
              <View style={styles.infoItem}>
                <LinearGradient colors={GRADIENTS.secondary as any} style={styles.infoIcon}>
                  <School size={20} color={COLORS.white} />
                </LinearGradient>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Établissement</Text>
                  <Text style={styles.infoValue}>École Centrale</Text>
                </View>
              </View>
            )}
            
            {user?.role === 'teacher' && (
              <View style={styles.infoItem}>
                <LinearGradient colors={GRADIENTS.info as any} style={styles.infoIcon}>
                  <BookOpen size={20} color={COLORS.white} />
                </LinearGradient>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Classes assignées</Text>
                  <Text style={styles.infoValue}>3 Classes actives</Text>
                </View>
              </View>
            )}
          </View>
        </Card>

        <Card title="Actions rapides" variant="elevated">
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => router.push('/edit-profile')}
            >
              <LinearGradient colors={GRADIENTS.info as any} style={styles.quickActionIcon}>
                <Edit3 size={24} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.quickActionText}>Modifier le profil</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => router.push('/security-dashboard')}
            >
              <LinearGradient colors={GRADIENTS.warm as any} style={styles.quickActionIcon}>
                <Shield size={24} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.quickActionText}>Sécurité</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => router.push('/notifications')}
            >
              <LinearGradient colors={GRADIENTS.success as any} style={styles.quickActionIcon}>
                <Bell size={24} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.quickActionText}>Notifications</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => router.push('/settings')}
            >
              <LinearGradient colors={GRADIENTS.secondary as any} style={styles.quickActionIcon}>
                <Settings size={24} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.quickActionText}>Paramètres</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <TouchableOpacity style={styles.logoutContainer} onPress={handleLogout}>
          <LinearGradient
            colors={['#FF6B6B', '#FF5252']}
            style={styles.logoutButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <LogOut size={20} color={COLORS.white} />
            <Text style={styles.logoutButtonText}>Se déconnecter</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 8,
  },
  header: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  roleIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  roleContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  role: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '600',
  },
  slogan: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontStyle: 'italic',
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  // Styles pour la grille d'informations
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
  },
  // Styles pour les actions rapides
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  quickActionItem: {
    alignItems: 'center',
    width: '22%',
    minWidth: 70,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
  // Styles pour le bouton de déconnexion
  logoutContainer: {
    marginTop: 24,
    marginBottom: 40,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});