import React, { ReactNode } from 'react';
import { StyleSheet, View, Text, StyleProp, ViewStyle, TextStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '@/constants/colors';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  testID?: string;
  variant?: 'default' | 'gradient' | 'elevated' | 'outlined' | 'modern';
  headerGradient?: boolean;
  interactive?: boolean;
}

export default function Card({
  children,
  title,
  subtitle,
  style,
  titleStyle,
  subtitleStyle,
  contentStyle,
  testID,
  variant = 'default',
  headerGradient = false,
  interactive = false,
}: CardProps) {
  const getCardStyle = () => {
    switch (variant) {
      case 'elevated':
        return [styles.card, styles.elevatedCard, interactive && styles.interactiveCard, style];
      case 'gradient':
        return [styles.card, styles.gradientCard, interactive && styles.interactiveCard, style];
      case 'outlined':
        return [styles.card, styles.outlinedCard, interactive && styles.interactiveCard, style];
      case 'modern':
        return [styles.card, styles.modernCard, interactive && styles.interactiveCard, style];
      default:
        return [styles.card, interactive && styles.interactiveCard, style];
    }
  };

  const renderHeader = () => {
    if (!title && !subtitle) return null;

    if (headerGradient) {
      return (
        <LinearGradient
          colors={GRADIENTS.primarySimple as any}
          style={styles.gradientHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {title && <Text style={[styles.title, styles.gradientTitle, subtitle && styles.titleWithSubtitle, titleStyle]}>{title}</Text>}
          {subtitle && <Text style={[styles.subtitle, styles.gradientSubtitle, subtitleStyle]}>{subtitle}</Text>}
        </LinearGradient>
      );
    }

    return (
      <View style={styles.header}>
        {title && <Text style={[styles.title, subtitle && styles.titleWithSubtitle, titleStyle]}>{title}</Text>}
        {subtitle && <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>}
      </View>
    );
  };

  return (
    <View style={getCardStyle()} testID={testID}>
      {renderHeader()}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginVertical: 8,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'default',
      },
    }),
  },
  elevatedCard: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderRadius: 20,
  },
  gradientCard: {
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: 'rgba(255, 107, 53, 0.02)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
      },
    }),
  },
  gradientHeader: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: COLORS.text,
  },
  gradientTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '800' as const,
  },
  titleWithSubtitle: {
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500' as const,
  },
  gradientSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    padding: 20,
  },
  outlinedCard: {
    borderWidth: 2,
    borderColor: `${COLORS.primary}20`,
    shadowOpacity: 0.04,
    elevation: 2,
  },
  modernCard: {
    borderRadius: 24,
    backgroundColor: `${COLORS.primary}02`,
    borderWidth: 1,
    borderColor: `${COLORS.primary}08`,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.1,
  },
  interactiveCard: {
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
});