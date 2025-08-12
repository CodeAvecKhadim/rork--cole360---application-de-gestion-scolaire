import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';
import { useData } from '@/hooks/data-store';
import { Class } from '@/types/auth';
import ClassItem from '@/components/ClassItem';
import EmptyState from '@/components/EmptyState';
import { BookOpen, Plus, UserCheck, ClipboardList } from 'lucide-react-native';

export default function ClassesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { getClasses } = useData();
  
  // Filter classes by school if user is a school admin
  const classes = user?.role === 'schoolAdmin' && user?.schoolId 
    ? getClasses(user.schoolId)
    : getClasses();

  const handleClassPress = (classData: Class) => {
    router.push(`/(app)/class/${classData.id}` as any);
  };

  const handleAttendancePress = (classData: Class) => {
    router.push(`/(app)/attendance/${classData.id}` as any);
  };

  const handleGradesPress = (classData: Class) => {
    router.push(`/(app)/grades/${classData.id}` as any);
  };

  const canManageClasses = user?.role === 'teacher' || user?.role === 'schoolAdmin';

  const renderClassItem = ({ item }: { item: Class }) => (
    <View style={styles.classContainer}>
      <ClassItem 
        classData={item} 
        onPress={handleClassPress}
      />
      {canManageClasses && (
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.quickActionButton, styles.attendanceButton]}
            onPress={() => handleAttendancePress(item)}
          >
            <UserCheck size={16} color={COLORS.white} />
            <Text style={styles.quickActionText}>Présences</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.quickActionButton, styles.gradesButton]}
            onPress={() => handleGradesPress(item)}
          >
            <ClipboardList size={16} color={COLORS.white} />
            <Text style={styles.quickActionText}>Notes</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={classes}
        renderItem={renderClassItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title="Aucune classe trouvée"
            message={user?.role === 'teacher' 
              ? "Vous n'êtes assigné à aucune classe pour le moment."
              : "Il n'y a pas encore de classes disponibles."
            }
            icon={<BookOpen size={50} color={COLORS.gray} />}
          />
        }
      />
      {user?.role === 'schoolAdmin' && (
        <TouchableOpacity style={styles.addButton} onPress={() => {}}>
          <Plus size={24} color={COLORS.white} />
        </TouchableOpacity>
      )}
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
    paddingBottom: 80,
  },
  classContainer: {
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  attendanceButton: {
    backgroundColor: COLORS.secondary,
  },
  gradesButton: {
    backgroundColor: COLORS.primary,
  },
  quickActionText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});