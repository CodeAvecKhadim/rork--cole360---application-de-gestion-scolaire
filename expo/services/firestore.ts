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
  type DocumentData,
  type QueryConstraint
} from 'firebase/firestore';
import { db } from '@/libs/firebase';

// Types pour les collections Firestore
export interface School {
  id?: string;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  directeur_id: string;
  dateCreation: any;
  is_active: boolean;
}

export interface Class {
  id?: string;
  nom: string;
  niveau: string;
  ecole_id: string;
  professeurs: string[];
  eleves: string[];
  dateCreation: any;
  is_active: boolean;
}

export interface Student {
  id?: string;
  prenom: string;
  nom: string;
  dateNaissance: string;
  classe_id: string;
  parents: string[];
  dateInscription: any;
  is_active: boolean;
}

export interface Grade {
  id?: string;
  eleve_id: string;
  cours_id: string;
  professeur_id: string;
  valeur: number;
  coefficient: number;
  type: 'devoir' | 'controle' | 'examen';
  date: any;
  commentaire?: string;
}

export interface Course {
  id?: string;
  nom: string;
  description: string;
  coefficient: number;
  couleur: string;
  dateCreation: any;
  is_active: boolean;
}

export interface Message {
  id?: string;
  expediteur_id: string;
  destinataire_id: string;
  sujet: string;
  contenu: string;
  dateEnvoi: any;
  lu: boolean;
  type: 'info' | 'urgent' | 'normal';
}

export interface LocationData {
  id?: string;
  eleve_id: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: any;
  address?: string;
  is_safe_zone: boolean;
}

