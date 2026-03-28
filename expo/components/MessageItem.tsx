import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '@/constants/colors';
import { Message } from '@/types/auth';
import { formatTime } from '@/utils/date';
import Avatar from './Avatar';
import { MessageCircle, Check, CheckCheck, Clock, AlertCircle, Info } from 'lucide-react-native';

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
  senderName?: string;
  showAvatar?: boolean;
  showStatus?: boolean;
  onPress?: () => void;
  testID?: string;
  variant?: 'default' | 'notification' | 'system' | 'announcement';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  category?: 'general' | 'academic' | 'administrative' | 'emergency';
}

export default function MessageItem({
  message,
  isCurrentUser,
  senderName,
  showAvatar = false,
  showStatus = false,
  onPress,
  testID,
  variant = 'default',
  priority = 'normal',
  category = 'general',
}: MessageItemProps) {
  const { content, createdAt, read } = message;

  const getPriorityColor = () => {
    switch (priority) {
      case 'urgent': return COLORS.danger;
      case 'high': return COLORS.warning;
      case 'normal': return COLORS.primary;
      case 'low': return COLORS.gray;
      default: return COLORS.primary;
    }
  };

  const getPriorityIcon = () => {
    switch (priority) {
      case 'urgent': return <AlertCircle size={14} color={COLORS.white} />;
      case 'high': return <Clock size={14} color={COLORS.white} />;
      case 'normal': return <Info size={14} color={COLORS.white} />;
      default: return null;
    }
  };

  const getCategoryGradient = () => {
    switch (category) {
      case 'academic': return GRADIENTS.info;
      case 'administrative': return GRADIENTS.secondary;
      case 'emergency': return ['#FF6B6B', '#FF5252'];
      default: return GRADIENTS.primary;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'notification':
        return {
          backgroundColor: `${COLORS.primary}08`,
          borderLeftWidth: 4,
          borderLeftColor: getPriorityColor(),
        };
      case 'system':
        return {
          backgroundColor: `${COLORS.gray}08`,
          borderRadius: 8,
        };
      case 'announcement':
        return {
          backgroundColor: `${COLORS.warning}08`,
          borderWidth: 1,
          borderColor: `${COLORS.warning}30`,
        };
      default:
        return {};
    }
  };

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
            colors={getCategoryGradient() as any}
            style={[
              styles.bubble, 
              styles.currentUserBubble,
              getVariantStyles(),
              Platform.OS === 'web' && styles.webShadow
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {priority !== 'normal' && (
              <View style={styles.priorityHeader}>
                {getPriorityIcon()}
                <Text style={styles.priorityText}>
                  {priority === 'urgent' ? 'URGENT' : 
                   priority === 'high' ? 'IMPORTANT' : 'INFO'}
                </Text>
              </View>
            )}
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
          <View style={[
            styles.bubble, 
            styles.otherUserBubble,
            getVariantStyles(),
            Platform.OS === 'web' && styles.webShadow
          ]}>
            {priority !== 'normal' && (
              <View style={[styles.priorityHeader, styles.otherUserPriorityHeader]}>
                <View style={[styles.priorityDot, { backgroundColor: getPriorityColor() }]} />
                <Text style={[styles.priorityText, styles.otherUserPriorityText]}>
                  {priority === 'urgent' ? 'URGENT' : 
                   priority === 'high' ? 'IMPORTANT' : 'INFO'}
                </Text>
              </View>
            )}
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
    ...Platform.select({
      web: {
        transition: 'all 0.2s ease-in-out',
      },
    }),
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
  priorityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  otherUserPriorityHeader: {
    backgroundColor: 'transparent',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  otherUserPriorityText: {
    color: COLORS.gray,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  webShadow: {
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
});