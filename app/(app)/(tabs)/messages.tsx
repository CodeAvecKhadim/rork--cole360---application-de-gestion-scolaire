import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';
import { useData } from '@/hooks/data-store';
import Avatar from '@/components/Avatar';
import { MessageSquare, Clock } from 'lucide-react-native';
import { formatDistanceToNow } from '@/utils/date';

export default function MessagesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { getMessagesByUser } = useData();
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.id) {
      setConversations([]);
      return;
    }

    const msgs = getMessagesByUser(user.id);
    const conversationMap = new Map<string, any>();

    msgs.forEach((message) => {
      const partnerId = message.senderId === user.id ? message.receiverId : message.senderId;
      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          id: partnerId,
          lastMessage: message,
          unreadCount: message.receiverId === user.id && !message.read ? 1 : 0,
        });
      } else {
        const conversation = conversationMap.get(partnerId);
        if (message.createdAt > conversation.lastMessage.createdAt) {
          conversation.lastMessage = message;
        }
        if (message.receiverId === user.id && !message.read) {
          conversation.unreadCount += 1;
        }
      }
    });

    const conversationsArray = Array.from(conversationMap.values());
    conversationsArray.sort((a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt);
    setConversations(conversationsArray);
  }, [user?.id, getMessagesByUser]);

  const getPartnerName = (partnerId: string) => {
    // In a real app, you would fetch the user name from a users collection
    // For demo purposes, we'll use hardcoded names
    switch (partnerId) {
      case '1':
        return 'Admin User';
      case '2':
        return 'School Admin';
      case '3':
        return 'Teacher User';
      case '4':
        return 'Parent User';
      default:
        return 'Unknown User';
    }
  };

  const renderConversationItem = ({ item }: { item: any }) => {
    const partnerName = getPartnerName(item.id);
    const { content, createdAt } = item.lastMessage;
    const hasUnread = item.unreadCount > 0;
    
    return (
      <TouchableOpacity
        style={[styles.conversationItem, hasUnread && styles.unreadConversation]}
        onPress={() => router.push(`/(app)/conversation/${item.id}` as any)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <Avatar name={partnerName} size={56} />
          {hasUnread && (
            <LinearGradient
              colors={GRADIENTS.primarySimple as any}
              style={styles.onlineIndicator}
            />
          )}
        </View>
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={[styles.partnerName, hasUnread && styles.unreadPartnerName]}>
              {partnerName}
            </Text>
            <View style={styles.timeContainer}>
              <Clock size={12} color={COLORS.gray} />
              <Text style={styles.timeText}>{formatDistanceToNow(createdAt)}</Text>
            </View>
          </View>
          <View style={styles.messagePreviewContainer}>
            <Text style={[styles.messagePreview, hasUnread && styles.unreadMessagePreview]} numberOfLines={2}>
              {content}
            </Text>
            {hasUnread && (
              <LinearGradient
                colors={GRADIENTS.primarySimple as any}
                style={styles.unreadBadge}
              >
                <Text style={styles.unreadCount}>{item.unreadCount}</Text>
              </LinearGradient>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={GRADIENTS.primary as any} style={styles.headerGradient}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
          <Text style={styles.headerSubtitle}>{conversations.length} conversation{conversations.length !== 1 ? 's' : ''}</Text>
        </View>
      </LinearGradient>
      
      <FlatList
        data={conversations}
        renderItem={renderConversationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <LinearGradient
              colors={GRADIENTS.info as any}
              style={styles.emptyIconContainer}
            >
              <MessageSquare size={40} color={COLORS.white} />
            </LinearGradient>
            <Text style={styles.emptyTitle}>Aucun message</Text>
            <Text style={styles.emptyMessage}>Vous n&apos;avez pas encore de messages.{"\n"}Commencez une conversation !</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  unreadConversation: {
    borderLeftColor: COLORS.primary,
    backgroundColor: 'rgba(255, 107, 53, 0.02)',
    shadowOpacity: 0.12,
  },
  avatarContainer: {
    position: 'relative',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  conversationContent: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  partnerName: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  unreadPartnerName: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: '500',
  },
  messagePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  messagePreview: {
    flex: 1,
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  unreadMessagePreview: {
    color: COLORS.text,
    fontWeight: '500',
  },
  unreadBadge: {
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  unreadCount: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
  },
  // Styles pour l'état vide
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
  },
});