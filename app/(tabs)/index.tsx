import { LoadingSpinner } from '@/src/components/common/LoadingSpinner';
import { Toast } from '@/src/components/common/Toast';
import { CreateHabitModal } from '@/src/components/habits/CreateHabitModal';
import { EditHabitModal } from '@/src/components/habits/EditHabitModal';
import { HabitActionSheet } from '@/src/components/habits/HabitActionSheet';
import { HabitCard } from '@/src/components/habits/HabitCard';
import { Sizes } from '@/src/constants';
import { useHabits } from '@/src/context/HabitsContext';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { useToast } from '@/src/hooks/useToast';
import * as Haptics from 'expo-haptics';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { habits, completeHabit, uncompleteHabit, isCompletedToday, isScheduledForToday, addHabit, updateHabit, deleteHabit, reloadHabits, isLoaded } = useHabits();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { toast, hideToast, showSuccess, showError } = useToast();

  // Привычки, запланированные на сегодня
  const todayHabits = useMemo(() => {
    return habits.filter((h: any) => isScheduledForToday(h));
  }, [habits, isScheduledForToday]);

  // Привычки на другие дни (не сегодня)
  const otherHabits = useMemo(() => {
    return habits.filter((h: any) => !isScheduledForToday(h));
  }, [habits, isScheduledForToday]);

  // Секции для SectionList
  const sections = useMemo(() => {
    const result = [];
    if (todayHabits.length > 0) {
      result.push({ title: t('home.today'), data: todayHabits, isToday: true });
    }
    if (otherHabits.length > 0) {
      result.push({ title: t('home.otherDays'), data: otherHabits, isToday: false });
    }
    return result;
  }, [todayHabits, otherHabits, t]);

  // Подсчет прогресса (только для запланированных привычек, без quit habits)
  const progress = useMemo(() => {
    // Исключаем вредные привычки из расчёта прогресса
    const regularHabits = todayHabits.filter((h: any) => !h.isQuitHabit);
    const total = regularHabits.length;
    const completed = regularHabits.filter((h: any) => isCompletedToday(h.id)).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }, [todayHabits, isCompletedToday]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await reloadHabits();
    setRefreshing(false);
  };

  const handleComplete = (id: string) => {
    if (isCompletedToday(id)) {
      uncompleteHabit(id);
    } else {
      completeHabit(id);
    }
  };

  const handleAddHabit = (habitData: any) => {
    try {
      addHabit(habitData);
      setCreateModalVisible(false);
      showSuccess(t('habits.saveSuccess'));
    } catch {
      showError(t('errors.storage'));
    }
  };

  const handleHabitPress = (habit: any) => {
    setSelectedHabit(habit);
    setEditModalVisible(true);
  };

  const handleEdit = (habit: any) => {
    setSelectedHabit(habit);
    setEditModalVisible(true);
  };

  const handleOpenCreateModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCreateModalVisible(true);
  };

  const handleUpdateHabit = (updates: any) => {
    if (selectedHabit) {
      try {
        updateHabit(selectedHabit.id, updates);
        setEditModalVisible(false);
        setSelectedHabit(null);
        showSuccess(t('habits.saveSuccess'));
      } catch {
        showError(t('errors.storage'));
      }
    }
  };

  const handleDelete = (id: string) => {
    try {
      deleteHabit(id);
      setSelectedHabit(null);
      showSuccess(t('habits.deleteSuccess'));
    } catch {
      showError(t('errors.storage'));
    }
  };

  const styles = createStyles(colors);

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <LoadingSpinner text={t('common.loading')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('home.title')}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleOpenCreateModal}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {habits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>{t('habits.emptyStateTitle')}</Text>
          <Text style={styles.emptyText}>{t('habits.emptyStateDescription')}</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item, index }: any) => (
            <HabitCard
              habit={item}
              index={index}
              onComplete={handleComplete}
              isCompleted={isCompletedToday(item.id)}
              onPress={handleHabitPress}
            />
          )}
          renderSectionHeader={({ section }: any) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
          )}
          ListHeaderComponent={
            todayHabits.length > 0 ? (
              <View style={styles.progressSection}>
                <View style={styles.progressInfo}>
                  <Text style={styles.progressText}>
                    {t('home.progress', { completed: progress.completed, total: progress.total })}
                  </Text>
                  <Text style={styles.progressPercentage}>{progress.percentage}%</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: `${progress.percentage}%` }]} />
                </View>
              </View>
            ) : null
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        />
      )}

      <CreateHabitModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSubmit={handleAddHabit}
      />

      <EditHabitModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSubmit={handleUpdateHabit}
        onDelete={handleDelete}
        habit={selectedHabit}
      />

      <HabitActionSheet
        visible={actionSheetVisible}
        onClose={() => setActionSheetVisible(false)}
        habit={selectedHabit}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Sizes.spacing.md,
    paddingVertical: Sizes.spacing.sm,
  },
  headerTitle: {
    fontSize: Sizes.fontSize.xxl,
    fontWeight: Sizes.fontWeight.bold,
    color: colors.text,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: Sizes.borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Sizes.shadow.lg,
  },
  addButtonText: {
    fontSize: 28,
    color: colors.surface,
    fontWeight: '300',
    marginTop: -2,
  },
  progressSection: {
    paddingHorizontal: Sizes.spacing.md,
    paddingBottom: Sizes.spacing.md,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.spacing.sm,
  },
  progressText: {
    fontSize: Sizes.fontSize.md,
    color: colors.text,
    fontWeight: Sizes.fontWeight.semibold,
  },
  progressPercentage: {
    fontSize: Sizes.fontSize.lg,
    color: colors.primary,
    fontWeight: Sizes.fontWeight.bold,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: colors.surface,
    borderRadius: Sizes.borderRadius.md,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: Sizes.borderRadius.md,
  },
  listContent: {
    padding: Sizes.spacing.md,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Sizes.spacing.sm,
    marginTop: Sizes.spacing.sm,
  },
  sectionTitle: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: Sizes.fontWeight.semibold,
    color: colors.text,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Sizes.spacing.xl,
  },
  emptyIcon: {
    fontSize: 72,
    marginBottom: Sizes.spacing.lg,
  },
  emptyTitle: {
    fontSize: Sizes.fontSize.xxl,
    fontWeight: Sizes.fontWeight.bold,
    color: colors.text,
    marginBottom: Sizes.spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: Sizes.fontSize.md,
    fontWeight: Sizes.fontWeight.medium,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
