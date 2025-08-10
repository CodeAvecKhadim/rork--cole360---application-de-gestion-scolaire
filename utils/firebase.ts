import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../firebase';
import type { Auth } from 'firebase/auth';
import type { Firestore, Query, CollectionReference, DocumentData } from 'firebase/firestore';

// Types pour les collections
export interface User {
  uid: string;
  email: string;
  prenom: string;
  nom: string;
  role: 'admin' | 'directeur' | 'professeur' | 'parent';
  dateCreation: Timestamp;
  is_active: boolean;
  ecoleId?: string;
}

export interface Ecole {
  id: string;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  directeurId: string;
  dateCreation: Timestamp;
}

export interface Classe {
  id: string;
  nom: string;
  niveau: string;
  ecoleId: string;
  professeurId: string;
  nombreEleves: number;
  dateCreation: Timestamp;
}

export interface Eleve {
  id: string;
  prenom: string;
  nom: string;
  dateNaissance: Timestamp;
  classeId: string;
  ecoleId: string;
  parents: string[]; // UIDs des parents
  adresse: string;
  telephone: string;
  dateInscription: Timestamp;
}

export interface Note {
  id: string;
  eleveId: string;
  classeId: string;
  coursId: string;
  valeur: number;
  coefficient: number;
  type: 'devoir' | 'controle' | 'examen';
  date: Timestamp;
  professeurId: string;
}

// Utilitaires d'authentification
export const authUtils = {
  // Inscription
  async signup(email: string, password: string, userData: Omit<User, 'uid' | 'dateCreation'>) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Mettre à jour le profil
      await updateProfile(user, {
        displayName: `${userData.prenom} ${userData.nom}`
      });
      
      // Créer le document utilisateur dans Firestore
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        email: user.email || email,
        prenom: userData.prenom,
        nom: userData.nom,
        role: userData.role,
        is_active: userData.is_active,
        ecoleId: userData.ecoleId,
        dateCreation: serverTimestamp()
      });
      
      console.log('✅ Utilisateur créé avec succès:', user.uid);
      return user;
    } catch (error) {
      console.error('❌ Erreur lors de l\'inscription:', error);
      throw error;
    }
  },

  // Connexion
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Connexion réussie:', userCredential.user.uid);
      return userCredential.user;
    } catch (error) {
      console.error('❌ Erreur lors de la connexion:', error);
      throw error;
    }
  },

  // Déconnexion
  async logout() {
    try {
      await signOut(auth);
      console.log('✅ Déconnexion réussie');
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
      throw error;
    }
  },

  // Réinitialisation du mot de passe
  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('✅ Email de réinitialisation envoyé');
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
      throw error;
    }
  }
};

// Utilitaires Firestore
export const firestoreUtils = {
  // Ajouter un document
  async addDocument(collectionName: string, data: any) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        dateCreation: serverTimestamp()
      });
      console.log(`✅ Document ajouté dans ${collectionName}:`, docRef.id);
      return docRef.id;
    } catch (error) {
      console.error(`❌ Erreur lors de l'ajout dans ${collectionName}:`, error);
      throw error;
    }
  },

  // Récupérer un document
  async getDocument(collectionName: string, docId: string) {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        console.log(`❌ Document non trouvé dans ${collectionName}:`, docId);
        return null;
      }
    } catch (error) {
      console.error(`❌ Erreur lors de la récupération dans ${collectionName}:`, error);
      throw error;
    }
  },

  // Récupérer tous les documents d'une collection
  async getCollection(collectionName: string, conditions?: any[]) {
    try {
      let q: Query<DocumentData> | CollectionReference<DocumentData> = collection(db, collectionName);
      
      if (conditions && conditions.length > 0) {
        q = query(collection(db, collectionName), ...conditions);
      }
      
      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`✅ ${documents.length} documents récupérés de ${collectionName}`);
      return documents;
    } catch (error) {
      console.error(`❌ Erreur lors de la récupération de ${collectionName}:`, error);
      throw error;
    }
  },

  // Mettre à jour un document
  async updateDocument(collectionName: string, docId: string, data: any) {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        dateModification: serverTimestamp()
      });
      console.log(`✅ Document mis à jour dans ${collectionName}:`, docId);
    } catch (error) {
      console.error(`❌ Erreur lors de la mise à jour dans ${collectionName}:`, error);
      throw error;
    }
  },

  // Supprimer un document
  async deleteDocument(collectionName: string, docId: string) {
    try {
      await deleteDoc(doc(db, collectionName, docId));
      console.log(`✅ Document supprimé de ${collectionName}:`, docId);
    } catch (error) {
      console.error(`❌ Erreur lors de la suppression dans ${collectionName}:`, error);
      throw error;
    }
  },

  // Écouter les changements en temps réel
  subscribeToCollection(collectionName: string, callback: (data: any[]) => void, conditions?: any[]) {
    try {
      let q: Query<DocumentData> | CollectionReference<DocumentData> = collection(db, collectionName);
      
      if (conditions && conditions.length > 0) {
        q = query(collection(db, collectionName), ...conditions);
      }
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const documents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(documents);
      });
      
      console.log(`✅ Abonnement créé pour ${collectionName}`);
      return unsubscribe;
    } catch (error) {
      console.error(`❌ Erreur lors de l'abonnement à ${collectionName}:`, error);
      throw error;
    }
  }
};

// Utilitaires spécifiques à École 360
export const ecole360Utils = {
  // Récupérer les classes d'un professeur
  async getClassesByProfesseur(professeurId: string) {
    return firestoreUtils.getCollection('classes', [
      where('professeurId', '==', professeurId)
    ]);
  },

  // Récupérer les élèves d'une classe
  async getElevesByClasse(classeId: string) {
    return firestoreUtils.getCollection('eleves', [
      where('classeId', '==', classeId)
    ]);
  },

  // Récupérer les notes d'un élève
  async getNotesByEleve(eleveId: string) {
    return firestoreUtils.getCollection('notes', [
      where('eleveId', '==', eleveId),
      orderBy('date', 'desc')
    ]);
  },

  // Récupérer les enfants d'un parent
  async getEnfantsByParent(parentId: string) {
    return firestoreUtils.getCollection('eleves', [
      where('parents', 'array-contains', parentId)
    ]);
  }
};

export { where, orderBy, limit, serverTimestamp, Timestamp };