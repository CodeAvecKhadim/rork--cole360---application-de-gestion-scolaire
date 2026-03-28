import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/libs/firebase';
import type { Grade } from '@/services/firestore';

/**
 * Service CRUD pour la collection 'notes'
 */
class GradeService {
  private collectionName = 'notes';

  /**
   * Créer une nouvelle note
   */
  async create(gradeData: Omit<Grade, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...gradeData,
        date: gradeData.date || serverTimestamp(),
        dateCreation: serverTimestamp()
      });
      console.log('Note créée avec l\'ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Erreur lors de la création de la note:', error);
      throw error;
    }
  }

  /**
   * Lire une note par son ID
   */
  async getById(id: string): Promise<Grade | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Grade;
      } else {
        console.log('Aucune note trouvée avec l\'ID:', id);
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de la lecture de la note:', error);
      throw error;
    }
  }

  /**
   * Lire toutes les notes
   */
  async getAll(): Promise<Grade[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const grades: Grade[] = [];
      querySnapshot.forEach((doc) => {
        grades.push({ id: doc.id, ...doc.data() } as Grade);
      });
      
      console.log(`${grades.length} notes récupérées`);
      return grades;
    } catch (error) {
      console.error('Erreur lors de la récupération des notes:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour une note
   */
  async update(id: string, updateData: Partial<Omit<Grade, 'id'>>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...updateData,
        dateModification: serverTimestamp()
      });
      console.log('Note mise à jour:', id);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la note:', error);
      throw error;
    }
  }

  /**
   * Supprimer une note
   */
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      console.log('Note supprimée:', id);
    } catch (error) {
      console.error('Erreur lors de la suppression de la note:', error);
      throw error;
    }
  }

  /**
   * Obtenir les notes d'un élève
   */
  async getByStudent(studentId: string): Promise<Grade[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('eleve_id', '==', studentId),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const grades: Grade[] = [];
      querySnapshot.forEach((doc) => {
        grades.push({ id: doc.id, ...doc.data() } as Grade);
      });
      
      return grades;
    } catch (error) {
      console.error('Erreur lors de la récupération des notes par élève:', error);
      throw error;
    }
  }

  /**
   * Obtenir les notes d'un cours
   */
  async getByCourse(courseId: string): Promise<Grade[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('cours_id', '==', courseId),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const grades: Grade[] = [];
      querySnapshot.forEach((doc) => {
        grades.push({ id: doc.id, ...doc.data() } as Grade);
      });
      
      return grades;
    } catch (error) {
      console.error('Erreur lors de la récupération des notes par cours:', error);
      throw error;
    }
  }

  /**
   * Obtenir les notes d'un professeur
   */
  async getByTeacher(teacherId: string): Promise<Grade[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('professeur_id', '==', teacherId),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const grades: Grade[] = [];
      querySnapshot.forEach((doc) => {
        grades.push({ id: doc.id, ...doc.data() } as Grade);
      });
      
      return grades;
    } catch (error) {
      console.error('Erreur lors de la récupération des notes par professeur:', error);
      throw error;
    }
  }

  /**
   * Obtenir les notes d'un élève pour un cours spécifique
   */
  async getByStudentAndCourse(studentId: string, courseId: string): Promise<Grade[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('eleve_id', '==', studentId),
        where('cours_id', '==', courseId),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const grades: Grade[] = [];
      querySnapshot.forEach((doc) => {
        grades.push({ id: doc.id, ...doc.data() } as Grade);
      });
      
      return grades;
    } catch (error) {
      console.error('Erreur lors de la récupération des notes par élève et cours:', error);
      throw error;
    }
  }

  /**
   * Obtenir les notes par type (devoir, controle, examen)
   */
  async getByType(type: 'devoir' | 'controle' | 'examen'): Promise<Grade[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('type', '==', type),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const grades: Grade[] = [];
      querySnapshot.forEach((doc) => {
        grades.push({ id: doc.id, ...doc.data() } as Grade);
      });
      
      return grades;
    } catch (error) {
      console.error('Erreur lors de la récupération des notes par type:', error);
      throw error;
    }
  }

  /**
   * Obtenir les notes dans une plage de dates
   */
  async getByDateRange(startDate: Date, endDate: Date): Promise<Grade[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate)),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const grades: Grade[] = [];
      querySnapshot.forEach((doc) => {
        grades.push({ id: doc.id, ...doc.data() } as Grade);
      });
      
      return grades;
    } catch (error) {
      console.error('Erreur lors de la récupération des notes par plage de dates:', error);
      throw error;
    }
  }

  /**
   * Calculer la moyenne d'un élève pour un cours
   */
  async calculateStudentCourseAverage(studentId: string, courseId: string): Promise<number> {
    try {
      const grades = await this.getByStudentAndCourse(studentId, courseId);
      
      if (grades.length === 0) {
        return 0;
      }
      
      let totalPoints = 0;
      let totalCoefficients = 0;
      
      grades.forEach(grade => {
        totalPoints += grade.valeur * grade.coefficient;
        totalCoefficients += grade.coefficient;
      });
      
      return totalCoefficients > 0 ? totalPoints / totalCoefficients : 0;
    } catch (error) {
      console.error('Erreur lors du calcul de la moyenne:', error);
      throw error;
    }
  }

  /**
   * Calculer la moyenne générale d'un élève
   */
  async calculateStudentGeneralAverage(studentId: string): Promise<number> {
    try {
      const grades = await this.getByStudent(studentId);
      
      if (grades.length === 0) {
        return 0;
      }
      
      let totalPoints = 0;
      let totalCoefficients = 0;
      
      grades.forEach(grade => {
        totalPoints += grade.valeur * grade.coefficient;
        totalCoefficients += grade.coefficient;
      });
      
      return totalCoefficients > 0 ? totalPoints / totalCoefficients : 0;
    } catch (error) {
      console.error('Erreur lors du calcul de la moyenne générale:', error);
      throw error;
    }
  }

  /**
   * Obtenir les meilleures notes d'un élève
   */
  async getTopGrades(studentId: string, limitCount: number = 5): Promise<Grade[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('eleve_id', '==', studentId),
        orderBy('valeur', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      
      const grades: Grade[] = [];
      querySnapshot.forEach((doc) => {
        grades.push({ id: doc.id, ...doc.data() } as Grade);
      });
      
      return grades;
    } catch (error) {
      console.error('Erreur lors de la récupération des meilleures notes:', error);
      throw error;
    }
  }

  /**
   * Obtenir les notes récentes
   */
  async getRecentGrades(limitCount: number = 10): Promise<Grade[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('date', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      
      const grades: Grade[] = [];
      querySnapshot.forEach((doc) => {
        grades.push({ id: doc.id, ...doc.data() } as Grade);
      });
      
      return grades;
    } catch (error) {
      console.error('Erreur lors de la récupération des notes récentes:', error);
      throw error;
    }
  }
}

// Instance unique du service
export const gradeService = new GradeService();
export default gradeService;

console.log('📊 Service Grades initialisé');