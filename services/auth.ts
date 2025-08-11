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
  serverTimestamp
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
  // Créer les comptes de démonstration
  async createDemoAccounts(): Promise<void> {
    const demoAccounts = [
      { email: 'admin@ecole-360.com', password: 'AdminSecure123!', prenom: 'Admin', nom: 'Système', role: 'admin' as const },
      { email: 'school@ecole-360.com', password: 'SchoolAdmin123!', prenom: 'Directeur', nom: 'École', role: 'admin' as const },
      { email: 'teacher@ecole-360.com', password: 'Teacher123!', prenom: 'Professeur', nom: 'Enseignant', role: 'prof' as const },
      { email: 'parent@ecole-360.com', password: 'Parent123!', prenom: 'Parent', nom: 'Famille', role: 'parent' as const }
    ];

    for (const account of demoAccounts) {
      try {
        console.log(`Création du compte: ${account.email}`);
        await this.signUp(account.email, account.password, account.prenom, account.nom, account.role);
        console.log(`✅ Compte créé: ${account.email}`);
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`ℹ️ Compte déjà existant: ${account.email}`);
        } else {
          console.error(`❌ Erreur création ${account.email}:`, error.message);
        }
      }
    }
  },

  // Vérifier si un utilisateur existe
  async checkUserExists(email: string): Promise<boolean> {
    try {
      // Tenter une connexion avec un mot de passe incorrect pour vérifier l'existence
      await signInWithEmailAndPassword(auth, email, 'test-password-incorrect');
      return true;
    } catch (error: any) {
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        return true; // L'utilisateur existe mais le mot de passe est incorrect
      }
      if (error.code === 'auth/user-not-found') {
        return false; // L'utilisateur n'existe pas
      }
      return false;
    }
  },
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