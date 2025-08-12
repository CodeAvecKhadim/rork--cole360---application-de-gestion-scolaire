import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput
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
  Phone
} from 'lucide-react-native';

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
              {getStatusIcon()}
            </View>
            <Text style={styles.title}>Paiement</Text>
            <Text style={styles.subtitle}>{getStatusText()}</Text>
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
            <Text style={styles.cardTitle}>Résumé de votre abonnement</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Nombre d&apos;élèves :</Text>
              <Text style={styles.summaryValue}>{subscription.studentsCount}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Plan :</Text>
              <Text style={styles.summaryValue}>{subscription.plan}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Durée :</Text>
              <Text style={styles.summaryValue}>12 mois</Text>
            </View>
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total à payer :</Text>
              <Text style={styles.totalValue}>{formatAmount(subscription.totalAmount)}</Text>
            </View>
          </Card>

          {paymentStatus === 'idle' && (
            <>
              {/* Sélection de la méthode de paiement */}
              <Card style={styles.methodCard}>
                <Text style={styles.cardTitle}>Choisissez votre méthode de paiement</Text>
                
                <View style={styles.methodsContainer}>
                  <TouchableOpacity
                    style={[
                      styles.methodOption,
                      selectedMethod === 'wave' && styles.selectedMethod
                    ]}
                    onPress={() => setSelectedMethod('wave')}
                  >
                    <Smartphone size={32} color={selectedMethod === 'wave' ? '#FFFFFF' : '#FF6B35'} />
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
                      Numéros sénégalais (+221)
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.methodOption,
                      selectedMethod === 'orange_money' && styles.selectedMethod
                    ]}
                    onPress={() => setSelectedMethod('orange_money')}
                  >
                    <Wallet size={32} color={selectedMethod === 'orange_money' ? '#FFFFFF' : '#FF8C00'} />
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
                      Afrique de l&apos;Ouest
                    </Text>
                  </TouchableOpacity>
                </View>
              </Card>

              {/* Saisie du numéro de téléphone */}
              <Card style={styles.phoneCard}>
                <Text style={styles.cardTitle}>Numéro de téléphone</Text>
                <Text style={styles.phoneDescription}>
                  Saisissez le numéro de téléphone associé à votre compte {selectedMethod === 'wave' ? 'Wave' : 'Orange Money'}
                </Text>
                
                <View style={styles.phoneInputContainer}>
                  <Phone size={20} color={COLORS.gray} style={styles.phoneIcon} />
                  <TextInput
                    style={styles.phoneInput}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholder={selectedMethod === 'wave' ? '+221 XX XXX XX XX' : '+22X XX XXX XX XX'}
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    testID="phone-input"
                  />
                </View>
                
                <Text style={styles.phoneNote}>
                  {selectedMethod === 'wave' 
                    ? 'Format : +221XXXXXXXXX (numéros sénégalais uniquement)'
                    : 'Format : +22XXXXXXXXXX (Sénégal, Mali, Burkina Faso, etc.)'
                  }
                </Text>
              </Card>

              <Button
                title={isProcessing ? 'Traitement...' : `Payer ${formatAmount(subscription.totalAmount)}`}
                onPress={handlePayment}
                loading={isProcessing}
                style={styles.payButton}
                testID="pay-button"
              />
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
  summaryCard: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: COLORS.text,
    marginBottom: 16,
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
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    backgroundColor: '#FFFFFF',
  },
  selectedMethod: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
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
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    marginBottom: 8,
  },
  phoneIcon: {
    marginRight: 12,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  phoneNote: {
    fontSize: 12,
    color: COLORS.gray,
    fontStyle: 'italic',
  },
  payButton: {
    marginBottom: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
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