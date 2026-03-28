// Page de consultation du bulletin scolaire - École-360
// Cette page affiche le bulletin détaillé d'un élève avec toutes ses notes et appréciations
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Download, FileText, CheckCircle, XCircle, Clock } from 'lucide-react-native';
import { useData } from '@/hooks/data-store';
import { useAuth } from '@/hooks/auth-store';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { COLORS, APP_CONFIG } from '@/constants/colors';
import { StudentBulletin, SubjectGrade, StudentInfo } from '@/types/auth';

type PeriodType = 'Semestre 1' | 'Semestre 2' | 'Annuel';

const mockStudentInfo: StudentInfo = {
  id: '1',
  name: 'Amadou Diallo',
  dateOfBirth: '15/03/2008',
  gender: 'M',
  matricule: 'SEN2024001',
  className: 'Terminale S1',
  schoolName: 'Lycée Blaise Diagne',
  schoolAddress: 'Avenue Cheikh Anta Diop, Dakar, Sénégal',
};

const mockSubjectGrades: SubjectGrade[] = [
  {
    subject: 'Mathématiques',
    coefficient: 4,
    compositionGrades: [15, 12, 16],
    subjectAverage: 14.33,
    subjectRank: 3,
    classAverage: 12.5,
    teacherAppreciation: 'Très bon travail, continuez ainsi',
  },
  {
    subject: 'Physique-Chimie',
    coefficient: 4,
    compositionGrades: [13, 14, 15],
    subjectAverage: 14.0,
    subjectRank: 5,
    classAverage: 11.8,
    teacherAppreciation: 'Élève sérieux et appliqué',
  },
  {
    subject: 'Sciences Naturelles',
    coefficient: 3,
    compositionGrades: [16, 15, 17],
    subjectAverage: 16.0,
    subjectRank: 1,
    classAverage: 13.2,
    teacherAppreciation: 'Excellent niveau, félicitations',
  },
  {
    subject: 'Français',
    coefficient: 3,
    compositionGrades: [12, 13, 11],
    subjectAverage: 12.0,
    subjectRank: 8,
    classAverage: 11.5,
    teacherAppreciation: 'Peut mieux faire en expression écrite',
  },
  {
    subject: 'Anglais',
    coefficient: 2,
    compositionGrades: [14, 15, 13],
    subjectAverage: 14.0,
    subjectRank: 4,
    classAverage: 12.0,
    teacherAppreciation: 'Bonne participation orale',
  },
  {
    subject: 'Histoire-Géographie',
    coefficient: 2,
    compositionGrades: [13, 12, 14],
    subjectAverage: 13.0,
    subjectRank: 6,
    classAverage: 11.8,
    teacherAppreciation: 'Travail régulier et satisfaisant',
  },
];

