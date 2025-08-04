import React from 'react';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, APP_CONFIG } from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';
import Avatar from '@/components/Avatar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { User, Mail, School, BookOpen, Phone, Globe } from 'lucide-react-native';

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
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Avatar 
          source={user?.avatar} 
          name={user?.name} 
          size={100} 
        />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.role}>{getRoleLabel()}</Text>
        <Text style={styles.slogan}>{APP_CONFIG.slogan}</Text>
      </View>

      <Card title="Informations du compte">
        <View style={styles.infoItem}>
          <User size={20} color={COLORS.gray} />
          <Text style={styles.infoLabel}>Nom :</Text>
          <Text style={styles.infoValue}>{user?.name}</Text>
        </View>
        <View style={styles.infoItem}>
          <Mail size={20} color={COLORS.gray} />
          <Text style={styles.infoLabel}>Email :</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>
        <View style={styles.infoItem}>
          <Phone size={20} color={COLORS.gray} />
          <Text style={styles.infoLabel}>Téléphone :</Text>
          <Text style={styles.infoValue}>{user?.phone}</Text>
        </View>
        <View style={styles.infoItem}>
          <Globe size={20} color={COLORS.gray} />
          <Text style={styles.infoLabel}>Pays :</Text>
          <Text style={styles.infoValue}>{user?.country}</Text>
        </View>
        {user?.role === 'schoolAdmin' && user?.schoolId && (
          <View style={styles.infoItem}>
            <School size={20} color={COLORS.gray} />
            <Text style={styles.infoLabel}>École :</Text>
            <Text style={styles.infoValue}>École Centrale</Text>
          </View>
        )}
        {user?.role === 'teacher' && (
          <View style={styles.infoItem}>
            <BookOpen size={20} color={COLORS.gray} />
            <Text style={styles.infoLabel}>Classes :</Text>
            <Text style={styles.infoValue}>3 Classes</Text>
          </View>
        )}
      </Card>

      <Card title="Paramètres de l'application">
        <Button
          title="Changer le mot de passe"
          variant="outline"
          onPress={() => {}}
          style={styles.settingButton}
        />
        <Button
          title="Paramètres de notification"
          variant="outline"
          onPress={() => {}}
          style={styles.settingButton}
        />
      </Card>

      <Button
        title="Déconnexion"
        onPress={handleLogout}
        variant="secondary"
        style={styles.logoutButton}
        textStyle={styles.logoutButtonText}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginVertical: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 4,
  },
  slogan: {
    fontSize: 12,
    color: COLORS.primary,
    fontStyle: 'italic',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: 16,
    color: COLORS.gray,
    marginLeft: 12,
    width: 80,
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  settingButton: {
    marginVertical: 8,
  },
  logoutButton: {
    marginTop: 24,
    marginBottom: 40,
  },
  logoutButtonText: {
    fontWeight: '600',
  },
});