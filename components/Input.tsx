// Composant Input personnalisé - École-360
// Ce composant fournit un champ de saisie réutilisable avec gestion des erreurs et visibilité du mot de passe
import React, { useState } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  View, 
  Text, 
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

// Interface définissant les props du composant Input
interface InputProps {
  value: string; // Valeur actuelle du champ
  onChangeText: (text: string) => void; // Callback lors du changement de texte
  placeholder?: string; // Texte d'aide affiché quand le champ est vide
  label?: string; // Libellé affiché au-dessus du champ
  error?: string; // Message d'erreur à afficher
  secureTextEntry?: boolean; // Masquer le texte (pour les mots de passe)
  keyboardType?: KeyboardTypeOptions; // Type de clavier à afficher
  returnKeyType?: ReturnKeyTypeOptions; // Type de bouton de retour
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'; // Capitalisation automatique
  autoCorrect?: boolean; // Correction automatique
  multiline?: boolean; // Permettre plusieurs lignes
  numberOfLines?: number; // Nombre de lignes pour le mode multiline
  style?: StyleProp<ViewStyle>; // Styles personnalisés pour le conteneur
  inputStyle?: StyleProp<TextStyle>; // Styles personnalisés pour le champ de saisie
  onBlur?: () => void; // Callback quand le champ perd le focus
  onFocus?: () => void; // Callback quand le champ reçoit le focus
  onSubmitEditing?: () => void; // Callback lors de la soumission
  testID?: string; // Identifiant pour les tests automatisés
}

// Composant Input avec gestion avancée des états et interactions
export default function Input({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  secureTextEntry = false, // Par défaut, le texte n'est pas masqué
  keyboardType = 'default', // Clavier par défaut
  returnKeyType = 'done', // Bouton "Terminé" par défaut
  autoCapitalize = 'none', // Pas de capitalisation automatique
  autoCorrect = false, // Pas de correction automatique
  multiline = false, // Une seule ligne par défaut
  numberOfLines = 1, // Une ligne par défaut
  style,
  inputStyle,
  onBlur,
  onFocus,
  onSubmitEditing,
  testID,
}: InputProps) {
  // États locaux pour la gestion de l'interface
  const [isFocused, setIsFocused] = useState(false); // Le champ a-t-il le focus ?
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry); // Le mot de passe est-il visible ?

  // Gestion du focus (quand le champ reçoit l'attention)
  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus(); // Appeler le callback personnalisé si fourni
  };

  // Gestion de la perte de focus
  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur(); // Appeler le callback personnalisé si fourni
  };

  // Basculer la visibilité du mot de passe
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Déterminer la couleur de la bordure selon l'état
  const getBorderColor = () => {
    if (error) return COLORS.danger; // Rouge en cas d'erreur
    if (isFocused) return COLORS.primary; // Couleur primaire quand actif
    return COLORS.grayLight; // Gris clair par défaut
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          { borderColor: getBorderColor() },
          multiline && styles.multilineContainer,
        ]}
      >
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={onSubmitEditing}
          testID={testID}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.iconContainer}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color={COLORS.gray} />
            ) : (
              <Eye size={20} color={COLORS.gray} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: COLORS.dark,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  multilineContainer: {
    minHeight: 100,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  multilineInput: {
    textAlignVertical: 'top',
  },
  iconContainer: {
    padding: 10,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 4,
  },
});