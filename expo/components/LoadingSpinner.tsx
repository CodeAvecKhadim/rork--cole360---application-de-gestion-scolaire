import React from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '@/constants/colors';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  message?: string;
  variant?: 'default' | 'gradient' | 'overlay';
  testID?: string;
}

export default function LoadingSpinner({
  size = 'medium',
  color = COLORS.primary,
  message,
  variant = 'default',
  testID,
}: LoadingSpinnerProps) {
  const getSize = () => {
    switch (size) {
      case 'small':
        return 20;
      case 'large':
        return 40;
      default:
        return 30;
    }
  };

  if (variant === 'overlay') {
    return (
      <View style={styles.overlay} testID={testID}>
        <View style={styles.overlayContent}>
          <LinearGradient
            colors={GRADIENTS.primarySimple as any}
            style={styles.gradientSpinner}
          >
            <ActivityIndicator size={getSize()} color={COLORS.white} />
          </LinearGradient>
          {message && <Text style={styles.overlayMessage}>{message}</Text>}
        </View>
      </View>
    );
  }

  if (variant === 'gradient') {
    return (
      <View style={styles.container} testID={testID}>
        <LinearGradient
          colors={GRADIENTS.primarySimple as any}
          style={styles.gradientContainer}
        >
          <ActivityIndicator size={getSize()} color={COLORS.white} />
        </LinearGradient>
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container} testID={testID}>
      <ActivityIndicator size={getSize()} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    fontWeight: '500',
  },
  gradientContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  overlayContent: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  gradientSpinner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayMessage: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    fontWeight: '600',
  },
});