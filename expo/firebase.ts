import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// Configuration Firebase basée sur votre google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyCYKFEXa5KKJtViWjFRXsjGzk2BCx6IvVw",
  authDomain: "ecole-360---rork-fix.firebaseapp.com",
  projectId: "ecole-360---rork-fix",
  storageBucket: "ecole-360---rork-fix.firebasestorage.app",
  messagingSenderId: "914223114395",
  appId: "1:914223114395:android:94b3dbb69cb032e1513e3e"
};

// Initialiser Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialiser Auth
const auth: Auth = getAuth(app);

// Initialiser Firestore
const db: Firestore = getFirestore(app);

export { auth, db };
export default app;