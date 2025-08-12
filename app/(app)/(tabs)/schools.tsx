import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { useData } from '@/hooks/data-store';
import { School } from '@/types/auth';
import Card from '@/components/Card';
import EmptyState from '@/components/EmptyState';
import { School as SchoolIcon, Plus, MapPin, Users, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SchoolsScreen() {
  const router = useRouter();
  const { getSchools } = useData();
  const schools = getSchools();

  const renderSchoolItem = ({ item }: { item: School }) => (
    <TouchableOpacity
      style={styles.schoolItem}
      onPress={() => router.push(`/(app)/school/${item.id}` as any)}
      activeOpacity={0.8}
    >
      <Card style={styles.schoolCard}>
        <LinearGradient
          colors={['#ffffff', '#f8f9ff']}
          style={styles.cardGradient}
        >
          <View style={styles.schoolContent}>
            <View style={styles.logoContainer}>
              {item.logo ? (
                <Image source={{ uri: item.logo }} style={styles.schoolLogo} />
              ) : (
                <View style={styles.schoolLogoPlaceholder}>
                  <SchoolIcon size={32} color={COLORS.primary} />
                </View>
              )}
              <View style={styles.logoOverlay} />
            </View>
            
            <View style={styles.schoolInfo}>
              <Text style={styles.schoolName}>{item.name}</Text>
              <View style={styles.addressContainer}>
                <MapPin size={14} color={COLORS.gray} />
                <Text style={styles.schoolAddress}>{item.address}</Text>
              </View>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Users size={12} color={COLORS.primary} />
                  <Text style={styles.statText}>250+ élèves</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.arrowContainer}>
              <ChevronRight size={20} color={COLORS.primary} />
            </View>
          </View>
        </LinearGradient>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f0f4ff', '#ffffff']}
        style={styles.backgroundGradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mes Écoles</Text>
          <Text style={styles.headerSubtitle}>Gérez vos établissements scolaires</Text>
        </View>
        
        <FlatList
          data={schools}
          renderItem={renderSchoolItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              title="Aucune École Trouvée"
              message="Il n'y a pas encore d'écoles enregistrées."
              icon={<SchoolIcon size={60} color={COLORS.gray} />}
            />
          }
        />
        
        <TouchableOpacity style={styles.addButton} onPress={() => {}}>
          <LinearGradient
            colors={[COLORS.primary, '#4f46e5']}
            style={styles.addButtonGradient}
          >
            <Plus size={26} color={COLORS.white} />
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  schoolItem: {
    marginBottom: 20,
  },
  schoolCard: {
    padding: 0,
    overflow: 'hidden',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  cardGradient: {
    borderRadius: 16,
  },
  schoolContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    position: 'relative',
  },
  schoolLogo: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  schoolLogoPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: `${COLORS.primary}30`,
  },
  logoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    backgroundColor: 'rgba(79, 70, 229, 0.05)',
  },
  schoolInfo: {
    marginLeft: 16,
    flex: 1,
  },
  schoolName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  schoolAddress: {
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 6,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}10`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statText: {
    fontSize: 12,
    color: COLORS.primary,
    marginLeft: 4,
    fontWeight: '600',
  },
  arrowContainer: {
    backgroundColor: `${COLORS.primary}15`,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
  },
  addButtonGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});