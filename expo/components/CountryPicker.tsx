import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { COLORS } from '@/constants/colors';
import { COUNTRIES, Country } from '@/constants/countries';
import { ChevronDown, Search, X } from 'lucide-react-native';

interface CountryPickerProps {
  selectedCountry: Country;
  onCountrySelect: (country: Country) => void;
  style?: any;
  testID?: string;
}

export default function CountryPicker({
  selectedCountry,
  onCountrySelect,
  style,
  testID,
}: CountryPickerProps) {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtrer les pays selon la recherche
  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.dialCode.includes(searchQuery)
  );

  const handleCountrySelect = (country: Country) => {
    onCountrySelect(country);
    setModalVisible(false);
    setSearchQuery('');
  };

  const renderCountryItem = ({ item }: { item: Country }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => handleCountrySelect(item)}
      testID={`country-item-${item.code}`}
    >
      <Text style={styles.flag}>{item.flag}</Text>
      <View style={styles.countryInfo}>
        <Text style={styles.countryName}>{item.name}</Text>
        <Text style={styles.dialCode}>{item.dialCode}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={() => setModalVisible(true)}
        testID={testID}
      >
        <Text style={styles.flag}>{selectedCountry.flag}</Text>
        <Text style={styles.dialCode}>{selectedCountry.dialCode}</Text>
        <ChevronDown size={16} color={COLORS.gray} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* En-tête du modal */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Sélectionner un pays</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
              testID="close-country-picker"
            >
              <X size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {/* Barre de recherche */}
          <View style={styles.searchContainer}>
            <Search size={20} color={COLORS.gray} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un pays..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              testID="country-search-input"
            />
          </View>

          {/* Liste des pays */}
          <FlatList
            data={filteredCountries}
            renderItem={renderCountryItem}
            keyExtractor={(item) => item.code}
            style={styles.countryList}
            showsVerticalScrollIndicator={false}
            testID="country-list"
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    minWidth: 100,
  },
  flag: {
    fontSize: 20,
    marginRight: 8,
  },
  dialCode: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500' as const,
    marginRight: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  countryList: {
    flex: 1,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  countryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: COLORS.text,
    marginBottom: 2,
  },
});