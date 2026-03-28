import React from 'react';
import { StyleSheet, View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '@/constants/colors';
import Button from './Button';
import IconWrapper from './IconWrapper';

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: React.ReactNode;
  buttonTitle?: string;
  onButtonPress?: () => void;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  messageStyle?: StyleProp<TextStyle>;
  variant?: 'default' | 'gradient' | 'minimal';
  testID?: string;
}

export default function EmptyState({
  title,
  message,
  icon,
  buttonTitle,
  onButtonPress,
  style,
  titleStyle,
  messageStyle,
  variant = 'default',
  testID,
}: EmptyStateProps) {
  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={GRADIENTS.primaryLight as any}
        style={[styles.gradientContainer, style]}
        testID={testID}
      >
        {icon && (
          <View style={styles.gradientIconContainer}>
            <LinearGradient
              colors={GRADIENTS.primary as any}
              style={styles.iconGradient}
            >
              <IconWrapper>{icon}</IconWrapper>
            </LinearGradient>
          </View>
        )}
        <Text style={[styles.gradientTitle, titleStyle]}>{title}</Text>
        {message && <Text style={[styles.gradientMessage, messageStyle]}>{message}</Text>}
        {buttonTitle && onButtonPress && (
          <Button
            title={buttonTitle}
            onPress={onButtonPress}
            variant="primary"
            style={styles.button}
          />
        )}
      </LinearGradient>
    );
  }

  if (variant === 'minimal') {
    return (
      <View style={[styles.minimalContainer, style]} testID={testID}>
        {icon && <View style={styles.minimalIconContainer}><IconWrapper>{icon}</IconWrapper></View>}
        <Text style={[styles.minimalTitle, titleStyle]}>{title}</Text>
        {message && <Text style={[styles.minimalMessage, messageStyle]}>{message}</Text>}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]} testID={testID}>
      {icon && (
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <IconWrapper>{icon}</IconWrapper>
          </View>
        </View>
      )}
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      {message && <Text style={[styles.message, messageStyle]}>{message}</Text>}
      {buttonTitle && onButtonPress && (
        <Button
          title={buttonTitle}
          onPress={onButtonPress}
          variant="primary"
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    minHeight: 200,
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${COLORS.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  message: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 24,
    maxWidth: 280,
  },
  button: {
    minWidth: 160,
    paddingHorizontal: 24,
  },
  // Gradient variant styles
  gradientContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    minHeight: 200,
    borderRadius: 16,
    margin: 16,
  },
  gradientIconContainer: {
    marginBottom: 20,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  gradientMessage: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 24,
    maxWidth: 280,
  },
  // Minimal variant styles
  minimalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  minimalIconContainer: {
    marginBottom: 12,
    opacity: 0.6,
  },
  minimalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  minimalMessage: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
});