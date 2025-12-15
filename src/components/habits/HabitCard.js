// src/components/habits/HabitCard.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { Colors, Sizes } from '@/src/constants';

export const HabitCard = ({ habit, onComplete, isCompleted, onLongPress, index = 0 }) => {
  const { t } = useTranslation();
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

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLongPress?.(habit);
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
                <Text style={styles.streak}>🔥 {t('habits.days', { count: habit.currentStreak })}</Text>
              )}
            </View>
          </View>
        </View>

        <Animated.View style={{ transform: [{ scale: checkboxScale }] }}>
          <TouchableOpacity
            style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}
            onPress={handlePress}
            activeOpacity={0.7}
          >
            {isCompleted && <Text style={styles.checkmark}>✓</Text>}
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
  icon: {
    fontSize: 32,
    marginRight: Sizes.spacing.md,
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
  checkmark: {
    color: Colors.surface,
    fontSize: 18,
    fontWeight: Sizes.fontWeight.bold,
  },
});
