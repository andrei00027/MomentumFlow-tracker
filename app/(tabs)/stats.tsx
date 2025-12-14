import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Sizes } from '@/src/constants';
import { useHabits } from '@/src/context/HabitsContext';
import { useMemo } from 'react';

export default function StatsScreen() {
  const { habits } = useHabits();

  // Общая статистика
  const stats = useMemo(() => {
    const totalHabits = habits.length;
    const totalStreak = habits.reduce((sum, h) => sum + h.currentStreak, 0);
    const maxStreak = Math.max(...habits.map(h => h.bestStreak), 0);

    // Статистика за сегодня
    const today = new Date().toISOString().split('T')[0];
    const completedToday = habits.filter(h => h.completionHistory?.[today]?.completed).length;
    const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

    return {
      totalHabits,
      totalStreak,
      maxStreak,
      completedToday,
      completionRate,
    };
  }, [habits]);

  // Топ-3 привычки по streak
  const topHabits = useMemo(() => {
    return [...habits]
      .sort((a, b) => b.currentStreak - a.currentStreak)
      .slice(0, 3);
  }, [habits]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Статистика</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Карточки со статистикой */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalHabits}</Text>
            <Text style={styles.statLabel}>Всего привычек</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.completedToday}</Text>
            <Text style={styles.statLabel}>Выполнено сегодня</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalStreak}</Text>
            <Text style={styles.statLabel}>Общий стрик</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.maxStreak}</Text>
            <Text style={styles.statLabel}>Лучший стрик</Text>
          </View>
        </View>

        {/* Прогресс за сегодня */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Прогресс за сегодня</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressValue}>{stats.completionRate}%</Text>
              <Text style={styles.progressLabel}>
                {stats.completedToday} из {stats.totalHabits}
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${stats.completionRate}%` }
                ]}
              />
            </View>
          </View>
        </View>

        {/* Топ привычки */}
        {topHabits.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Топ привычки</Text>
            {topHabits.map((habit, index) => (
              <View key={habit.id} style={styles.topHabitCard}>
                <View style={styles.topHabitRank}>
                  <Text style={styles.topHabitRankText}>{index + 1}</Text>
                </View>
                <Text style={styles.topHabitIcon}>{habit.icon}</Text>
                <View style={styles.topHabitInfo}>
                  <Text style={styles.topHabitName}>{habit.name}</Text>
                  <Text style={styles.topHabitStreak}>🔥 {habit.currentStreak} дней</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Sizes.spacing.md,
    paddingVertical: Sizes.spacing.sm,
  },
  headerTitle: {
    fontSize: Sizes.fontSize.xxl,
    fontWeight: 'bold',
    color: Colors.text,
  },
  content: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Sizes.spacing.md,
    gap: Sizes.spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surface,
    padding: Sizes.spacing.lg,
    borderRadius: Sizes.borderRadius.lg,
    alignItems: 'center',
  },
  statValue: {
    fontSize: Sizes.fontSize.xxxl,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Sizes.spacing.xs,
  },
  statLabel: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    padding: Sizes.spacing.md,
  },
  sectionTitle: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Sizes.spacing.md,
  },
  progressCard: {
    backgroundColor: Colors.surface,
    padding: Sizes.spacing.lg,
    borderRadius: Sizes.borderRadius.lg,
  },
  progressInfo: {
    alignItems: 'center',
    marginBottom: Sizes.spacing.md,
  },
  progressValue: {
    fontSize: Sizes.fontSize.xxxl,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  progressLabel: {
    fontSize: Sizes.fontSize.md,
    color: Colors.textSecondary,
    marginTop: Sizes.spacing.xs,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: Colors.background,
    borderRadius: Sizes.borderRadius.md,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: Sizes.borderRadius.md,
  },
  topHabitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.lg,
    marginBottom: Sizes.spacing.sm,
  },
  topHabitRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Sizes.spacing.md,
  },
  topHabitRankText: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  topHabitIcon: {
    fontSize: 32,
    marginRight: Sizes.spacing.md,
  },
  topHabitInfo: {
    flex: 1,
  },
  topHabitName: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Sizes.spacing.xs,
  },
  topHabitStreak: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
  },
});
