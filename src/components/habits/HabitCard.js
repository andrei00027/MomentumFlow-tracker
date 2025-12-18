// src/components/habits/HabitCard.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Sizes } from '@/src/constants';
import { HabitIcon } from '@/src/components/common/HabitIcon';
import { tPlural } from '@/src/i18n';
import { useHabits } from '@/src/context/HabitsContext';

export const HabitCard = ({ habit, onComplete, isCompleted, onPress, index = 0 }) => {
  const { getQuitHabitStreak } = useHabits();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const checkboxScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Анимация появления карточки с задержкой на основе индекса
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 50, // Карточки появляются последовательно
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 50,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Анимация checkbox при нажатии
    Animated.sequence([
      Animated.spring(checkboxScale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(checkboxScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onComplete(habit.id);
  };

  const handleCardPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.(habit);
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={handleCardPress}
        activeOpacity={0.8}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <HabitIcon
                name={habit.icon || 'checkmark'}
                size={32}
                color={Colors.primary}
              />
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{habit.name}</Text>
              {habit.isQuitHabit ? (
                // Для quit habit показываем дни без действия
                <Text style={[styles.streak, styles.quitStreak]}>
                  {tPlural('habits.days', getQuitHabitStreak(habit))}
                </Text>
              ) : (
                habit.currentStreak > 0 && (
                  <Text style={styles.streak}>{tPlural('habits.days', habit.currentStreak)}</Text>
                )
              )}
            </View>
          </View>
        </View>

        <Animated.View style={{ transform: [{ scale: checkboxScale }] }}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              habit.isQuitHabit ? styles.checkboxQuit : null,
              isCompleted && (habit.isQuitHabit ? styles.checkboxSlip : styles.checkboxCompleted),
            ]}
            onPress={handlePress}
            activeOpacity={0.7}
          >
            {isCompleted && (
              <Text style={styles.checkmark}>{habit.isQuitHabit ? '!' : '✓'}</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
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
    ...Sizes.shadow.md,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: Sizes.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: Sizes.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Sizes.spacing.xs,
  },
  streak: {
    fontSize: Sizes.fontSize.sm,
    fontWeight: Sizes.fontWeight.medium,
    color: Colors.textSecondary,
  },
  quitStreak: {
    color: Colors.success,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: Sizes.borderRadius.full,
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
  checkboxQuit: {
    borderColor: Colors.error,
  },
  checkboxSlip: {
    backgroundColor: Colors.error,
    borderColor: Colors.error,
  },
  checkmark: {
    color: Colors.surface,
    fontSize: 18,
    fontWeight: Sizes.fontWeight.bold,
  },
});
