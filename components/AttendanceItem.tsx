import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS } from '@/constants/colors';
import { Attendance } from '@/types/auth';
import { formatDate } from '@/utils/date';
import Badge from './Badge';

interface AttendanceItemProps {
  attendance: Attendance;
  testID?: string;
}

export default function AttendanceItem({ attendance, testID }: AttendanceItemProps) {
  const { date, status } = attendance;

  const getStatusVariant = () => {
    switch (status) {
      case 'present':
        return 'success';
      case 'absent':
        return 'danger';
      case 'late':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'present':
        return 'Present';
      case 'absent':
        return 'Absent';
      case 'late':
        return 'Late';
      default:
        return status;
    }
  };

  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.date}>{formatDate(date)}</Text>
      <Badge
        label={getStatusLabel()}
        variant={getStatusVariant() as any}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  date: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
});