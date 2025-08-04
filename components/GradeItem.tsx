import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS } from '@/constants/colors';
import { Grade } from '@/types/auth';
import { formatDate } from '@/utils/date';

interface GradeItemProps {
  grade: Grade;
  testID?: string;
}

export default function GradeItem({ grade, testID }: GradeItemProps) {
  const { subject, score, maxScore, date } = grade;
  const percentage = (score / maxScore) * 100;
  
  const getGradeColor = () => {
    if (percentage >= 90) return COLORS.success;
    if (percentage >= 70) return COLORS.info;
    if (percentage >= 50) return COLORS.warning;
    return COLORS.danger;
  };

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.leftContent}>
        <Text style={styles.subject}>{subject}</Text>
        <Text style={styles.date}>{formatDate(date)}</Text>
      </View>
      <View style={styles.rightContent}>
        <Text style={[styles.score, { color: getGradeColor() }]}>
          {score}/{maxScore}
        </Text>
        <Text style={[styles.percentage, { color: getGradeColor() }]}>
          {percentage.toFixed(0)}%
        </Text>
      </View>
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
  leftContent: {
    flex: 1,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  subject: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: COLORS.gray,
  },
  score: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  percentage: {
    fontSize: 14,
    fontWeight: '500',
  },
});