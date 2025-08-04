import React from 'react';
import { StyleSheet, View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '@/constants/colors';
import Button from './Button';

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: React.ReactNode;
  buttonTitle?: string;
  onButtonPress?: () => void;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  messageStyle?: StyleProp<TextStyle>;
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
  testID,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]} testID={testID}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
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
    padding: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    minWidth: 150,
  },
});