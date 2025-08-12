import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '@/constants/colors';
import { Search, X, Filter } from 'lucide-react-native';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSearch?: (text: string) => void;
  onClear?: () => void;
  onFilter?: () => void;
  showFilter?: boolean;
  variant?: 'default' | 'gradient' | 'minimal';
  testID?: string;
}

export default function SearchBar({
  placeholder = 'Rechercher...',
  value = '',
  onChangeText,
  onSearch,
  onClear,
  onFilter,
  showFilter = false,
  variant = 'default',
  testID,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    if (onChangeText) {
      onChangeText('');
    }
    if (onClear) {
      onClear();
    }
  };

  if (variant === 'gradient') {
    return (
      <View style={styles.container} testID={testID}>
        <LinearGradient
          colors={isFocused ? GRADIENTS.primarySimple as any : ['#F8F9FA', '#F8F9FA']}
          style={[styles.gradientSearchContainer, isFocused && styles.focused]}
        >
          <Search size={20} color={isFocused ? COLORS.white : COLORS.gray} />
          <TextInput
            style={[styles.gradientInput, isFocused && styles.gradientInputFocused]}
            placeholder={placeholder}
            placeholderTextColor={isFocused ? 'rgba(255, 255, 255, 0.7)' : COLORS.gray}
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={handleSubmit}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            returnKeyType="search"
          />
          {value.length > 0 && (
            <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
              <X size={18} color={isFocused ? COLORS.white : COLORS.gray} />
            </TouchableOpacity>
          )}
        </LinearGradient>
        {showFilter && (
          <TouchableOpacity onPress={onFilter} style={styles.filterButton}>
            <LinearGradient
              colors={GRADIENTS.primarySimple as any}
              style={styles.filterGradient}
            >
              <Filter size={20} color={COLORS.white} />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (variant === 'minimal') {
    return (
      <View style={styles.container} testID={testID}>
        <View style={[styles.minimalSearchContainer, isFocused && styles.minimalFocused]}>
          <Search size={18} color={COLORS.gray} />
          <TextInput
            style={styles.minimalInput}
            placeholder={placeholder}
            placeholderTextColor={COLORS.gray}
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={handleSubmit}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            returnKeyType="search"
          />
          {value.length > 0 && (
            <TouchableOpacity onPress={handleClear}>
              <X size={16} color={COLORS.gray} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container} testID={testID}>
      <View style={[styles.searchContainer, isFocused && styles.focused]}>
        <Search size={20} color={COLORS.gray} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={handleSubmit}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType="search"
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <X size={18} color={COLORS.gray} />
          </TouchableOpacity>
        )}
      </View>
      {showFilter && (
        <TouchableOpacity onPress={onFilter} style={styles.filterButton}>
          <View style={styles.filterContainer}>
            <Filter size={20} color={COLORS.primary} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  focused: {
    borderColor: COLORS.primary,
    shadowOpacity: 0.1,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    marginLeft: 8,
  },
  filterContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: `${COLORS.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Gradient variant styles
  gradientSearchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gradientInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  gradientInputFocused: {
    color: COLORS.white,
  },
  filterGradient: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Minimal variant styles
  minimalSearchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  minimalFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  minimalInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.text,
  },
});