// src/components/charts/TimeChart.js
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Colors } from '@/src/constants/Colors';

const screenWidth = Dimensions.get('window').width;

const TimeChart = ({ completionHistory, habitName = 'Привычка' }) => {
  // Обработка данных: группировка по часам
  const chartData = useMemo(() => {
    if (!completionHistory || Object.keys(completionHistory).length === 0) {
      return null;
    }

    // Создаем массив из 24 часов (0-23)
    const hourCounts = Array(24).fill(0);

    // Подсчитываем выполнения по часам
    Object.values(completionHistory).forEach(entry => {
      if (entry.completed && entry.timestamp) {
        const hour = new Date(entry.timestamp).getHours();
        hourCounts[hour]++;
      }
    });

    // Формируем данные для графика (показываем только часы с активностью)
    const labels = [];
    const data = [];

    hourCounts.forEach((count, hour) => {
      if (count > 0) {
        labels.push(`${hour}:00`);
        data.push(count);
      }
    });

    // Если нет данных с временем выполнения
    if (data.length === 0) {
      return null;
    }

    return {
      labels,
      datasets: [
        {
          data,
        },
      ],
    };
  }, [completionHistory]);

  if (!chartData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Недостаточно данных для графика</Text>
        <Text style={styles.emptySubtext}>
          Выполняйте привычку, чтобы увидеть статистику по времени
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Время выполнения: {habitName}</Text>
      <Text style={styles.subtitle}>Количество выполнений по часам</Text>

      <BarChart
        data={chartData}
        width={screenWidth - 40}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: Colors.background,
          backgroundGradientFrom: Colors.primary,
          backgroundGradientTo: Colors.secondary,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForLabels: {
            fontSize: 10,
          },
          propsForBackgroundLines: {
            strokeDasharray: '',
            strokeWidth: 1,
            stroke: 'rgba(255,255,255,0.1)',
          },
        }}
        style={styles.chart}
        fromZero
        showBarTops={false}
        withInnerLines={true}
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

export default TimeChart;
