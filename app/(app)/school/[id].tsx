import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { useData } from '@/hooks/data-store';
import { Class } from '@/types/auth';
import Card from '@/components/Card';
import ClassItem from '@/components/ClassItem';
import { Mail, Phone, MapPin, School } from 'lucide-react-native';

export default function SchoolDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getSchoolById, getClasses } = useData();
  
  const school = getSchoolById(id);
  const classes = school ? getClasses(school.id) : [];

  if (!school) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>School not found</Text>
      </View>
    );
  }

  const handleClassPress = (classData: Class) => {
    router.push(`/(app)/class/${classData.id}` as any);
  };

  return (
    <>
      <Stack.Screen options={{ title: school.name }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          {school.logo ? (
            <Image source={{ uri: school.logo }} style={styles.logo} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <School size={40} color={COLORS.primary} />
            </View>
          )}
          <Text style={styles.name}>{school.name}</Text>
        </View>

        <Card title="Contact Information">
          <View style={styles.infoItem}>
            <MapPin size={20} color={COLORS.gray} />
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoValue}>{school.address}</Text>
          </View>
          <View style={styles.infoItem}>
            <Phone size={20} color={COLORS.gray} />
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{school.phone}</Text>
          </View>
          <View style={styles.infoItem}>
            <Mail size={20} color={COLORS.gray} />
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{school.email}</Text>
          </View>
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Classes</Text>
        </View>

        {classes.length > 0 ? (
          classes.map(classData => (
            <ClassItem 
              key={classData.id} 
              classData={classData} 
              onPress={handleClassPress}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No classes available for this school</Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginBottom: 16,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: `${COLORS.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
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
});