import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';
import { useData } from '@/hooks/data-store';
import { Class } from '@/types/auth';
import ClassItem from '@/components/ClassItem';
import EmptyState from '@/components/EmptyState';
import { BookOpen, Plus } from 'lucide-react-native';

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

  return (
    <View style={styles.container}>
      <FlatList
        data={classes}
        renderItem={({ item }) => (
          <ClassItem 
            classData={item} 
            onPress={handleClassPress}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title="No Classes Found"
            message="There are no classes available yet."
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