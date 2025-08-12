# Configuration des Index Firestore - École 360

## Problème
Les erreurs que vous rencontrez sont dues à des index composites manquants dans Firestore. Quand vous utilisez plusieurs champs dans une requête (avec `where` et `orderBy`), Firestore nécessite des index composites.

## Solution Rapide - Créer les Index via les Liens d'Erreur

### 1. Index pour les Abonnements (subscriptions)
Cliquez sur ce lien pour créer l'index automatiquement :
```
https://console.firebase.google.com/v1/r/project/ecole-360---rork-fix/firestore/indexes?create_composite=Clpwcm9qZWN0cy9lY29sZS0zNjAtLS1yb3JrLWZpeC9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvc3Vic2NyaXB0aW9ucy9pbmRleGVzL18QARoKCgZhY3RpdmUQARoKCgZ1c2VySWQQARoNCgljcmVhdGVkQXQQAhoMCghfX25hbWVfXxAC
```

### 2. Index pour les Transactions de Paiement (payment_transactions)
Cliquez sur ce lien pour créer l'index automatiquement :
```
https://console.firebase.google.com/v1/r/project/ecole-360---rork-fix/firestore/indexes?create_composite=CmFwcm9qZWN0cy9lY29sZS0zNjAtLS1yb3JrLWZpeC9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvcGF5bWVudF90cmFuc2FjdGlvbnMvaW5kZXhlcy9fEAEaCgoGdXNlcklkEAEaDQoJY3JlYXRlZEF0EAIaDAoIX19uYW1lX18QAg
```

## Solution Manuelle - Créer les Index via la Console Firebase

### Étapes :
1. Allez sur [Firebase Console](https://console.firebase.google.com)
2. Sélectionnez votre projet `ecole-360---rork-fix`
3. Allez dans **Firestore Database** > **Index**
4. Cliquez sur **Créer un index**

### Index à créer :

#### Index 1 : Abonnements actifs par utilisateur
- **Collection** : `subscriptions`
- **Champs** :
  - `active` : Croissant
  - `userId` : Croissant  
  - `createdAt` : Décroissant

#### Index 2 : Historique des abonnements par utilisateur
- **Collection** : `subscriptions`
- **Champs** :
  - `userId` : Croissant
  - `createdAt` : Décroissant

#### Index 3 : Abonnements expirés
- **Collection** : `subscriptions`
- **Champs** :
  - `active` : Croissant
  - `endDate` : Croissant

#### Index 4 : Historique des paiements par utilisateur
- **Collection** : `payment_transactions`
- **Champs** :
  - `userId` : Croissant
  - `createdAt` : Décroissant

## Vérification

Après avoir créé les index :
1. Attendez quelques minutes (les index peuvent prendre du temps à se construire)
2. Testez l'application
3. Les erreurs `failed-precondition` devraient disparaître

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