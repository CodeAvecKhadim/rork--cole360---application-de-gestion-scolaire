import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS } from '@/constants/colors';
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
      <View 
        style={[
          styles.bubble,
          isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
        ]}
      >
        <Text style={styles.content}>{content}</Text>
        <Text style={styles.time}>{formatTime(createdAt)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  currentUserContainer: {
    alignSelf: 'flex-end',
  },
  otherUserContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    padding: 12,
    borderRadius: 16,
  },
  currentUserBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    backgroundColor: COLORS.light,
    borderBottomLeftRadius: 4,
  },
  content: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    alignSelf: 'flex-end',
  },
});