# Plan de Testing École-360 - 7 Jours

## Vue d'ensemble de l'application
École-360 est une application éducative avec système d'abonnement et géolocalisation comprenant :
- **Rôles** : Admin, Directeur d'école, Enseignant, Parent
- **Fonctionnalités principales** : Gestion d'écoles, classes, élèves, notes, messages, localisation, abonnements
- **Paiement** : Wave et Orange Money
- **Sécurité** : Zones de sécurité, alertes de localisation

---

## JOUR 1 - Tests d'Authentification et Rôles

### 🎯 Objectif
Valider le système d'authentification et la gestion des rôles utilisateurs.

### Tests à effectuer

#### 1.1 Inscription (signup.tsx)
- **Test** : Créer un compte parent avec email valide
- **Résultat attendu** : Compte créé, redirection vers login
- **Test** : Créer un compte avec email invalide
- **Résultat attendu** : Message d'erreur affiché
- **Test** : Créer un compte avec mot de passe faible
- **Résultat attendu** : Validation échoue, message d'erreur

#### 1.2 Connexion (login.tsx)
- **Test** : Se connecter avec identifiants valides
- **Résultat attendu** : Connexion réussie, redirection vers dashboard
- **Test** : Se connecter avec identifiants invalides
- **Résultat attendu** : Message d'erreur "Identifiants incorrects"
- **Test** : Tester "Mot de passe oublié"
- **Résultat attendu** : Redirection vers forgot-password.tsx

#### 1.3 Gestion des rôles
- **Test** : Connecter un parent
- **Résultat attendu** : Onglets visibles : Dashboard, Élèves, Localisation, Messages, Profil
- **Test** : Connecter un enseignant
- **Résultat attendu** : Onglets visibles : Dashboard, Classes, Messages, Profil
- **Test** : Connecter un directeur d'école
- **Résultat attendu** : Onglets visibles : Dashboard, Écoles, Classes, Messages, Profil
- **Test** : Connecter un admin
- **Résultat attendu** : Tous les onglets visibles

### Critères de réussite Jour 1
- ✅ Tous les rôles peuvent se connecter
- ✅ Navigation adaptée selon le rôle
- ✅ Sécurité des routes respectée
- ✅ Messages d'erreur appropriés

---

## JOUR 2 - Tests du Système d'Abonnement

### 🎯 Objectif
Valider le système d'abonnement obligatoire pour les parents.

### Tests à effectuer

#### 2.1 Accès sans abonnement
- **Test** : Parent connecté sans abonnement actif
- **Résultat attendu** : Redirection automatique vers subscription.tsx
- **Test** : Tenter d'accéder aux fonctionnalités sans abonnement
- **Résultat attendu** : Bloqué par SubscriptionGuard

#### 2.2 Page d'abonnement (subscription.tsx)
- **Test** : Sélectionner 1 élève
- **Résultat attendu** : Plan Standard sélectionné, prix calculé
- **Test** : Sélectionner 15 élèves
- **Résultat attendu** : Plan Premium sélectionné automatiquement
- **Test** : Modifier le nombre d'élèves (1-50)
- **Résultat attendu** : Prix mis à jour en temps réel
- **Test** : Cliquer "Procéder au paiement"
- **Résultat attendu** : Abonnement créé, redirection vers payment.tsx

#### 2.3 Calcul des prix
- **Test** : 1 élève
- **Résultat attendu** : Prix Standard affiché correctement
- **Test** : 5 élèves
- **Résultat attendu** : Prix Standard × 5
- **Test** : 20 élèves
- **Résultat attendu** : Prix Premium × 20 avec réduction

### Critères de réussite Jour 2
- ✅ Système d'abonnement bloque l'accès non payé
- ✅ Calculs de prix corrects
- ✅ Interface intuitive et responsive
- ✅ Création d'abonnement fonctionnelle

---

## JOUR 3 - Tests de Paiement Mobile Money

### 🎯 Objectif
Valider l'intégration des paiements Wave et Orange Money.

### Tests à effectuer

