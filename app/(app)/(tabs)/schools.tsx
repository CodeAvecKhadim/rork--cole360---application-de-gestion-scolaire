import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { useData } from '@/hooks/data-store';
import { School } from '@/types/auth';
import Card from '@/components/Card';
import EmptyState from '@/components/EmptyState';
import { School as SchoolIcon, Plus } from 'lucide-react-native';

export default function SchoolsScreen() {
  const router = useRouter();
  const { getSchools } = useData();
  const schools = getSchools();

  const renderSchoolItem = ({ item }: { item: School }) => (
    <TouchableOpacity
      style={styles.schoolItem}
      onPress={() => router.push(`/(app)/school/${item.id}` as any)}
      activeOpacity={0.7}
    >
      <Card style={styles.schoolCard}>
        <View style={styles.schoolContent}>
          {item.logo ? (
            <Image source={{ uri: item.logo }} style={styles.schoolLogo} />
          ) : (
            <View style={styles.schoolLogoPlaceholder}>
              <SchoolIcon size={30} color={COLORS.primary} />
            </View>
          )}
          <View style={styles.schoolInfo}>
            <Text style={styles.schoolName}>{item.name}</Text>
            <Text style={styles.schoolAddress}>{item.address}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={schools}
        renderItem={renderSchoolItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title="No Schools Found"
            message="There are no schools registered yet."
            icon={<SchoolIcon size={50} color={COLORS.gray} />}
          />
        }
      />
      <TouchableOpacity style={styles.addButton} onPress={() => {}}>
        <Plus size={24} color={COLORS.white} />
      </TouchableOpacity>
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
  schoolItem: {
    marginBottom: 16,
  },
  schoolCard: {
    padding: 0,
    overflow: 'hidden',
  },
  schoolContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  schoolLogo: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  schoolLogoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: `${COLORS.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  schoolInfo: {
    marginLeft: 16,
    flex: 1,
  },
  schoolName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  schoolAddress: {
    fontSize: 14,
    color: COLORS.gray,
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