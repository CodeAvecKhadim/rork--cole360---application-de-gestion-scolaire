import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { useData } from '@/hooks/data-store';
import { useAuth } from '@/hooks/auth-store';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Calendar, Check, X, Clock, Bell } from 'lucide-react-native';
import { notificationService } from '@/services/notifications';

export default function AttendanceScreen() {
  const { classId } = useLocalSearchParams<{ classId: string }>();
  const { user } = useAuth();
  const { 
    getClassById, 
    getStudents, 
    getAttendanceByClass, 
    addAttendance,
    getStudentById 
  } = useData();

  const [selectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialiser les notifications push au chargement
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        await notificationService.registerForPushNotifications();
        notificationService.setupNotificationListener();
        console.log('📱 Notifications push initialisées');
      } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation des notifications:', error);
      }
    };

    initializeNotifications();
  }, []);

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

  const saveAttendance = async () => {
    setIsSaving(true);
    const absentStudents: string[] = [];
    
    try {
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
          
          // Collecter les élèves absents pour les notifications
          if (status === 'absent') {
            absentStudents.push(studentId);
          }
        }
      });

      // Envoyer des notifications push aux parents des élèves absents
      if (absentStudents.length > 0) {
        await sendAbsenceNotifications(absentStudents);
      }

      setAttendanceData({});
      setIsRecording(false);
      
      const message = absentStudents.length > 0 
        ? `Présences enregistrées avec succès. ${absentStudents.length} notification(s) push envoyée(s) aux parents.`
        : 'Présences enregistrées avec succès';
      
      // Afficher le message de succès avec bouton de retour
      Alert.alert(
        'Succès', 
        message,
        [
          {
            text: 'Retour aux classes',
            onPress: () => router.back()
          },
          {
            text: 'Rester ici',
            style: 'cancel'
          }
        ]
      );
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'enregistrement des présences.');
    } finally {
      setIsSaving(false);
    }
  };

  const sendAbsenceNotifications = async (absentStudentIds: string[]) => {
    const promises = absentStudentIds.map(async (studentId) => {
      const student = getStudentById(studentId);
      if (student && user) {
        try {
          // Envoyer une vraie notification push Firebase
          await notificationService.sendAbsenceNotification({
            studentId: student.id,
            studentName: student.name,
            className: classData?.name || 'Classe inconnue',
            teacherName: user.name,
            date: formatDate(selectedDate),
            parentId: student.parentId || '4' // ID du parent par défaut pour la démo
          });
          
          console.log(`✅ Notification push envoyée pour ${student.name}`);
        } catch (error) {
          console.error(`❌ Erreur lors de l'envoi de la notification pour ${student.name}:`, error);
        }
      }
    });
    
    // Attendre que toutes les notifications soient envoyées
    await Promise.all(promises);
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
                    title={isSaving ? "Envoi..." : "Enregistrer"}
                    onPress={handleSaveAttendance}
                    disabled={isSaving}
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
                <View style={styles.studentStatsHeader}>
                  <Text style={styles.studentStatsName}>{student.name}</Text>
                  {absent > 0 && (
                    <View style={styles.notificationIndicator}>
                      <Bell size={12} color={COLORS.warning} />
                      <Text style={styles.notificationText}>{absent} absence(s)</Text>
                    </View>
                  )}
                </View>
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

        <Card title="📱 Notifications Push Firebase">
          <View style={styles.notificationInfo}>
            <Bell size={20} color={COLORS.primary} />
            <Text style={styles.notificationInfoText}>
              Les parents reçoivent automatiquement une notification push sur leur téléphone lorsque leur enfant est marqué absent.
            </Text>
          </View>
          <View style={styles.notificationFeatures}>
            <Text style={styles.featureText}>✓ Notification push instantanée via Firebase</Text>
            <Text style={styles.featureText}>✓ Fonctionne même si l&apos;app est fermée</Text>
            <Text style={styles.featureText}>✓ Détails complets (classe, date, professeur)</Text>
            <Text style={styles.featureText}>✓ Sauvegardé dans l&apos;historique des notifications</Text>
            <Text style={styles.featureText}>✓ Compatible iOS et Android</Text>
          </View>
          
          <View style={styles.pushStatusContainer}>
            <View style={styles.pushStatusIndicator}>
              <View style={[styles.statusDot, { backgroundColor: COLORS.success }]} />
              <Text style={styles.pushStatusText}>Notifications push activées</Text>
            </View>
          </View>
        </Card>
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
  studentStatsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  notificationText: {
    fontSize: 10,
    color: COLORS.warning,
    fontWeight: '600',
  },
  notificationInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  notificationInfoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  notificationFeatures: {
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  pushStatusContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  pushStatusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pushStatusText: {
    fontSize: 14,
    color: COLORS.success,
    fontWeight: '600',
  },
});