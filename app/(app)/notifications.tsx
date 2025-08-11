import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Stack } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';
import { useData } from '@/hooks/data-store';
import { Notification } from '@/types/auth';
import NotificationItem from '@/components/NotificationItem';
import EmptyState from '@/components/EmptyState';
import { Bell } from 'lucide-react-native';

export default function NotificationsScreen() {
  const { user } = useAuth();
  const { getNotificationsByUser, markNotificationAsRead } = useData();
  
  const notifications = user ? getNotificationsByUser(user.id) : [];

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Notifications',
          headerBackVisible: true,
          headerBackTitle: 'Retour',
        }} 
      />
      <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <NotificationItem 
            notification={item} 
            onPress={handleNotificationPress}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title="Aucune notification"
            message="Vous n'avez aucune notification pour le moment."
            icon={<Bell size={50} color={COLORS.gray} />}
          />
        }
      />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    flexGrow: 1,
  },
});