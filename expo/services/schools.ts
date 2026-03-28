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
  type QueryConstraint
} from 'firebase/firestore';
import { db } from '@/libs/firebase';
import type { School } from '@/services/firestore';

/**
 * Service CRUD pour la collection 'ecoles'
 */
class SchoolService {
  private collectionName = 'ecoles';

  /**
   * Créer une nouvelle école
   */
  async create(schoolData: Omit<School, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...schoolData,
        dateCreation: serverTimestamp(),
        is_active: true
      });
      console.log('École créée avec l\'ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Erreur lors de la création de l\'école:', error);
      throw error;
    }
  }

  /**
   * Lire une école par son ID
   */
  async getById(id: string): Promise<School | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as School;
      } else {
        console.log('Aucune école trouvée avec l\'ID:', id);
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de la lecture de l\'école:', error);
      throw error;
    }
  }

  /**
   * Lire toutes les écoles actives
   */
  async getAll(): Promise<School[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('is_active', '==', true),
        orderBy('dateCreation', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const schools: School[] = [];
      querySnapshot.forEach((doc) => {
        schools.push({ id: doc.id, ...doc.data() } as School);
      });
      
      console.log(`${schools.length} écoles récupérées`);
      return schools;
    } catch (error) {
      console.error('Erreur lors de la récupération des écoles:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour une école
   */
  async update(id: string, updateData: Partial<Omit<School, 'id'>>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...updateData,
        dateModification: serverTimestamp()
      });
      console.log('École mise à jour:', id);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'école:', error);
      throw error;
    }
  }

  /**
   * Supprimer une école (suppression logique)
   */
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        is_active: false,
        dateSupression: serverTimestamp()
      });
      console.log('École supprimée (logiquement):', id);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'école:', error);
      throw error;
    }
  }

  /**
   * Supprimer définitivement une école
   */
  async hardDelete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      console.log('École supprimée définitivement:', id);
    } catch (error) {
      console.error('Erreur lors de la suppression définitive de l\'école:', error);
      throw error;
    }
  }

  /**
   * Rechercher des écoles par directeur
   */
  async getByDirector(directorId: string): Promise<School[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('directeur_id', '==', directorId),
        where('is_active', '==', true)
      );
      const querySnapshot = await getDocs(q);
      
      const schools: School[] = [];
      querySnapshot.forEach((doc) => {
        schools.push({ id: doc.id, ...doc.data() } as School);
      });
      
      return schools;
    } catch (error) {
      console.error('Erreur lors de la recherche par directeur:', error);
      throw error;
    }
  }

  /**
   * Rechercher des écoles par nom
   */
  async searchByName(searchTerm: string): Promise<School[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('is_active', '==', true),
        orderBy('nom')
      );
      const querySnapshot = await getDocs(q);
      
      const schools: School[] = [];
      querySnapshot.forEach((doc) => {
        const school = { id: doc.id, ...doc.data() } as School;
        if (school.nom.toLowerCase().includes(searchTerm.toLowerCase())) {
          schools.push(school);
        }
      });
      
      return schools;
    } catch (error) {
      console.error('Erreur lors de la recherche par nom:', error);
      throw error;
    }
  }

  /**
   * Obtenir les écoles récemment créées
   */
  async getRecent(limitCount: number = 10): Promise<School[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('is_active', '==', true),
        orderBy('dateCreation', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      
      const schools: School[] = [];
      querySnapshot.forEach((doc) => {
        schools.push({ id: doc.id, ...doc.data() } as School);
      });
      
      return schools;
    } catch (error) {
      console.error('Erreur lors de la récupération des écoles récentes:', error);
      throw error;
    }
  }
}

// Instance unique du service
export const schoolService = new SchoolService();
export default schoolService;

console.log('🏫 Service Schools initialisé');