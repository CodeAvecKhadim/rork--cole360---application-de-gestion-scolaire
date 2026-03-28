import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';
import { useData } from '@/hooks/data-store';
import { Student } from '@/types/auth';
import Card from '@/components/Card';
import StudentItem from '@/components/StudentItem';

import { Clock, Users, BookOpen, UserCheck, BarChart3, MessageSquare, Bell } from 'lucide-react-native';

export default function ClassDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { getClassById, getStudents } = useData();
  
  const classData = getClassById(id);
  const students = classData ? getStudents(classData.id) : [];

  if (!classData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Classe non trouvée</Text>
      </View>
    );
  }

  const handleStudentPress = (student: Student) => {
    router.push(`/(app)/student/${student.id}` as any);
  };

  const canManageClass = user?.role === 'teacher' || user?.role === 'schoolAdmin';

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: classData.name,
          headerBackVisible: true,
          headerBackTitle: 'Retour',
        }} 
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Card title="Informations de la classe">
          <View style={styles.infoItem}>
            <Clock size={20} color={COLORS.gray} />
            <Text style={styles.infoLabel}>Horaire:</Text>
            <Text style={styles.infoValue}>{classData.schedule}</Text>
          </View>
          <View style={styles.infoItem}>
            <Users size={20} color={COLORS.gray} />
            <Text style={styles.infoLabel}>Élèves:</Text>
            <Text style={styles.infoValue}>{students.length}</Text>
          </View>
        </Card>

        {canManageClass && (
          <Card title="Actions rapides">
            <View style={styles.actionGrid}>
              <TouchableOpacity 
                style={[styles.actionCard, styles.attendanceCard]}
                onPress={() => router.push(`/(app)/attendance/${classData.id}` as any)}
              >
                <UserCheck size={28} color={COLORS.white} />
                <Text style={styles.actionCardTitle}>Faire l&apos;appel</Text>
                <Text style={styles.actionCardSubtitle}>Marquer les présences</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionCard, styles.gradesCard]}
                onPress={() => router.push(`/(app)/grades/${classData.id}` as any)}
              >
                <BookOpen size={28} color={COLORS.white} />
                <Text style={styles.actionCardTitle}>Notes</Text>
                <Text style={styles.actionCardSubtitle}>Gérer les évaluations</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.actionGrid}>
              <TouchableOpacity 
                style={[styles.actionCard, styles.messageCard]}
                onPress={() => {}}
              >
                <MessageSquare size={28} color={COLORS.white} />
                <Text style={styles.actionCardTitle}>Messages</Text>
                <Text style={styles.actionCardSubtitle}>Contacter les parents</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionCard, styles.statsCard]}
                onPress={() => {}}
              >
                <BarChart3 size={28} color={COLORS.white} />
                <Text style={styles.actionCardTitle}>Statistiques</Text>
                <Text style={styles.actionCardSubtitle}>Voir les performances</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}

        {canManageClass && (
          <Card title="Notifications automatiques">
            <View style={styles.notificationInfo}>
              <Bell size={20} color={COLORS.primary} />
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>Absences signalées automatiquement</Text>
                <Text style={styles.notificationText}>
                  Les parents reçoivent une notification immédiate lorsque leur enfant est marqué absent.
                </Text>
              </View>
            </View>
          </Card>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Élèves</Text>
        </View>

        {students.length > 0 ? (
          students.map(student => (
            <StudentItem 
              key={student.id} 
              student={student} 
              onPress={handleStudentPress}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>Aucun élève dans cette classe</Text>
        )}
      </ScrollView>
    </>
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
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: 16,
    color: COLORS.gray,
    marginLeft: 12,
    width: 80,
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.danger,
    textAlign: 'center',
    marginTop: 24,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  attendanceCard: {
    backgroundColor: COLORS.secondary,
  },
  gradesCard: {
    backgroundColor: COLORS.primary,
  },
  messageCard: {
    backgroundColor: COLORS.success,
  },
  statsCard: {
    backgroundColor: COLORS.warning,
  },
  actionCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
    marginTop: 8,
    textAlign: 'center',
  },
  actionCardSubtitle: {
    fontSize: 11,
    color: COLORS.white + 'CC',
    marginTop: 4,
    textAlign: 'center',
  },
  notificationInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  notificationText: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
});