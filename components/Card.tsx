import React, { ReactNode } from 'react';
import { StyleSheet, View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '@/constants/colors';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  testID?: string;
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
}: CardProps) {
  return (
    <View style={[styles.card, style]} testID={testID}>
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && <Text style={[styles.title, subtitle && styles.titleWithSubtitle, titleStyle]}>{title}</Text>}
          {subtitle && <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>}
        </View>
      )}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginVertical: 8,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  titleWithSubtitle: {
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.gray,
  },
  content: {
    padding: 16,
  },
});