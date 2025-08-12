import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Dimensions,
  Platform
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
  Smartphone,
  Wallet,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Clock,
  Phone,
  Heart,
  Shield,
  Star,
  Users
} from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

export default function PaymentScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    subscription,
    loading,
    error,
    payWithWave,
    payWithOrangeMoney,
    checkPaymentStatus,
    formatAmount,
    validatePhoneNumber
  } = useSubscription();

  const [selectedMethod, setSelectedMethod] = useState<'wave' | 'orange_money'>('wave');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');
  const [transactionId, setTransactionId] = useState<string | null>(null);

  // Rediriger si pas d'abonnement en attente
  useEffect(() => {
    if (!subscription || subscription.paymentStatus === 'paid') {
      router.replace('/(app)/(tabs)/dashboard');
    }
  }, [subscription, router]);

  // Vérifier le statut du paiement périodiquement
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (paymentStatus === 'pending' && transactionId) {
      interval = setInterval(async () => {
        try {
          const status = await checkPaymentStatus(transactionId);
          if (status === 'success') {
            setPaymentStatus('success');
            clearInterval(interval);
            
            Alert.alert(
              'Paiement réussi !',
              'Votre abonnement a été activé avec succès. Vous avez maintenant accès à toutes les fonctionnalités.',
              [
                {
                  text: 'Continuer',
                  onPress: () => router.replace('/(app)/(tabs)/dashboard')
                }
              ]
            );
          } else if (status === 'failed') {
            setPaymentStatus('failed');
            clearInterval(interval);
          }
        } catch (err) {
          console.error('Erreur vérification paiement:', err);
        }
      }, 3000); // Vérifier toutes les 3 secondes
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [paymentStatus, transactionId, checkPaymentStatus, router]);

  const handlePayment = async () => {
    if (!subscription) {
      Alert.alert('Erreur', 'Aucun abonnement trouvé');
      return;
    }

    if (!phoneNumber.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir votre numéro de téléphone');
      return;
    }

    // Valider le numéro de téléphone
    if (!validatePhoneNumber(phoneNumber, selectedMethod)) {
      const methodName = selectedMethod === 'wave' ? 'Wave' : 'Orange Money';
      Alert.alert(
        'Numéro invalide',
        `Le numéro de téléphone n'est pas valide pour ${methodName}. Vérifiez le format.`
      );
      return;
    }

    try {
      setIsProcessing(true);
      setPaymentStatus('pending');

      let transaction;
      if (selectedMethod === 'wave') {
        transaction = await payWithWave(subscription.id, phoneNumber);
      } else {
        transaction = await payWithOrangeMoney(subscription.id, phoneNumber);
      }

      setTransactionId(transaction.id);

      Alert.alert(
        'Paiement initié',
        `Votre demande de paiement ${selectedMethod === 'wave' ? 'Wave' : 'Orange Money'} a été envoyée. Vérifiez votre téléphone et confirmez la transaction.`,
        [{ text: 'OK' }]
      );
    } catch (err) {
      console.error('Erreur paiement:', err);
      setPaymentStatus('failed');
      Alert.alert(
        'Erreur de paiement',
        'Impossible d\'initier le paiement. Veuillez réessayer.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'pending':
        return <Clock size={24} color={COLORS.warning} />;
      case 'success':
        return <CheckCircle size={24} color={COLORS.success} />;
      case 'failed':
        return <AlertCircle size={24} color={COLORS.danger} />;
      default:
        return <CreditCard size={24} color={COLORS.primary} />;
    }
  };

  const getStatusText = () => {
    switch (paymentStatus) {
      case 'pending':
        return 'Paiement en cours...';
      case 'success':
        return 'Paiement réussi !';
      case 'failed':
        return 'Paiement échoué';
      default:
        return 'Prêt pour le paiement';
    }
  };

  if (loading || !subscription) {
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
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.iconGradient}
              >
                {getStatusIcon()}
              </LinearGradient>
            </View>
            <Text style={styles.title}>Suivi Scolaire Premium</Text>
            <Text style={styles.subtitle}>Accompagnez la réussite de votre enfant</Text>
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Shield size={16} color="rgba(255, 255, 255, 0.9)" />
                <Text style={styles.featureText}>Sécurisé</Text>
              </View>
              <View style={styles.featureItem}>
                <Star size={16} color="rgba(255, 255, 255, 0.9)" />
                <Text style={styles.featureText}>Premium</Text>
              </View>
              <View style={styles.featureItem}>
                <Users size={16} color="rgba(255, 255, 255, 0.9)" />
                <Text style={styles.featureText}>Famille</Text>
              </View>
            </View>
          </View>

          {error && (
            <Card style={styles.errorCard}>
              <View style={styles.errorContent}>
                <AlertCircle size={24} color={COLORS.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            </Card>
          )}

          {/* Résumé de l'abonnement */}
          <Card style={styles.summaryCard}>
            <LinearGradient
              colors={['#F8F9FF', '#FFFFFF']}
              style={styles.summaryGradient}
            >
              <View style={styles.summaryHeader}>
                <Text style={styles.cardTitle}>✨ Votre abonnement Premium</Text>
                <Text style={styles.cardSubtitle}>Accès complet pendant une année scolaire</Text>
              </View>
              
              <View style={styles.summaryContent}>
                <View style={styles.summaryRow}>
                  <View style={styles.summaryLabelContainer}>
                    <Users size={16} color={COLORS.primary} />
                    <Text style={styles.summaryLabel}>Élèves suivis</Text>
                  </View>
                  <View style={styles.summaryValueContainer}>
                    <Text style={styles.summaryValue}>{subscription.studentsCount}</Text>
                    <Text style={styles.summaryUnit}>enfant{subscription.studentsCount > 1 ? 's' : ''}</Text>
                  </View>
                </View>
                
                <View style={styles.summaryRow}>
                  <View style={styles.summaryLabelContainer}>
                    <Star size={16} color={COLORS.primary} />
                    <Text style={styles.summaryLabel}>Formule</Text>
                  </View>
                  <View style={styles.summaryValueContainer}>
                    <Text style={styles.summaryValue}>{subscription.plan}</Text>
                  </View>
                </View>
                
                <View style={styles.summaryRow}>
                  <View style={styles.summaryLabelContainer}>
                    <Clock size={16} color={COLORS.primary} />
                    <Text style={styles.summaryLabel}>Durée</Text>
                  </View>
                  <View style={styles.summaryValueContainer}>
                    <Text style={styles.summaryValue}>12 mois</Text>
                    <Text style={styles.summaryUnit}>année scolaire</Text>
                  </View>
                </View>
                
                <View style={styles.divider} />
                
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>💝 Investissement annuel</Text>
                  <View style={styles.totalContainer}>
                    <Text style={styles.totalValue}>{formatAmount(subscription.totalAmount)}</Text>
                    <Text style={styles.totalNote}>pour toute l'année</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </Card>

          {paymentStatus === 'idle' && (
            <>
              {/* Sélection de la méthode de paiement */}
              <Card style={styles.methodCard}>
                <Text style={styles.cardTitle}>💳 Méthode de paiement</Text>
                <Text style={styles.cardSubtitle}>Choisissez votre solution mobile money préférée</Text>
                
                <View style={styles.methodsContainer}>
                  <TouchableOpacity
                    style={styles.methodOption}
                    onPress={() => setSelectedMethod('wave')}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={selectedMethod === 'wave' ? ['#FF6B35', '#F7931E'] : ['#FFFFFF', '#F8F9FA']}
                      style={styles.methodGradient}
                    >
                      <View style={styles.methodIconContainer}>
                        <Smartphone size={28} color={selectedMethod === 'wave' ? '#FFFFFF' : '#FF6B35'} />
                        {selectedMethod === 'wave' && (
                          <View style={styles.selectedBadge}>
                            <CheckCircle size={16} color="#FFFFFF" />
                          </View>
                        )}
                      </View>
                      <Text style={[
                        styles.methodText,
                        selectedMethod === 'wave' && styles.selectedMethodText
                      ]}>
                        Wave
                      </Text>
                      <Text style={[
                        styles.methodDescription,
                        selectedMethod === 'wave' && styles.selectedMethodDescription
                      ]}>
                        Sénégal (+221)
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.methodOption}
                    onPress={() => setSelectedMethod('orange_money')}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={selectedMethod === 'orange_money' ? ['#FF8C00', '#FFA500'] : ['#FFFFFF', '#F8F9FA']}
                      style={styles.methodGradient}
                    >
                      <View style={styles.methodIconContainer}>
                        <Wallet size={28} color={selectedMethod === 'orange_money' ? '#FFFFFF' : '#FF8C00'} />
                        {selectedMethod === 'orange_money' && (
                          <View style={styles.selectedBadge}>
                            <CheckCircle size={16} color="#FFFFFF" />
                          </View>
                        )}
                      </View>
                      <Text style={[
                        styles.methodText,
                        selectedMethod === 'orange_money' && styles.selectedMethodText
                      ]}>
                        Orange Money
                      </Text>
                      <Text style={[
                        styles.methodDescription,
                        selectedMethod === 'orange_money' && styles.selectedMethodDescription
                      ]}>
                        Afrique de l'Ouest
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </Card>

              {/* Saisie du numéro de téléphone */}
              <Card style={styles.phoneCard}>
                <Text style={styles.cardTitle}>📱 Votre numéro {selectedMethod === 'wave' ? 'Wave' : 'Orange Money'}</Text>
                <Text style={styles.phoneDescription}>
                  Saisissez le numéro associé à votre compte {selectedMethod === 'wave' ? 'Wave' : 'Orange Money'} pour finaliser le paiement
                </Text>
                
                <View style={styles.phoneInputWrapper}>
                  <View style={[
                    styles.phoneInputContainer,
                    phoneNumber.length > 0 && styles.phoneInputFocused
                  ]}>
                    <View style={styles.phoneIconWrapper}>
                      <Phone size={20} color={phoneNumber.length > 0 ? COLORS.primary : COLORS.gray} />
                    </View>
                    <TextInput
                      style={styles.phoneInput}
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      placeholder={selectedMethod === 'wave' ? '+221 XX XXX XX XX' : '+22X XX XXX XX XX'}
                      placeholderTextColor={COLORS.lightGray}
                      keyboardType="phone-pad"
                      autoCapitalize="none"
                      testID="phone-input"
                    />
                  </View>
                  
                  <View style={styles.phoneHint}>
                    <Text style={styles.phoneNote}>
                      {selectedMethod === 'wave' 
                        ? '🇸🇳 Format sénégalais : +221XXXXXXXXX'
                        : '🌍 Format international : +22XXXXXXXXXX'
                      }
                    </Text>
                  </View>
                </View>
              </Card>

              <TouchableOpacity
                style={[
                  styles.payButton,
                  isProcessing && styles.payButtonDisabled
                ]}
                onPress={handlePayment}
                disabled={isProcessing}
                testID="pay-button"
              >
                <LinearGradient
                  colors={isProcessing ? ['#CCCCCC', '#999999'] : ['#FF6B35', '#F7931E']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.payButtonGradient}
                >
                  <View style={styles.payButtonContent}>
                    <Heart size={20} color="#FFFFFF" style={styles.payButtonIcon} />
                    <View style={styles.payButtonTextContainer}>
                      <Text style={styles.payButtonTitle}>
                        {isProcessing ? 'Traitement en cours...' : 'Oui, je veux suivre les études'}
                      </Text>
                      <Text style={styles.payButtonSubtitle}>
                        {isProcessing ? 'Veuillez patienter' : `de mon enfant(s) • ${formatAmount(subscription.totalAmount)}`}
                      </Text>
                    </View>
                    {isProcessing && (
                      <ActivityIndicator size="small" color="#FFFFFF" style={styles.payButtonLoader} />
                    )}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

          {paymentStatus === 'pending' && (
            <Card style={styles.statusCard}>
              <View style={styles.statusContent}>
                <ActivityIndicator size="large" color={COLORS.warning} />
                <Text style={styles.statusTitle}>Paiement en cours</Text>
                <Text style={styles.statusDescription}>
                  Vérifiez votre téléphone et confirmez la transaction {selectedMethod === 'wave' ? 'Wave' : 'Orange Money'}.
                </Text>
                <Text style={styles.statusNote}>
                  Cette page se mettra à jour automatiquement une fois le paiement confirmé.
                </Text>
              </View>
            </Card>
          )}

          {paymentStatus === 'failed' && (
            <Card style={styles.statusCard}>
              <View style={styles.statusContent}>
                <AlertCircle size={48} color={COLORS.danger} />
                <Text style={[styles.statusTitle, { color: COLORS.danger }]}>Paiement échoué</Text>
                <Text style={styles.statusDescription}>
                  Le paiement n&apos;a pas pu être traité. Veuillez réessayer.
                </Text>
                <Button
                  title="Réessayer"
                  onPress={() => {
                    setPaymentStatus('idle');
                    setTransactionId(null);
                  }}
                  style={styles.retryButton}
                />
              </View>
            </Card>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Paiement sécurisé • Support client disponible
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
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500' as const,
  },
  title: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500' as const,
    lineHeight: 22,
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
  summaryCard: {
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  summaryGradient: {
    padding: 24,
  },
  summaryHeader: {
    marginBottom: 20,
  },
  summaryContent: {
    gap: 16,
  },
  summaryLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  summaryValueContainer: {
    alignItems: 'flex-end',
  },
  summaryUnit: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: 8,
  },
  totalContainer: {
    alignItems: 'flex-end',
  },
  totalNote: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
    fontStyle: 'italic',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: COLORS.text,
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 20,
    lineHeight: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: COLORS.text,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: COLORS.primary,
  },
  methodCard: {
    marginBottom: 20,
  },
  methodsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  methodOption: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  methodGradient: {
    alignItems: 'center',
    padding: 20,
    minHeight: 120,
    justifyContent: 'center',
  },
  methodIconContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  selectedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    padding: 2,
  },
  methodText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.text,
    marginTop: 8,
  },
  selectedMethodText: {
    color: '#FFFFFF',
  },
  methodDescription: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
    textAlign: 'center',
  },
  selectedMethodDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  phoneCard: {
    marginBottom: 20,
  },
  phoneDescription: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 16,
    lineHeight: 20,
  },
  phoneInputWrapper: {
    gap: 12,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
  },
  phoneInputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  phoneIconWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },
  phoneHint: {
    paddingHorizontal: 4,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500' as const,
  },
  phoneNote: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: '500' as const,
    textAlign: 'center',
  },
  payButton: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  payButtonDisabled: {
    elevation: 2,
    shadowOpacity: 0.1,
  },
  payButtonGradient: {
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  payButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonIcon: {
    marginRight: 12,
  },
  payButtonTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  payButtonTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 2,
  },
  payButtonSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500' as const,
  },
  payButtonLoader: {
    marginLeft: 12,
  },
  statusCard: {
    marginBottom: 20,
  },
  statusContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  statusDescription: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  statusNote: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});