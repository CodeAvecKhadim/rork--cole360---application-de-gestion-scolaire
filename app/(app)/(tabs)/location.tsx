import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { MapPin, AlertTriangle, Settings, Shield, Plus } from 'lucide-react-native';
import * as Location from 'expo-location';
import { COLORS } from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';
import { useData } from '@/hooks/data-store';
import { LocationItem } from '@/components/LocationItem';
import { LocationAlertItem } from '@/components/LocationAlertItem';
import EmptyState from '@/components/EmptyState';
import Button from '@/components/Button';

export default function LocationScreen() {
  const { user } = useAuth();
  const { 
    getStudentsByParent, 
    getLocationAlerts, 
    getUnacknowledgedAlertsCount,
    acknowledgeLocationAlert,
    toggleStudentLocationTracking,
    updateStudentLocation
  } = useData();

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);

  const students = getStudentsByParent(user?.id || '');
  const locationAlerts = getLocationAlerts(user?.id || '');
  const unacknowledgedCount = getUnacknowledgedAlertsCount(user?.id || '');

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    if (Platform.OS === 'web') {
      setLocationPermission(true);
      return;
    }

    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
    } catch (error) {
      console.log('Error checking location permission:', error);
      setLocationPermission(false);
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Géolocalisation',
        'La géolocalisation n\'est pas disponible sur le web dans cette démo.'
      );
      return;
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermission(true);
        Alert.alert(
          'Permission accordée',
          'Vous pouvez maintenant activer la localisation pour vos enfants.'
        );
      } else {
        Alert.alert(
          'Permission refusée',
          'La géolocalisation est nécessaire pour localiser vos enfants.'
        );
      }
    } catch (error) {
      console.log('Error requesting location permission:', error);
      Alert.alert('Erreur', 'Impossible de demander la permission de géolocalisation.');
    }
  };

  const handleToggleLocationTracking = (studentId: string, enabled: boolean) => {
    if (!locationPermission && enabled) {
      Alert.alert(
        'Permission requise',
        'Vous devez d\'abord autoriser la géolocalisation.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Autoriser', onPress: requestLocationPermission }
        ]
      );
      return;
    }

    toggleStudentLocationTracking(studentId, enabled);
    
    if (enabled) {
      // Simulate location update for demo
      const mockLocation = {
        studentId,
        latitude: 48.8566 + (Math.random() - 0.5) * 0.01,
        longitude: 2.3522 + (Math.random() - 0.5) * 0.01,
        accuracy: Math.floor(Math.random() * 20) + 5,
        timestamp: Date.now(),
        address: 'École Centrale, 123 Education St, Paris',
        isInSchool: Math.random() > 0.5,
        batteryLevel: Math.floor(Math.random() * 100),
        deviceId: `device_${studentId}_001`,
      };
      updateStudentLocation(mockLocation);
    }
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    acknowledgeLocationAlert(alertId);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await checkLocationPermission();
    
    // Simulate refreshing location data
    students.forEach(student => {
      if (student.locationEnabled) {
        const mockLocation = {
          studentId: student.id,
          latitude: 48.8566 + (Math.random() - 0.5) * 0.01,
          longitude: 2.3522 + (Math.random() - 0.5) * 0.01,
          accuracy: Math.floor(Math.random() * 20) + 5,
          timestamp: Date.now(),
          address: 'École Centrale, 123 Education St, Paris',
          isInSchool: Math.random() > 0.5,
          batteryLevel: Math.floor(Math.random() * 100),
          deviceId: `device_${student.id}_001`,
        };
        updateStudentLocation(mockLocation);
      }
    });
    
    setRefreshing(false);
  };

  const studentsWithLocation = students.filter(student => student.locationEnabled);
  const studentsWithoutLocation = students.filter(student => !student.locationEnabled);

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Localisation des enfants',
          headerRight: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => Alert.alert('Paramètres', 'Fonctionnalité à venir')}
            >
              <Settings size={24} color={COLORS.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Permission Status */}
        {!locationPermission && (
          <View style={styles.permissionCard}>
            <Shield size={24} color={COLORS.warning} />
            <View style={styles.permissionContent}>
              <Text style={styles.permissionTitle}>Permission requise</Text>
              <Text style={styles.permissionText}>
                Autorisez la géolocalisation pour localiser vos enfants
              </Text>
            </View>
            <Button
              title="Autoriser"
              onPress={requestLocationPermission}
              variant="primary"
              size="small"
            />
          </View>
        )}

        {/* Alerts Section */}
        {locationAlerts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AlertTriangle size={20} color={COLORS.warning} />
              <Text style={styles.sectionTitle}>
                Alertes {unacknowledgedCount > 0 && `(${unacknowledgedCount})`}
              </Text>
            </View>
            
            {locationAlerts.slice(0, 3).map((alert) => {
              const student = students.find(s => s.id === alert.studentId);
              return (
                <LocationAlertItem
                  key={alert.id}
                  alert={alert}
                  studentName={student?.name || 'Élève inconnu'}
                  onAcknowledge={() => handleAcknowledgeAlert(alert.id)}
                />
              );
            })}
          </View>
        )}

        {/* Active Locations Section */}
        {studentsWithLocation.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MapPin size={20} color={COLORS.success} />
              <Text style={styles.sectionTitle}>Localisation active</Text>
            </View>
            
            {studentsWithLocation.map((student) => (
              <LocationItem
                key={student.id}
                location={student.lastLocation!}
                studentName={student.name}
                onPress={() => Alert.alert('Carte', 'Ouverture de la carte à venir')}
              />
            ))}
          </View>
        )}

        {/* Inactive Locations Section */}
        {studentsWithoutLocation.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MapPin size={20} color={COLORS.gray} />
              <Text style={styles.sectionTitle}>Localisation désactivée</Text>
            </View>
            
            {studentsWithoutLocation.map((student) => (
              <View key={student.id} style={styles.inactiveCard}>
                <View style={styles.inactiveHeader}>
                  <Text style={styles.inactiveStudentName}>{student.name}</Text>
                  <Button
                    title="Activer"
                    onPress={() => handleToggleLocationTracking(student.id, true)}
                    variant="primary"
                    size="small"
                  />
                </View>
                <Text style={styles.inactiveText}>
                  La localisation est désactivée pour cet élève
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {students.length === 0 && (
          <EmptyState
            icon={<MapPin size={48} color={COLORS.gray} />}
            title="Aucun élève"
            message="Vous n'avez aucun élève associé à votre compte."
          />
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
  headerButton: {
    padding: 8,
  },
  permissionCard: {
    backgroundColor: COLORS.warningLight,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.warning,
  },
  permissionContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.warning,
    marginBottom: 4,
  },
  permissionText: {
    fontSize: 14,
    color: COLORS.warning,
  },
  section: {
    margin: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
  inactiveCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inactiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inactiveStudentName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  inactiveText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});