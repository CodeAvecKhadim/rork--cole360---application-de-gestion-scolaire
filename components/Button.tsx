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
import { COLORS } from '@/constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
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
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
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
      borderWidth: 1,
      borderColor: COLORS.primary,
    },
    disabled: {
      backgroundColor: 'transparent',
      borderWidth: 1,
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
};