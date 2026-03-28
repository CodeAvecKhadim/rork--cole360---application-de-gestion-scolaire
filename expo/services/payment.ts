import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/libs/firebase';
import { PaymentTransaction } from '@/types/auth';
import { CONFIG } from '@/constants/config';

export const paymentService = {
  // Initier un paiement Wave
  async initiateWavePayment(
    subscriptionId: string,
    userId: string,
    amount: number,
    phoneNumber: string
  ): Promise<PaymentTransaction> {
    try {
      const transactionData = {
        subscriptionId,
        userId,
        amount,
        currency: 'XOF', // Franc CFA
        paymentMethod: 'wave' as const,
        phoneNumber,
        status: 'pending' as const,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'payment_transactions'), transactionData);
      
      // Simuler l'appel à l'API Wave
      const waveResponse = await this.callWaveAPI({
        amount,
        phoneNumber,
        transactionReference: docRef.id
      });

      // Mettre à jour avec la référence externe
      await updateDoc(doc(db, 'payment_transactions', docRef.id), {
        externalTransactionId: waveResponse.transactionId,
        updatedAt: serverTimestamp()
      });

      return {
        id: docRef.id,
        ...transactionData,
        externalTransactionId: waveResponse.transactionId,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
    } catch (error) {
      console.error('Erreur lors de l\'initiation du paiement Wave:', error);
      throw error;
    }
  },

  // Initier un paiement Orange Money
  async initiateOrangeMoneyPayment(
    subscriptionId: string,
    userId: string,
    amount: number,
    phoneNumber: string
  ): Promise<PaymentTransaction> {
    try {
      const transactionData = {
        subscriptionId,
        userId,
        amount,
        currency: 'XOF',
        paymentMethod: 'orange_money' as const,
        phoneNumber,
        status: 'pending' as const,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'payment_transactions'), transactionData);
      
      // Simuler l'appel à l'API Orange Money
      const orangeResponse = await this.callOrangeMoneyAPI({
        amount,
        phoneNumber,
        transactionReference: docRef.id
      });

      // Mettre à jour avec la référence externe
      await updateDoc(doc(db, 'payment_transactions', docRef.id), {
        externalTransactionId: orangeResponse.transactionId,
        updatedAt: serverTimestamp()
      });

      return {
        id: docRef.id,
        ...transactionData,
        externalTransactionId: orangeResponse.transactionId,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
    } catch (error) {
      console.error('Erreur lors de l\'initiation du paiement Orange Money:', error);
      throw error;
    }
  },

  // Vérifier le statut d'un paiement Wave
  async checkPaymentStatus(transactionId: string): Promise<'pending' | 'success' | 'failed' | 'cancelled'> {
    try {
      const waveApiUrl = `${CONFIG.WAVE.IS_SANDBOX ? CONFIG.WAVE.SANDBOX_URL : CONFIG.WAVE.API_URL}/checkout/sessions/${transactionId}`;
      
      const response = await fetch(waveApiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${CONFIG.WAVE.API_KEY}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Wave API Error: ${response.status}`);
      }

      const data = await response.json();
      
      // Mapper les statuts Wave vers nos statuts internes
      switch (data.payment_status) {
        case 'successful':
          return 'success';
        case 'failed':
        case 'expired':
          return 'failed';
        case 'cancelled':
          return 'cancelled';
        default:
          return 'pending';
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error);
      return 'failed';
    }
  },

  // Confirmer un paiement réussi
  async confirmPayment(transactionId: string): Promise<void> {
    try {
      const transactionRef = doc(db, 'payment_transactions', transactionId);
      await updateDoc(transactionRef, {
        status: 'success',
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Erreur lors de la confirmation du paiement:', error);
      throw error;
    }
  },

  // Marquer un paiement comme échoué
  async failPayment(transactionId: string, reason: string): Promise<void> {
    try {
      const transactionRef = doc(db, 'payment_transactions', transactionId);
      await updateDoc(transactionRef, {
        status: 'failed',
        failureReason: reason,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Erreur lors de l\'échec du paiement:', error);
      throw error;
    }
  },

  // Obtenir l'historique des paiements d'un utilisateur
  async getPaymentHistory(userId: string): Promise<PaymentTransaction[]> {
    try {
      const q = query(
        collection(db, 'payment_transactions'),
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
        } as PaymentTransaction;
      });
    } catch (error: any) {
      console.error('Erreur lors de la récupération de l\'historique des paiements:', error);
      
      if (error?.code === 'permission-denied') {
        throw new Error('Accès refusé. Veuillez vérifier vos permissions ou vous reconnecter.');
      }
      
      if (error?.code === 'failed-precondition') {
        throw new Error('Configuration de base de données incomplète. Veuillez contacter le support.');
      }
      
      throw new Error('Erreur lors du chargement de l\'historique des paiements. Veuillez réessayer.');
    }
  },

  // Appel à l'API Wave Business
  async callWaveAPI(params: {
    amount: number;
    phoneNumber: string;
    transactionReference: string;
  }): Promise<{ transactionId: string; status: string; checkoutUrl?: string }> {
    try {
      const waveApiUrl = `${CONFIG.WAVE.IS_SANDBOX ? CONFIG.WAVE.SANDBOX_URL : CONFIG.WAVE.API_URL}/checkout/sessions`;
      
      const payload = {
        amount: params.amount,
        currency: 'XOF',
        error_url: CONFIG.APP.ERROR_URL,
        success_url: CONFIG.APP.SUCCESS_URL,
        client_reference: params.transactionReference,
        payment_method: 'wave_senegal',
        mobile: params.phoneNumber.replace('+', ''),
        when_completed: 'redirect'
      };

      const response = await fetch(waveApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CONFIG.WAVE.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Wave API Error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        transactionId: data.id,
        status: 'pending',
        checkoutUrl: data.wave_launch_url
      };
    } catch (error) {
      console.error('Erreur API Wave:', error);
      throw error;
    }
  },

  // Simuler l'appel à l'API Orange Money (à remplacer par la vraie API)
  async callOrangeMoneyAPI(params: {
    amount: number;
    phoneNumber: string;
    transactionReference: string;
  }): Promise<{ transactionId: string; status: string }> {
    // Simulation d'un délai d'API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    
    return {
      transactionId: `OM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending'
    };
  },

  // Formater le montant en FCFA
  formatAmount(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  },

  // Valider un numéro de téléphone pour Wave
  validateWavePhoneNumber(phoneNumber: string): boolean {
    // Wave accepte les numéros sénégalais commençant par +221
    const waveRegex = /^\+221[0-9]{9}$/;
    return waveRegex.test(phoneNumber);
  },

  // Valider un numéro de téléphone pour Orange Money
  validateOrangeMoneyPhoneNumber(phoneNumber: string): boolean {
    // Orange Money accepte plusieurs pays d'Afrique de l'Ouest
    const orangeRegex = /^\+22[1-8][0-9]{8}$/;
    return orangeRegex.test(phoneNumber);
  }
};