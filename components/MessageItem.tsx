import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '@/constants/colors';
import { Message } from '@/types/auth';
import { formatTime } from '@/utils/date';
import Avatar from './Avatar';
import { MessageCircle, Check, CheckCheck } from 'lucide-react-native';

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
  senderName?: string;
  showAvatar?: boolean;
  showStatus?: boolean;
  onPress?: () => void;
  testID?: string;
}

export default function MessageItem({
  message,
  isCurrentUser,
  senderName,
  showAvatar = false,
  showStatus = false,
  onPress,
  testID,
}: MessageItemProps) {
  const { content, createdAt, read } = message;

  const MessageContent = () => (
    <View 
      style={[
        styles.container,
        isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer,
      ]}
    >
      {!isCurrentUser && showAvatar && (
        <View style={styles.avatarContainer}>
          <Avatar name={senderName || 'Utilisateur'} size={32} />
        </View>
      )}
      
      <View style={styles.messageWrapper}>
        {!isCurrentUser && senderName && (
          <Text style={styles.senderName}>{senderName}</Text>
        )}
        
        {isCurrentUser ? (
          <LinearGradient
            colors={GRADIENTS.primary as any}
            style={[styles.bubble, styles.currentUserBubble]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={[styles.content, styles.currentUserContent]}>{content}</Text>
            <View style={styles.messageFooter}>
              <Text style={[styles.time, styles.currentUserTime]}>{formatTime(createdAt)}</Text>
              {showStatus && (
                <View style={styles.statusContainer}>
                  {read ? (
                    <CheckCheck size={14} color="rgba(255, 255, 255, 0.8)" />
                  ) : (
                    <Check size={14} color="rgba(255, 255, 255, 0.6)" />
                  )}
                </View>
              )}
            </View>
          </LinearGradient>
        ) : (
          <View style={[styles.bubble, styles.otherUserBubble]}>
            <Text style={[styles.content, styles.otherUserContent]}>{content}</Text>
            <View style={styles.messageFooter}>
              <Text style={[styles.time, styles.otherUserTime]}>{formatTime(createdAt)}</Text>
              {!read && (
                <View style={styles.unreadIndicator}>
                  <MessageCircle size={12} color={COLORS.primary} />
                </View>
              )}
            </View>
          </View>
        )}
      </View>
      
      {isCurrentUser && showAvatar && (
        <View style={styles.avatarContainer}>
          <Avatar name={senderName || 'Moi'} size={32} />
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} testID={testID} activeOpacity={0.7}>
        <MessageContent />
      </TouchableOpacity>
    );
  }

  return (
    <View testID={testID}>
      <MessageContent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 8,
    maxWidth: '85%',
    paddingHorizontal: 4,
    alignItems: 'flex-end',
  },
  currentUserContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  otherUserContainer: {
    alignSelf: 'flex-start',
  },
  avatarContainer: {
    marginHorizontal: 8,
    marginBottom: 4,
  },
  messageWrapper: {
    flex: 1,
    maxWidth: '100%',
  },
  senderName: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: '600',
    marginBottom: 4,
    marginLeft: 16,
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    minWidth: 60,
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
    borderColor: 'rgba(255, 107, 53, 0.08)',
  },
  content: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 6,
  },
  currentUserContent: {
    color: COLORS.white,
    fontWeight: '500',
  },
  otherUserContent: {
    color: COLORS.text,
    fontWeight: '500',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  time: {
    fontSize: 11,
    fontWeight: '600',
  },
  currentUserTime: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  otherUserTime: {
    color: COLORS.gray,
  },
  statusContainer: {
    marginLeft: 4,
  },
  unreadIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
});