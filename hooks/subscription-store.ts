import { useState, useEffect, useCallback, useMemo } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { subscriptionService, paymentService } from '@/services';
import { Subscription, SubscriptionPlan, PaymentTransaction } from '@/types/auth';
import { useAuth } from './auth-store';

export const [SubscriptionProvider, useSubscription] = createContextHook(() => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les plans d'abonnement
  useEffect(() => {
    const loadPlans = () => {
      try {
        const availablePlans = subscriptionService.getPlans();
        setPlans(availablePlans);
      } catch (err) {
        console.error('Erreur lors du chargement des plans:', err);
        setError('Impossible de charger les plans d\'abonnement');
      }
    };

    loadPlans();
  }, []);

  // Charger l'abonnement actuel de l'utilisateur
  useEffect(() => {
    const loadCurrentSubscription = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const currentSub = await subscriptionService.getCurrentSubscription(user.id);
        setSubscription(currentSub);
      } catch (err) {
        console.error('Erreur lors du chargement de l\'abonnement:', err);
        setError('Impossible de charger votre abonnement');
      } finally {
        setLoading(false);
      }
    };

    loadCurrentSubscription();
  }, [user?.id]);

  // Charger l'historique des paiements
  useEffect(() => {
    const loadPaymentHistory = async () => {
      if (!user?.id) return;

      try {
        const history = await paymentService.getPaymentHistory(user.id);
        setPaymentHistory(history);
      } catch (err) {
        console.error('Erreur lors du chargement de l\'historique:', err);
      }
    };

    loadPaymentHistory();
  }, [user?.id]);

  // Calculer le coût pour un nombre d'élèves
  const calculateCost = useCallback((studentsCount: number) => {
    return subscriptionService.calculateTotalCost(studentsCount);
  }, []);

  // Créer un nouvel abonnement
  const createSubscription = useCallback(async (schoolId: string, studentsCount: number): Promise<Subscription> => {
    if (!user?.id) throw new Error('Utilisateur non connecté');

    try {
      setLoading(true);
      setError(null);
      
      const newSubscription = await subscriptionService.createSubscription(
        user.id,
        schoolId,
        studentsCount
      );
      
      setSubscription(newSubscription);
      return newSubscription;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création de l\'abonnement';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Initier un paiement Wave
  const payWithWave = useCallback(async (subscriptionId: string, phoneNumber: string): Promise<PaymentTransaction> => {
    if (!user?.id || !subscription) throw new Error('Données manquantes');

    try {
      setLoading(true);
      setError(null);

      const transaction = await paymentService.initiateWavePayment(
        subscriptionId,
        user.id,
        subscription.totalAmount,
        phoneNumber
      );

      // Recharger l'historique des paiements
      const updatedHistory = await paymentService.getPaymentHistory(user.id);
      setPaymentHistory(updatedHistory);

      return transaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du paiement Wave';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.id, subscription]);

  // Initier un paiement Orange Money
  const payWithOrangeMoney = useCallback(async (subscriptionId: string, phoneNumber: string): Promise<PaymentTransaction> => {
    if (!user?.id || !subscription) throw new Error('Données manquantes');

    try {
      setLoading(true);
      setError(null);

      const transaction = await paymentService.initiateOrangeMoneyPayment(
        subscriptionId,
        user.id,
        subscription.totalAmount,
        phoneNumber
      );

      // Recharger l'historique des paiements
      const updatedHistory = await paymentService.getPaymentHistory(user.id);
      setPaymentHistory(updatedHistory);

      return transaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du paiement Orange Money';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.id, subscription]);

  // Vérifier le statut d'un paiement
  const checkPaymentStatus = useCallback(async (transactionId: string) => {
    try {
      const status = await paymentService.checkPaymentStatus(transactionId);
      
      if (status === 'success') {
        // Confirmer le paiement et activer l'abonnement
        await paymentService.confirmPayment(transactionId);
        
        if (subscription) {
          await subscriptionService.activateSubscription(subscription.id, transactionId);
          // Recharger l'abonnement
          const updatedSub = await subscriptionService.getCurrentSubscription(user!.id);
          setSubscription(updatedSub);
        }
      } else if (status === 'failed') {
        await paymentService.failPayment(transactionId, 'Paiement échoué');
      }

      return status;
    } catch (err) {
      console.error('Erreur lors de la vérification du paiement:', err);
      return 'failed';
    }
  }, [subscription, user]);

  // Vérifier si l'utilisateur a un abonnement actif
  const hasActiveSubscription = useCallback(async (): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      return await subscriptionService.hasActiveSubscription(user.id);
    } catch (err) {
      console.error('Erreur lors de la vérification de l\'abonnement:', err);
      return false;
    }
  }, [user?.id]);

  // Renouveler un abonnement
  const renewSubscription = useCallback(async (schoolId: string, studentsCount: number): Promise<Subscription> => {
    if (!user?.id) throw new Error('Utilisateur non connecté');

    try {
      setLoading(true);
      setError(null);
      
      const renewedSubscription = await subscriptionService.renewSubscription(
        user.id,
        schoolId,
        studentsCount
      );
      
      setSubscription(renewedSubscription);
      return renewedSubscription;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du renouvellement';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Formater un montant
  const formatAmount = useCallback((amount: number): string => {
    return paymentService.formatAmount(amount);
  }, []);

  // Valider un numéro de téléphone
  const validatePhoneNumber = useCallback((phoneNumber: string, method: 'wave' | 'orange_money'): boolean => {
    if (method === 'wave') {
      return paymentService.validateWavePhoneNumber(phoneNumber);
    } else {
      return paymentService.validateOrangeMoneyPhoneNumber(phoneNumber);
    }
  }, []);

  return useMemo(() => ({
    // État
    subscription,
    plans,
    paymentHistory,
    loading,
    error,
    
    // Actions
    calculateCost,
    createSubscription,
    payWithWave,
    payWithOrangeMoney,
    checkPaymentStatus,
    hasActiveSubscription,
    renewSubscription,
    formatAmount,
    validatePhoneNumber,
    
    // Utilitaires
    clearError: () => setError(null)
  }), [
    subscription,
    plans,
    paymentHistory,
    loading,
    error,
    calculateCost,
    createSubscription,
    payWithWave,
    payWithOrangeMoney,
    checkPaymentStatus,
    hasActiveSubscription,
    renewSubscription,
    formatAmount,
    validatePhoneNumber
  ]);
});