import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/auth-store';
import { useSubscription } from '@/hooks/subscription-store';
import { COLORS } from '@/constants/colors';
import Button from './Button';
import Card from './Card';
import { AlertCircle, CreditCard } from 'lucide-react-native';

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

export default function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { hasActiveSubscription, loading } = useSubscription();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setIsChecking(false);
        return;
      }

      // Seuls les parents ont besoin d'un abonnement
      if (user.role !== 'parent') {
        setHasAccess(true);
        setIsChecking(false);
        return;
      }

      try {
        const hasActive = await hasActiveSubscription();
        setHasAccess(hasActive);
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'abonnement:', error);
        setHasAccess(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAccess();
  }, [user, hasActiveSubscription]);

  if (loading || isChecking) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Vérification de votre abonnement...</Text>
      </View>
    );
  }

  // Si l'utilisateur n'est pas un parent ou a un abonnement actif, afficher le contenu
  if (user?.role !== 'parent' || hasAccess) {
    return <>{children}</>;
  }

  // Afficher l'écran d'abonnement requis
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <CreditCard size={60} color={COLORS.primary} />
        </View>
        
        <Text style={styles.title}>Abonnement requis</Text>
        <Text style={styles.subtitle}>
          Pour accéder à toutes les fonctionnalités de suivi de vos enfants, 
          vous devez souscrire à un abonnement annuel.
        </Text>

        <Card style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <AlertCircle size={24} color={COLORS.warning} />
            <Text style={styles.infoTitle}>Pourquoi un abonnement ?</Text>
          </View>
          
          <View style={styles.infoList}>
            <Text style={styles.infoItem}>• Géolocalisation en temps réel de vos enfants</Text>
            <Text style={styles.infoItem}>• Notifications instantanées de sécurité</Text>
            <Text style={styles.infoItem}>• Suivi complet de la scolarité</Text>
            <Text style={styles.infoItem}>• Communication avec les enseignants</Text>
            <Text style={styles.infoItem}>• Support client dédié</Text>
          </View>
        </Card>

        <Button
          title="Choisir mon abonnement"
          onPress={() => router.push('/(app)/subscription')}
          style={styles.subscribeButton}
          testID="subscribe-button"
        />

        <Text style={styles.footerText}>
          Paiement sécurisé par Wave et Orange Money
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${COLORS.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  infoCard: {
    width: '100%',
    marginBottom: 32,
    backgroundColor: '#FFF9E6',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  infoList: {
    gap: 8,
  },
  infoItem: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  subscribeButton: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});