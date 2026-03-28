import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';
import { useData } from '@/hooks/data-store';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Plus, Edit3, Trash2 } from 'lucide-react-native';

export default function GradesScreen() {
  const { classId } = useLocalSearchParams<{ classId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { 
    getClassById, 
    getStudents, 
    getGradesByClass, 
    addGrade,
    getStudentById 
  } = useData();

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [subject, setSubject] = useState('');
  const [score, setScore] = useState('');
  const [maxScore, setMaxScore] = useState('100');

  if (!classId) return null;

  const classData = getClassById(classId);
  const students = getStudents(classId);
  const grades = getGradesByClass(classId);

  const handleAddGrade = () => {
    if (!selectedStudent || !subject || !score || !maxScore) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    const scoreNum = parseFloat(score);
    const maxScoreNum = parseFloat(maxScore);

    if (isNaN(scoreNum) || isNaN(maxScoreNum) || scoreNum < 0 || maxScoreNum <= 0) {
      Alert.alert('Erreur', 'Veuillez saisir des notes valides');
      return;
    }

    addGrade({
      studentId: selectedStudent,
      classId,
      subject,
      score: scoreNum,
      maxScore: maxScoreNum,
      date: Date.now(),
    });

    setShowAddForm(false);
    setSelectedStudent('');
    setSubject('');
    setScore('');
    setMaxScore('100');
    Alert.alert('Succès', 'Note ajoutée avec succès');
  };

  const getGradeColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return COLORS.success;
    if (percentage >= 60) return COLORS.warning;
    return COLORS.danger;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('fr-FR');
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: `Notes - ${classData?.name || 'Classe'}`,
          headerBackVisible: true,
          headerBackTitle: 'Retour',
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => setShowAddForm(!showAddForm)}
              style={styles.headerButton}
            >
              <Plus size={24} color={COLORS.primary} />
            </TouchableOpacity>
          )
        }} 
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {showAddForm && (
          <Card title="Ajouter une note">
            <View style={styles.formContainer}>
              <Text style={styles.label}>Élève</Text>
              <View style={styles.studentSelector}>
                {students.map(student => (
                  <TouchableOpacity
                    key={student.id}
                    style={[
                      styles.studentOption,
                      selectedStudent === student.id && styles.selectedStudent
                    ]}
                    onPress={() => setSelectedStudent(student.id)}
                  >
                    <Text style={[
                      styles.studentOptionText,
                      selectedStudent === student.id && styles.selectedStudentText
                    ]}>
                      {student.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Input
                label="Matière"
                value={subject}
                onChangeText={setSubject}
                placeholder="Ex: Mathématiques, Sciences..."
              />

              <View style={styles.scoreContainer}>
                <View style={styles.scoreInput}>
                  <Input
                    label="Note obtenue"
                    value={score}
                    onChangeText={setScore}
                    placeholder="0"
                    keyboardType="numeric"
                  />
                </View>
                <Text style={styles.scoreSeparator}>/</Text>
                <View style={styles.scoreInput}>
                  <Input
                    label="Note maximale"
                    value={maxScore}
                    onChangeText={setMaxScore}
                    placeholder="100"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.formActions}>
                <Button
                  title="Annuler"
                  onPress={() => setShowAddForm(false)}
                  variant="outline"
                  style={styles.cancelButton}
                />
                <Button
                  title="Ajouter"
                  onPress={handleAddGrade}
                  style={styles.addButton}
                />
              </View>
            </View>
          </Card>
        )}

        <Card title="Notes récentes">
          {grades.length === 0 ? (
            <Text style={styles.emptyText}>Aucune note enregistrée</Text>
          ) : (
            grades
              .sort((a, b) => b.date - a.date)
              .map(grade => {
                const student = getStudentById(grade.studentId);
                const percentage = Math.round((grade.score / grade.maxScore) * 100);
                
                return (
                  <View key={grade.id} style={styles.gradeItem}>
                    <View style={styles.gradeHeader}>
                      <View>
                        <Text style={styles.studentName}>{student?.name}</Text>
                        <Text style={styles.subject}>{grade.subject}</Text>
                      </View>
                      <View style={styles.gradeScore}>
                        <Text 
                          style={[
                            styles.score,
                            { color: getGradeColor(grade.score, grade.maxScore) }
                          ]}
                        >
                          {grade.score}/{grade.maxScore}
                        </Text>
                        <Text style={styles.percentage}>({percentage}%)</Text>
                      </View>
                    </View>
                    <Text style={styles.gradeDate}>{formatDate(grade.date)}</Text>
                  </View>
                );
              })
          )}
        </Card>

        {/* Statistiques par élève */}
        <Card title="Statistiques par élève">
          {students.map(student => {
            const studentGrades = grades.filter(g => g.studentId === student.id);
            if (studentGrades.length === 0) return null;
            
            const average = studentGrades.reduce((sum, grade) => {
              return sum + (grade.score / grade.maxScore) * 100;
            }, 0) / studentGrades.length;

            return (
              <View key={student.id} style={styles.studentStats}>
                <Text style={styles.studentStatsName}>{student.name}</Text>
                <View style={styles.statsRow}>
                  <Text style={styles.statsText}>
                    {studentGrades.length} note{studentGrades.length > 1 ? 's' : ''}
                  </Text>
                  <Text style={[
                    styles.averageText,
                    { color: getGradeColor(average, 100) }
                  ]}>
                    Moyenne: {average.toFixed(1)}%
                  </Text>
                </View>
              </View>
            );
          })}
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
  formContainer: {
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  studentSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  studentOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  selectedStudent: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  studentOptionText: {
    fontSize: 14,
    color: COLORS.text,
  },
  selectedStudentText: {
    color: COLORS.white,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  scoreInput: {
    flex: 1,
  },
  scoreSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
  },
  addButton: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.gray,
    fontSize: 16,
    padding: 20,
  },
  gradeItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  gradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  subject: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  gradeScore: {
    alignItems: 'flex-end',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  percentage: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  gradeDate: {
    fontSize: 12,
    color: COLORS.gray,
  },
  studentStats: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  studentStatsName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  averageText: {
    fontSize: 14,
    fontWeight: '600',
  },
});