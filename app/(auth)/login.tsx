// Page de connexion et d'inscription - École-360
// Cette page permet aux utilisateurs de se connecter ou de créer un compte
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, APP_CONFIG } from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';
import { authService } from '@/services/auth';
import { testFirebaseConnection } from '@/libs/firebase';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Eye, EyeOff, Mail, Lock, Chrome } from 'lucide-react-native';

// Composant principal de l'écran de connexion
export default function LoginScreen() {
  const router = useRouter();
  const { login, loading, getRememberedEmail } = useAuth();
  
  // États locaux pour la gestion du formulaire
  const [email, setEmail] = useState(''); // Adresse email saisie
  const [password, setPassword] = useState(''); // Mot de passe saisi
  const [error, setError] = useState(''); // Message d'erreur à afficher
  const [showPassword, setShowPassword] = useState(false); // Affichage/masquage du mot de passe
  const [rememberMe, setRememberMe] = useState(false); // Option "Rester connecté"
  const [isLogin, setIsLogin] = useState(true); // Basculer entre connexion et inscription
  const [isCreatingDemoAccounts, setIsCreatingDemoAccounts] = useState(false); // État pour la création des comptes démo

  // Charger l'email mémorisé au démarrage de l'application
  useEffect(() => {
    const loadRememberedEmail = async () => {
      const rememberedEmail = await getRememberedEmail();
      if (rememberedEmail) {
        setEmail(rememberedEmail); // Pré-remplir le champ email
        setRememberMe(true); // Activer l'option "Rester connecté"
      }
    };
    loadRememberedEmail();
    
    // Test de connexion Firebase au démarrage
    const testConnection = async () => {
      const result = await testFirebaseConnection();
      console.log('🔍 Résultat du test Firebase:', result);
    };
    testConnection();
  }, [getRememberedEmail]);

  // Fonction pour créer les comptes de démonstration
  const handleCreateDemoAccounts = async () => {
    setIsCreatingDemoAccounts(true);
    setError('');
    
    try {
      console.log('Création des comptes de démonstration...');
      await authService.createDemoAccounts();
      setError('✅ Comptes de démonstration créés avec succès! Vous pouvez maintenant vous connecter.');
    } catch (err) {
      console.error('Erreur lors de la création des comptes démo:', err);
      setError('❌ Erreur lors de la création des comptes de démonstration');
    } finally {
      setIsCreatingDemoAccounts(false);
    }
  };

  // Fonction de gestion de la connexion
  const handleLogin = async () => {
    // Validation des champs obligatoires
    if (!email || !password) {
      setError('Veuillez saisir votre email et mot de passe');
      return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('❌ Format d\'email invalide');
      return;
    }

    try {
      setError(''); // Réinitialiser les erreurs
      console.log('Tentative de connexion avec Firebase...');
      console.log('Email:', email);
      console.log('Firebase config check:', {
        projectId: 'ecole-360---rork-fix',
        authDomain: 'ecole-360---rork-fix.firebaseapp.com'
      });
      
      // Utiliser le service Firebase pour la connexion
      const user = await authService.signIn(email.trim().toLowerCase(), password);
      console.log('Connexion Firebase réussie:', user.uid);
      
      // Utiliser aussi le hook auth existant pour la gestion d'état locale
      await login(email.trim().toLowerCase(), password, rememberMe);
      
      router.replace('/(app)/(tabs)/dashboard' as any); // Redirection vers l'app principale
    } catch (err: any) {
      console.error('Erreur de connexion complète:', {
        code: err.code,
        message: err.message,
        stack: err.stack
      });
      
      // Affichage de l'erreur en cas d'échec
      let errorMessage = 'Échec de la connexion';
      
      if (err.code) {
        switch (err.code) {
          case 'auth/user-not-found':
            errorMessage = '❌ Aucun compte trouvé avec cette adresse email. Créez d\'abord les comptes de démonstration.';
            break;
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            errorMessage = '❌ Email ou mot de passe incorrect. Vérifiez vos identifiants ou créez les comptes de démonstration.';
            break;
          case 'auth/invalid-email':
            errorMessage = '❌ Adresse email invalide';
            break;
          case 'auth/too-many-requests':
            errorMessage = '❌ Trop de tentatives. Veuillez réessayer plus tard';
            break;
          case 'auth/network-request-failed':
            errorMessage = '❌ Erreur de connexion réseau. Vérifiez votre connexion internet.';
            break;
          case 'auth/configuration-not-found':
          case 'auth/project-not-found':
            errorMessage = '❌ Configuration Firebase incorrecte. Contactez l\'administrateur.';
            break;
          default:
            errorMessage = `❌ Erreur Firebase (${err.code}): ${err.message}`;
        }
      } else if (err.message) {
        errorMessage = `❌ ${err.message}`;
      }
      
      setError(errorMessage);
    }
  };

  // Navigation vers la page de récupération de mot de passe
  const handleForgotPassword = () => {
    router.push('/forgot-password' as any);
  };



  // Fonction pour gérer l'inscription rapide depuis cet écran
  const handleQuickSignUp = async () => {
    // Validation des champs obligatoires
    if (!email || !password) {
      setError('Veuillez saisir votre email et mot de passe');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      setError('');
      console.log('Tentative d\'inscription avec Firebase...');
      
      // Créer le compte avec Firebase (rôle parent par défaut)
      const user = await authService.signUp(email, password, 'Utilisateur', 'Nouveau', 'parent');
      console.log('Inscription Firebase réussie:', user.uid);
      
      // Utiliser aussi le hook auth existant
      await login(email, password, rememberMe);
      
      router.replace('/(app)/(tabs)/dashboard' as any);
    } catch (err) {
      console.error('Erreur d\'inscription:', err);
      let errorMessage = 'Échec de la création du compte';
      if (err instanceof Error) {
        if (err.message.includes('email-already-in-use')) {
          errorMessage = 'Cette adresse email est déjà utilisée';
        } else if (err.message.includes('weak-password')) {
          errorMessage = 'Le mot de passe est trop faible';
        } else if (err.message.includes('invalid-email')) {
          errorMessage = 'Adresse email invalide';
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
    }
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
            <View style={styles.logoContainer}>
              <View style={styles.logoWrapper}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=200&auto=format&fit=crop' }}
                  style={styles.logo}
                />
              </View>
              <Text style={styles.title}>{APP_CONFIG.name}</Text>
              <Text style={styles.subtitle}>{APP_CONFIG.description}</Text>
              <Text style={styles.slogan}>{APP_CONFIG.slogan}</Text>
            </View>

            <View style={styles.formCard}>
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[styles.tab, isLogin && styles.activeTab]}
                  onPress={() => setIsLogin(true)}
                >
                  <Text style={[styles.tabText, isLogin && styles.activeTabText]}>Connexion</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, !isLogin && styles.activeTab]}
                  onPress={() => setIsLogin(false)}
                >
                  <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>Inscription</Text>
                </TouchableOpacity>
              </View>

              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.inputContainer}>
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

                <View style={styles.inputWrapper}>
                  <Lock size={20} color={COLORS.gray} style={styles.inputIcon} />
                  <Input
                    value={password}
                    onChangeText={setPassword}
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
              </View>

              {isLogin && (
                <View style={styles.optionsContainer}>
                  <View style={styles.rememberContainer}>
                    <Switch
                      value={rememberMe}
                      onValueChange={setRememberMe}
                      trackColor={{ false: COLORS.lightGray, true: '#FF6B35' }}
                      thumbColor={rememberMe ? '#FFFFFF' : '#f4f3f4'}
                    />
                    <Text style={styles.rememberText}>Rester connecté</Text>
                  </View>
                  <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
                  </TouchableOpacity>
                </View>
              )}

              <Button
                title={isLogin ? "Se connecter" : "S'inscrire"}
                onPress={isLogin ? handleLogin : handleQuickSignUp}
                loading={loading}
                style={styles.actionButton}
                testID={isLogin ? "login-button" : "signup-button"}
              />

              {isLogin && (
                <>
                  <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>ou</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  <TouchableOpacity style={styles.googleButton} onPress={() => console.log('Google login')}>
                    <Chrome size={20} color="#4285F4" style={styles.googleIcon} />
                    <Text style={styles.googleButtonText}>Continuer avec Google</Text>
                  </TouchableOpacity>
                </>
              )}

              {isLogin && (
                <View style={styles.demoContainer}>
                  <Text style={styles.demoTitle}>Comptes de démonstration :</Text>
                  
                  <Button
                    title="Créer les comptes de démonstration"
                    onPress={handleCreateDemoAccounts}
                    loading={isCreatingDemoAccounts}
                    style={styles.demoButton}
                    testID="create-demo-accounts-button"
                  />
                  
                  <View style={styles.demoAccountsList}>
                    <Text style={styles.demoText}>• Administrateur : admin@ecole-360.com</Text>
                    <Text style={styles.demoPassword}>Mot de passe : AdminSecure123!</Text>
                    <Text style={styles.demoText}>• Directeur : school@ecole-360.com</Text>
                    <Text style={styles.demoPassword}>Mot de passe : SchoolAdmin123!</Text>
                    <Text style={styles.demoText}>• Professeur : teacher@ecole-360.com</Text>
                    <Text style={styles.demoPassword}>Mot de passe : Teacher123!</Text>
                    <Text style={styles.demoText}>• Parent : parent@ecole-360.com</Text>
                    <Text style={styles.demoPassword}>Mot de passe : Parent123!</Text>
                  </View>
                </View>
              )}
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  slogan: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '600',
    fontStyle: 'italic',
    marginTop: 8,
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray,
  },
  activeTabText: {
    color: COLORS.primary,
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
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 20,
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
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  forgotText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  actionButton: {
    marginBottom: 20,
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 16,
  },
  demoContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  demoButton: {
    backgroundColor: '#28A745',
    marginBottom: 16,
    paddingVertical: 12,
  },
  demoAccountsList: {
    marginTop: 8,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 2,
  },
  demoPassword: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  googleIcon: {
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
});