const mockBulletin: StudentBulletin = {
  id: '1',
  studentId: '1',
  schoolId: '1',
  classId: '1',
  period: 'Semestre 1',
  schoolYear: '2023-2024',
  subjectGrades: mockSubjectGrades,
  generalAverage: 13.89,
  classRank: 4,
  totalStudents: 35,
  councilDecision: 'Passage',
  councilAppreciation: 'Élève sérieux avec de bons résultats. Encourager les efforts en français.',
  pdfGenerated: false,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

// Composant principal pour afficher le bulletin d'un élève
export default function StudentBulletinPage() {
  // Récupération des paramètres de l'URL et des données utilisateur
  const { studentId } = useLocalSearchParams<{ studentId: string }>();
  const { user } = useAuth();
  const { getStudentById } = useData();
  
  // États locaux pour la gestion de l'interface
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('Semestre 1'); // Période sélectionnée
  const [selectedYear, setSelectedYear] = useState<string>('2023-2024'); // Année scolaire sélectionnée
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false); // État de génération PDF

  const student = getStudentById(studentId || '');
  const studentInfo = mockStudentInfo;
  const bulletin = mockBulletin;

  const periods: PeriodType[] = ['Semestre 1', 'Semestre 2', 'Annuel'];
  const years = ['2023-2024', '2022-2023', '2021-2022'];

  // Fonction pour déterminer la couleur selon la moyenne
  const getAverageColor = (average: number) => {
    if (average >= 14) return COLORS.success; // Vert pour les bonnes notes (≥14)
    if (average >= 10) return COLORS.warning; // Orange pour les notes moyennes (10-13.99)
    return COLORS.error; // Rouge pour les notes faibles (<10)
  };

  // Fonction pour afficher l'icône selon la décision du conseil
  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'Passage':
        return <CheckCircle size={20} color={COLORS.success} />; // Icône verte pour le passage
      case 'Redoublement':
        return <XCircle size={20} color={COLORS.error} />; // Icône rouge pour le redoublement
      default:
        return <Clock size={20} color={COLORS.warning} />; // Icône orange pour en attente
    }
  };

  const handleGeneratePDF = async () => {
    if (user?.role !== 'schoolAdmin' && user?.role !== 'admin') {
      Alert.alert('Accès refusé', 'Seuls les administrateurs peuvent générer les bulletins PDF.');
      return;
    }

    setIsGeneratingPDF(true);
    try {
      // Simulation de génération PDF
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert('Succès', 'Le bulletin PDF a été généré avec succès.');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de générer le bulletin PDF.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadPDF = () => {
    if (Platform.OS === 'web') {
      Alert.alert('Information', 'Le téléchargement sera disponible prochainement sur le web.');
    } else {
      Alert.alert('Téléchargement', 'Le bulletin sera téléchargé dans vos fichiers.');
    }
  };

  const totalCoefficients = useMemo(() => {
    return bulletin.subjectGrades.reduce((sum, grade) => sum + grade.coefficient, 0);
  }, [bulletin.subjectGrades]);

  const weightedAverage = useMemo(() => {
    const totalPoints = bulletin.subjectGrades.reduce(
      (sum, grade) => sum + (grade.subjectAverage * grade.coefficient),
      0
    );
    return totalPoints / totalCoefficients;
  }, [bulletin.subjectGrades, totalCoefficients]);

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: `Bulletin de ${studentInfo.name}`,
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.white,
          headerBackVisible: true,
          headerBackTitle: 'Retour',
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* En-tête Officiel - République du Sénégal */}
        <Card style={styles.officialHeader}>
          <View style={styles.republicHeader}>
            <Text style={styles.republicText}>RÉPUBLIQUE DU SÉNÉGAL</Text>
            <Text style={styles.mottoText}>Un Peuple, Un But, Une Foi</Text>
            <View style={styles.divider} />
            <Text style={styles.ministryText}>MINISTÈRE DE L&apos;ÉDUCATION NATIONALE</Text>
            <Text style={styles.appBranding}>{APP_CONFIG.name} - {APP_CONFIG.slogan}</Text>
          </View>
        </Card>

        {/* Informations de l'établissement */}
        <Card style={styles.schoolInfo}>
          <Text style={styles.schoolName}>{studentInfo.schoolName}</Text>
          <Text style={styles.schoolAddress}>{studentInfo.schoolAddress}</Text>
        </Card>

        {/* Sélecteurs de période et année */}
        <Card style={styles.selectors}>
          <View style={styles.selectorRow}>
            <View style={styles.selectorGroup}>
              <Text style={styles.selectorLabel}>Période :</Text>
              <View style={styles.periodTabs}>
                {periods.map((period) => (
                  <TouchableOpacity
                    key={period}
                    style={[
                      styles.periodTab,
                      selectedPeriod === period && styles.periodTabActive,
                    ]}
                    onPress={() => setSelectedPeriod(period)}
                  >
                    <Text
                      style={[
                        styles.periodTabText,
                        selectedPeriod === period && styles.periodTabTextActive,
                      ]}
                    >
                      {period}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.selectorGroup}>
              <Text style={styles.selectorLabel}>Année :</Text>
              <TouchableOpacity style={styles.yearSelector}>
                <Text style={styles.yearText}>{selectedYear}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        {/* Informations de l'élève */}
        <Card style={styles.studentInfo}>
          <View style={styles.studentInfoRow}>
            <View style={styles.studentInfoColumn}>
              <Text style={styles.studentInfoLabel}>Nom et Prénom :</Text>
              <Text style={styles.studentInfoValue}>{studentInfo.name}</Text>
            </View>
            <View style={styles.studentInfoColumn}>
              <Text style={styles.studentInfoLabel}>Date de Naissance :</Text>
              <Text style={styles.studentInfoValue}>{studentInfo.dateOfBirth}</Text>
            </View>
          </View>
          
          <View style={styles.studentInfoRow}>
            <View style={styles.studentInfoColumn}>
              <Text style={styles.studentInfoLabel}>Classe :</Text>
              <Text style={styles.studentInfoValue}>{studentInfo.className}</Text>
            </View>
            <View style={styles.studentInfoColumn}>
              <Text style={styles.studentInfoLabel}>Sexe :</Text>
              <Text style={styles.studentInfoValue}>{studentInfo.gender === 'M' ? 'Masculin' : 'Féminin'}</Text>
            </View>
          </View>
          
          <View style={styles.studentInfoRow}>
            <View style={styles.studentInfoColumn}>
              <Text style={styles.studentInfoLabel}>Matricule :</Text>
              <Text style={styles.studentInfoValue}>{studentInfo.matricule}</Text>
            </View>
          </View>
        </Card>

        {/* Tableau des notes */}
        <Card style={styles.gradesTable}>
          <Text style={styles.tableTitle}>Relevé des Notes - {selectedPeriod}</Text>
          
          {/* En-têtes du tableau */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.subjectColumn]}>Matières</Text>
            <Text style={[styles.tableHeaderText, styles.coeffColumn]}>Coef.</Text>
            <Text style={[styles.tableHeaderText, styles.gradeColumn]}>Notes</Text>
            <Text style={[styles.tableHeaderText, styles.avgColumn]}>Moy.</Text>
            <Text style={[styles.tableHeaderText, styles.rankColumn]}>Rang</Text>
            <Text style={[styles.tableHeaderText, styles.classAvgColumn]}>Moy. Cl.</Text>
          </View>

          {/* Lignes des matières */}
          {bulletin.subjectGrades.map((grade, index) => (
            <View key={grade.subject} style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}>
              <Text style={[styles.tableCellText, styles.subjectColumn]}>{grade.subject}</Text>
              <Text style={[styles.tableCellText, styles.coeffColumn]}>{grade.coefficient}</Text>
              <Text style={[styles.tableCellText, styles.gradeColumn]}>
                {grade.compositionGrades.join(' - ')}
              </Text>
              <Text style={[styles.tableCellText, styles.avgColumn, { color: getAverageColor(grade.subjectAverage) }]}>
                {grade.subjectAverage.toFixed(2)}
              </Text>
              <Text style={[styles.tableCellText, styles.rankColumn]}>{grade.subjectRank}</Text>
              <Text style={[styles.tableCellText, styles.classAvgColumn]}>{grade.classAverage.toFixed(2)}</Text>
            </View>
          ))}

          {/* Appréciations des professeurs */}
          <View style={styles.appreciationsSection}>
            <Text style={styles.appreciationsTitle}>Appréciations des Professeurs :</Text>
            {bulletin.subjectGrades.map((grade) => (
              <View key={grade.subject} style={styles.appreciationRow}>
                <Text style={styles.appreciationSubject}>{grade.subject} :</Text>
                <Text style={styles.appreciationText}>{grade.teacherAppreciation}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Synthèse générale */}
        <Card style={styles.summary}>
          <Text style={styles.summaryTitle}>Résultats Généraux</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Moyenne Générale :</Text>
            <Text style={[styles.summaryValue, styles.generalAverage, { color: getAverageColor(bulletin.generalAverage) }]}>
              {bulletin.generalAverage.toFixed(2)}/20
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Rang :</Text>
            <Text style={styles.summaryValue}>
              {bulletin.classRank}e / {bulletin.totalStudents} élèves
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Décision du Conseil :</Text>
            <View style={styles.decisionContainer}>
              {getDecisionIcon(bulletin.councilDecision)}
              <Text style={[styles.summaryValue, styles.decision]}>
                {bulletin.councilDecision}
              </Text>
            </View>
          </View>
        </Card>

        {/* Appréciation du conseil */}
        <Card style={styles.councilAppreciation}>
          <Text style={styles.appreciationTitle}>Appréciation du Conseil de Classe :</Text>
          <Text style={styles.appreciationContent}>{bulletin.councilAppreciation}</Text>
        </Card>

        {/* Boutons d'action pour les administrateurs */}
        {(user?.role === 'schoolAdmin' || user?.role === 'admin') && (
          <Card style={styles.actionButtons}>
            <Button
              title={isGeneratingPDF ? 'Génération en cours...' : 'Générer le Bulletin Officiel (PDF)'}
              onPress={handleGeneratePDF}
              disabled={isGeneratingPDF}
              style={styles.generateButton}
              icon={<FileText size={20} color={COLORS.white} />}
            />
            
            {bulletin.pdfGenerated && (
              <Button
                title="Télécharger/Voir PDF"
                onPress={handleDownloadPDF}
                variant="outline"
                style={styles.downloadButton}
                icon={<Download size={20} color={COLORS.primary} />}
              />
            )}
          </Card>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  officialHeader: {
    margin: 16,
    padding: 20,
    alignItems: 'center',
  },
  republicHeader: {
    alignItems: 'center',
  },
  republicText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  mottoText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  ministryText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  appBranding: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  schoolInfo: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    alignItems: 'center',
  },
  schoolName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  schoolAddress: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  selectors: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  selectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  selectorGroup: {
    flex: 1,
  },
  selectorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  periodTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  periodTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    marginRight: 8,
    marginBottom: 4,
  },
  periodTabActive: {
    backgroundColor: COLORS.primary,
  },
  periodTabText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  periodTabTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  yearSelector: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  yearText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  studentInfo: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  studentInfoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  studentInfoColumn: {
    flex: 1,
  },
  studentInfoLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  studentInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  gradesTable: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    padding: 16,
    backgroundColor: COLORS.surface,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tableRowEven: {
    backgroundColor: COLORS.surface,
  },
  tableCellText: {
    fontSize: 11,
    color: COLORS.text,
    textAlign: 'center',
  },
  subjectColumn: {
    flex: 3,
    textAlign: 'left',
  },
  coeffColumn: {
    flex: 1,
  },
  gradeColumn: {
    flex: 2,
  },
  avgColumn: {
    flex: 1,
    fontWeight: '600',
  },
  rankColumn: {
    flex: 1,
  },
  classAvgColumn: {
    flex: 1,
  },
  appreciationsSection: {
    padding: 16,
    backgroundColor: COLORS.surface,
  },
  appreciationsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  appreciationRow: {
    marginBottom: 8,
  },
  appreciationSubject: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  appreciationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  summary: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  generalAverage: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  decision: {
    marginLeft: 8,
  },
  decisionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  councilAppreciation: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  appreciationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  appreciationContent: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  actionButtons: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  generateButton: {
    marginBottom: 12,
  },
  downloadButton: {
    marginTop: 8,
  },
  bottomSpacing: {
    height: 32,
  },
});