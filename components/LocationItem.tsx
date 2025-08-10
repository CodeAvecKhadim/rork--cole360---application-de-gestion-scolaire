import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Clock, Battery, Smartphone, AlertTriangle } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { StudentLocation } from '@/types/auth';
import { formatDistanceToNow } from '@/utils/date';

interface LocationItemProps {
  location: StudentLocation;
  studentName: string;
  onPress?: () => void;
}

export function LocationItem({ location, studentName, onPress }: LocationItemProps) {
  const getLocationStatus = () => {
    const timeDiff = Date.now() - location.timestamp;
    const minutes = Math.floor(timeDiff / (1000 * 60));
    
    if (minutes < 5) return { color: COLORS.success, text: 'En ligne' };
    if (minutes < 30) return { color: COLORS.warning, text: 'Récent' };
    return { color: COLORS.error, text: 'Hors ligne' };
  };

  const status = getLocationStatus();
  const batteryColor = location.batteryLevel && location.batteryLevel < 20 
    ? COLORS.error 
    : location.batteryLevel && location.batteryLevel < 50 
    ? COLORS.warning 
    : COLORS.success;

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      testID={`location-item-${location.studentId}`}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MapPin size={20} color={COLORS.primary} />
          <Text style={styles.studentName}>{studentName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
            <Text style={styles.statusText}>{status.text}</Text>
          </View>
        </View>
        
        <View style={styles.schoolStatus}>
          {location.isInSchool ? (
            <View style={styles.inSchoolBadge}>
              <Text style={styles.inSchoolText}>À l'école</Text>
            </View>
          ) : (
            <View style={styles.outSchoolBadge}>
              <AlertTriangle size={14} color={COLORS.warning} />
              <Text style={styles.outSchoolText}>Hors école</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Clock size={16} color={COLORS.textSecondary} />
          <Text style={styles.detailText}>
            {formatDistanceToNow(location.timestamp)}
          </Text>
        </View>
        
        {location.batteryLevel && (
          <View style={styles.detailRow}>
            <Battery size={16} color={batteryColor} />
            <Text style={[styles.detailText, { color: batteryColor }]}>
              {location.batteryLevel}%
            </Text>
          </View>
        )}
        
        <View style={styles.detailRow}>
          <Smartphone size={16} color={COLORS.textSecondary} />
          <Text style={styles.detailText}>
            Précision: {location.accuracy}m
          </Text>
        </View>
      </View>

      {location.address && (
        <Text style={styles.address} numberOfLines={2}>
          {location.address}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.white,
  },
  schoolStatus: {
    alignItems: 'flex-start',
  },
  inSchoolBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  inSchoolText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.white,
  },
  outSchoolBadge: {
    backgroundColor: COLORS.warningLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  outSchoolText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.warning,
    marginLeft: 4,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  address: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
});