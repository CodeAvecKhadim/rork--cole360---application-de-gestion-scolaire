import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/colors';
import { useSubscription } from '@/hooks/subscription-store';
import { useAuth } from '@/hooks/auth-store';
import Button from '@/components/Button';
import Card from '@/components/Card';
import {
  CreditCard,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Smartphone,
  Wallet
} from 'lucide-react-native';

export default function SubscriptionScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    subscription,
    plans,
    loading,
    error,
    calculateCost,
    createSubscription,
    hasActiveSubscription,
    formatAmount
  } = useSubscription();

  const [studentsCount, setStudentsCount] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'premium'>('standard');
  const [isCreatingSubscription, setIsCreatingSubscription] = useState(false);

  // Vérifier l'abonnement actuel
  useEffect(() => {
    const checkSubscription = async () => {
      if (user?.role === 'parent') {
        const hasActive = await hasActiveSubscription();
        if (hasActive) {
          // Rediriger vers le dashboard si l'abonnement est actif
          router.replace('/(app)/(tabs)/dashboard');
        }
      }
    };

    checkSubscription();
  }, [user, hasActiveSubscription, router]);

  const handleStudentsCountChange = (count: number) => {
    if (count >= 1 && count <= 50) {
      setStudentsCount(count);
      // Changer automatiquement le plan selon le nombre d'élèves
      setSelectedPlan(count <= 10 ? 'standard' : 'premium');
    }
  };

  const handleCreateSubscription = async () => {
    if (!user?.schoolId) {
      Alert.alert('Erreur', 'Vous devez être associé à une école pour créer un abonnement.');
      return;
    }

    try {
      setIsCreatingSubscription(true);
      
      const newSubscription = await createSubscription(user.schoolId, studentsCount);
      
      Alert.alert(
        'Abonnement créé',
        'Votre abonnement a été créé. Procédez maintenant au paiement pour l\'activer.',
        [
          {
            text: 'Payer maintenant',
            onPress: () => router.push('/(app)/payment' as any)
          }
        ]
      );
    } catch (err) {
      console.error('Erreur création abonnement:', err);
      Alert.alert(
        'Erreur',
        'Impossible de créer l\'abonnement. Veuillez réessayer.'
      );
    } finally {
      setIsCreatingSubscription(false);
    }
  };

  const costInfo = calculateCost(studentsCount);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF6B35', '#F7931E', '#FFD23F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerContainer}>
            <View style={styles.iconWrapper}>
              <CreditCard size={60} color="#FFFFFF" />
            </View>
            <Text style={styles.title}>Abonnement Annuel</Text>
            <Text style={styles.subtitle}>
              Choisissez votre plan pour suivre vos enfants
            </Text>
          </View>

          {error && (
            <Card style={styles.errorCard}>
              <View style={styles.errorContent}>
                <AlertCircle size={24} color={COLORS.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            </Card>
          )}

          {/* Sélection du nombre d'élèves */}
          <Card style={styles.studentsCard}>
            <Text style={styles.cardTitle}>Nombre d'élèves à suivre</Text>
            <Text style={styles.cardSubtitle}>
              Un abonnement = un élève. Plusieurs élèves dans la même école peuvent être regroupés.
            </Text>
            
            <View style={styles.studentsSelector}>
              <TouchableOpacity
                style={styles.countButton}
                onPress={() => handleStudentsCountChange(studentsCount - 1)}
                disabled={studentsCount <= 1}
              >
                <Text style={[styles.countButtonText, studentsCount <= 1 && styles.disabledText]}>-</Text>
              </TouchableOpacity>
              
              <View style={styles.countDisplay}>
                <Users size={24} color={COLORS.primary} />
                <Text style={styles.countText}>{studentsCount}</Text>
                <Text style={styles.countLabel}>élève{studentsCount > 1 ? 's' : ''}</Text>
              </View>
              
              <TouchableOpacity
                style={styles.countButton}
                onPress={() => handleStudentsCountChange(studentsCount + 1)}
                disabled={studentsCount >= 50}
              >
                <Text style={[styles.countButtonText, studentsCount >= 50 && styles.disabledText]}>+</Text>
              </TouchableOpacity>
            </View>
          </Card>

          {/* Plan recommandé */}
          <Card style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>{costInfo.plan.name}</Text>
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>Recommandé</Text>
              </View>
            </View>
            
            <View style={styles.priceContainer}>
              <Text style={styles.priceAmount}>{formatAmount(costInfo.totalAmount)}</Text>
              <Text style={styles.priceUnit}>pour {studentsCount} élève{studentsCount > 1 ? 's' : ''}</Text>
              <Text style={styles.priceDetail}>
                {formatAmount(costInfo.plan.pricePerStudent)} par élève/an
              </Text>
            </View>

            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Fonctionnalités incluses :</Text>
              {costInfo.plan.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <CheckCircle size={16} color={COLORS.success} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            <View style={styles.durationContainer}>
              <Calendar size={20} color={COLORS.gray} />
              <Text style={styles.durationText}>
                Durée : {costInfo.plan.duration} mois (année scolaire)
              </Text>
            </View>
          </Card>

          {/* Méthodes de paiement */}
          <Card style={styles.paymentCard}>
            <Text style={styles.cardTitle}>Méthodes de paiement acceptées</Text>
            
            <View style={styles.paymentMethods}>
              <View style={styles.paymentMethod}>
                <Smartphone size={24} color="#FF6B35" />
                <Text style={styles.paymentMethodText}>Wave</Text>
              </View>
              
              <View style={styles.paymentMethod}>
                <Wallet size={24} color="#FF8C00" />
                <Text style={styles.paymentMethodText}>Orange Money</Text>
              </View>
            </View>
            
            <Text style={styles.paymentNote}>
              Le paiement est sécurisé et traité par nos partenaires de confiance.
            </Text>
          </Card>

          {/* Informations importantes */}
          <Card style={styles.infoCard}>
            <Text style={styles.infoTitle}>Informations importantes</Text>
            <View style={styles.infoList}>
              <Text style={styles.infoItem}>• L'abonnement est valable pour une année scolaire</Text>
              <Text style={styles.infoItem}>• Renouvellement nécessaire chaque année</Text>
              <Text style={styles.infoItem}>• Accès à toutes les fonctionnalités après paiement</Text>
              <Text style={styles.infoItem}>• Support client inclus</Text>
            </View>
          </Card>

          <Button
            title={isCreatingSubscription ? 'Création...' : 'Procéder au paiement'}
            onPress={handleCreateSubscription}
            loading={isCreatingSubscription}
            style={styles.subscribeButton}
            testID="subscribe-button"
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              En continuant, vous acceptez nos conditions d&apos;utilisation et notre politique de confidentialité.
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
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
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 60,
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500' as const,
  },
  errorCard: {
    marginBottom: 20,
    backgroundColor: '#FFF5F5',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    flex: 1,
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: '500' as const,
  },
  studentsCard: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: COLORS.text,
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 20,
    lineHeight: 20,
  },
  studentsSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  countButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countButtonText: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  disabledText: {
    opacity: 0.5,
  },
  countDisplay: {
    alignItems: 'center',
    gap: 8,
  },
  countText: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: COLORS.primary,
  },
  countLabel: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500' as const,
  },
  planCard: {
    marginBottom: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: COLORS.text,
  },
  recommendedBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  priceAmount: {
    fontSize: 36,
    fontWeight: '800' as const,
    color: COLORS.primary,
  },
  priceUnit: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 4,
  },
  priceDetail: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text,
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  durationText: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500' as const,
  },
  paymentCard: {
    marginBottom: 20,
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  paymentMethod: {
    alignItems: 'center',
    gap: 8,
  },
  paymentMethodText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  paymentNote: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  infoCard: {
    marginBottom: 24,
    backgroundColor: '#F8F9FA',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text,
    marginBottom: 12,
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
    marginBottom: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 18,
  },
});