// src/components/charts/CompletionRateChart.js
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit';
import { Colors } from '@/src/constants/Colors';

const screenWidth = Dimensions.get('window').width;

const CompletionRateChart = ({ completionHistory, habitName = 'Привычка', period = 'week' }) => {
  // Обработка данных: вычисляем процент выполнения за период
  const chartData = useMemo(() => {
    if (!completionHistory || Object.keys(completionHistory).length === 0) {
      return null;
    }

    const today = new Date();
    const dates = Object.keys(completionHistory).sort();

    // Определяем период
    let daysToAnalyze = 7; // по умолчанию неделя
    if (period === 'month') daysToAnalyze = 30;
    if (period === 'year') daysToAnalyze = 365;

    // Получаем даты за период
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - daysToAnalyze);

    const recentDates = dates.filter(date => {
      const d = new Date(date);
      return d >= startDate && d <= today;
    });

    // Вычисляем процент выполнения
    const totalDays = recentDates.length;
    if (totalDays === 0) return null;

    const completedDays = recentDates.filter(
      date => completionHistory[date].completed
    ).length;

    const completionRate = completedDays / totalDays;

    // Дополнительная статистика
    const missedDays = totalDays - completedDays;

    return {
      rate: completionRate,
      completed: completedDays,
      total: totalDays,
      missed: missedDays,
    };
  }, [completionHistory, period]);

  if (!chartData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Недостаточно данных для графика</Text>
        <Text style={styles.emptySubtext}>
          Выполняйте привычку, чтобы увидеть статистику
        </Text>
      </View>
    );
  }

  const periodName = {
    week: 'неделю',
    month: 'месяц',
    year: 'год',
  }[period];

  const percentage = Math.round(chartData.rate * 100);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Процент выполнения: {habitName}</Text>
      <Text style={styles.subtitle}>За {periodName}</Text>

      <View style={styles.chartContainer}>
        <ProgressChart
          data={{
            labels: ['Выполнено'],
            data: [chartData.rate],
          }}
          width={screenWidth - 80}
          height={200}
          strokeWidth={16}
          radius={70}
          chartConfig={{
            backgroundColor: Colors.white,
            backgroundGradientFrom: Colors.white,
            backgroundGradientTo: Colors.white,
            decimalPlaces: 2,
            color: (opacity = 1) => {
              // Цвет зависит от процента
              if (chartData.rate >= 0.8) return `rgba(34, 197, 94, ${opacity})`; // Зеленый
              if (chartData.rate >= 0.5) return `rgba(251, 191, 36, ${opacity})`; // Желтый
              return `rgba(239, 68, 68, ${opacity})`; // Красный
            },
            labelColor: (opacity = 1) => Colors.text,
          }}
          hideLegend={true}
          style={styles.chart}
        />

        <View style={styles.percentageContainer}>
          <Text style={[
            styles.percentageText,
            { color: percentage >= 80 ? Colors.success : percentage >= 50 ? '#FBB936' : Colors.error }
          ]}>
            {percentage}%
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{chartData.completed}</Text>
          <Text style={styles.statLabel}>Выполнено</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{chartData.missed}</Text>
          <Text style={styles.statLabel}>Пропущено</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{chartData.total}</Text>
          <Text style={styles.statLabel}>Всего дней</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  chart: {
    borderRadius: 16,
  },
  percentageContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  emptyContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 32,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default CompletionRateChart;
