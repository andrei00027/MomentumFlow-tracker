import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Colors, Sizes } from '@/src/constants';
import { useHabits } from '@/src/context/HabitsContext';
import { useMemo, useState } from 'react';
import TimeChart from '@/src/components/charts/TimeChart';
import StreakChart from '@/src/components/charts/StreakChart';
import CompletionRateChart from '@/src/components/charts/CompletionRateChart';

export default function StatsScreen() {
  const { t } = useTranslation();
  const { habits } = useHabits();
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');

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

  // Выбранная привычка для графиков
  const selectedHabit = useMemo(() => {
    if (!selectedHabitId) return habits[0] || null;
    return habits.find(h => h.id === selectedHabitId) || habits[0] || null;
  }, [selectedHabitId, habits]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('stats.title')}</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Карточки со статистикой */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalHabits}</Text>
            <Text style={styles.statLabel}>{t('stats.totalHabits')}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.completedToday}</Text>
            <Text style={styles.statLabel}>{t('stats.completedToday')}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalStreak}</Text>
            <Text style={styles.statLabel}>{t('stats.averageStreak')}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.maxStreak}</Text>
            <Text style={styles.statLabel}>{t('stats.bestStreak')}</Text>
          </View>
        </View>

        {/* Прогресс за сегодня */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.today')}</Text>
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
                  <Text style={styles.topHabitStreak}>🔥 {t('habits.days', { count: habit.currentStreak })}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Графики */}
        {habits.length > 0 && selectedHabit && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('stats.completionRate')}</Text>

            {/* Выбор привычки */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.habitSelector}
            >
              {habits.map((habit) => (
                <TouchableOpacity
                  key={habit.id}
                  style={[
                    styles.habitSelectorItem,
                    selectedHabit.id === habit.id && styles.habitSelectorItemActive
                  ]}
                  onPress={() => setSelectedHabitId(habit.id)}
                >
                  <Text style={styles.habitSelectorIcon}>{habit.icon}</Text>
                  <Text style={[
                    styles.habitSelectorText,
                    selectedHabit.id === habit.id && styles.habitSelectorTextActive
                  ]}>
                    {habit.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Выбор периода */}
            <View style={styles.periodSelector}>
              {(['week', 'month', 'year'] as const).map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.periodButton,
                    period === p && styles.periodButtonActive
                  ]}
                  onPress={() => setPeriod(p)}
                >
                  <Text style={[
                    styles.periodButtonText,
                    period === p && styles.periodButtonTextActive
                  ]}>
                    {p === 'week' ? t('stats.lastWeek') : p === 'month' ? t('stats.lastMonth') : t('stats.allTime')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* График процента выполнения */}
            <CompletionRateChart
              completionHistory={selectedHabit.completionHistory}
              habitName={selectedHabit.name}
              period={period}
            />

            {/* График динамики streak */}
            <StreakChart
              completionHistory={selectedHabit.completionHistory}
              habitName={selectedHabit.name}
            />

            {/* График времени выполнения */}
            <TimeChart
              completionHistory={selectedHabit.completionHistory}
              habitName={selectedHabit.name}
            />
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
  habitSelector: {
    marginBottom: Sizes.spacing.md,
  },
  habitSelectorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Sizes.spacing.md,
    paddingVertical: Sizes.spacing.sm,
    borderRadius: Sizes.borderRadius.lg,
    marginRight: Sizes.spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  habitSelectorItemActive: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary,
  },
  habitSelectorIcon: {
    fontSize: 24,
    marginRight: Sizes.spacing.xs,
  },
  habitSelectorText: {
    fontSize: Sizes.fontSize.md,
    color: Colors.text,
    fontWeight: '500',
  },
  habitSelectorTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Sizes.borderRadius.lg,
    padding: 4,
    marginBottom: Sizes.spacing.md,
  },
  periodButton: {
    flex: 1,
    paddingVertical: Sizes.spacing.sm,
    paddingHorizontal: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.md,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: Colors.primary,
  },
  periodButtonText: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
});
