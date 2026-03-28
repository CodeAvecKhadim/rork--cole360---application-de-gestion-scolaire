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
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '@/libs/firebase';
import type { Student } from '@/services/firestore';

/**
 * Service CRUD pour la collection 'eleves'
 */
class StudentService {
  private collectionName = 'eleves';

  /**
   * Créer un nouvel élève
   */
  async create(studentData: Omit<Student, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...studentData,
        dateInscription: serverTimestamp(),
        is_active: true,
        parents: studentData.parents || []
      });
      console.log('Élève créé avec l\'ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Erreur lors de la création de l\'élève:', error);
      throw error;
    }
  }

  /**
   * Lire un élève par son ID
   */
  async getById(id: string): Promise<Student | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Student;
      } else {
        console.log('Aucun élève trouvé avec l\'ID:', id);
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de la lecture de l\'élève:', error);
      throw error;
    }
  }

  /**
   * Lire tous les élèves actifs
   */
  async getAll(): Promise<Student[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('is_active', '==', true),
        orderBy('nom'),
        orderBy('prenom')
      );
      const querySnapshot = await getDocs(q);
      
      const students: Student[] = [];
      querySnapshot.forEach((doc) => {
        students.push({ id: doc.id, ...doc.data() } as Student);
      });
      
      console.log(`${students.length} élèves récupérés`);
      return students;
    } catch (error) {
      console.error('Erreur lors de la récupération des élèves:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour un élève
   */
  async update(id: string, updateData: Partial<Omit<Student, 'id'>>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...updateData,
        dateModification: serverTimestamp()
      });
      console.log('Élève mis à jour:', id);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'élève:', error);
      throw error;
    }
  }

  /**
   * Supprimer un élève (suppression logique)
   */
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        is_active: false,
        dateSupression: serverTimestamp()
      });
      console.log('Élève supprimé (logiquement):', id);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'élève:', error);
      throw error;
    }
  }

  /**
   * Supprimer définitivement un élève
   */
  async hardDelete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      console.log('Élève supprimé définitivement:', id);
    } catch (error) {
      console.error('Erreur lors de la suppression définitive de l\'élève:', error);
      throw error;
    }
  }

  /**
   * Obtenir les élèves d'une classe
   */
  async getByClass(classId: string): Promise<Student[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('classe_id', '==', classId),
        where('is_active', '==', true),
        orderBy('nom'),
        orderBy('prenom')
      );
      const querySnapshot = await getDocs(q);
      
      const students: Student[] = [];
      querySnapshot.forEach((doc) => {
        students.push({ id: doc.id, ...doc.data() } as Student);
      });
      
      return students;
    } catch (error) {
      console.error('Erreur lors de la récupération des élèves par classe:', error);
      throw error;
    }
  }

  /**
   * Obtenir les élèves d'un parent
   */
  async getByParent(parentId: string): Promise<Student[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('parents', 'array-contains', parentId),
        where('is_active', '==', true),
        orderBy('nom'),
        orderBy('prenom')
      );
      const querySnapshot = await getDocs(q);
      
      const students: Student[] = [];
      querySnapshot.forEach((doc) => {
        students.push({ id: doc.id, ...doc.data() } as Student);
      });
      
      return students;
    } catch (error) {
      console.error('Erreur lors de la récupération des élèves par parent:', error);
      throw error;
    }
  }

  /**
   * Rechercher des élèves par nom ou prénom
   */
  async searchByName(searchTerm: string): Promise<Student[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('is_active', '==', true),
        orderBy('nom')
      );
      const querySnapshot = await getDocs(q);
      
      const students: Student[] = [];
      querySnapshot.forEach((doc) => {
        const student = { id: doc.id, ...doc.data() } as Student;
        const fullName = `${student.prenom} ${student.nom}`.toLowerCase();
        if (fullName.includes(searchTerm.toLowerCase())) {
          students.push(student);
        }
      });
      
      return students;
    } catch (error) {
      console.error('Erreur lors de la recherche par nom:', error);
      throw error;
    }
  }

  /**
   * Obtenir les élèves par date de naissance (pour les anniversaires)
   */
  async getByBirthDate(date: string): Promise<Student[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('dateNaissance', '==', date),
        where('is_active', '==', true)
      );
      const querySnapshot = await getDocs(q);
      
      const students: Student[] = [];
      querySnapshot.forEach((doc) => {
        students.push({ id: doc.id, ...doc.data() } as Student);
      });
      
      return students;
    } catch (error) {
      console.error('Erreur lors de la récupération par date de naissance:', error);
      throw error;
    }
  }

  /**
   * Ajouter un parent à un élève
   */
  async addParent(studentId: string, parentId: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, studentId);
      await updateDoc(docRef, {
        parents: arrayUnion(parentId),
        dateModification: serverTimestamp()
      });
      console.log(`Parent ${parentId} ajouté à l'élève ${studentId}`);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du parent:', error);
      throw error;
    }
  }

  /**
   * Retirer un parent d'un élève
   */
  async removeParent(studentId: string, parentId: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, studentId);
      await updateDoc(docRef, {
        parents: arrayRemove(parentId),
        dateModification: serverTimestamp()
      });
      console.log(`Parent ${parentId} retiré de l'élève ${studentId}`);
    } catch (error) {
      console.error('Erreur lors du retrait du parent:', error);
      throw error;
    }
  }

  /**
   * Changer la classe d'un élève
   */
  async changeClass(studentId: string, newClassId: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, studentId);
      await updateDoc(docRef, {
        classe_id: newClassId,
        dateModification: serverTimestamp()
      });
      console.log(`Élève ${studentId} transféré vers la classe ${newClassId}`);
    } catch (error) {
      console.error('Erreur lors du changement de classe:', error);
      throw error;
    }
  }

  /**
   * Obtenir les élèves récemment inscrits
   */
  async getRecentlyEnrolled(limitCount: number = 10): Promise<Student[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('is_active', '==', true),
        orderBy('dateInscription', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      
      const students: Student[] = [];
      querySnapshot.forEach((doc) => {
        students.push({ id: doc.id, ...doc.data() } as Student);
      });
      
      return students;
    } catch (error) {
      console.error('Erreur lors de la récupération des élèves récents:', error);
      throw error;
    }
  }

  /**
   * Obtenir le nombre total d'élèves actifs
   */
  async getTotalCount(): Promise<number> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('is_active', '==', true)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Erreur lors du comptage des élèves:', error);
      throw error;
    }
  }
}

// Instance unique du service
export const studentService = new StudentService();
export default studentService;

console.log('👨‍🎓 Service Students initialisé');