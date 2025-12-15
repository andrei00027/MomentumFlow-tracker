// src/components/common/Toast.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Sizes } from '@/src/constants';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  visible,
  onHide,
  duration = 3000
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      // Показать toast
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      // Автоматически скрыть через duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      hideToast();
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  if (!visible && fadeAnim._value === 0) {
    return null;
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return Colors.success;
      case 'error':
        return Colors.error;
      default:
        return Colors.primary;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      default:
        return 'ℹ';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.icon}>{getIcon()}</Text>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: Sizes.spacing.md,
    right: Sizes.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.lg,
    zIndex: 9999,
    ...Sizes.shadow.lg,
  },
  icon: {
    fontSize: 20,
    color: Colors.surface,
    marginRight: Sizes.spacing.sm,
    fontWeight: Sizes.fontWeight.bold,
  },
  message: {
    flex: 1,
    fontSize: Sizes.fontSize.md,
    fontWeight: Sizes.fontWeight.medium,
    color: Colors.surface,
  },
});
