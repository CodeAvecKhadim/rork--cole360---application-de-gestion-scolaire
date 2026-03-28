import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';
import CountryPicker from '@/components/CountryPicker';
import { Country } from '@/constants/countries';
import Avatar from '@/components/Avatar';
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  Globe,
  Save,
  Camera
} from 'lucide-react-native';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [country, setCountry] = useState<Country>({
    name: user?.country || 'Sénégal',
    code: user?.countryCode || 'SN',
    dialCode: '+221',
    flag: '🇸🇳'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Erreur', 'Le nom est obligatoire');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Erreur', 'L\'email est obligatoire');
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        country: country.name
      });
      
      Alert.alert(
        'Succès',
        'Votre profil a été mis à jour avec succès',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeAvatar = () => {
    Alert.alert(
      'Changer la photo de profil',
      'Cette fonctionnalité sera bientôt disponible',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={GRADIENTS.primary as any} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <ArrowLeft size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier le profil</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        {/* Photo de profil */}
        <Card title="Photo de profil" variant="elevated" headerGradient>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Avatar 
                source={user?.avatar} 
                name={user?.name} 
                size={100} 
              />
              <TouchableOpacity 
                style={styles.cameraButton}
                onPress={handleChangeAvatar}
              >
                <LinearGradient colors={GRADIENTS.secondary as any} style={styles.cameraIcon}>
                  <Camera size={20} color={COLORS.white} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarHint}>Appuyez pour changer votre photo</Text>
          </View>
        </Card>

        {/* Informations personnelles */}
        <Card title="Informations personnelles" variant="elevated" headerGradient>
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <User size={20} color={COLORS.primary} />
              </View>
              <Input
                label="Nom complet"
                value={name}
                onChangeText={setName}
                placeholder="Entrez votre nom complet"
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <Mail size={20} color={COLORS.primary} />
              </View>
              <Input
                label="Adresse email"
                value={email}
                onChangeText={setEmail}
                placeholder="Entrez votre email"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <Phone size={20} color={COLORS.primary} />
              </View>
              <Input
                label="Numéro de téléphone"
                value={phone}
                onChangeText={setPhone}
                placeholder="Entrez votre numéro de téléphone"
                keyboardType="phone-pad"
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <Globe size={20} color={COLORS.primary} />
              </View>
              <View style={styles.countryPickerContainer}>
                <Text style={styles.inputLabel}>Pays</Text>
                <CountryPicker
                  selectedCountry={country}
                  onCountrySelect={setCountry}
                />
              </View>
            </View>
          </View>
        </Card>

        {/* Informations sur le rôle */}
        <Card title="Informations du compte" variant="elevated" headerGradient>
          <View style={styles.roleInfo}>
            <Text style={styles.roleLabel}>Rôle dans l&apos;application</Text>
            <Text style={styles.roleValue}>
              {user?.role === 'admin' ? 'Administrateur' :
               user?.role === 'schoolAdmin' ? 'Administrateur d&apos;école' :
               user?.role === 'teacher' ? 'Professeur' :
               user?.role === 'parent' ? 'Parent' : 'Utilisateur'}
            </Text>
            <Text style={styles.roleHint}>
              Votre rôle détermine les fonctionnalités auxquelles vous avez accès
            </Text>
          </View>
        </Card>

        {/* Bouton de sauvegarde */}
        <View style={styles.saveButtonContainer}>
          <Button
            title="Enregistrer les modifications"
            onPress={handleSave}
            loading={isLoading}
            icon={<Save size={20} color={COLORS.white} />}
            variant="primary"
          />
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
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cameraIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  avatarHint: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
  },
  formSection: {
    gap: 20,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  inputIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  input: {
    flex: 1,
  },
  countryPickerContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  roleInfo: {
    paddingVertical: 8,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  roleValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
  },
  roleHint: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  saveButtonContainer: {
    marginTop: 24,
    marginBottom: 40,
  },
});