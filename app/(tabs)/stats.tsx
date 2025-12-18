import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Colors, Sizes } from '@/src/constants';
import { useHabits } from '@/src/context/HabitsContext';
import { useMemo, useState } from 'react';
import DynamicsChart from '@/src/components/charts/DynamicsChart';
import TimeChart from '@/src/components/charts/TimeChart';
import CompletionsByDayChart from '@/src/components/charts/CompletionsByDayChart';
import { HabitIcon } from '@/src/components/common/HabitIcon';

const CHART_COLOR = Colors.primary;

export default function StatsScreen() {
  const { t } = useTranslation();
  const { habits } = useHabits();
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

  // Selected habit for charts
  const selectedHabit = useMemo(() => {
    if (!selectedHabitId) return habits[0] || null;
    return habits.find((h: any) => h.id === selectedHabitId) || habits[0] || null;
  }, [selectedHabitId, habits]);

  // Stats for selected habit
  const habitStats = useMemo(() => {
    if (!selectedHabit || !selectedHabit.completionHistory) {
      return {
        bestStreak: 0,
        allTimeRate: 0,
        totalCompletions: 0,
        startDate: null,
        totalDays: 0,
      };
    }

    const history = selectedHabit.completionHistory;
    const dates = Object.keys(history).sort();

    // Total completions
    const totalCompletions = Object.values(history).filter(
      (entry: any) => entry.completed
    ).length;

    // All-time completion rate
    const totalDays = dates.length;
    const allTimeRate = totalDays > 0
      ? Math.round((totalCompletions / totalDays) * 1000) / 10
      : 0;

    // Best streak (use from habit or calculate)
    const bestStreak = selectedHabit.bestStreak || 0;

    // Start date
    const startDate = dates.length > 0 ? new Date(dates[0]) : null;

    return {
      bestStreak,
      allTimeRate,
      totalCompletions,
      startDate,
      totalDays,
    };
  }, [selectedHabit]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('stats.title')}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {habits.length > 0 && selectedHabit ? (
          <>
            {/* Habit selector grid */}
            <View style={styles.habitSelectorGrid}>
              {habits.map((habit: any) => (
                <TouchableOpacity
                  key={habit.id}
                  style={[
                    styles.habitSelectorItem,
                    selectedHabit.id === habit.id && styles.habitSelectorItemActive
                  ]}
                  onPress={() => setSelectedHabitId(habit.id)}
                >
                  <HabitIcon
                    name={habit.icon}
                    size={20}
                    color={selectedHabit.id === habit.id ? CHART_COLOR : Colors.textSecondary}
                  />
                  <Text style={[
                    styles.habitSelectorText,
                    selectedHabit.id === habit.id && styles.habitSelectorTextActive
                  ]} numberOfLines={1}>
                    {habit.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Top stats row - 3 big numbers */}
            <View style={styles.topStatsRow}>
              <View style={styles.topStatItem}>
                <Text style={styles.topStatValue}>{habitStats.bestStreak}</Text>
                <Text style={styles.topStatLabel}>{t('stats.bestStreak').toUpperCase()}</Text>
              </View>

              <View style={styles.topStatItem}>
                <Text style={styles.topStatValue}>{habitStats.allTimeRate}%</Text>
                <Text style={styles.topStatLabel}>{t('stats.allTime').toUpperCase()}</Text>
              </View>

              <View style={styles.topStatItem}>
                <Text style={styles.topStatValue}>{habitStats.totalCompletions}</Text>
                <Text style={styles.topStatLabel}>{t('stats.completions').toUpperCase()}</Text>
              </View>
            </View>

            {/* Dynamics line chart */}
            <DynamicsChart
              completionHistory={selectedHabit.completionHistory}
            />

            {/* Completions section */}
            <View style={styles.completionsSection}>
              <View style={styles.completionsCharts}>
                {/* Bar chart - completions by day of week */}
                <CompletionsByDayChart
                  completionHistory={selectedHabit.completionHistory}
                />
                {/* Line chart - completions by time of day */}
                <TimeChart
                  completionHistory={selectedHabit.completionHistory}
                />
              </View>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>{t('stats.noData')}</Text>
            <Text style={styles.emptyStateSubtitle}>{t('stats.startTracking')}</Text>
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
    paddingHorizontal: Sizes.spacing.md,
  },
  habitSelectorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Sizes.spacing.lg,
    justifyContent: 'space-between',
    rowGap: Sizes.spacing.sm,
  },
  habitSelectorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Sizes.spacing.md,
    paddingVertical: Sizes.spacing.sm,
    borderRadius: Sizes.borderRadius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: Sizes.spacing.xs,
    width: '48%',
  },
  habitSelectorItemActive: {
    backgroundColor: CHART_COLOR + '15',
    borderColor: CHART_COLOR,
  },
  habitSelectorText: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.text,
    fontWeight: '500',
    maxWidth: 100,
  },
  habitSelectorTextActive: {
    color: CHART_COLOR,
    fontWeight: '700',
  },
  topStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Sizes.spacing.lg,
    paddingVertical: Sizes.spacing.md,
  },
  topStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  topStatValue: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: 4,
  },
  topStatLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  completionsSection: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Sizes.spacing.md,
    marginBottom: Sizes.spacing.lg,
  },
  completionsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: Sizes.spacing.md,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  completionsCharts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    minHeight: 100,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyStateTitle: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Sizes.spacing.sm,
  },
  emptyStateSubtitle: {
    fontSize: Sizes.fontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
