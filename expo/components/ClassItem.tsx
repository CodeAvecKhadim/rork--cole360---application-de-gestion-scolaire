import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/colors';
import { Class } from '@/types/auth';
import { Clock } from 'lucide-react-native';

interface ClassItemProps {
  classData: Class;
  onPress: (classData: Class) => void;
  testID?: string;
}

export default function ClassItem({ classData, onPress, testID }: ClassItemProps) {
  const { name, schedule } = classData;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(classData)}
      activeOpacity={0.7}
      testID={testID}
    >
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.scheduleContainer}>
          <Clock size={14} color={COLORS.gray} />
          <Text style={styles.schedule}>{schedule}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  scheduleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  schedule: {
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 6,
  },
});