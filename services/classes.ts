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
import type { Class } from '@/services/firestore';

/**
 * Service CRUD pour la collection 'classes'
 */
class ClassService {
  private collectionName = 'classes';

  /**
   * Créer une nouvelle classe
   */
  async create(classData: Omit<Class, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...classData,
        dateCreation: serverTimestamp(),
        is_active: true,
        professeurs: classData.professeurs || [],
        eleves: classData.eleves || []
      });
      console.log('Classe créée avec l\'ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Erreur lors de la création de la classe:', error);
      throw error;
    }
  }

  /**
   * Lire une classe par son ID
   */
  async getById(id: string): Promise<Class | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Class;
      } else {
        console.log('Aucune classe trouvée avec l\'ID:', id);
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de la lecture de la classe:', error);
      throw error;
    }
  }

  /**
   * Lire toutes les classes actives
   */
  async getAll(): Promise<Class[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('is_active', '==', true),
        orderBy('nom')
      );
      const querySnapshot = await getDocs(q);
      
      const classes: Class[] = [];
      querySnapshot.forEach((doc) => {
        classes.push({ id: doc.id, ...doc.data() } as Class);
      });
      
      console.log(`${classes.length} classes récupérées`);
      return classes;
    } catch (error) {
      console.error('Erreur lors de la récupération des classes:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour une classe
   */
  async update(id: string, updateData: Partial<Omit<Class, 'id'>>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...updateData,
        dateModification: serverTimestamp()
      });
      console.log('Classe mise à jour:', id);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la classe:', error);
      throw error;
    }
  }

  /**
   * Supprimer une classe (suppression logique)
   */
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        is_active: false,
        dateSupression: serverTimestamp()
      });
      console.log('Classe supprimée (logiquement):', id);
    } catch (error) {
      console.error('Erreur lors de la suppression de la classe:', error);
      throw error;
    }
  }

  /**
   * Supprimer définitivement une classe
   */
  async hardDelete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      console.log('Classe supprimée définitivement:', id);
    } catch (error) {
      console.error('Erreur lors de la suppression définitive de la classe:', error);
      throw error;
    }
  }

  /**
   * Obtenir les classes d'une école
   */
  async getBySchool(schoolId: string): Promise<Class[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('ecole_id', '==', schoolId),
        where('is_active', '==', true),
        orderBy('nom')
      );
      const querySnapshot = await getDocs(q);
      
      const classes: Class[] = [];
      querySnapshot.forEach((doc) => {
        classes.push({ id: doc.id, ...doc.data() } as Class);
      });
      
      return classes;
    } catch (error) {
      console.error('Erreur lors de la récupération des classes par école:', error);
      throw error;
    }
  }

  /**
   * Obtenir les classes d'un professeur
   */
  async getByTeacher(teacherId: string): Promise<Class[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('professeurs', 'array-contains', teacherId),
        where('is_active', '==', true),
        orderBy('nom')
      );
      const querySnapshot = await getDocs(q);
      
      const classes: Class[] = [];
      querySnapshot.forEach((doc) => {
        classes.push({ id: doc.id, ...doc.data() } as Class);
      });
      
      return classes;
    } catch (error) {
      console.error('Erreur lors de la récupération des classes par professeur:', error);
      throw error;
    }
  }

  /**
   * Obtenir les classes par niveau
   */
  async getByLevel(niveau: string): Promise<Class[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('niveau', '==', niveau),
        where('is_active', '==', true),
        orderBy('nom')
      );
      const querySnapshot = await getDocs(q);
      
      const classes: Class[] = [];
      querySnapshot.forEach((doc) => {
        classes.push({ id: doc.id, ...doc.data() } as Class);
      });
      
      return classes;
    } catch (error) {
      console.error('Erreur lors de la récupération des classes par niveau:', error);
      throw error;
    }
  }

  /**
   * Ajouter un professeur à une classe
   */
  async addTeacher(classId: string, teacherId: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, classId);
      await updateDoc(docRef, {
        professeurs: arrayUnion(teacherId),
        dateModification: serverTimestamp()
      });
      console.log(`Professeur ${teacherId} ajouté à la classe ${classId}`);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du professeur:', error);
      throw error;
    }
  }

  /**
   * Retirer un professeur d'une classe
   */
  async removeTeacher(classId: string, teacherId: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, classId);
      await updateDoc(docRef, {
        professeurs: arrayRemove(teacherId),
        dateModification: serverTimestamp()
      });
      console.log(`Professeur ${teacherId} retiré de la classe ${classId}`);
    } catch (error) {
      console.error('Erreur lors du retrait du professeur:', error);
      throw error;
    }
  }

  /**
   * Ajouter un élève à une classe
   */
  async addStudent(classId: string, studentId: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, classId);
      await updateDoc(docRef, {
        eleves: arrayUnion(studentId),
        dateModification: serverTimestamp()
      });
      console.log(`Élève ${studentId} ajouté à la classe ${classId}`);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'élève:', error);
      throw error;
    }
  }

  /**
   * Retirer un élève d'une classe
   */
  async removeStudent(classId: string, studentId: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, classId);
      await updateDoc(docRef, {
        eleves: arrayRemove(studentId),
        dateModification: serverTimestamp()
      });
      console.log(`Élève ${studentId} retiré de la classe ${classId}`);
    } catch (error) {
      console.error('Erreur lors du retrait de l\'élève:', error);
      throw error;
    }
  }

  /**
   * Rechercher des classes par nom
   */
  async searchByName(searchTerm: string): Promise<Class[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('is_active', '==', true),
        orderBy('nom')
      );
      const querySnapshot = await getDocs(q);
      
      const classes: Class[] = [];
      querySnapshot.forEach((doc) => {
        const classData = { id: doc.id, ...doc.data() } as Class;
        if (classData.nom.toLowerCase().includes(searchTerm.toLowerCase())) {
          classes.push(classData);
        }
      });
      
      return classes;
    } catch (error) {
      console.error('Erreur lors de la recherche par nom:', error);
      throw error;
    }
  }
}

// Instance unique du service
export const classService = new ClassService();
export default classService;

console.log('🎓 Service Classes initialisé');