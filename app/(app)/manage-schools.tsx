import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';
import { useData } from '@/hooks/data-store';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Plus, School, MapPin, Phone, Mail, Users } from 'lucide-react-native';

export default function ManageSchoolsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { getSchools, addSchool } = useData();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    adminId: '',
  });

  // Only admin can access this page
  if (user?.role !== 'admin') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Accès non autorisé</Text>
      </View>
    );
  }

  const schools = getSchools();

  const handleAddSchool = () => {
    if (!formData.name || !formData.address || !formData.phone || !formData.email) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      addSchool({
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=200&auto=format&fit=crop',
        adminId: formData.adminId || '2', // Default to school admin
        isActive: true,
      });

      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        adminId: '',
      });
      setShowAddForm(false);
      Alert.alert('Succès', 'École ajoutée avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter l\'école');
    }
  };

  const handleSchoolPress = (schoolId: string) => {
    router.push(`/(app)/school/${schoolId}` as any);
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Gestion des écoles',
          headerBackVisible: true,
          headerBackTitle: 'Retour',
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => setShowAddForm(!showAddForm)}
              style={styles.headerButton}
            >
              <Plus size={24} color={COLORS.primary} />
            </TouchableOpacity>
          )
        }} 
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {showAddForm && (
          <Card title="Ajouter une école">
            <View style={styles.formContainer}>
              <Input
                label="Nom de l'école *"
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Ex: Lycée Central"
              />

              <Input
                label="Adresse *"
                value={formData.address}
                onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
                placeholder="123 Rue de l'Éducation, Ville"
                multiline
                numberOfLines={2}
              />

              <Input
                label="Téléphone *"
                value={formData.phone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                placeholder="+33 1 23 45 67 89"
                keyboardType="phone-pad"
              />

              <Input
                label="Email *"
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                placeholder="contact@ecole.edu"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View style={styles.formActions}>
                <Button
                  title="Annuler"
                  onPress={() => {
                    setShowAddForm(false);
                    setFormData({
                      name: '',
                      address: '',
                      phone: '',
                      email: '',
                      adminId: '',
                    });
                  }}
                  variant="outline"
                  style={styles.cancelButton}
                />
                <Button
                  title="Ajouter"
                  onPress={handleAddSchool}
                  style={styles.addButton}
                />
              </View>
            </View>
          </Card>
        )}

        <Card title={`Écoles enregistrées (${schools.length})`}>
          {schools.length === 0 ? (
            <Text style={styles.emptyText}>Aucune école enregistrée</Text>
          ) : (
            schools.map(school => (
              <TouchableOpacity
                key={school.id}
                style={styles.schoolItem}
                onPress={() => handleSchoolPress(school.id)}
              >
                <View style={styles.schoolHeader}>
                  <View style={styles.schoolIcon}>
                    <School size={24} color={COLORS.primary} />
                  </View>
                  <View style={styles.schoolInfo}>
                    <Text style={styles.schoolName}>{school.name}</Text>
                    <View style={styles.schoolDetail}>
                      <MapPin size={14} color={COLORS.gray} />
                      <Text style={styles.schoolDetailText}>{school.address}</Text>
                    </View>
                    <View style={styles.schoolDetail}>
                      <Phone size={14} color={COLORS.gray} />
                      <Text style={styles.schoolDetailText}>{school.phone}</Text>
                    </View>
                    <View style={styles.schoolDetail}>
                      <Mail size={14} color={COLORS.gray} />
                      <Text style={styles.schoolDetailText}>{school.email}</Text>
                    </View>
                  </View>
                  <View style={styles.schoolStatus}>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: school.isActive ? COLORS.success : COLORS.danger }
                    ]}>
                      <Text style={styles.statusText}>
                        {school.isActive ? 'Actif' : 'Inactif'}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </Card>

        {/* Statistiques globales */}
        <Card title="Statistiques globales">
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <School size={24} color={COLORS.primary} />
              <Text style={styles.statValue}>{schools.length}</Text>
              <Text style={styles.statLabel}>Écoles</Text>
            </View>
            <View style={styles.statItem}>
              <School size={24} color={COLORS.success} />
              <Text style={styles.statValue}>
                {schools.filter(s => s.isActive).length}
              </Text>
              <Text style={styles.statLabel}>Actives</Text>
            </View>
            <View style={styles.statItem}>
              <Users size={24} color={COLORS.secondary} />
              <Text style={styles.statValue}>42</Text>
              <Text style={styles.statLabel}>Utilisateurs</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: 16,
  },
  headerButton: {
    padding: 8,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.danger,
    textAlign: 'center',
    marginTop: 24,
  },
  formContainer: {
    gap: 16,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
  },
  addButton: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.gray,
    fontSize: 16,
    padding: 20,
  },
  schoolItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  schoolHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  schoolIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  schoolInfo: {
    flex: 1,
  },
  schoolName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  schoolDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  schoolDetailText: {
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 6,
    flex: 1,
  },
  schoolStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
});