#### 3.1 Page de paiement (payment.tsx)
- **Test** : Affichage des informations d'abonnement
- **Résultat attendu** : Détails corrects (nombre d'élèves, montant, durée)
- **Test** : Sélection méthode Wave
- **Résultat attendu** : Interface Wave affichée
- **Test** : Sélection méthode Orange Money
- **Résultat attendu** : Interface Orange Money affichée

#### 3.2 Processus de paiement Wave
- **Test** : Initier paiement Wave avec numéro valide
- **Résultat attendu** : Demande de confirmation envoyée au téléphone
- **Test** : Confirmer paiement sur téléphone
- **Résultat attendu** : Paiement validé, abonnement activé
- **Test** : Annuler paiement
- **Résultat attendu** : Retour à la sélection de méthode

#### 3.3 Processus de paiement Orange Money
- **Test** : Initier paiement Orange Money
- **Résultat attendu** : Interface Orange Money fonctionnelle
- **Test** : Paiement réussi
- **Résultat attendu** : Abonnement activé, accès aux fonctionnalités

#### 3.4 Gestion des erreurs de paiement
- **Test** : Numéro de téléphone invalide
- **Résultat attendu** : Message d'erreur clair
- **Test** : Solde insuffisant
- **Résultat attendu** : Message d'erreur approprié
- **Test** : Échec de connexion réseau
- **Résultat attendu** : Possibilité de réessayer

### Critères de réussite Jour 3
- ✅ Intégration Wave fonctionnelle
- ✅ Intégration Orange Money fonctionnelle
- ✅ Gestion d'erreurs robuste
- ✅ Activation automatique après paiement

---

## JOUR 4 - Tests de Géolocalisation

### 🎯 Objectif
Valider le système de géolocalisation des élèves.

### Tests à effectuer

#### 4.1 Permissions de localisation
- **Test** : Première ouverture de l'onglet Localisation
- **Résultat attendu** : Demande de permission de localisation
- **Test** : Accepter la permission
- **Résultat attendu** : Accès aux fonctionnalités de localisation
- **Test** : Refuser la permission
- **Résultat attendu** : Message explicatif, bouton pour réessayer

#### 4.2 Activation de la localisation (location.tsx)
- **Test** : Activer la localisation pour un élève
- **Résultat attendu** : Localisation activée, position affichée
- **Test** : Désactiver la localisation
- **Résultat attendu** : Localisation arrêtée, élève dans section "désactivée"
- **Test** : Rafraîchir les positions
- **Résultat attendu** : Nouvelles positions récupérées

#### 4.3 Zones de sécurité
- **Test** : Élève dans zone de sécurité (école)
- **Résultat attendu** : Indicateur vert "À l'école"
- **Test** : Élève hors zone de sécurité
- **Résultat attendu** : Indicateur orange/rouge, alerte générée
- **Test** : Définir nouvelles zones de sécurité
- **Résultat attendu** : Zones sauvegardées, alertes mises à jour

#### 4.4 Alertes de localisation
- **Test** : Élève sort de la zone de sécurité
- **Résultat attendu** : Alerte générée, notification parent
- **Test** : Acquitter une alerte
- **Résultat attendu** : Alerte marquée comme lue
- **Test** : Historique des alertes
- **Résultat attendu** : Liste chronologique des alertes

### Critères de réussite Jour 4
- ✅ Permissions gérées correctement
- ✅ Localisation en temps réel fonctionnelle
- ✅ Zones de sécurité opérationnelles
- ✅ Système d'alertes réactif

---

## JOUR 5 - Tests des Fonctionnalités Éducatives

### 🎯 Objectif
Valider la gestion des écoles, classes, élèves et notes.

### Tests à effectuer

#### 5.1 Gestion des écoles (schools.tsx)
- **Test** : Admin - Créer une nouvelle école
- **Résultat attendu** : École créée, visible dans la liste
- **Test** : Modifier informations d'une école
- **Résultat attendu** : Modifications sauvegardées
- **Test** : Supprimer une école
- **Résultat attendu** : Confirmation demandée, école supprimée

#### 5.2 Gestion des classes (classes.tsx)
- **Test** : Enseignant - Créer une classe
- **Résultat attendu** : Classe créée, associée à l'enseignant
- **Test** : Ajouter des élèves à une classe
- **Résultat attendu** : Élèves ajoutés, visibles dans la classe
- **Test** : Consulter les détails d'une classe
- **Résultat attendu** : Informations complètes affichées

#### 5.3 Gestion des élèves (students.tsx)
- **Test** : Parent - Voir ses élèves
- **Résultat attendu** : Liste des élèves du parent
- **Test** : Consulter le profil d'un élève
- **Résultat attendu** : Informations détaillées, notes, présences
- **Test** : Bulletin d'un élève
- **Résultat attendu** : Bulletin complet avec moyennes

#### 5.4 Gestion des notes (grades/[classId].tsx)
- **Test** : Enseignant - Ajouter une note
- **Résultat attendu** : Note enregistrée, visible pour le parent
- **Test** : Modifier une note existante
- **Résultat attendu** : Modification sauvegardée
- **Test** : Calcul des moyennes
- **Résultat attendu** : Moyennes calculées automatiquement

### Critères de réussite Jour 5
- ✅ CRUD complet pour écoles/classes/élèves
- ✅ Système de notes fonctionnel
- ✅ Permissions respectées par rôle
- ✅ Calculs automatiques corrects

---

## JOUR 6 - Tests de Communication

### 🎯 Objectif
Valider le système de messagerie et notifications.

### Tests à effectuer

#### 6.1 Messagerie (messages.tsx)
- **Test** : Envoyer un message parent → enseignant
- **Résultat attendu** : Message envoyé, reçu par l'enseignant
- **Test** : Répondre à un message
- **Résultat attendu** : Réponse dans la conversation
- **Test** : Conversation de groupe (classe)
- **Résultat attendu** : Message visible par tous les participants

#### 6.2 Notifications (notifications.tsx)
- **Test** : Nouvelle note ajoutée
- **Résultat attendu** : Notification envoyée au parent
- **Test** : Alerte de localisation
- **Résultat attendu** : Notification immédiate
- **Test** : Message reçu
- **Résultat attendu** : Notification de nouveau message

#### 6.3 Conversations individuelles
- **Test** : Ouvrir conversation avec un contact
- **Résultat attendu** : Historique des messages affiché
- **Test** : Envoyer message avec pièce jointe
- **Résultat attendu** : Fichier joint et envoyé
- **Test** : Marquer messages comme lus
- **Résultat attendu** : Statut de lecture mis à jour

### Critères de réussite Jour 6
- ✅ Messagerie bidirectionnelle fonctionnelle
- ✅ Notifications en temps réel
- ✅ Historique des conversations
- ✅ Statuts de lecture corrects

---

## JOUR 7 - Tests d'Intégration et Performance

### 🎯 Objectif
Tests complets de l'application et optimisation.

### Tests à effectuer

#### 7.1 Scénarios utilisateur complets
- **Test** : Parcours parent complet
  1. Inscription → Connexion → Abonnement → Paiement → Utilisation
- **Résultat attendu** : Parcours fluide sans blocage
- **Test** : Parcours enseignant complet
  1. Connexion → Gestion classe → Ajout notes → Messages parents
- **Résultat attendu** : Toutes les fonctionnalités accessibles

#### 7.2 Tests de performance
- **Test** : Chargement avec 100+ élèves
- **Résultat attendu** : Interface réactive, pas de lag
- **Test** : Synchronisation données en arrière-plan
- **Résultat attendu** : Données à jour sans intervention utilisateur
- **Test** : Utilisation hors ligne
- **Résultat attendu** : Fonctionnalités de base disponibles

#### 7.3 Tests de sécurité
- **Test** : Tentative d'accès non autorisé
- **Résultat attendu** : Accès bloqué, redirection appropriée
- **Test** : Expiration de session
- **Résultat attendu** : Déconnexion automatique, reconnexion requise
- **Test** : Données sensibles (localisation)
- **Résultat attendu** : Chiffrement et protection des données

#### 7.4 Tests multi-plateforme
- **Test** : Application sur iOS
- **Résultat attendu** : Interface native, toutes fonctionnalités opérationnelles
- **Test** : Application sur Android
- **Résultat attendu** : Interface native, toutes fonctionnalités opérationnelles
- **Test** : Version web (React Native Web)
- **Résultat attendu** : Fonctionnalités adaptées au web

#### 7.5 Tests de régression
- **Test** : Reprendre tous les tests critiques des jours précédents
- **Résultat attendu** : Aucune régression détectée
- **Test** : Vérifier les corrections de bugs
- **Résultat attendu** : Bugs précédents résolus

### Critères de réussite Jour 7
- ✅ Parcours utilisateur fluides
- ✅ Performance optimale
- ✅ Sécurité renforcée
- ✅ Compatibilité multi-plateforme
- ✅ Aucune régression

---

## Métriques de Réussite Globales

### Fonctionnalités Critiques (100% requis)
- ✅ Authentification et rôles
- ✅ Système d'abonnement
- ✅ Paiement mobile money
- ✅ Géolocalisation et sécurité
- ✅ Gestion éducative de base

### Fonctionnalités Importantes (90% requis)
- ✅ Messagerie complète
- ✅ Notifications
- ✅ Performance
- ✅ Interface utilisateur

### Fonctionnalités Secondaires (70% requis)
- ✅ Fonctionnalités avancées
- ✅ Optimisations
- ✅ Personnalisation

---

## Plan de Correction des Bugs

### Priorité 1 - Critique (Correction immédiate)
- Bugs bloquant l'authentification
- Erreurs de paiement
- Problèmes de sécurité

### Priorité 2 - Importante (Correction sous 24h)
- Bugs de géolocalisation
- Erreurs de calcul
- Problèmes de performance

### Priorité 3 - Normale (Correction sous 48h)
- Bugs d'interface
- Problèmes mineurs de navigation
- Optimisations

---

## Outils de Testing Recommandés

### Tests Manuels
- Appareils iOS et Android physiques
- Émulateurs pour tests rapides
- Navigateurs web pour version web

### Tests Automatisés (à implémenter)
- Jest pour tests unitaires
- Detox pour tests E2E
- Firebase Test Lab pour tests sur cloud

### Monitoring
- Firebase Analytics pour usage
- Crashlytics pour erreurs
- Performance Monitoring

---

## Livrables Attendus

### Chaque jour
- ✅ Rapport de tests avec résultats
- ✅ Liste des bugs identifiés
- ✅ Captures d'écran des problèmes
- ✅ Recommandations d'amélioration

### Fin de semaine
- ✅ Rapport complet de testing
- ✅ Matrice de couverture des tests
- ✅ Plan de correction des bugs
- ✅ Recommandations pour la production

Ce plan garantit une validation complète de toutes les fonctionnalités de l'application École-360 avant sa mise en production.