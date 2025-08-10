# Configuration Firebase pour École 360

## ✅ Configuration terminée

Votre projet École 360 est maintenant configuré avec Firebase ! Voici ce qui a été mis en place :

### 📦 Dépendances installées
- `firebase` - SDK Firebase pour React Native/Web

### 🔧 Fichiers de configuration créés

#### 1. `firebase.ts` - Configuration principale
- Initialisation de Firebase avec vos paramètres de projet
- Configuration de Firebase Auth
- Configuration de Firestore
- Compatible Web et Mobile

#### 2. `google-services.json` - Configuration Android
- Fichier de configuration pour les builds Android
- Contient les clés API et identifiants de projet

#### 3. `firestore.rules` - Règles de sécurité Firestore
- Règles de sécurité adaptées à votre structure École 360
- Gestion des permissions par rôle (admin, directeur, professeur, parent)
- Protection des données sensibles des élèves

#### 4. `utils/firebase.ts` - Utilitaires Firebase
- Fonctions d'authentification (signup, login, logout, resetPassword)
- Utilitaires Firestore (CRUD operations)
- Fonctions spécifiques à École 360
- Types TypeScript pour toutes les collections

### 🏗️ Structure des collections Firestore

```
📁 users (utilisateurs)
├── uid, email, prenom, nom, role, dateCreation, is_active, ecoleId

📁 ecoles (écoles)
├── nom, adresse, telephone, email, directeurId, dateCreation

📁 classes (classes)
├── nom, niveau, ecoleId, professeurId, nombreEleves, dateCreation

📁 eleves (élèves)
├── prenom, nom, dateNaissance, classeId, ecoleId, parents[], adresse, telephone

📁 notes (notes)
├── eleveId, classeId, coursId, valeur, coefficient, type, date, professeurId

📁 presences (présences)
├── eleveId, classeId, date, present, retard, justifie

📁 cours (matières)
├── nom, description, dateCreation

📁 messages (messagerie)
├── expediteur, destinataire, contenu, date, lu

📁 notifications (notifications)
├── userId, titre, contenu, date, lu, type

📁 locations (localisation)
├── eleveId, latitude, longitude, timestamp, precision

📁 bulletins (bulletins scolaires)
├── eleveId, periode, notes[], moyenne, commentaires
```

### 🚀 Utilisation dans votre code

#### Authentification
```typescript
import { authUtils } from '@/utils/firebase';

// Inscription
await authUtils.signup(email, password, {
  prenom: 'Jean',
  nom: 'Dupont',
  role: 'parent',
  is_active: true
});

// Connexion
await authUtils.login(email, password);

// Déconnexion
await authUtils.logout();
```

#### Firestore
```typescript
import { firestoreUtils, ecole360Utils } from '@/utils/firebase';

// Ajouter un élève
await firestoreUtils.addDocument('eleves', {
  prenom: 'Marie',
  nom: 'Martin',
  classeId: 'classe123',
  parents: ['parent123']
});

// Récupérer les élèves d'une classe
const eleves = await ecole360Utils.getElevesByClasse('classe123');

// Écouter les changements en temps réel
const unsubscribe = firestoreUtils.subscribeToCollection('notes', (notes) => {
  console.log('Nouvelles notes:', notes);
});
```

### 🔐 Étapes suivantes pour la sécurité

1. **Copiez les règles Firestore** :
   - Allez dans la console Firebase > Firestore Database > Rules
   - Copiez le contenu de `firestore.rules` dans l'éditeur
   - Publiez les règles

2. **Configurez l'authentification** :
   - Activez les méthodes de connexion souhaitées (Email/Password)
   - Configurez les domaines autorisés pour le web

3. **Pour les builds natifs** :
   - Le fichier `google-services.json` est prêt pour Android
   - Pour iOS, vous devrez télécharger `GoogleService-Info.plist` depuis la console Firebase

### 📱 Compatibilité

- ✅ **Web** : Fonctionne avec React Native Web
- ✅ **iOS** : Prêt pour les builds natifs
- ✅ **Android** : Configuration incluse avec google-services.json

### 🔧 Dev Client / EAS

Votre projet est maintenant prêt pour :
- Builds avec EAS Build
- Dev Client pour tester sur appareil
- Déploiement sur les stores

---

**🎉 Firebase est maintenant intégré à votre application École 360 !**

Vous pouvez commencer à utiliser les fonctions d'authentification et de base de données dans vos composants React Native.