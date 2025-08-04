import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';
import { useData } from '@/hooks/data-store';
import { Student } from '@/types/auth';
import Card from '@/components/Card';
import StudentItem from '@/components/StudentItem';
import Button from '@/components/Button';
import { Clock, Users, BookOpen, UserCheck, BarChart3 } from 'lucide-react-native';

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
      <Stack.Screen options={{ title: classData.name }} />
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
          <Card title="Gestion de la classe">
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push(`/(app)/grades/${classData.id}` as any)}
              >
                <BookOpen size={24} color={COLORS.primary} />
                <Text style={styles.actionButtonText}>Notes</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push(`/(app)/attendance/${classData.id}` as any)}
              >
                <UserCheck size={24} color={COLORS.secondary} />
                <Text style={styles.actionButtonText}>Présences</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => {}}
              >
                <BarChart3 size={24} color={COLORS.success} />
                <Text style={styles.actionButtonText}>Statistiques</Text>
              </TouchableOpacity>
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  actionButton: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    minWidth: 80,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 8,
    textAlign: 'center',
  },
});