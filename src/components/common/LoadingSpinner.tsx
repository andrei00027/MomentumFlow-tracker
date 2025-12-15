// src/components/common/LoadingSpinner.tsx
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Sizes } from '@/src/constants';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  text?: string;
  style?: ViewStyle;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'large', text, style }) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={Colors.primary} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Sizes.spacing.lg,
  },
  text: {
    marginTop: Sizes.spacing.md,
    fontSize: Sizes.fontSize.md,
    color: Colors.textSecondary,
  },
});
