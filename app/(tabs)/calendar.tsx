import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { Colors, Sizes } from '@/src/constants';
import { useHabits } from '@/src/context/HabitsContext';
import { useMemo } from 'react';

export default function CalendarScreen() {
  const { habits } = useHabits();

  // Подготовить marked dates для календаря
  const markedDates = useMemo(() => {
    const marked: any = {};

    habits.forEach(habit => {
      Object.keys(habit.completionHistory || {}).forEach(date => {
        if (habit.completionHistory[date].completed) {
          if (!marked[date]) {
            marked[date] = { dots: [] };
          }
          marked[date].dots.push({
            color: Colors.success,
          });
        }
      });
    });

    return marked;
  }, [habits]);

  // Подсчитать статистику за последний месяц
  const monthStats = useMemo(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    let completedDays = 0;
    const checkedDates = new Set();

    habits.forEach(habit => {
      Object.keys(habit.completionHistory || {}).forEach(dateStr => {
        const date = new Date(dateStr);
        if (date >= thirtyDaysAgo && date <= today && habit.completionHistory[dateStr].completed) {
          if (!checkedDates.has(dateStr)) {
            checkedDates.add(dateStr);
            completedDays++;
          }
        }
      });
    });

    return completedDays;
  }, [habits]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Календарь</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsCard}>
          <Text style={styles.statsLabel}>Активные дни за месяц</Text>
          <Text style={styles.statsValue}>{monthStats} дней</Text>
        </View>

        <View style={styles.calendarContainer}>
          <Calendar
            markedDates={markedDates}
            markingType="multi-dot"
            theme={{
              backgroundColor: Colors.background,
              calendarBackground: Colors.surface,
              textSectionTitleColor: Colors.textSecondary,
              selectedDayBackgroundColor: Colors.primary,
              selectedDayTextColor: Colors.surface,
              todayTextColor: Colors.primary,
              dayTextColor: Colors.text,
              textDisabledColor: Colors.textDisabled,
              dotColor: Colors.success,
              monthTextColor: Colors.text,
              textMonthFontWeight: 'bold',
              textMonthFontSize: Sizes.fontSize.xl,
              textDayFontSize: Sizes.fontSize.md,
              textDayHeaderFontSize: Sizes.fontSize.sm,
            }}
          />
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.success }]} />
            <Text style={styles.legendText}>Выполненная привычка</Text>
          </View>
        </View>
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
  statsCard: {
    backgroundColor: Colors.surface,
    margin: Sizes.spacing.md,
    padding: Sizes.spacing.lg,
    borderRadius: Sizes.borderRadius.lg,
    alignItems: 'center',
  },
  statsLabel: {
    fontSize: Sizes.fontSize.md,
    color: Colors.textSecondary,
    marginBottom: Sizes.spacing.xs,
  },
  statsValue: {
    fontSize: Sizes.fontSize.xxxl,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  calendarContainer: {
    backgroundColor: Colors.surface,
    margin: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.lg,
    padding: Sizes.spacing.sm,
    overflow: 'hidden',
  },
  legend: {
    margin: Sizes.spacing.md,
    padding: Sizes.spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Sizes.borderRadius.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Sizes.spacing.sm,
  },
  legendText: {
    fontSize: Sizes.fontSize.md,
    color: Colors.text,
  },
});
