import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '@/constants/colors';
import { Notification } from '@/types/auth';
import { formatDistanceToNow } from '@/utils/date';
import { Clock, Bell } from 'lucide-react-native';

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
      activeOpacity={0.8}
      testID={testID}
    >
      <View style={styles.iconContainer}>
        {!read ? (
          <LinearGradient
            colors={GRADIENTS.primary as any}
            style={styles.iconGradient}
          >
            <Bell size={20} color={COLORS.white} />
          </LinearGradient>
        ) : (
          <View style={styles.iconRead}>
            <Bell size={20} color={COLORS.gray} />
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, !read && styles.titleUnread]} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.timeContainer}>
            <Clock size={12} color={COLORS.gray} />
            <Text style={styles.time}>{formatDistanceToNow(createdAt)}</Text>
          </View>
        </View>
        
        <Text style={[styles.message, !read && styles.messageUnread]} numberOfLines={2}>
          {message}
        </Text>
        
        {!read && <View style={styles.unreadIndicator} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  unread: {
    backgroundColor: 'rgba(255, 107, 53, 0.02)',
    borderLeftColor: COLORS.primary,
    shadowOpacity: 0.12,
  },
  iconContainer: {
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  iconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRead: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  titleUnread: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: '500',
  },
  message: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  messageUnread: {
    color: COLORS.text,
    fontWeight: '500',
  },
  unreadIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
});