import React from 'react';
import { StyleSheet, View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '@/constants/colors';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'small' | 'medium' | 'large';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

export default function Badge({
  label,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
  testID,
}: BadgeProps) {
  return (
    <View 
      style={[
        styles.badge,
        styles[variant],
        styles[size],
        style,
      ]} 
      testID={testID}
    >
      <Text 
        style={[
          styles.text,
          styles[`${variant}Text`],
          styles[`${size}Text`],
          textStyle,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '500',
  },
  small: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  medium: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  large: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: 12,
  },
  largeText: {
    fontSize: 14,
  },
  primary: {
    backgroundColor: `${COLORS.primary}20`,
  },
  secondary: {
    backgroundColor: `${COLORS.secondary}20`,
  },
  success: {
    backgroundColor: `${COLORS.success}20`,
  },
  warning: {
    backgroundColor: `${COLORS.warning}20`,
  },
  danger: {
    backgroundColor: `${COLORS.danger}20`,
  },
  info: {
    backgroundColor: `${COLORS.info}20`,
  },
  primaryText: {
    color: COLORS.primary,
  },
  secondaryText: {
    color: COLORS.secondary,
  },
  successText: {
    color: COLORS.success,
  },
  warningText: {
    color: COLORS.warning,
  },
  dangerText: {
    color: COLORS.danger,
  },
  infoText: {
    color: COLORS.info,
  },
});