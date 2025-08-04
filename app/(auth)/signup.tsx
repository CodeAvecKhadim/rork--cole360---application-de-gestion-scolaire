import React, { useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, APP_CONFIG } from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';
import { UserRole } from '@/types/auth';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, School, Users, BookOpen, UserCheck } from 'lucide-react-native';

const roleOptions = [
  {
    value: 'parent' as UserRole,
    label: 'Parent',
    description: 'Suivre la scolarité de mes enfants',
    icon: User,
    color: '#4CAF50',
  },
  {
    value: 'teacher' as UserRole,
    label: 'Professeur',
    description: 'Gérer mes classes et élèves',
    icon: BookOpen,
    color: '#2196F3',
  },
  {
    value: 'schoolAdmin' as UserRole,
    label: 'Administrateur d\'école',
    description: 'Gérer mon établissement',
    icon: School,
    color: '#FF9800',
  },
];

export default function SignUpScreen() {
  const router = useRouter();
  const { signup, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'parent' as UserRole,
    schoolName: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Role selection, 2: Form

  const handleRoleSelect = (role: UserRole) => {
    setFormData(prev => ({ ...prev, role }));
    setStep(2);
  };

  const handleSignUp = async () => {
    // Validation
    if (!formData.name.trim()) {
      setError('Veuillez saisir votre nom complet');
      return;
    }

    if (!formData.email.trim()) {
      setError('Veuillez saisir votre adresse email');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Veuillez saisir une adresse email valide');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.role === 'schoolAdmin' && !formData.schoolName.trim()) {
      setError('Veuillez saisir le nom de votre école');
      return;
    }

    try {
      setError('');
      await signup(formData);
      
      Alert.alert(
        'Compte créé !',
        'Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.',
        [
          {
            text: 'Se connecter',
            onPress: () => router.replace('/(auth)'),
          },
        ]
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec de la création du compte');
    }
  };

  const handleGoBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      router.back();
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (step === 1) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#FF6B35', '#F7931E', '#FFD23F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.headerContainer}>
              <View style={styles.iconWrapper}>
                <Users size={60} color="#FFFFFF" />
              </View>
              <Text style={styles.title}>Créer un compte</Text>
              <Text style={styles.subtitle}>
                Choisissez votre rôle pour commencer
              </Text>
              <Text style={styles.slogan}>{APP_CONFIG.slogan}</Text>
            </View>

            <View style={styles.roleContainer}>
              {roleOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[styles.roleCard, formData.role === option.value && styles.selectedRoleCard]}
                    onPress={() => handleRoleSelect(option.value)}
                  >
                    <View style={[styles.roleIcon, { backgroundColor: option.color }]}>
                      <IconComponent size={32} color="#FFFFFF" />
                    </View>
                    <View style={styles.roleContent}>
                      <Text style={styles.roleLabel}>{option.label}</Text>
                      <Text style={styles.roleDescription}>{option.description}</Text>
                    </View>
                    <View style={[styles.roleSelector, formData.role === option.value && styles.selectedRoleSelector]}>
                      {formData.role === option.value && <UserCheck size={20} color="#FFFFFF" />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }

  const selectedRole = roleOptions.find(r => r.value === formData.role);

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
              <View style={[styles.iconWrapper, { backgroundColor: selectedRole?.color + '40' }]}>
                {selectedRole && <selectedRole.icon size={60} color="#FFFFFF" />}
              </View>
              <Text style={styles.title}>Inscription</Text>
              <Text style={styles.subtitle}>
                Compte {selectedRole?.label}
              </Text>
              <Text style={styles.slogan}>{APP_CONFIG.slogan}</Text>
            </View>

            <View style={styles.formCard}>
              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <User size={20} color={COLORS.gray} style={styles.inputIcon} />
                  <Input
                    value={formData.name}
                    onChangeText={(value) => updateFormData('name', value)}
                    placeholder="Nom complet"
                    autoCapitalize="words"
                    style={styles.input}
                    testID="name-input"
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <Mail size={20} color={COLORS.gray} style={styles.inputIcon} />
                  <Input
                    value={formData.email}
                    onChangeText={(value) => updateFormData('email', value)}
                    placeholder="Adresse email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                    testID="email-input"
                  />
                </View>

                {formData.role === 'schoolAdmin' && (
                  <View style={styles.inputWrapper}>
                    <School size={20} color={COLORS.gray} style={styles.inputIcon} />
                    <Input
                      value={formData.schoolName}
                      onChangeText={(value) => updateFormData('schoolName', value)}
                      placeholder="Nom de l'école"
                      autoCapitalize="words"
                      style={styles.input}
                      testID="school-name-input"
                    />
                  </View>
                )}

                <View style={styles.inputWrapper}>
                  <Lock size={20} color={COLORS.gray} style={styles.inputIcon} />
                  <Input
                    value={formData.password}
                    onChangeText={(value) => updateFormData('password', value)}
                    placeholder="Mot de passe"
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    testID="password-input"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color={COLORS.gray} />
                    ) : (
                      <Eye size={20} color={COLORS.gray} />
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.inputWrapper}>
                  <Lock size={20} color={COLORS.gray} style={styles.inputIcon} />
                  <Input
                    value={formData.confirmPassword}
                    onChangeText={(value) => updateFormData('confirmPassword', value)}
                    placeholder="Confirmer le mot de passe"
                    secureTextEntry={!showConfirmPassword}
                    style={styles.input}
                    testID="confirm-password-input"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color={COLORS.gray} />
                    ) : (
                      <Eye size={20} color={COLORS.gray} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <Button
                title="Créer mon compte"
                onPress={handleSignUp}
                loading={loading}
                style={styles.signupButton}
                testID="signup-button"
              />

              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  En créant un compte, vous acceptez nos{' '}
                  <Text style={styles.termsLink}>Conditions d&apos;utilisation</Text>
                  {' '}et notre{' '}
                  <Text style={styles.termsLink}>Politique de confidentialité</Text>
                </Text>
              </View>

              <TouchableOpacity
                style={styles.loginLink}
                onPress={() => router.replace('/(auth)')}
              >
                <Text style={styles.loginLinkText}>
                  Déjà un compte ? <Text style={styles.loginLinkBold}>Se connecter</Text>
                </Text>
              </TouchableOpacity>
            </View>
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
    marginBottom: 8,
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
  },
  slogan: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '600' as const,
    fontStyle: 'italic',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  roleContainer: {
    gap: 16,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedRoleCard: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF8F5',
  },
  roleIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  roleContent: {
    flex: 1,
  },
  roleLabel: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: COLORS.text,
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  roleSelector: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRoleSelector: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
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
  inputContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 16,
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
  eyeIcon: {
    padding: 4,
  },
  signupButton: {
    marginBottom: 20,
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 16,
  },
  termsContainer: {
    marginBottom: 20,
  },
  termsText: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: '600' as const,
  },
  loginLink: {
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  loginLinkBold: {
    fontWeight: '600' as const,
    color: COLORS.primary,
  },
});