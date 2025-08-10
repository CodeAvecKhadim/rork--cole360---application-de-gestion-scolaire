import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { MapPin, Clock, Battery, Shield, Settings, Phone, AlertTriangle } from 'lucide-react-native';
import * as Location from 'expo-location';
import { COLORS } from '@/constants/colors';
import { useData } from '@/hooks/data-store';
import { formatDistanceToNow } from '@/utils/date';
import Button from '@/components/Button';

export default function StudentLocationScreen() {
  const { studentId } = useLocalSearchParams<{ studentId: string }>();
  const { 
    getStudentById, 
    getStudentLocation, 
    updateStudentLocation,
    toggleStudentLocationTracking,
    getSafeZonesByStudent 
  } = useData();

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);

  const student = getStudentById(studentId || '');
  const studentLocation = getStudentLocation(studentId || '');
  const safeZones = getSafeZonesByStudent(studentId || '');

  useEffect(() => {
    if (Platform.OS !== 'web') {
      getCurrentLocation();
    }
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location);
      }
    } catch (error) {
      console.log('Error getting current location:', error);
    }
  };

  const handleRefreshLocation = async () => {
    if (!student) return;
    
    setRefreshing(true);
    
    // Simulate location update for demo
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
    setRefreshing(false);
  };

  const handleToggleTracking = () => {
    if (!student) return;
    
    const newStatus = !student.locationEnabled;
    toggleStudentLocationTracking(student.id, newStatus);
    
    if (newStatus) {
      handleRefreshLocation();
    }
  };

  const handleEmergencyCall = (contact: any) => {
    Alert.alert(
      'Appel d\'urgence',
      `Appeler ${contact.name} au ${contact.phone} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Appeler', onPress: () => Alert.alert('Appel', 'Fonctionnalité à venir') }
      ]
    );
  };

  const getLocationStatus = () => {
    if (!studentLocation) return { color: COLORS.gray, text: 'Aucune donnée' };
    
    const timeDiff = Date.now() - studentLocation.timestamp;
    const minutes = Math.floor(timeDiff / (1000 * 60));
    
    if (minutes < 5) return { color: COLORS.success, text: 'En ligne' };
    if (minutes < 30) return { color: COLORS.warning, text: 'Récent' };
    return { color: COLORS.error, text: 'Hors ligne' };
  };

  const getBatteryColor = () => {
    if (!studentLocation?.batteryLevel) return COLORS.gray;
    if (studentLocation.batteryLevel < 20) return COLORS.error;
    if (studentLocation.batteryLevel < 50) return COLORS.warning;
    return COLORS.success;
  };

  if (!student) {
    return (
      <View style={styles.errorContainer}>
        <AlertTriangle size={48} color={COLORS.error} />
        <Text style={styles.errorText}>Élève non trouvé</Text>
      </View>
    );
  }

  const status = getLocationStatus();
  const batteryColor = getBatteryColor();

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: `Localisation - ${student.name}`,
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
      
      <ScrollView style={styles.container}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{student.name}</Text>
              <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
                <Text style={styles.statusText}>{status.text}</Text>
              </View>
            </View>
            
            <Button
              title={student.locationEnabled ? 'Désactiver' : 'Activer'}
              onPress={handleToggleTracking}
              variant={student.locationEnabled ? 'secondary' : 'primary'}
              size="small"
            />
          </View>

          {studentLocation && (
            <View style={styles.locationDetails}>
              <View style={styles.detailRow}>
                <MapPin size={16} color={COLORS.primary} />
                <Text style={styles.detailLabel}>Position:</Text>
                <Text style={styles.detailValue}>
                  {studentLocation.isInSchool ? 'À l\'école' : 'Hors école'}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Clock size={16} color={COLORS.textSecondary} />
                <Text style={styles.detailLabel}>Dernière mise à jour:</Text>
                <Text style={styles.detailValue}>
                  {formatDistanceToNow(studentLocation.timestamp)}
                </Text>
              </View>
              
              {studentLocation.batteryLevel && (
                <View style={styles.detailRow}>
                  <Battery size={16} color={batteryColor} />
                  <Text style={styles.detailLabel}>Batterie:</Text>
                  <Text style={[styles.detailValue, { color: batteryColor }]}>
                    {studentLocation.batteryLevel}%
                  </Text>
                </View>
              )}
              
              <View style={styles.detailRow}>
                <Shield size={16} color={COLORS.textSecondary} />
                <Text style={styles.detailLabel}>Précision:</Text>
                <Text style={styles.detailValue}>
                  {studentLocation.accuracy}m
                </Text>
              </View>
            </View>
          )}

          {studentLocation?.address && (
            <View style={styles.addressContainer}>
              <Text style={styles.addressLabel}>Adresse:</Text>
              <Text style={styles.addressText}>{studentLocation.address}</Text>
            </View>
          )}
        </View>

        {/* Map Placeholder */}
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <MapPin size={48} color={COLORS.primary} />
            <Text style={styles.mapPlaceholderText}>Carte interactive</Text>
            <Text style={styles.mapPlaceholderSubtext}>
              Fonctionnalité à venir
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button
            title="Actualiser la position"
            onPress={handleRefreshLocation}
            variant="primary"
            loading={refreshing}
            style={styles.actionButton}
          />
          
          <Button
            title="Voir l'historique"
            onPress={() => Alert.alert('Historique', 'Fonctionnalité à venir')}
            variant="outline"
            style={styles.actionButton}
          />
        </View>

        {/* Safe Zones */}
        {safeZones.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Zones de sécurité</Text>
            {safeZones.map((zone) => (
              <View key={zone.id} style={styles.zoneCard}>
                <View style={styles.zoneHeader}>
                  <Shield size={20} color={COLORS.success} />
                  <Text style={styles.zoneName}>{zone.name}</Text>
                  <View style={[
                    styles.zoneStatus,
                    { backgroundColor: zone.isActive ? COLORS.success : COLORS.gray }
                  ]}>
                    <Text style={styles.zoneStatusText}>
                      {zone.isActive ? 'Active' : 'Inactive'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.zoneRadius}>Rayon: {zone.radius}m</Text>
              </View>
            ))}
          </View>
        )}

        {/* Emergency Contacts */}
        {student.emergencyContacts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contacts d&apos;urgence</Text>
            {student.emergencyContacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={styles.contactCard}
                onPress={() => handleEmergencyCall(contact)}
              >
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactRelation}>{contact.relationship}</Text>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                </View>
                <Phone size={20} color={COLORS.primary} />
              </TouchableOpacity>
            ))}
          </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.error,
    marginTop: 16,
  },
  headerButton: {
    padding: 8,
  },
  statusCard: {
    backgroundColor: COLORS.white,
    margin: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.white,
  },
  locationDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 8,
    minWidth: 120,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    flex: 1,
  },
  addressContainer: {
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 8,
  },
  addressLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: COLORS.text,
  },
  mapContainer: {
    margin: 16,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 12,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  actionsContainer: {
    margin: 16,
  },
  actionButton: {
    marginBottom: 12,
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  zoneCard: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  zoneName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginLeft: 8,
    flex: 1,
  },
  zoneStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  zoneStatusText: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.white,
  },
  zoneRadius: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 28,
  },
  contactCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  contactRelation: {
    fontSize: 12,
    color: COLORS.primary,
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});