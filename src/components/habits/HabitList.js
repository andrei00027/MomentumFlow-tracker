// src/components/habits/HabitList.js
import React, { useState } from 'react';
import { FlatList, StyleSheet, View, Text, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { HabitCard } from './HabitCard';
import { Colors, Sizes } from '@/src/constants';

export const HabitList = ({ habits, onComplete, isCompletedToday, onLongPress, onRefresh }) => {
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setRefreshing(false);
  };

  if (habits.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🌊</Text>
        <Text style={styles.emptyTitle}>{t('habits.emptyStateTitle')}</Text>
        <Text style={styles.emptyText}>{t('habits.emptyStateDescription')}</Text>
        <View style={styles.emptyBenefits}>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>✨</Text>
            <Text style={styles.benefitText}>{t('habits.emptyBenefit1')}</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>🔥</Text>
            <Text style={styles.benefitText}>{t('habits.emptyBenefit2')}</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>📊</Text>
            <Text style={styles.benefitText}>{t('habits.emptyBenefit3')}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <FlatList
      data={habits}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <HabitCard
          habit={item}
          index={index}
          onComplete={onComplete}
          isCompleted={isCompletedToday(item.id)}
          onLongPress={onLongPress}
        />
      )}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={Colors.primary}
          colors={[Colors.primary]}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: Sizes.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Sizes.spacing.xl,
  },
  emptyIcon: {
    fontSize: 72,
    marginBottom: Sizes.spacing.lg,
  },
  emptyTitle: {
    fontSize: Sizes.fontSize.xxl,
    fontWeight: Sizes.fontWeight.bold,
    color: Colors.text,
    marginBottom: Sizes.spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: Sizes.fontSize.md,
    fontWeight: Sizes.fontWeight.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Sizes.spacing.xl,
    paddingHorizontal: Sizes.spacing.md,
  },
  emptyBenefits: {
    width: '100%',
    maxWidth: 300,
    gap: Sizes.spacing.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.lg,
    ...Sizes.shadow.sm,
  },
  benefitIcon: {
    fontSize: 24,
    marginRight: Sizes.spacing.md,
  },
  benefitText: {
    fontSize: Sizes.fontSize.md,
    fontWeight: Sizes.fontWeight.medium,
    color: Colors.text,
  },
});
