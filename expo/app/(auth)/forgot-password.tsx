import React, { useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, APP_CONFIG } from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      setError('Veuillez saisir votre adresse email');
      return;
    }

    if (!email.includes('@')) {
      setError('Veuillez saisir une adresse email valide');
      return;
    }

    try {
      setError('');
      await resetPassword(email);
      setSuccess(true);
      
      // Show success alert
      Alert.alert(
        'Email envoyé !',
        'Un lien de réinitialisation a été envoyé à votre adresse email. Vérifiez votre boîte de réception.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec de l\'envoi du lien');
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF6B35', '#F7931E', '#FFD23F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.headerContainer}>
              <View style={styles.iconWrapper}>
                {success ? (
                  <CheckCircle size={60} color="#FFFFFF" />
                ) : (
                  <Mail size={60} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.title}>
                {success ? 'Email envoyé !' : 'Mot de passe oublié ?'}
              </Text>
              <Text style={styles.subtitle}>
                {success 
                  ? 'Vérifiez votre boîte de réception pour le lien de réinitialisation'
                  : 'Saisissez votre adresse email pour recevoir un lien de réinitialisation'
                }
              </Text>
              {!success && (
                <Text style={styles.slogan}>{APP_CONFIG.slogan}</Text>
              )}
            </View>

            {!success && (
              <View style={styles.formCard}>
                {error ? (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                <View style={styles.inputWrapper}>
                  <Mail size={20} color={COLORS.gray} style={styles.inputIcon} />
                  <Input
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Adresse email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                    testID="email-input"
                  />
                </View>

                <Button
                  title="Envoyer le lien"
                  onPress={handleResetPassword}
                  loading={loading}
                  style={styles.resetButton}
                  testID="reset-button"
                />

                <View style={styles.infoContainer}>
                  <Text style={styles.infoText}>
                    Vous recevrez un email avec un lien pour créer un nouveau mot de passe.
                  </Text>
                </View>
              </View>
            )}

            {success && (
              <View style={styles.successCard}>
                <Button
                  title="Retour à la connexion"
                  onPress={handleGoBack}
                  style={styles.backToLoginButton}
                  testID="back-to-login-button"
                />
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 80,
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500' as const,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  slogan: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '600' as const,
    fontStyle: 'italic',
    marginTop: 12,
    paddingHorizontal: 20,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  errorContainer: {
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: '500' as const,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 24,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
  },
  resetButton: {
    marginBottom: 20,
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 16,
  },
  backToLoginButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 16,
  },
  infoContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
});