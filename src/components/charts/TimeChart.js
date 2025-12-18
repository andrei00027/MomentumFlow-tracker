// src/components/charts/TimeChart.js
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/src/constants/Colors';
import Svg, { Path, Circle, Text as SvgText } from 'react-native-svg';

const CHART_COLOR = Colors.primary;

const TimeChart = ({ completionHistory }) => {
  const { t } = useTranslation();

  const chartData = useMemo(() => {
    if (!completionHistory || Object.keys(completionHistory).length === 0) {
      return null;
    }

    // Count completions by hour (0-23)
    const hourCounts = Array(24).fill(0);
    let hasTimeData = false;

    Object.values(completionHistory).forEach(entry => {
      if (entry.completed && entry.timestamp) {
        const hour = new Date(entry.timestamp).getHours();
        hourCounts[hour]++;
        hasTimeData = true;
      }
    });

    if (!hasTimeData) return null;

    const maxCount = Math.max(...hourCounts, 1);

    return {
      hourCounts,
      maxCount,
    };
  }, [completionHistory]);

  if (!chartData) {
    return null;
  }

  const chartWidth = 140;
  const chartHeight = 70;
  const padding = 10;

  // Create smooth curve path
  const createPath = () => {
    const points = chartData.hourCounts.map((count, hour) => {
      const x = padding + (hour / 23) * (chartWidth - 2 * padding);
      const y = chartHeight - padding - (count / chartData.maxCount) * (chartHeight - 2 * padding);
      return { x, y, count };
    });

    if (points.length < 2) return '';

    // Create smooth bezier curve
    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const midX = (current.x + next.x) / 2;

      path += ` Q ${current.x} ${current.y} ${midX} ${(current.y + next.y) / 2}`;
    }

    const lastPoint = points[points.length - 1];
    path += ` L ${lastPoint.x} ${lastPoint.y}`;

    return path;
  };

  // Find peak hours for dots
  const peakHours = chartData.hourCounts
    .map((count, hour) => ({ count, hour }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .filter(p => p.count > 0);

  return (
    <View style={styles.container}>
      <Svg width={chartWidth} height={chartHeight + 20}>
        <Path
          d={createPath()}
          fill="none"
          stroke={CHART_COLOR}
          strokeWidth={2}
        />
        {peakHours.map((peak, index) => {
          const x = padding + (peak.hour / 23) * (chartWidth - 2 * padding);
          const y = chartHeight - padding - (peak.count / chartData.maxCount) * (chartHeight - 2 * padding);
          return (
            <Circle
              key={index}
              cx={x}
              cy={y}
              r={3}
              fill={CHART_COLOR}
            />
          );
        })}
        {/* Time labels */}
        <SvgText
          x={padding + (6 / 23) * (chartWidth - 2 * padding)}
          y={chartHeight + 14}
          fontSize={10}
          fill={Colors.textSecondary}
          textAnchor="middle"
          fontWeight="700"
        >
          6 AM
        </SvgText>
        <SvgText
          x={padding + (18 / 23) * (chartWidth - 2 * padding)}
          y={chartHeight + 14}
          fontSize={10}
          fill={Colors.textSecondary}
          textAnchor="middle"
          fontWeight="700"
        >
          6 PM
        </SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TimeChart;
