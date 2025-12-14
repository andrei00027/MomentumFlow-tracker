// src/components/habits/HabitCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Sizes } from '@/src/constants';

export const HabitCard = ({ habit, onComplete, isCompleted, onLongPress }) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onComplete(habit.id);
  };

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLongPress?.(habit);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onLongPress={handleLongPress}
      activeOpacity={0.8}
      delayLongPress={500}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.icon}>{habit.icon || '✨'}</Text>
          <View style={styles.info}>
            <Text style={styles.name}>{habit.name}</Text>
            {habit.currentStreak > 0 && (
              <Text style={styles.streak}>🔥 {habit.currentStreak} дней</Text>
            )}
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {isCompleted && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Sizes.borderRadius.lg,
    padding: Sizes.spacing.md,
    marginBottom: Sizes.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 32,
    marginRight: Sizes.spacing.md,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Sizes.spacing.xs,
  },
  streak: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Sizes.spacing.sm,
  },
  checkboxCompleted: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  checkmark: {
    color: Colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
