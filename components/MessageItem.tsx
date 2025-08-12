import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '@/constants/colors';
import { Message } from '@/types/auth';
import { formatTime } from '@/utils/date';

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
  testID?: string;
}

export default function MessageItem({
  message,
  isCurrentUser,
  testID,
}: MessageItemProps) {
  const { content, createdAt } = message;

  return (
    <View 
      style={[
        styles.container,
        isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer,
      ]}
      testID={testID}
    >
      {isCurrentUser ? (
        <LinearGradient
          colors={GRADIENTS.primary as any}
          style={[styles.bubble, styles.currentUserBubble]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={[styles.content, styles.currentUserContent]}>{content}</Text>
          <Text style={[styles.time, styles.currentUserTime]}>{formatTime(createdAt)}</Text>
        </LinearGradient>
      ) : (
        <View style={[styles.bubble, styles.otherUserBubble]}>
          <Text style={[styles.content, styles.otherUserContent]}>{content}</Text>
          <Text style={[styles.time, styles.otherUserTime]}>{formatTime(createdAt)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    maxWidth: '85%',
    paddingHorizontal: 4,
  },
  currentUserContainer: {
    alignSelf: 'flex-end',
  },
  otherUserContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentUserBubble: {
    borderBottomRightRadius: 6,
    marginLeft: 8,
  },
  otherUserBubble: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.1)',
  },
  content: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  currentUserContent: {
    color: COLORS.white,
    fontWeight: '500',
  },
  otherUserContent: {
    color: COLORS.text,
    fontWeight: '500',
  },
  time: {
    fontSize: 11,
    alignSelf: 'flex-end',
    fontWeight: '600',
    marginTop: 2,
  },
  currentUserTime: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  otherUserTime: {
    color: COLORS.gray,
  },
});