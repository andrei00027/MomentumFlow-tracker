// src/components/charts/StreakChart.js
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Colors } from '@/src/constants/Colors';

const screenWidth = Dimensions.get('window').width;

const StreakChart = ({ completionHistory, habitName = 'Привычка' }) => {
  // Обработка данных: показываем динамику streak за последние 30 дней
  const chartData = useMemo(() => {
    if (!completionHistory || Object.keys(completionHistory).length === 0) {
      return null;
    }

    // Получаем все даты и сортируем их
    const dates = Object.keys(completionHistory).sort();

    if (dates.length === 0) {
      return null;
    }

    // Берем последние 30 дней (или меньше, если данных меньше)
    const recentDates = dates.slice(-30);

    // Вычисляем streak для каждой точки
    const streakData = [];
    const labels = [];

    let currentStreak = 0;

    recentDates.forEach((date, index) => {
      const entry = completionHistory[date];

      if (entry.completed) {
        currentStreak++;
      } else {
        currentStreak = 0;
      }

      streakData.push(currentStreak);

      // Показываем метки только для некоторых точек, чтобы не перегружать
      const dateObj = new Date(date);
      const day = dateObj.getDate();
      const month = dateObj.getMonth() + 1;

      if (index === 0 || index === recentDates.length - 1 || index % 7 === 0) {
        labels.push(`${day}/${month}`);
      } else {
        labels.push('');
      }
    });

    return {
      labels,
      datasets: [
        {
          data: streakData,
          color: (opacity = 1) => Colors.primary,
          strokeWidth: 3,
        },
      ],
    };
  }, [completionHistory]);

  if (!chartData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Недостаточно данных для графика</Text>
        <Text style={styles.emptySubtext}>
          Выполняйте привычку регулярно, чтобы увидеть динамику streak
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Динамика streak: {habitName}</Text>
      <Text style={styles.subtitle}>История последовательности за 30 дней</Text>

      <LineChart
        data={chartData}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundColor: Colors.background,
          backgroundGradientFrom: Colors.white,
          backgroundGradientTo: Colors.white,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
          labelColor: (opacity = 1) => Colors.text,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: Colors.primary,
          },
          propsForLabels: {
            fontSize: 10,
          },
        }}
        bezier
        style={styles.chart}
        withDots={true}
        withInnerLines={true}
        withOuterLines={true}
        withVerticalLines={false}
        withHorizontalLines={true}
        segments={4}
      />
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
  chart: {
    marginVertical: 8,
    borderRadius: 16,
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

export default StreakChart;
