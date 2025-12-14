import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Sizes } from '@/src/constants';
import { useHabits } from '@/src/context/HabitsContext';
import { AsyncStorageService } from '@/src/services/storage/AsyncStorageService';
import { useMemo } from 'react';

export default function ProfileScreen() {
  const { habits, reloadHabits } = useHabits();

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
      'Очистить все данные?',
      'Это действие удалит все привычки и их историю. После очистки загрузятся примеры привычек.',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Очистить',
          style: 'destructive',
          onPress: async () => {
            try {
              // Сначала очистить AsyncStorage
              await AsyncStorageService.clearAll();
              // Затем перезагрузить привычки (загрузятся моковые данные)
              await reloadHabits();
              Alert.alert('Успешно', 'Все данные были очищены. Загружены примеры привычек.');
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось очистить данные');
            }
          },
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'MomentumFlow',
      'Версия: 1.0.0\n\nПриложение для отслеживания привычек и достижения целей.\n\n© 2024 MomentumFlow',
      [{ text: 'ОК' }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Профиль</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Аватар и имя */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
          <Text style={styles.username}>Пользователь</Text>
        </View>

        {/* Статистика пользователя */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Статистика</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{userStats.totalHabits}</Text>
              <Text style={styles.statLabel}>Привычек</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{userStats.totalCompletions}</Text>
              <Text style={styles.statLabel}>Выполнений</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{userStats.totalStreak}</Text>
              <Text style={styles.statLabel}>Общий стрик</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{userStats.bestStreak}</Text>
              <Text style={styles.statLabel}>Лучший стрик</Text>
            </View>
          </View>
        </View>

        {/* Настройки */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Настройки</Text>

          <TouchableOpacity style={styles.settingItem} onPress={handleAbout}>
            <Text style={styles.settingIcon}>ℹ️</Text>
            <Text style={styles.settingText}>О приложении</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleClearData}>
            <Text style={styles.settingIcon}>🗑️</Text>
            <Text style={[styles.settingText, styles.settingTextDanger]}>Очистить все данные</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Версия приложения */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>MomentumFlow v1.0.0</Text>
          <Text style={styles.footerSubtext}>Сделано с ❤️ для ваших привычек</Text>
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
