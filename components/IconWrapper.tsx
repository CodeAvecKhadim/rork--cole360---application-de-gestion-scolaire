import React from 'react';
import { View } from 'react-native';

interface IconWrapperProps {
  children: React.ReactNode;
  style?: any;
}

export default function IconWrapper({ children, style }: IconWrapperProps) {
  return (
    <View style={[{ alignItems: 'center', justifyContent: 'center' }, style]}>
      {children}
    </View>
  );
}