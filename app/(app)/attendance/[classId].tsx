import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { useData } from '@/hooks/data-store';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Calendar, Check, X, Clock } from 'lucide-react-native';

export default function AttendanceScreen() {
  const { classId } = useLocalSearchParams<{ classId: string }>();
  const { 
    getClassById, 
    getStudents, 
    getAttendanceByClass, 
    addAttendance,
    getStudentById 
  } = useData();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const [isRecording, setIsRecording] = useState(false);

  if (!classId) return null;

  const classData = getClassById(classId);
  const students = getStudents(classId);
  const todayTimestamp = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()).getTime();
  const existingAttendance = getAttendanceByClass(classId, todayTimestamp);

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAttendance = () => {
    const studentsWithoutAttendance = students.filter(student => 
      !attendanceData[student.id] && 
      !existingAttendance.some(att => att.studentId === student.id)
    );

    if (studentsWithoutAttendance.length > 0) {
      Alert.alert(
        'Attention',
        `Vous n'avez pas marqué la présence pour ${studentsWithoutAttendance.length} élève(s). Continuer ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Continuer', onPress: saveAttendance }
        ]
      );
    } else {
      saveAttendance();
    }
  };

  const saveAttendance = () => {
    Object.entries(attendanceData).forEach(([studentId, status]) => {
      // Vérifier si l'attendance existe déjà pour cet élève aujourd'hui
      const existingRecord = existingAttendance.find(att => att.studentId === studentId);
      if (!existingRecord) {
        addAttendance({
          studentId,
          classId,
          date: todayTimestamp,
          status,
        });
      }
    });

    setAttendanceData({});
    setIsRecording(false);
    Alert.alert('Succès', 'Présences enregistrées avec succès');
  };

  const getAttendanceStatus = (studentId: string) => {
    // Vérifier d'abord les données en cours de saisie
    if (attendanceData[studentId]) {
      return attendanceData[studentId];
    }
    
    // Puis vérifier les données existantes
    const existing = existingAttendance.find(att => att.studentId === studentId);
    return existing?.status;
  };

  const getStatusColor = (status: 'present' | 'absent' | 'late' | undefined) => {
    switch (status) {
      case 'present': return COLORS.success;
      case 'absent': return COLORS.danger;
      case 'late': return COLORS.warning;
      default: return COLORS.gray;
    }
  };

  const getStatusIcon = (status: 'present' | 'absent' | 'late' | undefined) => {
    switch (status) {
      case 'present': return <Check size={20} color={COLORS.white} />;
      case 'absent': return <X size={20} color={COLORS.white} />;
      case 'late': return <Clock size={20} color={COLORS.white} />;
      default: return null;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAttendanceStats = () => {
    const allAttendance = getAttendanceByClass(classId);
    const totalDays = new Set(allAttendance.map(att => att.date)).size;
    
    if (totalDays === 0) return null;

    const stats = students.map(student => {
      const studentAttendance = allAttendance.filter(att => att.studentId === student.id);
      const present = studentAttendance.filter(att => att.status === 'present').length;
      const late = studentAttendance.filter(att => att.status === 'late').length;
      const absent = studentAttendance.filter(att => att.status === 'absent').length;
      const attendanceRate = totalDays > 0 ? ((present + late) / totalDays) * 100 : 0;

      return {
        student,
        present,
        late,
        absent,
        attendanceRate
      };
    });

    return { stats, totalDays };
  };

  const attendanceStats = getAttendanceStats();

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: `Présences - ${classData?.name || 'Classe'}`,
          headerBackVisible: true,
          headerBackTitle: 'Retour',
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => setIsRecording(!isRecording)}
              style={styles.headerButton}
            >
              <Calendar size={24} color={COLORS.primary} />
            </TouchableOpacity>
          )
        }} 
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Card title={`Présences du ${formatDate(selectedDate)}`}>
          {!isRecording && existingAttendance.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Aucune présence enregistrée pour aujourd&apos;hui</Text>
              <Button
                title="Commencer l'appel"
                onPress={() => setIsRecording(true)}
                style={styles.startButton}
              />
            </View>
          )}

          {(isRecording || existingAttendance.length > 0) && (
            <View style={styles.attendanceList}>
              {students.map(student => {
                const status = getAttendanceStatus(student.id);
                const isExisting = existingAttendance.some(att => att.studentId === student.id);
                
                return (
                  <View key={student.id} style={styles.studentRow}>
                    <Text style={styles.studentName}>{student.name}</Text>
                    
                    {isRecording && !isExisting ? (
                      <View style={styles.attendanceButtons}>
                        <TouchableOpacity
                          style={[
                            styles.attendanceButton,
                            styles.presentButton,
                            status === 'present' && styles.selectedButton
                          ]}
                          onPress={() => handleAttendanceChange(student.id, 'present')}
                        >
                          <Check size={16} color={status === 'present' ? COLORS.white : COLORS.success} />
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={[
                            styles.attendanceButton,
                            styles.lateButton,
                            status === 'late' && styles.selectedButton
                          ]}
                          onPress={() => handleAttendanceChange(student.id, 'late')}
                        >
                          <Clock size={16} color={status === 'late' ? COLORS.white : COLORS.warning} />
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={[
                            styles.attendanceButton,
                            styles.absentButton,
                            status === 'absent' && styles.selectedButton
                          ]}
                          onPress={() => handleAttendanceChange(student.id, 'absent')}
                        >
                          <X size={16} color={status === 'absent' ? COLORS.white : COLORS.danger} />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(status) }
                      ]}>
                        {getStatusIcon(status)}
                        <Text style={styles.statusText}>
                          {status === 'present' ? 'Présent' : 
                           status === 'absent' ? 'Absent' : 
                           status === 'late' ? 'Retard' : 'Non marqué'}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
              
              {isRecording && (
                <View style={styles.saveActions}>
                  <Button
                    title="Annuler"
                    onPress={() => {
                      setIsRecording(false);
                      setAttendanceData({});
                    }}
                    variant="outline"
                    style={styles.cancelButton}
                  />
                  <Button
                    title="Enregistrer"
                    onPress={handleSaveAttendance}
                    style={styles.saveButton}
                  />
                </View>
              )}
            </View>
          )}
        </Card>

        {attendanceStats && (
          <Card title="Statistiques de présence">
            <Text style={styles.statsHeader}>
              Basé sur {attendanceStats.totalDays} jour{attendanceStats.totalDays > 1 ? 's' : ''} de cours
            </Text>
            
            {attendanceStats.stats.map(({ student, present, late, absent, attendanceRate }) => (
              <View key={student.id} style={styles.studentStats}>
                <Text style={styles.studentStatsName}>{student.name}</Text>
                <View style={styles.statsRow}>
                  <View style={styles.statsItem}>
                    <Text style={[styles.statsNumber, { color: COLORS.success }]}>{present}</Text>
                    <Text style={styles.statsLabel}>Présent</Text>
                  </View>
                  <View style={styles.statsItem}>
                    <Text style={[styles.statsNumber, { color: COLORS.warning }]}>{late}</Text>
                    <Text style={styles.statsLabel}>Retard</Text>
                  </View>
                  <View style={styles.statsItem}>
                    <Text style={[styles.statsNumber, { color: COLORS.danger }]}>{absent}</Text>
                    <Text style={styles.statsLabel}>Absent</Text>
                  </View>
                  <View style={styles.statsItem}>
                    <Text style={[
                      styles.statsNumber, 
                      { color: attendanceRate >= 80 ? COLORS.success : attendanceRate >= 60 ? COLORS.warning : COLORS.danger }
                    ]}>
                      {attendanceRate.toFixed(0)}%
                    </Text>
                    <Text style={styles.statsLabel}>Assiduité</Text>
                  </View>
                </View>
              </View>
            ))}
          </Card>
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
  contentContainer: {
    padding: 16,
  },
  headerButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 16,
  },
  startButton: {
    minWidth: 150,
  },
  attendanceList: {
    gap: 12,
  },
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    flex: 1,
  },
  attendanceButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  attendanceButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  presentButton: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.white,
  },
  lateButton: {
    borderColor: COLORS.warning,
    backgroundColor: COLORS.white,
  },
  absentButton: {
    borderColor: COLORS.danger,
    backgroundColor: COLORS.white,
  },
  selectedButton: {
    backgroundColor: 'transparent',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  saveActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
  statsHeader: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 16,
    textAlign: 'center',
  },
  studentStats: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  studentStatsName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statsItem: {
    alignItems: 'center',
  },
  statsNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statsLabel: {
    fontSize: 12,
    color: COLORS.gray,
  },
});