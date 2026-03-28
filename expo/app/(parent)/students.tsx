import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';
import { useData } from '@/hooks/data-store';
import { Student } from '@/types/auth';
import StudentItem from '@/components/StudentItem';
import EmptyState from '@/components/EmptyState';
import { Users } from 'lucide-react-native';

export default function StudentsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { getStudentsByParent } = useData();
  
  const students = user ? getStudentsByParent(user.id) : [];

  const handleStudentPress = (student: Student) => {
    router.push(`/(app)/student/${student.id}` as any);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={students}
        renderItem={({ item }) => (
          <StudentItem 
            student={item} 
            onPress={handleStudentPress}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title="No Students Found"
            message="You don't have any students linked to your account."
            icon={<Users size={50} color={COLORS.gray} />}
          />
        }
      />
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
  },
});