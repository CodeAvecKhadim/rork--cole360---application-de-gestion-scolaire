import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';
import { useData } from '@/hooks/data-store';
import Avatar from '@/components/Avatar';
import EmptyState from '@/components/EmptyState';
import { MessageSquare } from 'lucide-react-native';
import { formatDistanceToNow } from '@/utils/date';

export default function MessagesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { getMessagesByUser } = useData();
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const messages = getMessagesByUser(user.id);
      
      // Group messages by conversation partner
      const conversationMap = new Map();
      
      messages.forEach(message => {
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
      
      // Convert map to array and sort by last message time
      const conversationsArray = Array.from(conversationMap.values());
      conversationsArray.sort((a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt);
      
      setConversations(conversationsArray);
    }
  }, [user, getMessagesByUser]);

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
    
    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => router.push(`/(app)/conversation/${item.id}` as any)}
        activeOpacity={0.7}
      >
        <Avatar name={partnerName} size={50} />
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.partnerName}>{partnerName}</Text>
            <Text style={styles.timeText}>{formatDistanceToNow(createdAt)}</Text>
          </View>
          <View style={styles.messagePreviewContainer}>
            <Text style={styles.messagePreview} numberOfLines={1}>
              {content}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        renderItem={renderConversationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title="No Messages"
            message="You don't have any messages yet."
            icon={<MessageSquare size={50} color={COLORS.gray} />}
          />
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
  listContent: {
    padding: 16,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  conversationContent: {
    flex: 1,
    marginLeft: 12,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  messagePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messagePreview: {
    flex: 1,
    fontSize: 14,
    color: COLORS.gray,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
});