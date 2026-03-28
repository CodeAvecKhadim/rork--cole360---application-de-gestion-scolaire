// Composant d'affichage des informations de sécurité utilisateur
// Montre les permissions, dernière connexion et options de sécurité
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '@/hooks/auth-store';
import { useSecurity } from '@/hooks/security-store';
import { COLORS } from '@/constants/colors';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { PermissionBadge, ConditionalRender } from '@/components/ProtectedRoute';
import { 
  Shield, 
  Clock, 
  Smartphone, 
  Key, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings
} from 'lucide-react-native';

interface SecurityInfoProps {
  showAdvanced?: boolean;
}

export default function SecurityInfo({ showAdvanced = false }: SecurityInfoProps) {
  const { user, changePassword } = useAuth();
  const { activeSessions, loginAttempts } = useSecurity();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return null;
  }

  // Obtenir les informations de sécurité
  const userSessions = activeSessions.filter(session => 
    session.userId === user.id && session.isActive
  );
  
  const recentAttempts = loginAttempts
    .filter(attempt => attempt.email === user.email)
    .slice(-5);

  const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;
  const passwordAge = Date.now() - user.lastPasswordChange;
  const passwordAgeDays = Math.floor(passwordAge / (24 * 60 * 60 * 1000));

  // Fonction pour changer le mot de passe
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erreur', 'Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    try {
      setLoading(true);
      await changePassword(currentPassword, newPassword);
      
      Alert.alert(
        'Succès',
        'Votre mot de passe a été changé avec succès',
        [{ text: 'OK', onPress: () => setShowPasswordForm(false) }]
      );
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Erreur', error instanceof Error ? error.message : 'Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  // Formatage des dates
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      {/* Statut de sécurité général */}
      <Card style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Shield size={24} color={COLORS.primary} />
          <Text style={styles.statusTitle}>Statut de sécurité</Text>
        </View>
        
        <View style={styles.statusGrid}>
          <View style={styles.statusItem}>
            {user.emailVerified ? (
              <CheckCircle size={16} color={COLORS.success} />
            ) : (
              <XCircle size={16} color={COLORS.danger} />
            )}
            <Text style={styles.statusText}>Email vérifié</Text>
          </View>
          
          <View style={styles.statusItem}>
            {user.phoneVerified ? (
              <CheckCircle size={16} color={COLORS.success} />
            ) : (
              <XCircle size={16} color={COLORS.danger} />
            )}
            <Text style={styles.statusText}>Téléphone vérifié</Text>
          </View>
          
          <View style={styles.statusItem}>
            {user.twoFactorEnabled ? (
              <CheckCircle size={16} color={COLORS.success} />
            ) : (
              <XCircle size={16} color={COLORS.warning} />
            )}
            <Text style={styles.statusText}>2FA activé</Text>
          </View>
        </View>
      </Card>

      {/* Informations de connexion */}
      <Card style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Clock size={20} color={COLORS.gray} />
          <Text style={styles.infoTitle}>Dernière connexion</Text>
        </View>
        <Text style={styles.infoValue}>
          {lastLogin ? formatDate(lastLogin.getTime()) : 'Jamais'}
        </Text>
      </Card>

      {/* Mot de passe */}
      <Card style={styles.passwordCard}>
        <View style={styles.passwordHeader}>
          <Key size={20} color={COLORS.gray} />
          <Text style={styles.passwordTitle}>Mot de passe</Text>
          {passwordAgeDays > 90 && (
            <AlertTriangle size={16} color={COLORS.warning} />
          )}
        </View>
        
        <Text style={styles.passwordAge}>
          Dernière modification : il y a {passwordAgeDays} jour{passwordAgeDays > 1 ? 's' : ''}
        </Text>
        
        {passwordAgeDays > 90 && (
          <Text style={styles.passwordWarning}>
            Recommandation : Changez votre mot de passe régulièrement
          </Text>
        )}
        
        <TouchableOpacity
          style={styles.changePasswordButton}
          onPress={() => setShowPasswordForm(!showPasswordForm)}
        >
          <Text style={styles.changePasswordText}>
            {showPasswordForm ? 'Annuler' : 'Changer le mot de passe'}
          </Text>
        </TouchableOpacity>

        {showPasswordForm && (
          <View style={styles.passwordForm}>
            <Text style={styles.formLabel}>Mot de passe actuel</Text>
            <Text style={styles.formInput}>{currentPassword}</Text>
            
            <Text style={styles.formLabel}>Nouveau mot de passe</Text>
            <Text style={styles.formInput}>{newPassword}</Text>
            
            <Text style={styles.formLabel}>Confirmer le nouveau mot de passe</Text>
            <Text style={styles.formInput}>{confirmPassword}</Text>
            
            <Button
              title="Changer le mot de passe"
              onPress={handlePasswordChange}
              loading={loading}
              style={styles.submitButton}
            />
          </View>
        )}
      </Card>

      {/* Sessions actives */}
      <Card style={styles.sessionsCard}>
        <View style={styles.sessionsHeader}>
          <Smartphone size={20} color={COLORS.gray} />
          <Text style={styles.sessionsTitle}>Sessions actives ({userSessions.length})</Text>
        </View>
        
        {userSessions.slice(0, 3).map((session) => (
          <View key={session.id} style={styles.sessionItem}>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionDevice}>{session.deviceName}</Text>
              <Text style={styles.sessionTime}>
                {formatDate(session.lastActivity)}
              </Text>
            </View>
            <Text style={styles.sessionStatus}>Active</Text>
          </View>
        ))}
        
        {userSessions.length > 3 && (
          <Text style={styles.moreSessionsText}>
            +{userSessions.length - 3} session{userSessions.length - 3 > 1 ? 's' : ''} de plus
          </Text>
        )}
      </Card>

      {/* Permissions utilisateur */}
      <Card style={styles.permissionsCard}>
        <View style={styles.permissionsHeader}>
          <Settings size={20} color={COLORS.gray} />
          <Text style={styles.permissionsTitle}>Permissions</Text>
        </View>
        
        <View style={styles.permissionsList}>
          <PermissionBadge permission="canViewStudents" label="Voir élèves" />
          <PermissionBadge permission="canEditStudents" label="Modifier élèves" />
          <PermissionBadge permission="canViewGrades" label="Voir notes" />
          <PermissionBadge permission="canEditGrades" label="Modifier notes" />
          <PermissionBadge permission="canViewMessages" label="Voir messages" />
          <PermissionBadge permission="canSendMessages" label="Envoyer messages" />
          
          <ConditionalRender allowedRoles={['admin', 'schoolAdmin']}>
            <PermissionBadge permission="canManageSchool" label="Gérer école" />
            <PermissionBadge permission="canManageUsers" label="Gérer utilisateurs" />
            <PermissionBadge permission="canExportData" label="Exporter données" />
          </ConditionalRender>
        </View>
      </Card>

      {/* Informations avancées pour les administrateurs */}
      <ConditionalRender allowedRoles={['admin', 'schoolAdmin']}>
        {showAdvanced && (
          <Card style={styles.advancedCard}>
            <View style={styles.advancedHeader}>
              <AlertTriangle size={20} color={COLORS.warning} />
              <Text style={styles.advancedTitle}>Informations avancées</Text>
            </View>
            
            <View style={styles.advancedInfo}>
              <Text style={styles.advancedLabel}>ID utilisateur :</Text>
              <Text style={styles.advancedValue}>{user.id}</Text>
            </View>
            
            <View style={styles.advancedInfo}>
              <Text style={styles.advancedLabel}>Rôle :</Text>
              <Text style={styles.advancedValue}>{user.role}</Text>
            </View>
            
            <View style={styles.advancedInfo}>
              <Text style={styles.advancedLabel}>Compte créé :</Text>
              <Text style={styles.advancedValue}>{formatDate(user.createdAt)}</Text>
            </View>
            
            <View style={styles.advancedInfo}>
              <Text style={styles.advancedLabel}>Dernière mise à jour :</Text>
              <Text style={styles.advancedValue}>{formatDate(user.updatedAt)}</Text>
            </View>
          </Card>
        )}
      </ConditionalRender>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  statusCard: {
    padding: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 14,
    color: COLORS.text,
  },
  infoCard: {
    padding: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.gray,
  },
  passwordCard: {
    padding: 16,
  },
  passwordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  passwordTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text,
    flex: 1,
  },
  passwordAge: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  passwordWarning: {
    fontSize: 12,
    color: COLORS.warning,
    marginBottom: 12,
  },
  changePasswordButton: {
    paddingVertical: 8,
  },
  changePasswordText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600' as const,
  },
  passwordForm: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: COLORS.text,
    marginBottom: 4,
    marginTop: 12,
  },
  formInput: {
    fontSize: 14,
    color: COLORS.gray,
    padding: 12,
    backgroundColor: COLORS.light,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  submitButton: {
    marginTop: 16,
  },
  sessionsCard: {
    padding: 16,
  },
  sessionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sessionsTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionDevice: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: COLORS.text,
  },
  sessionTime: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  sessionStatus: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '600' as const,
  },
  moreSessionsText: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 8,
  },
  permissionsCard: {
    padding: 16,
  },
  permissionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  permissionsTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  permissionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  advancedCard: {
    padding: 16,
    backgroundColor: COLORS.light,
  },
  advancedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  advancedTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  advancedInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  advancedLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  advancedValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500' as const,
  },
});