import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';
import Card from '@/components/Card';
import { 
  Settings, 
  Bell, 
  Shield, 
  Moon, 
  Globe, 
  Smartphone, 
  Mail, 
  Lock, 
  Eye, 
  Volume2,
  Vibrate,
  ArrowLeft,
  ChevronRight
} from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  // const { } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Changer le mot de passe',
      'Un email de réinitialisation va être envoyé à votre adresse.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Envoyer', onPress: () => {
          Alert.alert('Email envoyé', 'Vérifiez votre boîte de réception.');
        }}
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      'Cette action est irréversible. Toutes vos données seront perdues.',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Compte supprimé', 'Votre compte a été supprimé avec succès.');
          }
        }
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightElement, 
    variant = 'default' 
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    variant?: 'default' | 'danger';
  }) => (
    <TouchableOpacity 
      style={[
        styles.settingItem,
        variant === 'danger' && styles.settingItemDanger
      ]} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingItemLeft}>
        <View style={[
          styles.settingIcon,
          variant === 'danger' && styles.settingIconDanger
        ]}>
          {icon}
        </View>
        <View style={styles.settingContent}>
          <Text style={[
            styles.settingTitle,
            variant === 'danger' && styles.settingTitleDanger
          ]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.settingSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      {rightElement || (
        onPress && <ChevronRight size={20} color={COLORS.gray} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={GRADIENTS.primary as any} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <ArrowLeft size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètres</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        {/* Notifications */}
        <Card title="Notifications" variant="elevated" headerGradient>
          <View style={styles.settingsGroup}>
            <SettingItem
              icon={<Bell size={20} color={COLORS.primary} />}
              title="Notifications push"
              subtitle="Recevoir les notifications sur l'appareil"
              rightElement={
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
                  thumbColor={notifications ? COLORS.white : COLORS.gray}
                />
              }
            />
            
            <SettingItem
              icon={<Mail size={20} color={COLORS.primary} />}
              title="Notifications email"
              subtitle="Recevoir les notifications par email"
              rightElement={
                <Switch
                  value={emailNotifications}
                  onValueChange={setEmailNotifications}
                  trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
                  thumbColor={emailNotifications ? COLORS.white : COLORS.gray}
                />
              }
            />
            
            <SettingItem
              icon={<Volume2 size={20} color={COLORS.primary} />}
              title="Sons"
              subtitle="Activer les sons de notification"
              rightElement={
                <Switch
                  value={soundEnabled}
                  onValueChange={setSoundEnabled}
                  trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
                  thumbColor={soundEnabled ? COLORS.white : COLORS.gray}
                />
              }
            />
            
            <SettingItem
              icon={<Vibrate size={20} color={COLORS.primary} />}
              title="Vibrations"
              subtitle="Activer les vibrations"
              rightElement={
                <Switch
                  value={vibrationEnabled}
                  onValueChange={setVibrationEnabled}
                  trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
                  thumbColor={vibrationEnabled ? COLORS.white : COLORS.gray}
                />
              }
            />
          </View>
        </Card>

        {/* Apparence */}
        <Card title="Apparence" variant="elevated" headerGradient>
          <View style={styles.settingsGroup}>
            <SettingItem
              icon={<Moon size={20} color={COLORS.primary} />}
              title="Mode sombre"
              subtitle="Activer le thème sombre"
              rightElement={
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
                  thumbColor={darkMode ? COLORS.white : COLORS.gray}
                />
              }
            />
            
            <SettingItem
              icon={<Globe size={20} color={COLORS.primary} />}
              title="Langue"
              subtitle="Français"
              onPress={() => Alert.alert('Langue', 'Fonctionnalité bientôt disponible')}
            />
          </View>
        </Card>

        {/* Sécurité */}
        <Card title="Sécurité et confidentialité" variant="elevated" headerGradient>
          <View style={styles.settingsGroup}>
            <SettingItem
              icon={<Shield size={20} color={COLORS.primary} />}
              title="Tableau de bord sécurité"
              subtitle="Gérer la sécurité de votre compte"
              onPress={() => router.push('/security-dashboard')}
            />
            
            <SettingItem
              icon={<Eye size={20} color={COLORS.primary} />}
              title="Authentification biométrique"
              subtitle="Utiliser l'empreinte ou Face ID"
              rightElement={
                <Switch
                  value={biometricAuth}
                  onValueChange={setBiometricAuth}
                  trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
                  thumbColor={biometricAuth ? COLORS.white : COLORS.gray}
                />
              }
            />
            
            <SettingItem
              icon={<Lock size={20} color={COLORS.primary} />}
              title="Changer le mot de passe"
              subtitle="Modifier votre mot de passe actuel"
              onPress={handleChangePassword}
            />
          </View>
        </Card>

        {/* Compte */}
        <Card title="Compte" variant="elevated" headerGradient>
          <View style={styles.settingsGroup}>
            <SettingItem
              icon={<Smartphone size={20} color={COLORS.primary} />}
              title="Appareils connectés"
              subtitle="Gérer vos appareils"
              onPress={() => Alert.alert('Appareils', 'Fonctionnalité bientôt disponible')}
            />
            
            <SettingItem
              icon={<Settings size={20} color={COLORS.error} />}
              title="Supprimer le compte"
              subtitle="Supprimer définitivement votre compte"
              onPress={handleDeleteAccount}
              variant="danger"
            />
          </View>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>École-360 v1.0.0</Text>
          <Text style={styles.footerSubtext}>Développé avec ❤️ pour l&apos;éducation</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.white,
    textAlign: 'center',
    marginLeft: -40,
  },
  headerSpacer: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 8,
  },
  settingsGroup: {
    gap: 0,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  settingItemDanger: {
    backgroundColor: 'rgba(255, 107, 107, 0.05)',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingIconDanger: {
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  settingTitleDanger: {
    color: COLORS.error,
  },
  settingSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    marginTop: 16,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
  },
});