import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, APP_CONFIG } from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';
import { useData } from '@/hooks/data-store';
import Card from '@/components/Card';
import StatsCard from '@/components/StatsCard';
import Avatar from '@/components/Avatar';
import { Bell, MessageSquare, Users, BookOpen, School, TrendingUp, Calendar, Award, Target, Clock, CheckCircle, AlertTriangle, BarChart3, PieChart, Activity } from 'lucide-react-native';

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
      <View style={styles.statsGrid}>
        <LinearGradient colors={GRADIENTS.primarySimple as any} style={styles.statCard}>
          <School size={32} color={COLORS.white} />
          <Text style={styles.statCardValue}>{getSchools().length}</Text>
          <Text style={styles.statCardLabel}>Écoles</Text>
        </LinearGradient>
        <LinearGradient colors={GRADIENTS.secondary as any} style={styles.statCard}>
          <Users size={32} color={COLORS.white} />
          <Text style={styles.statCardValue}>42</Text>
          <Text style={styles.statCardLabel}>Utilisateurs</Text>
        </LinearGradient>
      </View>

      <Card title="Gestion des écoles" style={styles.enhancedCard}>
        <TouchableOpacity 
          style={styles.gradientButton}
          onPress={() => router.push('/(app)/manage-schools' as any)}
        >
          <LinearGradient colors={GRADIENTS.primarySimple as any} style={styles.gradientButtonInner}>
            <School size={20} color={COLORS.white} />
            <Text style={styles.gradientButtonText}>Gérer les écoles</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Card>

      <Card title="Activité récente" style={styles.enhancedCard}>
        <View style={styles.activityContainer}>
          <TrendingUp size={48} color={COLORS.primary} style={styles.activityIcon} />
          <Text style={styles.activityText}>Aucune activité récente</Text>
          <Text style={styles.activitySubtext}>Les dernières actions apparaîtront ici</Text>
        </View>
      </Card>
    </>
  );

  const renderSchoolAdminDashboard = () => (
    <>
      <View style={styles.statsGrid}>
        <LinearGradient colors={GRADIENTS.primarySimple as any} style={styles.statCard}>
          <BookOpen size={32} color={COLORS.white} />
          <Text style={styles.statCardValue}>
            {user?.schoolId ? getClasses(user.schoolId).length : 0}
          </Text>
          <Text style={styles.statCardLabel}>Classes</Text>
        </LinearGradient>
        <LinearGradient colors={GRADIENTS.secondary as any} style={styles.statCard}>
          <Users size={32} color={COLORS.white} />
          <Text style={styles.statCardValue}>24</Text>
          <Text style={styles.statCardLabel}>Professeurs</Text>
        </LinearGradient>
      </View>

      <Card title="Tableau de bord école" style={styles.enhancedCard}>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionItem}>
            <LinearGradient colors={GRADIENTS.info as any} style={styles.quickActionGradient}>
              <Calendar size={24} color={COLORS.white} />
            </LinearGradient>
            <Text style={styles.quickActionText}>Emploi du temps</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionItem}>
            <LinearGradient colors={GRADIENTS.warm as any} style={styles.quickActionGradient}>
              <Award size={24} color={COLORS.white} />
            </LinearGradient>
            <Text style={styles.quickActionText}>Évaluations</Text>
          </TouchableOpacity>
        </View>
      </Card>

      <Card title="Activité récente" style={styles.enhancedCard}>
        <View style={styles.activityContainer}>
          <TrendingUp size={48} color={COLORS.primary} style={styles.activityIcon} />
          <Text style={styles.activityText}>Aucune activité récente</Text>
          <Text style={styles.activitySubtext}>Les dernières actions apparaîtront ici</Text>
        </View>
      </Card>
    </>
  );

  const renderTeacherDashboard = () => (
    <>
      <View style={styles.statsGrid}>
        <LinearGradient colors={GRADIENTS.primarySimple as any} style={styles.statCard}>
          <BookOpen size={32} color={COLORS.white} />
          <Text style={styles.statCardValue}>3</Text>
          <Text style={styles.statCardLabel}>Classes</Text>
        </LinearGradient>
        <LinearGradient colors={GRADIENTS.secondary as any} style={styles.statCard}>
          <Users size={32} color={COLORS.white} />
          <Text style={styles.statCardValue}>68</Text>
          <Text style={styles.statCardLabel}>Élèves</Text>
        </LinearGradient>
      </View>

      <Card title="Emploi du temps à venir" style={styles.enhancedCard}>
        <View style={styles.scheduleContainer}>
          <LinearGradient colors={GRADIENTS.info as any} style={styles.scheduleCard}>
            <View style={styles.scheduleHeader}>
              <Calendar size={20} color={COLORS.white} />
              <Text style={styles.scheduleTime}>9h00 - 10h30</Text>
            </View>
            <Text style={styles.scheduleClass}>Mathématiques - 2nde</Text>
          </LinearGradient>
          <LinearGradient colors={GRADIENTS.warm as any} style={styles.scheduleCard}>
            <View style={styles.scheduleHeader}>
              <Calendar size={20} color={COLORS.white} />
              <Text style={styles.scheduleTime}>11h00 - 12h30</Text>
            </View>
            <Text style={styles.scheduleClass}>Sciences - 2nde</Text>
          </LinearGradient>
        </View>
      </Card>
    </>
  );

  const renderParentDashboard = () => (
    <>
      <Card title="Mes enfants" style={styles.enhancedCard}>
        <View style={styles.childrenContainer}>
          {user && getStudentsByParent(user.id).map(student => (
            <TouchableOpacity 
              key={student.id}
              style={styles.childCard}
              onPress={() => router.push(`/(app)/student/${student.id}` as any)}
            >
              <LinearGradient colors={GRADIENTS.primarySimple as any} style={styles.childGradient}>
                <Avatar name={student.name} size={50} />
                <Text style={styles.childName}>{student.name}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <View style={styles.parentStatsGrid}>
        <LinearGradient colors={GRADIENTS.success as any} style={styles.parentStatCard}>
          <Award size={28} color={COLORS.white} />
          <Text style={styles.parentStatValue}>A+</Text>
          <Text style={styles.parentStatLabel}>Dernière note</Text>
        </LinearGradient>
        <LinearGradient colors={GRADIENTS.info as any} style={styles.parentStatCard}>
          <Calendar size={28} color={COLORS.white} />
          <Text style={styles.parentStatValue}>98%</Text>
          <Text style={styles.parentStatLabel}>Présence</Text>
        </LinearGradient>
      </View>

      <Card title="Activité récente" style={styles.enhancedCard}>
        <View style={styles.activityContainer}>
          <TrendingUp size={48} color={COLORS.primary} style={styles.activityIcon} />
          <Text style={styles.activityText}>Tout va bien !</Text>
          <Text style={styles.activitySubtext}>Aucune nouvelle notification</Text>
        </View>
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
    <View style={styles.container}>
      <LinearGradient colors={GRADIENTS.primary as any} style={styles.headerGradient}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Bonjour,</Text>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.slogan}>{APP_CONFIG.slogan}</Text>
          </View>
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => router.push('/(app)/notifications' as any)}
            >
              <Bell size={24} color={COLORS.white} />
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
              <MessageSquare size={24} color={COLORS.white} />
              {unreadMessages > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadMessages}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        {renderDashboardByRole()}
      </ScrollView>
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
    paddingHorizontal: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.white,
    marginVertical: 4,
  },
  slogan: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontStyle: 'italic',
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 12,
    marginLeft: 8,
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
  },
  // Nouveaux styles pour les cartes statistiques
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  statCardValue: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.white,
    marginVertical: 8,
  },
  statCardLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    textAlign: 'center',
  },
  // Styles pour les cartes améliorées
  enhancedCard: {
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  // Styles pour les boutons avec dégradé
  gradientButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 12,
  },
  gradientButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  gradientButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  // Styles pour les conteneurs d'activité
  activityContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  activityIcon: {
    marginBottom: 12,
    opacity: 0.6,
  },
  activityText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  activitySubtext: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
  },
  // Styles pour les actions rapides
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
  },
  quickActionItem: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  quickActionGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Styles pour l'emploi du temps
  scheduleContainer: {
    gap: 12,
  },
  scheduleCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  scheduleTime: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '700',
  },
  scheduleClass: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  // Styles pour les enfants (parents)
  childCard: {
    margin: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  childGradient: {
    padding: 16,
    alignItems: 'center',
    minWidth: 120,
  },
  childName: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
  },
  // Styles pour les statistiques des parents
  parentStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  parentStatCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  parentStatValue: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.white,
    marginVertical: 6,
  },
  parentStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    textAlign: 'center',
  },
  // Anciens styles conservés pour compatibilité
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
  scheduleItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
  // Nouveaux styles pour les améliorations
  analyticsContainer: {
    gap: 16,
  },
  analyticsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: `${COLORS.primary}05`,
    borderRadius: 12,
    gap: 16,
  },
  analyticsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyticsContent: {
    flex: 1,
  },
  analyticsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  analyticsSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  recommendationsContainer: {
    gap: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  recommendationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  strengthsContainer: {
    gap: 20,
  },
  strengthItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  strengthIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  strengthContent: {
    flex: 1,
  },
  strengthTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  strengthText: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  communicationContainer: {
    gap: 12,
  },
  communicationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: `${COLORS.primary}05`,
    borderRadius: 12,
    gap: 16,
  },
  communicationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  communicationContent: {
    flex: 1,
  },
  communicationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  communicationSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  quickStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  quickStatItem: {
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
    fontWeight: '600',
  },
  systemAnalyticsContainer: {
    gap: 16,
  },
  systemAnalyticsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: `${COLORS.primary}05`,
    borderRadius: 12,
    gap: 16,
  },
  systemAnalyticsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  systemAnalyticsContent: {
    flex: 1,
  },
  systemAnalyticsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  systemAnalyticsSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  priorityActionsContainer: {
    gap: 16,
  },
  priorityActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: `${COLORS.primary}05`,
    borderRadius: 12,
    gap: 16,
  },
  priorityActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityActionContent: {
    flex: 1,
  },
  priorityActionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  priorityActionSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
});