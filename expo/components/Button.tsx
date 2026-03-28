import React, { ReactNode } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '@/constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'gradient';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: ReactNode;
  testID?: string;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  testID,
}: ButtonProps) {
  const getButtonStyle = () => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...sizeStyles[size],
    };

    if (disabled) {
      return {
        ...baseStyle,
        ...variantStyles[variant].disabled,
      };
    }

    return {
      ...baseStyle,
      ...variantStyles[variant].default,
    };
  };

  const getTextStyle = () => {
    const baseTextStyle = {
      ...styles.text,
      ...textSizeStyles[size],
    };

    if (disabled) {
      return {
        ...baseTextStyle,
        ...variantStyles[variant].disabledText,
      };
    }

    return {
      ...baseTextStyle,
      ...variantStyles[variant].text,
    };
  };

  // Rendu avec dégradé pour la variante gradient
  if (variant === 'gradient' && !disabled) {
    return (
      <TouchableOpacity
        style={[styles.gradientContainer, style]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        testID={testID}
      >
        <LinearGradient
          colors={GRADIENTS.primarySimple as any}
          style={[styles.gradientButton, sizeStyles[size]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <View style={styles.content}>
              {icon && <View style={styles.iconContainer}>{icon}</View>}
              <Text style={[styles.gradientText, textSizeStyles[size], textStyle]}>{title}</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Rendu standard pour les autres variantes
  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? COLORS.white : COLORS.primary} 
        />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontWeight: '600',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  // Nouveaux styles pour les boutons avec dégradé
  gradientContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  gradientButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  gradientText: {
    color: COLORS.white,
    fontWeight: '700',
  },
});

const sizeStyles = {
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
};

const textSizeStyles = {
  small: {
    fontSize: 14,
  },
  medium: {
    fontSize: 16,
  },
  large: {
    fontSize: 18,
  },
};

const variantStyles = {
  primary: {
    default: {
      backgroundColor: COLORS.primary,
    },
    disabled: {
      backgroundColor: COLORS.grayLight,
    },
    text: {
      color: COLORS.white,
    },
    disabledText: {
      color: COLORS.gray,
    },
  },
  secondary: {
    default: {
      backgroundColor: COLORS.secondary,
    },
    disabled: {
      backgroundColor: COLORS.grayLight,
    },
    text: {
      color: COLORS.white,
    },
    disabledText: {
      color: COLORS.gray,
    },
  },
  outline: {
    default: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: COLORS.primary,
    },
    disabled: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: COLORS.grayLight,
    },
    text: {
      color: COLORS.primary,
    },
    disabledText: {
      color: COLORS.gray,
    },
  },
  text: {
    default: {
      backgroundColor: 'transparent',
    },
    disabled: {
      backgroundColor: 'transparent',
    },
    text: {
      color: COLORS.primary,
    },
    disabledText: {
      color: COLORS.gray,
    },
  },
  gradient: {
    default: {
      backgroundColor: 'transparent',
    },
    disabled: {
      backgroundColor: COLORS.grayLight,
    },
    text: {
      color: COLORS.white,
    },
    disabledText: {
      color: COLORS.gray,
    },
  },
};