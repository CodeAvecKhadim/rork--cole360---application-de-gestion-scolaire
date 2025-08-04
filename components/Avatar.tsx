import React from 'react';
import { StyleSheet, View, Text, Image, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '@/constants/colors';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

export default function Avatar({
  source,
  name,
  size = 40,
  style,
  textStyle,
  testID,
}: AvatarProps) {
  const getInitials = (name?: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const fontSize = size * 0.4;

  return (
    <View style={[styles.container, avatarStyle, style]} testID={testID}>
      {source ? (
        <Image
          source={{ uri: source }}
          style={[styles.image, avatarStyle]}
          resizeMode="cover"
        />
      ) : (
        <Text style={[styles.initials, { fontSize }, textStyle]}>
          {getInitials(name)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    color: COLORS.white,
    fontWeight: '600',
  },
});