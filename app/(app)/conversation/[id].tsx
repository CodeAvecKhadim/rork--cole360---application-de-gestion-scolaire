import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Text
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';
import { useData } from '@/hooks/data-store';
import { Message } from '@/types/auth';
import MessageItem from '@/components/MessageItem';
import { Send, MessageCircle } from 'lucide-react-native';

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { getConversation, sendMessage, markMessageAsRead } = useData();
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const partnerId = id;
  const messages = user ? getConversation(user.id, partnerId) : [];

  // Mark unread messages as read
  useEffect(() => {
    if (!user?.id) return;

    const messagesToMarkAsRead = messages.filter(
      (message) => message.receiverId === user.id && !message.read
    );

    if (messagesToMarkAsRead.length === 0) return;

    messagesToMarkAsRead.forEach((message) => {
      markMessageAsRead(message.id);
    });
  }, [user?.id, messages.length]);

  const getPartnerName = (partnerId: string) => {
    // In a real app, you would fetch the user name from a users collection
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

  const handleSendMessage = () => {
    if (!user || !newMessage.trim()) return;

    setSending(true);
    
    try {
      sendMessage({
        senderId: user.id,
        receiverId: partnerId,
        content: newMessage.trim(),
      });
      
      setNewMessage('');
      
      // Scroll to bottom after sending
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: getPartnerName(partnerId),
          headerTitleStyle: styles.headerTitle,
          headerBackVisible: true,
          headerBackTitle: 'Retour',
        }} 
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => (
            <MessageItem 
              message={item} 
              isCurrentUser={user?.id === item.senderId}
            />
          )}
          keyExtractor={(item: Message) => item.id}
          contentContainerStyle={styles.messagesList}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <LinearGradient
                colors={GRADIENTS.info as any}
                style={styles.emptyIconContainer}
              >
                <MessageCircle size={40} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.emptyTitle}>Commencez la conversation</Text>
              <Text style={styles.emptyMessage}>Envoyez votre premier message à {getPartnerName(partnerId)}</Text>
            </View>
          }
        />

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Tapez votre message..."
              placeholderTextColor={COLORS.gray}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!newMessage.trim() || sending) && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              activeOpacity={0.8}
            >
              {sending ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : newMessage.trim() ? (
                <LinearGradient
                  colors={GRADIENTS.primary as any}
                  style={styles.sendButtonGradient}
                >
                  <Send size={18} color={COLORS.white} />
                </LinearGradient>
              ) : (
                <Send size={18} color={COLORS.gray} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexGrow: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
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
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 107, 53, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    maxHeight: 120,
    fontSize: 16,
    lineHeight: 22,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.1)',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  sendButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.grayLight,
  },
});