import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, APP_CONFIG } from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';
import { useData } from '@/hooks/data-store';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';
import { Bell, MessageSquare, Users, BookOpen, School } from 'lucide-react-native';

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { 
    getUnreadNotificationsCount, 
    getSchools, 
    getClasses, 
    getStudentsByParent,
    getMessagesByUser
  } = useData();

  const unreadNotifications = user ? getUnreadNotificationsCount(user.id) : 0;
  const messages = user ? getMessagesByUser(user.id) : [];
  const unreadMessages = messages.filter(m => !m.read && m.receiverId === user?.id).length;

  const renderAdminDashboard = () => (
    <>
      <Card title="Vue d'ensemble des écoles">
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <School size={24} color={COLORS.primary} />
            <Text style={styles.statValue}>{getSchools().length}</Text>
            <Text style={styles.statLabel}>Total écoles</Text>
          </View>
          <View style={styles.statItem}>
            <Users size={24} color={COLORS.secondary} />
            <Text style={styles.statValue}>42</Text>
            <Text style={styles.statLabel}>Total utilisateurs</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.manageButton}
          onPress={() => router.push('/(app)/manage-schools' as any)}
        >
          <Text style={styles.manageButtonText}>Gérer les écoles</Text>
        </TouchableOpacity>
      </Card>

      <Card title="Activité récente">
        <Text style={styles.activityText}>Aucune activité récente</Text>
      </Card>
    </>
  );

  const renderSchoolAdminDashboard = () => (
    <>
      <Card title="Vue d'ensemble de l'école">
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <BookOpen size={24} color={COLORS.primary} />
            <Text style={styles.statValue}>
              {user?.schoolId ? getClasses(user.schoolId).length : 0}
            </Text>
            <Text style={styles.statLabel}>Classes</Text>
          </View>
          <View style={styles.statItem}>
            <Users size={24} color={COLORS.secondary} />
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Professeurs</Text>
          </View>
        </View>
      </Card>

      <Card title="Activité récente">
        <Text style={styles.activityText}>Aucune activité récente</Text>
      </Card>
    </>
  );

  const renderTeacherDashboard = () => (
    <>
      <Card title="Vue d'ensemble des classes">
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <BookOpen size={24} color={COLORS.primary} />
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Classes</Text>
          </View>
          <View style={styles.statItem}>
            <Users size={24} color={COLORS.secondary} />
            <Text style={styles.statValue}>68</Text>
            <Text style={styles.statLabel}>Élèves</Text>
          </View>
        </View>
      </Card>

      <Card title="Emploi du temps à venir">
        <View style={styles.scheduleItem}>
          <Text style={styles.scheduleTime}>9h00 - 10h30</Text>
          <Text style={styles.scheduleClass}>Mathématiques - 2nde</Text>
        </View>
        <View style={styles.scheduleItem}>
          <Text style={styles.scheduleTime}>11h00 - 12h30</Text>
          <Text style={styles.scheduleClass}>Sciences - 2nde</Text>
        </View>
      </Card>
    </>
  );

  const renderParentDashboard = () => (
    <>
      <Card title="Enfants">
        <View style={styles.childrenContainer}>
          {user && getStudentsByParent(user.id).map(student => (
            <TouchableOpacity 
              key={student.id}
              style={styles.childItem}
              onPress={() => router.push(`/(app)/student/${student.id}` as any)}
            >
              <Avatar name={student.name} size={50} />
              <Text style={styles.childName}>{student.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <Card title="Notes récentes">
        <Text style={styles.activityText}>Aucune note récente</Text>
      </Card>

      <Card title="Présences">
        <Text style={styles.activityText}>Aucun enregistrement de présence</Text>
      </Card>
    </>
  );

  const renderDashboardByRole = () => {
    switch (user?.role) {
      case 'admin':
        return renderAdminDashboard();
      case 'schoolAdmin':
        return renderSchoolAdminDashboard();
      case 'teacher':
        return renderTeacherDashboard();
      case 'parent':
        return renderParentDashboard();
      default:
        return <Text>Rôle inconnu</Text>;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour,</Text>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.slogan}>{APP_CONFIG.slogan}</Text>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/(app)/notifications' as any)}
          >
            <Bell size={24} color={COLORS.text} />
            {unreadNotifications > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadNotifications}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/(app)/(tabs)/messages' as any)}
          >
            <MessageSquare size={24} color={COLORS.text} />
            {unreadMessages > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadMessages}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {renderDashboardByRole()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.gray,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  slogan: {
    fontSize: 12,
    color: COLORS.primary,
    fontStyle: 'italic',
    fontWeight: '500',
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  statItem: {
    alignItems: 'center',
    padding: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  activityText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    padding: 16,
  },
  scheduleItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  scheduleTime: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  scheduleClass: {
    fontSize: 16,
    color: COLORS.text,
  },
  childrenContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 8,
  },
  childItem: {
    alignItems: 'center',
    margin: 8,
    width: 80,
  },
  childName: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 8,
  },
  manageButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  manageButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});