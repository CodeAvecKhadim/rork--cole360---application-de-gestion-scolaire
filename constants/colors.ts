// Palette de couleurs principale de l'application École-360
// Toutes les couleurs utilisées dans l'app sont centralisées ici
export const COLORS = {
  // Couleurs principales de la marque - Dégradé orange vibrant
  primary: "#FF6B35", // Orange principal - couleur de base du dégradé
  primaryDark: "#E55A2B", // Version plus foncée de l'orange
  primaryLight: "#FF8A5B", // Version plus claire de l'orange
  secondary: "#F7931E", // Orange moyen - deuxième couleur du dégradé
  accent: "#FFD23F", // Jaune doré - troisième couleur du dégradé
  
  // Couleurs d'état (feedback utilisateur)
  success: "#4CAF50", // Vert - pour les messages de succès
  warning: "#FFC107", // Jaune/Orange - pour les avertissements
  warningLight: "#FFF3CD", // Version claire du warning
  danger: "#F44336", // Rouge - pour les erreurs et actions destructives
  info: "#2196F3", // Bleu clair - pour les informations
  error: "#F44336", // Rouge - alias pour danger (cohérence)
  
  // Couleurs neutres (arrière-plans et textes)
  light: "#F5F7FA", // Gris très clair
  dark: "#343A40", // Gris très foncé
  gray: "#6C757D", // Gris moyen - pour le texte secondaire
  grayLight: "#CED4DA", // Gris clair - pour les bordures
  lightGray: "#F8F9FA", // Gris très clair - pour les arrière-plans
  
  // Couleurs de base
  white: "#FFFFFF", // Blanc pur
  black: "#000000", // Noir pur
  
  // Couleurs sémantiques (usage spécifique)
  background: "#F8F9FA", // Arrière-plan principal de l'app
  card: "#FFFFFF", // Arrière-plan des cartes et composants
  text: "#212529", // Couleur du texte principal
  textSecondary: "#6C757D", // Couleur du texte secondaire
  border: "#E9ECEF", // Couleur des bordures
  surface: "#F8F9FA", // Surface des éléments interactifs
  notification: "#FF6B6B", // Couleur des badges de notification
  shadow: "rgba(0, 0, 0, 0.1)", // Couleur des ombres
};

// Dégradés de couleurs pour les éléments visuels avancés
// Utilisés avec LinearGradient pour créer des effets visuels
export const GRADIENTS = {
  primary: ["#FF6B35", "#F7931E", "#FFD23F"], // Dégradé orange principal (3 couleurs)
  primarySimple: ["#FF6B35", "#F7931E"], // Dégradé orange simple (2 couleurs)
  secondary: ["#F7931E", "#FFD23F"], // Dégradé orange-jaune
  success: ["#4CAF50", "#66BB6A"], // Dégradé vert de succès
  info: ["#FF8A5B", "#FFB347"], // Dégradé orange clair
  warm: ["#FF6B35", "#FF8A5B", "#FFB347"], // Dégradé chaud
  sunset: ["#FFD23F", "#F7931E", "#FF6B35"], // Dégradé coucher de soleil
};

// Configuration globale de l'application
// Contient les informations de base de l'app
export const APP_CONFIG = {
  name: 'École-360', // Nom de l'application
  description: 'Votre plateforme éducative complète', // Description courte
  slogan: 'Le lien entre enseignants, parents et élèves', // Slogan principal
  version: '1.0.0', // Version actuelle de l'application
};

// Thèmes de l'application (clair et sombre)
// Permet de basculer entre les modes d'affichage
export const THEME = {
  // Thème clair (par défaut)
  light: {
    text: COLORS.text, // Couleur du texte principal
    background: COLORS.background, // Arrière-plan principal
    tint: COLORS.primary, // Couleur d'accent
    tabIconDefault: COLORS.gray, // Icônes d'onglets inactives
    tabIconSelected: COLORS.primary, // Icônes d'onglets actives
    card: COLORS.card, // Arrière-plan des cartes
    border: COLORS.border, // Couleur des bordures
  },
  // Thème sombre (pour le mode nuit)
  dark: {
    text: COLORS.white, // Texte blanc sur fond sombre
    background: COLORS.dark, // Arrière-plan sombre
    tint: COLORS.primary, // Couleur d'accent (reste la même)
    tabIconDefault: COLORS.grayLight, // Icônes inactives plus claires
    tabIconSelected: COLORS.primary, // Icônes actives (reste la même)
    card: COLORS.dark, // Cartes sombres
    border: COLORS.gray, // Bordures plus visibles sur fond sombre
  },
};

// Nouvelles couleurs pour améliorer l'accessibilité
export const ACCESSIBILITY = {
  // Couleurs avec contraste élevé
  highContrast: {
    text: '#000000',
    background: '#FFFFFF',
    primary: '#0066CC',
    secondary: '#FF6600',
  },
  // Tailles de police adaptatives
  fontSize: {
    small: 12,
    medium: 16,
    large: 20,
    extraLarge: 24,
  },
};

// Animations et transitions
export const ANIMATIONS = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

export default THEME;