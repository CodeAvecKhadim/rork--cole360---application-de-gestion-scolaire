import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertTriangle, Clock, MapPin } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { LocationAlert } from '@/types/auth';
import { formatDistanceToNow } from '@/utils/date';

interface LocationAlertItemProps {
  alert: LocationAlert;
  studentName: string;
  onPress?: () => void;
  onAcknowledge?: () => void;
}

export function LocationAlertItem({ alert, studentName, onPress, onAcknowledge }: LocationAlertItemProps) {
  const getAlertIcon = () => {
    switch (alert.type) {
      case 'left_school':
        return { icon: MapPin, color: COLORS.warning };
      case 'arrived_school':
        return { icon: MapPin, color: COLORS.success };
      case 'emergency':
        return { icon: AlertTriangle, color: COLORS.error };
      case 'low_battery':
        return { icon: AlertTriangle, color: COLORS.warning };
      case 'location_disabled':
        return { icon: AlertTriangle, color: COLORS.error };
      default:
        return { icon: AlertTriangle, color: COLORS.gray };
    }
  };

  const getAlertTitle = () => {
    switch (alert.type) {
      case 'left_school':
        return 'A quitté l\'école';
      case 'arrived_school':
        return 'Arrivé à l\'école';
      case 'emergency':
        return 'Alerte d\'urgence';
      case 'low_battery':
        return 'Batterie faible';
      case 'location_disabled':
        return 'Localisation désactivée';
      default:
        return 'Alerte';
    }
  };

  const { icon: Icon, color } = getAlertIcon();

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        !alert.acknowledged && styles.unacknowledged
      ]} 
      onPress={onPress}
      testID={`location-alert-${alert.id}`}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icon size={20} color={color} />
        </View>
        
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{getAlertTitle()}</Text>
            {!alert.acknowledged && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>Nouveau</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.studentName}>{studentName}</Text>
          <Text style={styles.message}>{alert.message}</Text>
          
          <View style={styles.footer}>
            <View style={styles.timeContainer}>
              <Clock size={14} color={COLORS.textSecondary} />
              <Text style={styles.time}>
                {formatDistanceToNow(alert.createdAt)}
              </Text>
            </View>
            
            {!alert.acknowledged && onAcknowledge && (
              <TouchableOpacity 
                style={styles.acknowledgeButton}
                onPress={onAcknowledge}
                testID={`acknowledge-alert-${alert.id}`}
              >
                <Text style={styles.acknowledgeText}>Marquer comme lu</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
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
  unacknowledged: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    backgroundColor: '#F8F9FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  unreadText: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.white,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  acknowledgeButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  acknowledgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.white,
  },
});