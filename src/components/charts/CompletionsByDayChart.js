// src/components/charts/CompletionsByDayChart.js
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/src/constants/Colors';

const CHART_COLOR = Colors.primary;

const CompletionsByDayChart = ({ completionHistory }) => {
  const { t } = useTranslation();

  // Short day keys in order: Monday to Sunday
  const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  const chartData = useMemo(() => {
    if (!completionHistory || Object.keys(completionHistory).length === 0) {
      return null;
    }

    // Count completions by day of week (0 = Sunday, 1 = Monday, ...)
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];

    Object.entries(completionHistory).forEach(([date, entry]) => {
      if (entry.completed) {
        const dayOfWeek = new Date(date).getDay();
        dayCounts[dayOfWeek]++;
      }
    });

    // Reorder to start from Monday: Mon, Tue, Wed, Thu, Fri, Sat, Sun
    const reorderedCounts = [
      dayCounts[1], // Monday
      dayCounts[2], // Tuesday
      dayCounts[3], // Wednesday
      dayCounts[4], // Thursday
      dayCounts[5], // Friday
      dayCounts[6], // Saturday
      dayCounts[0], // Sunday
    ];

    const maxCount = Math.max(...reorderedCounts, 1);

    return {
      counts: reorderedCounts,
      maxCount,
    };
  }, [completionHistory]);

  if (!chartData) {
    return null;
  }

  const barWidth = 14;
  const chartHeight = 80;

  return (
    <View style={styles.container}>
      <View style={styles.barsContainer}>
        {chartData.counts.map((count, index) => {
          const barHeight = chartData.maxCount > 0
            ? (count / chartData.maxCount) * chartHeight
            : 0;
          return (
            <View key={index} style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  {
                    width: barWidth,
                    height: Math.max(barHeight, 2),
                    backgroundColor: count > 0 ? CHART_COLOR : Colors.border,
                  },
                ]}
              />
              <Text style={styles.dayLabel}>{t(`days.${dayKeys[index]}`)}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    borderRadius: 3,
  },
  dayLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});

export default CompletionsByDayChart;
