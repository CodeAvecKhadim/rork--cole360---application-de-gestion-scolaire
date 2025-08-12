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
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/libs/firebase';
import { Subscription, SubscriptionPlan } from '@/types/auth';

// Plans d'abonnement disponibles
const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'standard',
    name: 'Standard',
    pricePerStudent: 15000, // 15,000 FCFA par élève par an
    maxStudents: 10,
    features: [
      'Suivi de la scolarité',
      'Géolocalisation en temps réel',
      'Notifications push',
      'Bulletins de notes',
      'Messagerie avec les enseignants',
      'Zones de sécurité',
      'Support client'
    ],
    duration: 12, // 12 mois
    isActive: true
  },
  {
    id: 'premium',
    name: 'Premium',
    pricePerStudent: 12000, // 12,000 FCFA par élève par an (réduction pour plus d'élèves)
    maxStudents: 50,
    features: [
      'Toutes les fonctionnalités Standard',
      'Rapports détaillés',
      'Historique complet',
      'Export des données',
      'Support prioritaire',
      'Alertes avancées',
      'Statistiques personnalisées'
    ],
    duration: 12,
    isActive: true
  }
];

export const subscriptionService = {
  // Obtenir les plans d'abonnement
  getPlans(): SubscriptionPlan[] {
    return SUBSCRIPTION_PLANS;
  },

  // Calculer le coût total pour un nombre d'élèves
  calculateTotalCost(studentsCount: number): { plan: SubscriptionPlan; totalAmount: number } {
    const plan = studentsCount <= 10 ? SUBSCRIPTION_PLANS[0] : SUBSCRIPTION_PLANS[1];
    const totalAmount = studentsCount * plan.pricePerStudent;
    return { plan, totalAmount };
  },

  // Créer un nouvel abonnement
  async createSubscription(userId: string, schoolId: string, studentsCount: number): Promise<Subscription> {
    try {
      const { plan, totalAmount } = this.calculateTotalCost(studentsCount);
      const now = Date.now();
      const endDate = now + (plan.duration * 30 * 24 * 60 * 60 * 1000); // 12 mois

      const subscriptionData = {
        userId,
        schoolId,
        plan: plan.id as 'standard' | 'premium',
        startDate: now,
        endDate,
        active: false, // Sera activé après le paiement
        studentsCount,
        totalAmount,
        paymentStatus: 'pending' as const,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'subscriptions'), subscriptionData);
      
      return {
        id: docRef.id,
        ...subscriptionData,
        createdAt: now,
        updatedAt: now
      };
    } catch (error) {
      console.error('Erreur lors de la création de l\'abonnement:', error);
      throw error;
    }
  },

  // Obtenir l'abonnement actuel d'un utilisateur
  async getCurrentSubscription(userId: string): Promise<Subscription | null> {
    try {
      const q = query(
        collection(db, 'subscriptions'),
        where('userId', '==', userId),
        where('active', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toMillis() || Date.now(),
        updatedAt: data.updatedAt?.toMillis() || Date.now()
      } as Subscription;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'abonnement:', error);
      throw error;
    }
  },

  // Vérifier si un utilisateur a un abonnement actif
  async hasActiveSubscription(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getCurrentSubscription(userId);
      if (!subscription) return false;
      
      const now = Date.now();
      return subscription.active && 
             subscription.paymentStatus === 'paid' && 
             subscription.endDate > now;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'abonnement:', error);
      return false;
    }
  },

  // Activer un abonnement après paiement
  async activateSubscription(subscriptionId: string, transactionId: string): Promise<void> {
    try {
      const subscriptionRef = doc(db, 'subscriptions', subscriptionId);
      await updateDoc(subscriptionRef, {
        active: true,
        paymentStatus: 'paid',
        transactionId,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Erreur lors de l\'activation de l\'abonnement:', error);
      throw error;
    }
  },

  // Désactiver un abonnement
  async deactivateSubscription(subscriptionId: string): Promise<void> {
    try {
      const subscriptionRef = doc(db, 'subscriptions', subscriptionId);
      await updateDoc(subscriptionRef, {
        active: false,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Erreur lors de la désactivation de l\'abonnement:', error);
      throw error;
    }
  },

  // Renouveler un abonnement
  async renewSubscription(userId: string, schoolId: string, studentsCount: number): Promise<Subscription> {
    try {
      // Désactiver l'ancien abonnement
      const currentSubscription = await this.getCurrentSubscription(userId);
      if (currentSubscription) {
        await this.deactivateSubscription(currentSubscription.id);
      }
      
      // Créer un nouvel abonnement
      return await this.createSubscription(userId, schoolId, studentsCount);
    } catch (error) {
      console.error('Erreur lors du renouvellement de l\'abonnement:', error);
      throw error;
    }
  },

  // Obtenir l'historique des abonnements d'un utilisateur
  async getSubscriptionHistory(userId: string): Promise<Subscription[]> {
    try {
      const q = query(
        collection(db, 'subscriptions'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toMillis() || Date.now(),
          updatedAt: data.updatedAt?.toMillis() || Date.now()
        } as Subscription;
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      throw error;
    }
  },

  // Vérifier les abonnements expirés
  async checkExpiredSubscriptions(): Promise<void> {
    try {
      const now = Date.now();
      const q = query(
        collection(db, 'subscriptions'),
        where('active', '==', true),
        where('endDate', '<', now)
      );
      
      const querySnapshot = await getDocs(q);
      
      const batch = [];
      for (const docSnapshot of querySnapshot.docs) {
        batch.push(
          updateDoc(doc(db, 'subscriptions', docSnapshot.id), {
            active: false,
            paymentStatus: 'expired',
            updatedAt: serverTimestamp()
          })
        );
      }
      
      await Promise.all(batch);
      console.log(`${batch.length} abonnements expirés désactivés`);
    } catch (error) {
      console.error('Erreur lors de la vérification des abonnements expirés:', error);
      throw error;
    }
  }
};