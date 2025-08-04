import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { useData } from '@/hooks/data-store';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';
import GradeItem from '@/components/GradeItem';
import AttendanceItem from '@/components/AttendanceItem';
import { Button } from '@/components/Button';
import { BookOpen, Clock, FileText } from 'lucide-react-native';

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getStudentById, getGradesByStudent, getAttendanceByStudent, getClassById } = useData();
  const [activeTab, setActiveTab] = useState<'grades' | 'attendance'>('grades');
  
  const student = getStudentById(id);
  const grades = student ? getGradesByStudent(student.id) : [];
  const attendance = student ? getAttendanceByStudent(student.id) : [];
  const studentClass = student?.classId ? getClassById(student.classId) : null;

  if (!student) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Student not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: student.name }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Avatar name={student.name} size={80} />
          <Text style={styles.name}>{student.name}</Text>
          {studentClass && (
            <View style={styles.classContainer}>
              <BookOpen size={16} color={COLORS.primary} />
              <Text style={styles.className}>{studentClass.name}</Text>
            </View>
          )}
        </View>

        <Card title="Schedule">
          <View style={styles.scheduleItem}>
            <Clock size={18} color={COLORS.gray} />
            <Text style={styles.scheduleText}>
              {studentClass?.schedule || 'No schedule available'}
            </Text>
          </View>
        </Card>

        <Card title="Actions">
          <Button
            title="Voir le Bulletin"
            onPress={() => router.push(`/bulletin/${student.id}`)}
            icon={<FileText size={20} color={COLORS.white} />}
            style={styles.bulletinButton}
          />
        </Card>

        <View style={styles.tabContainer}>
          <View style={styles.tabs}>
            <TouchableTab
              title="Grades"
              isActive={activeTab === 'grades'}
              onPress={() => setActiveTab('grades')}
            />
            <TouchableTab
              title="Attendance"
              isActive={activeTab === 'attendance'}
              onPress={() => setActiveTab('attendance')}
            />
          </View>

          {activeTab === 'grades' && (
            <View style={styles.tabContent}>
              {grades.length > 0 ? (
                grades.map(grade => <GradeItem key={grade.id} grade={grade} />)
              ) : (
                <Text style={styles.emptyText}>No grades available</Text>
              )}
            </View>
          )}

          {activeTab === 'attendance' && (
            <View style={styles.tabContent}>
              {attendance.length > 0 ? (
                attendance.map(item => <AttendanceItem key={item.id} attendance={item} />)
              ) : (
                <Text style={styles.emptyText}>No attendance records available</Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

interface TouchableTabProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
}

function TouchableTab({ title, isActive, onPress }: TouchableTabProps) {
  return (
    <TouchableOpacity
      style={[styles.tab, isActive && styles.activeTab]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
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
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 4,
  },
  classContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  className: {
    fontSize: 16,
    color: COLORS.primary,
    marginLeft: 6,
    fontWeight: '500',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  scheduleText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
  },
  tabContainer: {
    marginTop: 16,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  activeTabText: {
    color: COLORS.white,
  },
  tabContent: {
    marginBottom: 24,
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
  bulletinButton: {
    marginVertical: 8,
  },
});