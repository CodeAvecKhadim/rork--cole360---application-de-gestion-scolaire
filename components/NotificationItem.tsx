import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/colors';
import { Notification } from '@/types/auth';
import { formatDistanceToNow } from '@/utils/date';

interface NotificationItemProps {
  notification: Notification;
  onPress: (notification: Notification) => void;
  testID?: string;
}

export default function NotificationItem({
  notification,
  onPress,
  testID,
}: NotificationItemProps) {
  const { title, message, read, createdAt } = notification;

  return (
    <TouchableOpacity
      style={[styles.container, !read && styles.unread]}
      onPress={() => onPress(notification)}
      activeOpacity={0.7}
      testID={testID}
    >
      {!read && <View style={styles.indicator} />}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
        <Text style={styles.time}>{formatDistanceToNow(createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  unread: {
    backgroundColor: `${COLORS.primary}10`,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginRight: 12,
    marginTop: 6,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 8,
  },
  time: {
    fontSize: 12,
    color: COLORS.gray,
  },
});