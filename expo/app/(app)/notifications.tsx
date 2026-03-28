import React from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';
import { useData } from '@/hooks/data-store';
import { Notification } from '@/types/auth';
import NotificationItem from '@/components/NotificationItem';
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

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Notifications',
          headerBackVisible: true,
          headerBackTitle: 'Retour',
          headerTitleStyle: styles.headerTitle,
        }} 
      />
      <View style={styles.container}>
        <LinearGradient colors={GRADIENTS.primary as any} style={styles.headerGradient}>
          <View style={styles.header}>
            <Text style={styles.headerTitleText}>Notifications</Text>
            <Text style={styles.headerSubtitle}>
              {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
              {unreadCount > 0 && ` • ${unreadCount} non lue${unreadCount !== 1 ? 's' : ''}`}
            </Text>
          </View>
        </LinearGradient>
        
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
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <LinearGradient
                colors={GRADIENTS.info as any}
                style={styles.emptyIconContainer}
              >
                <Bell size={40} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.emptyTitle}>Aucune notification</Text>
              <Text style={styles.emptyMessage}>Vous n&apos;avez aucune notification{"\n"}pour le moment.</Text>
            </View>
          }
        />
      </View>
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
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    textAlign: 'center',
  },
  listContent: {
    flexGrow: 1,
    paddingVertical: 8,
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
});