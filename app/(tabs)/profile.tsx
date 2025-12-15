import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Colors, Sizes } from '@/src/constants';
import { useHabits } from '@/src/context/HabitsContext';
import { useAuth } from '@/src/context/AuthContext';
import { AsyncStorageService } from '@/src/services/storage/AsyncStorageService';
import { useMemo } from 'react';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { habits, reloadHabits, syncWithCloud, isSyncing, lastSyncTime, checkHealthKitGoals } = useHabits();
  const { user, signOut } = useAuth();

  // Общая статистика пользователя
  const userStats = useMemo(() => {
    const totalHabits = habits.length;
    const totalStreak = habits.reduce((sum, h) => sum + h.currentStreak, 0);
    const bestStreak = Math.max(...habits.map(h => h.bestStreak), 0);

    // Подсчет общего количества выполнений
    let totalCompletions = 0;
    habits.forEach(habit => {
      totalCompletions += Object.keys(habit.completionHistory || {}).length;
    });

    return {
      totalHabits,
      totalStreak,
      bestStreak,
      totalCompletions,
    };
  }, [habits]);

  const handleClearData = () => {
    Alert.alert(
      t('profile.clearData'),
      t('profile.clearDataConfirm'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              // Сначала очистить AsyncStorage
              await AsyncStorageService.clearAll();
              // Затем перезагрузить привычки (загрузятся моковые данные)
              await reloadHabits();
              Alert.alert(t('common.success'), t('profile.clearDataSuccess'));
            } catch (error) {
              Alert.alert(t('common.error'), t('errors.storage'));
            }
          },
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'MomentumFlow',
      t('profile.aboutMessage'),
      [{ text: t('profile.ok') }]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      t('profile.signOut'),
      t('profile.signOutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.signOut'),
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert(t('common.error'), t('errors.generic'));
            }
          },
        },
      ]
    );
  };

  const handleSync = async () => {
    if (Platform.OS !== 'ios') {
      Alert.alert(t('profile.unavailableIOS'), t('profile.iCloudUnavailable'));
      return;
    }

    const result = await syncWithCloud();
    if (result.success) {
      Alert.alert(t('common.success'), t('profile.iCloudSyncSuccess'));
    } else {
      Alert.alert(
        t('profile.iCloudSyncError'),
        result.error || t('profile.iCloudSyncErrorMessage')
      );
    }
  };

  const handleCheckHealthGoals = async () => {
    if (Platform.OS !== 'ios') {
      Alert.alert(t('profile.unavailableIOS'), t('profile.healthUnavailable'));
      return;
    }

    try {
      const updated = await checkHealthKitGoals();
      if (updated && updated.length > 0) {
        const names = updated.map(h => `• ${h.name}`).join('\n');
        Alert.alert(
          t('profile.healthCheckTitle'),
          t('profile.healthCheckSuccess', { habits: names })
        );
      } else {
        Alert.alert(t('common.success'), t('profile.healthCheckNoData'));
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('profile.healthCheckError'));
    }
  };

  const formatSyncTime = (date: Date | null) => {
    if (!date) return t('profile.never');
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return t('profile.justNow');
    if (minutes < 60) return t('profile.minutesAgo', { count: minutes });
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return t('profile.hoursAgo', { count: hours });
    const days = Math.floor(hours / 24);
    return t('profile.daysAgo', { count: days });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('profile.title')}</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Аватар и имя */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
          <Text style={styles.username}>{user?.fullName || user?.email || t('profile.user')}</Text>
          {user?.email && <Text style={styles.userEmail}>{user.email}</Text>}
        </View>

        {/* Статистика пользователя */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.statistics')}</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{userStats.totalHabits}</Text>
              <Text style={styles.statLabel}>{t('profile.totalHabitsLabel')}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{userStats.totalCompletions}</Text>
              <Text style={styles.statLabel}>{t('profile.totalCompletionsLabel')}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{userStats.totalStreak}</Text>
              <Text style={styles.statLabel}>{t('profile.totalStreakLabel')}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{userStats.bestStreak}</Text>
              <Text style={styles.statLabel}>{t('profile.bestStreakLabel')}</Text>
            </View>
          </View>
        </View>

        {/* Настройки */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.settings')}</Text>

          {/* iCloud синхронизация */}
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleSync}
              disabled={isSyncing}
            >
              <Text style={styles.settingIcon}>☁️</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingText}>{t('profile.syncWithICloud')}</Text>
                <Text style={styles.settingSubtext}>
                  {t('profile.iCloudLastSync', { time: formatSyncTime(lastSyncTime) })}
                </Text>
              </View>
              {isSyncing ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Text style={styles.settingArrow}>›</Text>
              )}
            </TouchableOpacity>
          )}

          {/* Apple Health интеграция */}
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleCheckHealthGoals}
            >
              <Text style={styles.settingIcon}>❤️</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingText}>{t('profile.health')}</Text>
                <Text style={styles.settingSubtext}>
                  {t('profile.connectHealth')}
                </Text>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.settingItem} onPress={handleAbout}>
            <Text style={styles.settingIcon}>ℹ️</Text>
            <Text style={styles.settingText}>{t('profile.about')}</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleClearData}>
            <Text style={styles.settingIcon}>🗑️</Text>
            <Text style={[styles.settingText, styles.settingTextDanger]}>{t('profile.clearData')}</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleSignOut}>
            <Text style={styles.settingIcon}>🚪</Text>
            <Text style={[styles.settingText, styles.settingTextDanger]}>{t('profile.signOut')}</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Версия приложения */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('profile.version')}</Text>
          <Text style={styles.footerSubtext}>{t('profile.madeWithLove')}</Text>
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
  profileSection: {
    alignItems: 'center',
    paddingVertical: Sizes.spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Sizes.spacing.md,
  },
  avatarEmoji: {
    fontSize: 48,
  },
  username: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.text,
  },
  userEmail: {
    fontSize: Sizes.fontSize.md,
    color: Colors.textSecondary,
    marginTop: Sizes.spacing.xs,
  },
  section: {
    padding: Sizes.spacing.md,
  },
  sectionTitle: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Sizes.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizes.spacing.md,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surface,
    padding: Sizes.spacing.lg,
    borderRadius: Sizes.borderRadius.lg,
    alignItems: 'center',
  },
  statValue: {
    fontSize: Sizes.fontSize.xxxl,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Sizes.spacing.xs,
  },
  statLabel: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.lg,
    marginBottom: Sizes.spacing.sm,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: Sizes.spacing.md,
  },
  settingText: {
    flex: 1,
    fontSize: Sizes.fontSize.lg,
    color: Colors.text,
    fontWeight: '600',
  },
  settingTextDanger: {
    color: Colors.error,
  },
  settingSubtext: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Sizes.spacing.xs,
  },
  settingArrow: {
    fontSize: 24,
    color: Colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    padding: Sizes.spacing.xl,
  },
  footerText: {
    fontSize: Sizes.fontSize.md,
    color: Colors.textSecondary,
    marginBottom: Sizes.spacing.xs,
  },
  footerSubtext: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textDisabled,
  },
});
