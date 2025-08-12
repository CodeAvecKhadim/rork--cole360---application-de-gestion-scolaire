import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '@/constants/colors';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react-native';

interface StatItem {
  label: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: LucideIcon;
  color?: string;
}

interface StatsCardProps {
  title: string;
  subtitle?: string;
  stats: StatItem[];
  variant?: 'default' | 'gradient' | 'compact';
  layout?: 'grid' | 'list';
  testID?: string;
}

export default function StatsCard({
  title,
  subtitle,
  stats,
  variant = 'default',
  layout = 'grid',
  testID,
}: StatsCardProps) {
  const getTrendIcon = (changeType?: 'increase' | 'decrease' | 'neutral') => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp size={16} color={COLORS.success} />;
      case 'decrease':
        return <TrendingDown size={16} color={COLORS.danger} />;
      case 'neutral':
        return <Minus size={16} color={COLORS.gray} />;
      default:
        return null;
    }
  };

  const getTrendColor = (changeType?: 'increase' | 'decrease' | 'neutral') => {
    switch (changeType) {
      case 'increase':
        return COLORS.success;
      case 'decrease':
        return COLORS.danger;
      case 'neutral':
        return COLORS.gray;
      default:
        return COLORS.text;
    }
  };

  const renderStatItem = (stat: StatItem, index: number) => {
    const IconComponent = stat.icon;
    
    return (
      <View key={index} style={[
        styles.statItem,
        layout === 'list' && styles.statItemList,
        variant === 'compact' && styles.statItemCompact
      ]}>
        <View style={styles.statHeader}>
          {IconComponent && (
            <View style={[
              styles.iconContainer,
              { backgroundColor: `${stat.color || COLORS.primary}15` }
            ]}>
              <IconComponent size={20} color={stat.color || COLORS.primary} />
            </View>
          )}
          <Text style={[
            styles.statLabel,
            variant === 'compact' && styles.statLabelCompact
          ]}>
            {stat.label}
          </Text>
        </View>
        
        <View style={styles.statValueContainer}>
          <Text style={[
            styles.statValue,
            variant === 'compact' && styles.statValueCompact,
            stat.color && { color: stat.color }
          ]}>
            {stat.value}
          </Text>
          
          {stat.change !== undefined && (
            <View style={styles.changeContainer}>
              {getTrendIcon(stat.changeType)}
              <Text style={[
                styles.changeText,
                { color: getTrendColor(stat.changeType) }
              ]}>
                {stat.change > 0 ? '+' : ''}{stat.change}%
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderContent = () => (
    <>
      <View style={styles.header}>
        <Text style={[
          styles.title,
          variant === 'gradient' && styles.gradientTitle
        ]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[
            styles.subtitle,
            variant === 'gradient' && styles.gradientSubtitle
          ]}>
            {subtitle}
          </Text>
        )}
      </View>
      
      <View style={[
        styles.statsContainer,
        layout === 'list' && styles.statsContainerList
      ]}>
        {stats.map(renderStatItem)}
      </View>
    </>
  );

  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={GRADIENTS.primary as any}
        style={[
          styles.card,
          styles.gradientCard
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        testID={testID}
      >
        {renderContent()}
      </LinearGradient>
    );
  }

  return (
    <View style={[
      styles.card,
      variant === 'compact' && styles.compactCard
    ]} testID={testID}>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    marginVertical: 8,
    ...Platform.select({
      web: {
        transition: 'all 0.3s ease-in-out',
      },
    }),
  },
  gradientCard: {
    backgroundColor: 'transparent',
  },
  compactCard: {
    padding: 16,
    borderRadius: 12,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  gradientTitle: {
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  gradientSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  statsContainerList: {
    flexDirection: 'column',
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: `${COLORS.primary}05`,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statItemList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: '100%',
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    borderRadius: 0,
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  statItemCompact: {
    padding: 12,
  },
  statHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '600',
    textAlign: 'center',
  },
  statLabelCompact: {
    fontSize: 12,
  },
  statValueContainer: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  statValueCompact: {
    fontSize: 20,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});