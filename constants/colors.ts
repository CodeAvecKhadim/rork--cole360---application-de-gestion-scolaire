// Palette de couleurs principale de l'application École-360
// Toutes les couleurs utilisées dans l'app sont centralisées ici
export const COLORS = {
  // Couleurs principales de la marque
  primary: "#4A6FFF", // Bleu principal - utilisé pour les boutons et éléments importants
  primaryDark: "#3D5CCC", // Version plus foncée du bleu principal
  secondary: "#FF6B6B", // Rouge secondaire - utilisé pour les accents et notifications
  
  // Couleurs d'état (feedback utilisateur)
  success: "#4CAF50", // Vert - pour les messages de succès
  warning: "#FFC107", // Jaune/Orange - pour les avertissements
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
  primary: ["#4A6FFF", "#6B8DFF"], // Dégradé bleu principal
  secondary: ["#FF6B6B", "#FF8E8E"], // Dégradé rouge secondaire
  success: ["#4CAF50", "#66BB6A"], // Dégradé vert de succès
  info: ["#2196F3", "#64B5F6"], // Dégradé bleu d'information
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

export default THEME;