import { useState, useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { Colors, Sizes } from '@/src/constants';
import { useHabits } from '@/src/context/HabitsContext';
import { HabitList } from '@/src/components/habits/HabitList';
import { CreateHabitModal } from '@/src/components/habits/CreateHabitModal';
import { EditHabitModal } from '@/src/components/habits/EditHabitModal';
import { HabitActionSheet } from '@/src/components/habits/HabitActionSheet';
import { LoadingSpinner } from '@/src/components/common/LoadingSpinner';
import { Toast } from '@/src/components/common/Toast';
import { useToast } from '@/src/hooks/useToast';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { habits, completeHabit, uncompleteHabit, isCompletedToday, addHabit, updateHabit, deleteHabit, reloadHabits, isLoaded } = useHabits();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<any>(null);
  const { toast, hideToast, showSuccess, showError } = useToast();

  // Подсчет прогресса
  const progress = useMemo(() => {
    const total = habits.length;
    const completed = habits.filter((h: any) => isCompletedToday(h.id)).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }, [habits, isCompletedToday]);

  const handleRefresh = async () => {
    await reloadHabits();
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
    } catch (error) {
      showError(t('errors.storage'));
    }
  };

  const handleLongPress = (habit: any) => {
    setSelectedHabit(habit);
    setActionSheetVisible(true);
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
      } catch (error) {
        showError(t('errors.storage'));
      }
    }
  };

  const handleDelete = (id: string) => {
    try {
      deleteHabit(id);
      setSelectedHabit(null);
      showSuccess(t('habits.deleteSuccess'));
    } catch (error) {
      showError(t('errors.storage'));
    }
  };

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

      {habits.length > 0 && (
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
      )}

      <View style={styles.content}>
        <HabitList
          habits={habits}
          onComplete={handleComplete}
          isCompletedToday={isCompletedToday}
          onLongPress={handleLongPress}
          onRefresh={handleRefresh}
        />
      </View>

      <CreateHabitModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSubmit={handleAddHabit}
      />

      <EditHabitModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSubmit={handleUpdateHabit}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    color: Colors.text,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: Sizes.borderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Sizes.shadow.lg,
  },
  addButtonText: {
    fontSize: 28,
    color: Colors.surface,
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
    color: Colors.text,
    fontWeight: Sizes.fontWeight.semibold,
  },
  progressPercentage: {
    fontSize: Sizes.fontSize.lg,
    color: Colors.primary,
    fontWeight: Sizes.fontWeight.bold,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: Colors.surface,
    borderRadius: Sizes.borderRadius.md,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: Sizes.borderRadius.md,
  },
  content: {
    flex: 1,
  },
});
