import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/colors';
import { Student } from '@/types/auth';
import Avatar from './Avatar';

interface StudentItemProps {
  student: Student;
  onPress: (student: Student) => void;
  testID?: string;
}

export default function StudentItem({ student, onPress, testID }: StudentItemProps) {
  const { name } = student;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(student)}
      activeOpacity={0.7}
      testID={testID}
    >
      <Avatar name={name} size={40} />
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  content: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
});