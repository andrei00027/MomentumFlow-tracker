import { useState, useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Sizes } from '@/src/constants';
import { useHabits } from '@/src/context/HabitsContext';
import { HabitList } from '@/src/components/habits/HabitList';
import { CreateHabitModal } from '@/src/components/habits/CreateHabitModal';
import { EditHabitModal } from '@/src/components/habits/EditHabitModal';
import { HabitActionSheet } from '@/src/components/habits/HabitActionSheet';

export default function HomeScreen() {
  const { habits, completeHabit, uncompleteHabit, isCompletedToday, addHabit, updateHabit, deleteHabit, reloadHabits } = useHabits();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<any>(null);

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
    addHabit(habitData);
    setCreateModalVisible(false);
  };

  const handleLongPress = (habit: any) => {
    setSelectedHabit(habit);
    setActionSheetVisible(true);
  };

  const handleEdit = (habit: any) => {
    setSelectedHabit(habit);
    setEditModalVisible(true);
  };

  const handleUpdateHabit = (updates: any) => {
    if (selectedHabit) {
      updateHabit(selectedHabit.id, updates);
      setEditModalVisible(false);
      setSelectedHabit(null);
    }
  };

  const handleDelete = (id: string) => {
    deleteHabit(id);
    setSelectedHabit(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Мои привычки</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setCreateModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {habits.length > 0 && (
        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {progress.completed} из {progress.total} выполнено
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
    fontWeight: 'bold',
    color: Colors.text,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
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
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: Sizes.fontSize.lg,
    color: Colors.primary,
    fontWeight: 'bold',
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
