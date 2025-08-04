export const COLORS = {
  primary: "#4A6FFF",
  primaryDark: "#3D5CCC",
  secondary: "#FF6B6B",
  success: "#4CAF50",
  warning: "#FFC107",
  danger: "#F44336",
  info: "#2196F3",
  light: "#F5F7FA",
  dark: "#343A40",
  gray: "#6C757D",
  grayLight: "#CED4DA",
  lightGray: "#F8F9FA",
  white: "#FFFFFF",
  black: "#000000",
  background: "#F8F9FA",
  card: "#FFFFFF",
  text: "#212529",
  border: "#E9ECEF",
  notification: "#FF6B6B",
  shadow: "rgba(0, 0, 0, 0.1)",
  textSecondary: "#6C757D",
  surface: "#F8F9FA",
  error: "#F44336",
};

export const GRADIENTS = {
  primary: ["#4A6FFF", "#6B8DFF"],
  secondary: ["#FF6B6B", "#FF8E8E"],
  success: ["#4CAF50", "#66BB6A"],
  info: ["#2196F3", "#64B5F6"],
};

export const APP_CONFIG = {
  name: 'École-360',
  description: 'Votre plateforme éducative complète',
  slogan: 'Le lien entre enseignants, parents et élèves',
  version: '1.0.0',
};

export const THEME = {
  light: {
    text: COLORS.text,
    background: COLORS.background,
    tint: COLORS.primary,
    tabIconDefault: COLORS.gray,
    tabIconSelected: COLORS.primary,
    card: COLORS.card,
    border: COLORS.border,
  },
  dark: {
    text: COLORS.white,
    background: COLORS.dark,
    tint: COLORS.primary,
    tabIconDefault: COLORS.grayLight,
    tabIconSelected: COLORS.primary,
    card: COLORS.dark,
    border: COLORS.gray,
  },
};

export default THEME;