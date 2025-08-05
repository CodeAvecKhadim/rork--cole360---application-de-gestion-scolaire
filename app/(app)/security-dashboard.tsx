// Tableau de bord de sécurité pour les administrateurs
// Affiche les logs de sécurité, tentatives de connexion et sessions actives
import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Stack } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { useSecurity } from '@/hooks/security-store';

import ProtectedRoute from '@/components/ProtectedRoute';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  Activity, 
  Clock, 
  MapPin, 
  Smartphone,
  Eye,
  EyeOff,
  RefreshCw,
  TrendingUp,
  TrendingDown
} from 'lucide-react-native';

type TabType = 'overview' | 'attempts' | 'sessions' | 'logs';

export default function SecurityDashboard() {
  const {
    loginAttempts,
    securityLogs,
    activeSessions,
    cleanupOldData,
  } = useSecurity();
  
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [showDetails, setShowDetails] = useState<{ [key: string]: boolean }>({});

  // Fonction de rafraîchissement
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await cleanupOldData();
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Statistiques de sécurité
  const getSecurityStats = () => {
    const now = Date.now();
    const last24h = now - (24 * 60 * 60 * 1000);
    const last7d = now - (7 * 24 * 60 * 60 * 1000);

    const recentAttempts = loginAttempts.filter(attempt => attempt.timestamp > last24h);
    const failedAttempts = recentAttempts.filter(attempt => !attempt.success);
    const successfulAttempts = recentAttempts.filter(attempt => attempt.success);
    
    const recentLogs = securityLogs.filter(log => log.timestamp > last24h);
    const activeSess = activeSessions.filter(session => session.isActive && session.expiresAt > now);
    
    const weeklyAttempts = loginAttempts.filter(attempt => attempt.timestamp > last7d);
    const weeklyFailed = weeklyAttempts.filter(attempt => !attempt.success);

    return {
      totalAttempts24h: recentAttempts.length,
      failedAttempts24h: failedAttempts.length,
      successfulAttempts24h: successfulAttempts.length,
      securityEvents24h: recentLogs.length,
      activeSessions: activeSess.length,
      weeklyFailureRate: weeklyAttempts.length > 0 ? (weeklyFailed.length / weeklyAttempts.length) * 100 : 0,
      suspiciousActivity: failedAttempts.length > 5,
    };
  };

  const stats = getSecurityStats();

  // Fonction pour basculer l'affichage des détails
  const toggleDetails = (id: string) => {
    setShowDetails(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Formatage des dates
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Rendu de l'onglet Vue d'ensemble
  const renderOverview = () => (
    <ScrollView 
      style={styles.tabContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      <View style={styles.statsGrid}>
        <Card style={[styles.statCard, stats.suspiciousActivity && styles.alertCard]}>
          <View style={styles.statHeader}>
            <Shield size={24} color={stats.suspiciousActivity ? COLORS.danger : COLORS.primary} />
            <Text style={styles.statValue}>{stats.totalAttempts24h}</Text>
          </View>
          <Text style={styles.statLabel}>Tentatives 24h</Text>
          {stats.suspiciousActivity && (
            <Badge text="Activité suspecte" variant="danger" style={styles.alertBadge} />
          )}
        </Card>

        <Card style={styles.statCard}>
          <View style={styles.statHeader}>
            <AlertTriangle size={24} color={COLORS.warning} />
            <Text style={styles.statValue}>{stats.failedAttempts24h}</Text>
          </View>
          <Text style={styles.statLabel}>Échecs 24h</Text>
        </Card>

        <Card style={styles.statCard}>
          <View style={styles.statHeader}>
            <Users size={24} color={COLORS.success} />
            <Text style={styles.statValue}>{stats.activeSessions}</Text>
          </View>
          <Text style={styles.statLabel}>Sessions actives</Text>
        </Card>

        <Card style={styles.statCard}>
          <View style={styles.statHeader}>
            <Activity size={24} color={COLORS.info} />
            <Text style={styles.statValue}>{stats.securityEvents24h}</Text>
          </View>
          <Text style={styles.statLabel}>Événements 24h</Text>
        </Card>
      </View>

      <Card style={styles.trendCard}>
        <View style={styles.trendHeader}>
          <Text style={styles.trendTitle}>Taux d&apos;échec hebdomadaire</Text>
          {stats.weeklyFailureRate > 20 ? (
            <TrendingUp size={20} color={COLORS.danger} />
          ) : (
            <TrendingDown size={20} color={COLORS.success} />
          )}
        </View>
        <Text style={[styles.trendValue, { color: stats.weeklyFailureRate > 20 ? COLORS.danger : COLORS.success }]}>
          {stats.weeklyFailureRate.toFixed(1)}%
        </Text>
        <Text style={styles.trendDescription}>
          {stats.weeklyFailureRate > 20 ? 'Taux élevé - Surveillance recommandée' : 'Taux normal'}
        </Text>
      </Card>
    </ScrollView>
  );

  // Rendu de l'onglet Tentatives de connexion
  const renderAttempts = () => (
    <ScrollView 
      style={styles.tabContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      {loginAttempts.slice(-20).reverse().map((attempt) => (
        <Card key={attempt.id} style={styles.attemptCard}>
          <View style={styles.attemptHeader}>
            <View style={styles.attemptInfo}>
              <Text style={styles.attemptEmail}>{attempt.email}</Text>
              <Text style={styles.attemptTime}>{formatDate(attempt.timestamp)}</Text>
            </View>
            <Badge 
              text={attempt.success ? 'Succès' : 'Échec'} 
              variant={attempt.success ? 'success' : 'danger'} 
            />
          </View>
          
          <TouchableOpacity 
            style={styles.detailsToggle}
            onPress={() => toggleDetails(attempt.id)}
          >
            <Text style={styles.detailsToggleText}>
              {showDetails[attempt.id] ? 'Masquer' : 'Afficher'} les détails
            </Text>
            {showDetails[attempt.id] ? (
              <EyeOff size={16} color={COLORS.gray} />
            ) : (
              <Eye size={16} color={COLORS.gray} />
            )}
          </TouchableOpacity>

          {showDetails[attempt.id] && (
            <View style={styles.attemptDetails}>
              <View style={styles.detailRow}>
                <MapPin size={16} color={COLORS.gray} />
                <Text style={styles.detailText}>IP: {attempt.ipAddress}</Text>
              </View>
              <View style={styles.detailRow}>
                <Smartphone size={16} color={COLORS.gray} />
                <Text style={styles.detailText} numberOfLines={2}>
                  {attempt.userAgent}
                </Text>
              </View>
              {attempt.failureReason && (
                <View style={styles.detailRow}>
                  <AlertTriangle size={16} color={COLORS.danger} />
                  <Text style={[styles.detailText, { color: COLORS.danger }]}>
                    {attempt.failureReason}
                  </Text>
                </View>
              )}
            </View>
          )}
        </Card>
      ))}
    </ScrollView>
  );

  // Rendu de l'onglet Sessions actives
  const renderSessions = () => (
    <ScrollView 
      style={styles.tabContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      {activeSessions.filter(session => session.isActive).map((session) => (
        <Card key={session.id} style={styles.sessionCard}>
          <View style={styles.sessionHeader}>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionDevice}>{session.deviceName}</Text>
              <Text style={styles.sessionTime}>
                Créée: {formatDate(session.createdAt)}
              </Text>
            </View>
            <Badge 
              text={session.expiresAt > Date.now() ? 'Active' : 'Expirée'} 
              variant={session.expiresAt > Date.now() ? 'success' : 'warning'} 
            />
          </View>

          <TouchableOpacity 
            style={styles.detailsToggle}
            onPress={() => toggleDetails(session.id)}
          >
            <Text style={styles.detailsToggleText}>
              {showDetails[session.id] ? 'Masquer' : 'Afficher'} les détails
            </Text>
            {showDetails[session.id] ? (
              <EyeOff size={16} color={COLORS.gray} />
            ) : (
              <Eye size={16} color={COLORS.gray} />
            )}
          </TouchableOpacity>

          {showDetails[session.id] && (
            <View style={styles.sessionDetails}>
              <View style={styles.detailRow}>
                <MapPin size={16} color={COLORS.gray} />
                <Text style={styles.detailText}>IP: {session.ipAddress}</Text>
              </View>
              <View style={styles.detailRow}>
                <Clock size={16} color={COLORS.gray} />
                <Text style={styles.detailText}>
                  Dernière activité: {formatDate(session.lastActivity)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Smartphone size={16} color={COLORS.gray} />
                <Text style={styles.detailText}>ID: {session.deviceId}</Text>
              </View>
            </View>
          )}
        </Card>
      ))}
    </ScrollView>
  );

  // Rendu de l'onglet Logs de sécurité
  const renderLogs = () => (
    <ScrollView 
      style={styles.tabContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      {securityLogs.slice(-30).reverse().map((log) => (
        <Card key={log.id} style={styles.logCard}>
          <View style={styles.logHeader}>
            <View style={styles.logInfo}>
              <Text style={styles.logAction}>{log.action}</Text>
              <Text style={styles.logTime}>{formatDate(log.timestamp)}</Text>
            </View>
            <Badge 
              text={log.success ? 'Succès' : 'Échec'} 
              variant={log.success ? 'success' : 'danger'} 
            />
          </View>
          
          <Text style={styles.logResource}>Ressource: {log.resource}</Text>
          
          {log.details && (
            <TouchableOpacity 
              style={styles.detailsToggle}
              onPress={() => toggleDetails(log.id)}
            >
              <Text style={styles.detailsToggleText}>
                {showDetails[log.id] ? 'Masquer' : 'Afficher'} les détails
              </Text>
              {showDetails[log.id] ? (
                <EyeOff size={16} color={COLORS.gray} />
              ) : (
                <Eye size={16} color={COLORS.gray} />
              )}
            </TouchableOpacity>
          )}

          {showDetails[log.id] && log.details && (
            <View style={styles.logDetails}>
              <Text style={styles.detailsJson}>
                {JSON.stringify(log.details, null, 2)}
              </Text>
            </View>
          )}
        </Card>
      ))}
    </ScrollView>
  );

  return (
    <ProtectedRoute allowedRoles={['admin', 'schoolAdmin']}>
      <View style={styles.container}>
        <Stack.Screen 
          options={{ 
            title: 'Tableau de bord sécurité',
            headerRight: () => (
              <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
                <RefreshCw size={20} color={COLORS.primary} />
              </TouchableOpacity>
            ),
          }} 
        />

        <View style={styles.tabBar}>
          {[
            { key: 'overview', label: 'Vue d&apos;ensemble', icon: Shield },
            { key: 'attempts', label: 'Connexions', icon: Activity },
            { key: 'sessions', label: 'Sessions', icon: Users },
            { key: 'logs', label: 'Logs', icon: AlertTriangle },
          ].map(({ key, label, icon: Icon }) => (
            <TouchableOpacity
              key={key}
              style={[styles.tab, activeTab === key && styles.activeTab]}
              onPress={() => setActiveTab(key as TabType)}
            >
              <Icon size={16} color={activeTab === key ? COLORS.primary : COLORS.gray} />
              <Text style={[styles.tabText, activeTab === key && styles.activeTabText]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'attempts' && renderAttempts()}
        {activeTab === 'sessions' && renderSessions()}
        {activeTab === 'logs' && renderLogs()}
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  refreshButton: {
    padding: 8,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 4,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: COLORS.gray,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '600' as const,
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
  },
  alertCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: '500' as const,
  },
  alertBadge: {
    marginTop: 8,
  },
  trendCard: {
    padding: 16,
    marginBottom: 16,
  },
  trendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  trendTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  trendValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  trendDescription: {
    fontSize: 14,
    color: COLORS.gray,
  },
  attemptCard: {
    marginBottom: 12,
    padding: 16,
  },
  attemptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  attemptInfo: {
    flex: 1,
  },
  attemptEmail: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  attemptTime: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  detailsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 8,
  },
  detailsToggleText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500' as const,
  },
  attemptDetails: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.gray,
    flex: 1,
  },
  sessionCard: {
    marginBottom: 12,
    padding: 16,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionDevice: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  sessionTime: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  sessionDetails: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  logCard: {
    marginBottom: 12,
    padding: 16,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logInfo: {
    flex: 1,
  },
  logAction: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  logTime: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  logResource: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 8,
  },
  logDetails: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  detailsJson: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: COLORS.gray,
    backgroundColor: COLORS.light,
    padding: 8,
    borderRadius: 4,
  },
});