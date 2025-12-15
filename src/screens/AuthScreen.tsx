// src/screens/AuthScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAuth } from '@/src/context/AuthContext';
import { Colors, Sizes } from '@/src/constants';

export default function AuthScreen() {
  const { signInWithApple } = useAuth();
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    if (Platform.OS === 'ios') {
      const available = await AppleAuthentication.isAvailableAsync();
      setIsAvailable(available);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithApple();
    } catch (error: any) {
      Alert.alert('Ошибка входа', error.message || 'Не удалось войти с Apple ID');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>📈</Text>
          <Text style={styles.title}>MomentumFlow</Text>
          <Text style={styles.subtitle}>Трекер привычек для iOS</Text>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>✨</Text>
            <Text style={styles.featureText}>Отслеживайте свои привычки</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📊</Text>
            <Text style={styles.featureText}>Анализируйте прогресс</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🔥</Text>
            <Text style={styles.featureText}>Набирайте импульс</Text>
          </View>
        </View>

        {isAvailable ? (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={Sizes.borderRadius.md}
            style={styles.appleButton}
            onPress={handleSignIn}
          />
        ) : (
          <View style={styles.notAvailable}>
            <Text style={styles.notAvailableText}>
              Apple Sign In недоступен на этом устройстве
            </Text>
            <Text style={styles.notAvailableSubtext}>
              {Platform.OS !== 'ios'
                ? 'Требуется iOS устройство'
                : 'Проверьте настройки Apple ID'}
            </Text>
          </View>
        )}

        <Text style={styles.footer}>
          Войдя, вы соглашаетесь с условиями использования и политикой
          конфиденциальности
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Sizes.spacing.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Sizes.spacing.xxl * 2,
  },
  logo: {
    fontSize: 80,
    marginBottom: Sizes.spacing.lg,
  },
  title: {
    fontSize: Sizes.fontSize.xxxl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Sizes.spacing.sm,
  },
  subtitle: {
    fontSize: Sizes.fontSize.lg,
    color: Colors.textSecondary,
  },
  features: {
    marginBottom: Sizes.spacing.xxl * 2,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.spacing.lg,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: Sizes.spacing.md,
  },
  featureText: {
    fontSize: Sizes.fontSize.lg,
    color: Colors.text,
  },
  appleButton: {
    width: '100%',
    height: 50,
    marginBottom: Sizes.spacing.lg,
  },
  notAvailable: {
    backgroundColor: Colors.surface,
    borderRadius: Sizes.borderRadius.md,
    padding: Sizes.spacing.lg,
    alignItems: 'center',
    marginBottom: Sizes.spacing.lg,
  },
  notAvailableText: {
    fontSize: Sizes.fontSize.md,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: Sizes.spacing.sm,
    textAlign: 'center',
  },
  notAvailableSubtext: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
