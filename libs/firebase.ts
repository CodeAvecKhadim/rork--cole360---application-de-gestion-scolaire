import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// Configuration Firebase basée sur votre google-services.json et GoogleService-Info.plist
const firebaseConfig = {
  apiKey: "AIzaSyCdKZPLeJxepR3fiJkMktmBCoVTmYMoKjM",
  authDomain: "ecole-360---rork-fix.firebaseapp.com",
  projectId: "ecole-360---rork-fix",
  storageBucket: "ecole-360---rork-fix.firebasestorage.app",
  messagingSenderId: "914223114395",
  appId: "1:914223114395:ios:3b6953077b82f6da513e3e"
};

// Initialiser Firebase seulement s'il n'est pas déjà initialisé
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialiser Auth
const auth: Auth = getAuth(app);

// Initialiser Firestore
const db: Firestore = getFirestore(app);

// Initialiser Storage
const storage: FirebaseStorage = getStorage(app);

// Vérifier la connexion Firebase
console.log('🔥 Firebase initialisé avec succès');
console.log('📋 Project ID:', firebaseConfig.projectId);
console.log('🌐 Auth Domain:', firebaseConfig.authDomain);
console.log('🔑 API Key:', firebaseConfig.apiKey.substring(0, 10) + '...');
console.log('📱 App ID:', firebaseConfig.appId);
console.log('💾 Storage Bucket:', firebaseConfig.storageBucket);

// Test de connexion Firebase
export const testFirebaseConnection = async () => {
  try {
    console.log('🧪 Test de connexion Firebase...');
    
    // Test de l'authentification
    const currentUser = auth.currentUser;
    console.log('👤 Utilisateur actuel:', currentUser ? currentUser.uid : 'Aucun');
    
    // Test de Firestore
    console.log('🗄️ Firestore connecté');
    
    return {
      auth: !!auth,
      firestore: !!db,
      storage: !!storage,
      currentUser: currentUser?.uid || null,
      config: {
        projectId: firebaseConfig.projectId,
        authDomain: firebaseConfig.authDomain,
        storageBucket: firebaseConfig.storageBucket
      }
    };
  } catch (error) {
    console.error('❌ Erreur de test Firebase:', error);
    return { error: error instanceof Error ? error.message : 'Erreur inconnue' };
  }
};

export { auth, db, storage };
export default app;