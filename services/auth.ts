import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  type User 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp,
  type DocumentData 
} from 'firebase/firestore';
import { auth, db } from '@/libs/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  prenom: string;
  nom: string;
  role: 'admin' | 'prof' | 'parent';
  dateCreation: any;
  is_active: boolean;
}

export const authService = {
  // Inscription d'un nouvel utilisateur
  async signUp(email: string, password: string, prenom: string, nom: string, role: 'admin' | 'prof' | 'parent' = 'parent'): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Créer le document utilisateur dans Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        prenom,
        nom,
        role,
        dateCreation: serverTimestamp(),
        is_active: true
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      
      console.log('Utilisateur créé avec succès:', user.uid);
      return user;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  },

  // Connexion d'un utilisateur
  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Connexion réussie:', userCredential.user.uid);
      return userCredential.user;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  },

  // Déconnexion
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
      console.log('Déconnexion réussie');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  },

  // Récupérer le profil utilisateur depuis Firestore
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      } else {
        console.log('Aucun profil utilisateur trouvé');
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      throw error;
    }
  },

  // Obtenir l'utilisateur actuel
  getCurrentUser(): User | null {
    return auth.currentUser;
  }
};