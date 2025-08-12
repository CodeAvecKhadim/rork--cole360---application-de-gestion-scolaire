# Configuration des Index Firestore - École 360

## Problème
Les erreurs que vous rencontrez sont dues à des index composites manquants dans Firestore et à des problèmes de permissions. Quand vous utilisez plusieurs champs dans une requête (avec `where` et `orderBy`), Firestore nécessite des index composites.

## ÉTAPES OBLIGATOIRES POUR CORRIGER LES ERREURS

### 1. Mettre à jour les règles Firestore (CRITIQUE)

**IMPORTANT :** Vous devez d'abord mettre à jour les règles Firestore pour corriger les erreurs de permissions.

1. Allez sur [Firebase Console](https://console.firebase.google.com)
2. Sélectionnez votre projet `ecole-360---rork-fix`
3. Allez dans **Firestore Database** > **Règles**
4. Remplacez tout le contenu par les règles du fichier `firestore.rules` de ce projet
5. Cliquez sur **Publier**

### 2. Créer les Index via les Liens d'Erreur

#### Index pour les Abonnements (subscriptions)
Cliquez sur ce lien pour créer l'index automatiquement :
```
https://console.firebase.google.com/v1/r/project/ecole-360---rork-fix/firestore/indexes?create_composite=Clpwcm9qZWN0cy9lY29sZS0zNjAtLS1yb3JrLWZpeC9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvc3Vic2NyaXB0aW9ucy9pbmRleGVzL18QARoKCgZhY3RpdmUQARoKCgZ1c2VySWQQARoNCgljcmVhdGVkQXQQAhoMCghfX25hbWVfXxAC
```

#### Index pour les Transactions de Paiement (payment_transactions)
Cliquez sur ce lien pour créer l'index automatiquement :
```
https://console.firebase.google.com/v1/r/project/ecole-360---rork-fix/firestore/indexes?create_composite=CmFwcm9qZWN0cy9lY29sZS0zNjAtLS1yb3JrLWZpeC9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvcGF5bWVudF90cmFuc2FjdGlvbnMvaW5kZXhlcy9fEAEaCgoGdXNlcklkEAEaDQoJY3JlYXRlZEF0EAIaDAoIX19uYW1lX18QAg
```

### 3. Solution Manuelle - Créer les Index via la Console Firebase

Si les liens automatiques ne fonctionnent pas :

#### Étapes :
1. Allez sur [Firebase Console](https://console.firebase.google.com)
2. Sélectionnez votre projet `ecole-360---rork-fix`
3. Allez dans **Firestore Database** > **Index**
4. Cliquez sur **Créer un index composite**

#### Index à créer :

**Index 1 : Abonnements actifs par utilisateur**
- **Collection** : `subscriptions`
- **Champs** :
  - `active` : Croissant
  - `userId` : Croissant  
  - `createdAt` : Décroissant

**Index 2 : Historique des abonnements par utilisateur**
- **Collection** : `subscriptions`
- **Champs** :
  - `userId` : Croissant
  - `createdAt` : Décroissant

**Index 3 : Abonnements expirés**
- **Collection** : `subscriptions`
- **Champs** :
  - `active` : Croissant
  - `endDate` : Croissant

**Index 4 : Historique des paiements par utilisateur**
- **Collection** : `payment_transactions`
- **Champs** :
  - `userId` : Croissant
  - `createdAt` : Décroissant

**Index 5 : Classes par école**
- **Collection** : `classes`
- **Champs** :
  - `ecole_id` : Croissant
  - `nom` : Croissant

**Index 6 : Élèves par classe**
- **Collection** : `eleves`
- **Champs** :
  - `classe_id` : Croissant
  - `nom` : Croissant

**Index 7 : Notes par élève**
- **Collection** : `notes`
- **Champs** :
  - `eleve_id` : Croissant
  - `date_creation` : Décroissant

**Index 8 : Messages reçus**
- **Collection** : `messages`
- **Champs** :
  - `destinataire_id` : Croissant
  - `date_envoi` : Décroissant

**Index 9 : Messages envoyés**
- **Collection** : `messages`
- **Champs** :
  - `expediteur_id` : Croissant
  - `date_envoi` : Décroissant

**Index 10 : Localisation par élève**
- **Collection** : `locations`
- **Champs** :
  - `eleve_id` : Croissant
  - `timestamp` : Décroissant

## Vérification

Après avoir mis à jour les règles ET créé les index :

1. **Vérifiez les règles** : Dans Firebase Console > Firestore Database > Règles, assurez-vous que les nouvelles règles sont publiées
2. **Vérifiez les index** : Dans Firebase Console > Firestore Database > Index, vérifiez que tous les index sont créés
3. **Attendez la construction** : Les index peuvent prendre quelques minutes à se construire (statut "Building" → "Enabled")
4. **Testez l'application** : Les erreurs `permission-denied` et `failed-precondition` devraient disparaître

## Ordre d'importance des corrections

1. **CRITIQUE** : Mettre à jour les règles Firestore (corrige les erreurs `permission-denied`)
2. **IMPORTANT** : Créer les index composites (corrige les erreurs `failed-precondition`)
3. **OPTIONNEL** : Utiliser Firebase CLI pour automatiser le déploiement

## Index Automatiques

Les index suivants sont créés automatiquement par Firestore :
- Index sur un seul champ
- Index pour les requêtes d'égalité simples

## Fichier de Configuration

Le fichier `firestore.indexes.json` contient la configuration complète des index pour votre projet. Vous pouvez l'utiliser avec Firebase CLI si nécessaire :

```bash
firebase deploy --only firestore:indexes
```

## Surveillance

Pour éviter ce problème à l'avenir :
1. Testez toujours les nouvelles requêtes en développement
2. Surveillez les logs d'erreur dans Firebase Console
3. Créez les index dès qu'une nouvelle requête composite est ajoutée

## Support

Si vous continuez à avoir des problèmes :
1. Vérifiez que les index sont bien créés dans Firebase Console
2. Attendez que le statut passe de "Building" à "Enabled"
3. Redémarrez l'application si nécessaire