// Service générique pour les opérations CRUD
class FirestoreService {
  // Créer un document
  async create<T extends DocumentData>(collectionName: string, data: Omit<T, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        dateCreation: serverTimestamp()
      });
      console.log(`Document créé dans ${collectionName}:`, docRef.id);
      return docRef.id;
    } catch (error) {
      console.error(`Erreur lors de la création dans ${collectionName}:`, error);
      throw error;
    }
  }

  // Lire un document par ID
  async getById<T extends DocumentData>(collectionName: string, id: string): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as unknown as T;
      } else {
        console.log(`Aucun document trouvé dans ${collectionName} avec l'ID:`, id);
        return null;
      }
    } catch (error) {
      console.error(`Erreur lors de la lecture dans ${collectionName}:`, error);
      throw error;
    }
  }

  // Lire tous les documents d'une collection avec filtres optionnels
  async getAll<T extends DocumentData>(
    collectionName: string, 
    constraints: QueryConstraint[] = []
  ): Promise<T[]> {
    try {
      const q = query(collection(db, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      
      const documents: T[] = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() } as unknown as T);
      });
      
      console.log(`${documents.length} documents récupérés de ${collectionName}`);
      return documents;
    } catch (error) {
      console.error(`Erreur lors de la lecture de ${collectionName}:`, error);
      throw error;
    }
  }

  // Mettre à jour un document
  async update<T extends DocumentData>(
    collectionName: string, 
    id: string, 
    data: Partial<Omit<T, 'id'>>
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        dateModification: serverTimestamp()
      });
      console.log(`Document mis à jour dans ${collectionName}:`, id);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour dans ${collectionName}:`, error);
      throw error;
    }
  }

  // Supprimer un document
  async delete(collectionName: string, id: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      console.log(`Document supprimé de ${collectionName}:`, id);
    } catch (error) {
      console.error(`Erreur lors de la suppression dans ${collectionName}:`, error);
      throw error;
    }
  }

  // Requêtes spécialisées
  async getByField<T extends DocumentData>(
    collectionName: string, 
    field: string, 
    value: any
  ): Promise<T[]> {
    return this.getAll<T>(collectionName, [where(field, '==', value)]);
  }

  async getActiveDocuments<T extends DocumentData>(collectionName: string): Promise<T[]> {
    return this.getAll<T>(collectionName, [where('is_active', '==', true)]);
  }

  async getRecentDocuments<T extends DocumentData>(
    collectionName: string, 
    limitCount: number = 10
  ): Promise<T[]> {
    return this.getAll<T>(collectionName, [
      orderBy('dateCreation', 'desc'),
      limit(limitCount)
    ]);
  }
}

// Instance du service
export const firestoreService = new FirestoreService();

// Services spécialisés pour chaque collection
export const schoolService = {
  create: (data: Omit<School, 'id'>) => firestoreService.create<School>('ecoles', data),
  getById: (id: string) => firestoreService.getById<School>('ecoles', id),
  getAll: () => firestoreService.getActiveDocuments<School>('ecoles'),
  update: (id: string, data: Partial<School>) => firestoreService.update<School>('ecoles', id, data),
  delete: (id: string) => firestoreService.delete('ecoles', id),
  getByDirector: (directorId: string) => firestoreService.getByField<School>('ecoles', 'directeur_id', directorId),
};

export const classService = {
  create: (data: Omit<Class, 'id'>) => firestoreService.create<Class>('classes', data),
  getById: (id: string) => firestoreService.getById<Class>('classes', id),
  getAll: () => firestoreService.getActiveDocuments<Class>('classes'),
  update: (id: string, data: Partial<Class>) => firestoreService.update<Class>('classes', id, data),
  delete: (id: string) => firestoreService.delete('classes', id),
  getBySchool: (schoolId: string) => firestoreService.getByField<Class>('classes', 'ecole_id', schoolId),
  getByTeacher: (teacherId: string) => firestoreService.getByField<Class>('classes', 'professeurs', teacherId),
};

export const studentService = {
  create: (data: Omit<Student, 'id'>) => firestoreService.create<Student>('eleves', data),
  getById: (id: string) => firestoreService.getById<Student>('eleves', id),
  getAll: () => firestoreService.getActiveDocuments<Student>('eleves'),
  update: (id: string, data: Partial<Student>) => firestoreService.update<Student>('eleves', id, data),
  delete: (id: string) => firestoreService.delete('eleves', id),
  getByClass: (classId: string) => firestoreService.getByField<Student>('eleves', 'classe_id', classId),
  getByParent: (parentId: string) => firestoreService.getByField<Student>('eleves', 'parents', parentId),
};

export const gradeService = {
  create: (data: Omit<Grade, 'id'>) => firestoreService.create<Grade>('notes', data),
  getById: (id: string) => firestoreService.getById<Grade>('notes', id),
  getAll: () => firestoreService.getAll<Grade>('notes'),
  update: (id: string, data: Partial<Grade>) => firestoreService.update<Grade>('notes', id, data),
  delete: (id: string) => firestoreService.delete('notes', id),
  getByStudent: (studentId: string) => firestoreService.getByField<Grade>('notes', 'eleve_id', studentId),
  getByCourse: (courseId: string) => firestoreService.getByField<Grade>('notes', 'cours_id', courseId),
  getByTeacher: (teacherId: string) => firestoreService.getByField<Grade>('notes', 'professeur_id', teacherId),
};

export const courseService = {
  create: (data: Omit<Course, 'id'>) => firestoreService.create<Course>('cours', data),
  getById: (id: string) => firestoreService.getById<Course>('cours', id),
  getAll: () => firestoreService.getActiveDocuments<Course>('cours'),
  update: (id: string, data: Partial<Course>) => firestoreService.update<Course>('cours', id, data),
  delete: (id: string) => firestoreService.delete('cours', id),
};

export const messageService = {
  create: (data: Omit<Message, 'id'>) => firestoreService.create<Message>('messages', data),
  getById: (id: string) => firestoreService.getById<Message>('messages', id),
  getAll: () => firestoreService.getAll<Message>('messages'),
  update: (id: string, data: Partial<Message>) => firestoreService.update<Message>('messages', id, data),
  delete: (id: string) => firestoreService.delete('messages', id),
  getBySender: (senderId: string) => firestoreService.getByField<Message>('messages', 'expediteur_id', senderId),
  getByReceiver: (receiverId: string) => firestoreService.getByField<Message>('messages', 'destinataire_id', receiverId),
  markAsRead: (id: string) => firestoreService.update<Message>('messages', id, { lu: true }),
};

export const locationService = {
  create: (data: Omit<LocationData, 'id'>) => firestoreService.create<LocationData>('locations', data),
  getById: (id: string) => firestoreService.getById<LocationData>('locations', id),
  getAll: () => firestoreService.getAll<LocationData>('locations'),
  update: (id: string, data: Partial<LocationData>) => firestoreService.update<LocationData>('locations', id, data),
  delete: (id: string) => firestoreService.delete('locations', id),
  getByStudent: (studentId: string) => firestoreService.getByField<LocationData>('locations', 'eleve_id', studentId),
  getRecentByStudent: (studentId: string, limitCount: number = 50) => 
    firestoreService.getAll<LocationData>('locations', [
      where('eleve_id', '==', studentId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    ]),
};

console.log('🔥 Services Firestore initialisés avec succès');