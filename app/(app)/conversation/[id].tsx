import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';
import { useData } from '@/hooks/data-store';
import { Message } from '@/types/auth';
import MessageItem from '@/components/MessageItem';
import { Send } from 'lucide-react-native';

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
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor={COLORS.gray}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!newMessage.trim() || sending) && styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Send size={20} color={COLORS.white} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.light,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.grayLight,
  },
});