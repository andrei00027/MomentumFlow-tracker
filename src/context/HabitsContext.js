// src/context/HabitsContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { AsyncStorageService } from '@/src/services/storage/AsyncStorageService';
import NotificationService from '@/src/services/notifications/NotificationService';
import CloudStorageService from '@/src/services/storage/CloudStorageService';
import AppleHealthService from '@/src/services/health/AppleHealthService';

const HabitsContext = createContext();

// Моковые данные для тестирования
const mockHabits = [
  {
    id: '1',
    name: 'Утренняя медитация',
    icon: '🧘',
    type: 'binary',
    currentStreak: 5,
    bestStreak: 12,
    completionHistory: {},
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Выпить 8 стаканов воды',
    icon: '💧',
    type: 'counter',
    targetValue: 8,
    unit: 'стаканов',
    currentStreak: 3,
    bestStreak: 7,
    completionHistory: {},
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Тренировка',
    icon: '💪',
    type: 'binary',
    currentStreak: 2,
    bestStreak: 15,
    completionHistory: {},
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Чтение книги',
    icon: '📚',
    type: 'binary',
    currentStreak: 8,
    bestStreak: 20,
    completionHistory: {},
    createdAt: new Date().toISOString(),
  },
];

export const HabitsProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Запросить разрешения на уведомления и HealthKit при запуске
  useEffect(() => {
    const initServices = async () => {
      try {
        // Инициализация уведомлений
        await NotificationService.requestPermissions();
      } catch (error) {
        console.log('Notifications not supported on this device:', error.message);
      }

      try {
        // Инициализация HealthKit
        const healthInitialized = await AppleHealthService.initialize();
        if (healthInitialized) {
          console.log('Apple Health initialized successfully');
        }
      } catch (error) {
        console.log('Apple Health not available:', error.message);
      }
    };

    initServices();
    loadHabitsFromStorage();
  }, []);

  // Сохранять привычки при каждом изменении
  useEffect(() => {
    if (isLoaded) {
      AsyncStorageService.saveHabits(habits);
    }
  }, [habits, isLoaded]);

  const loadHabitsFromStorage = async () => {
    const loadedHabits = await AsyncStorageService.loadHabits();
    // Если нет сохраненных привычек, используем моковые данные
    setHabits(loadedHabits.length > 0 ? loadedHabits : mockHabits);
    setIsLoaded(true);
  };

  // Добавить новую привычку
  const addHabit = async (habit) => {
    const newHabit = {
      id: Date.now().toString(),
      ...habit,
      currentStreak: 0,
      bestStreak: 0,
      completionHistory: {},
      createdAt: new Date().toISOString(),
    };

    // Если включены напоминания, запланировать уведомление
    if (habit.reminderEnabled && habit.reminderTime) {
      try {
        const reminderDate = new Date(habit.reminderTime);
        const notificationId = await NotificationService.scheduleHabitReminder(
          newHabit.id,
          newHabit.name,
          newHabit.icon,
          reminderDate.getHours(),
          reminderDate.getMinutes()
        );
        newHabit.notificationId = notificationId;
      } catch (error) {
        console.error('Failed to schedule notification:', error);
      }
    }

    setHabits([...habits, newHabit]);
  };

  // Обновить привычку
  const updateHabit = async (id, updates) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    // Если изменились настройки напоминаний
    if ('reminderEnabled' in updates || 'reminderTime' in updates) {
      // Отменить старое уведомление, если было
      if (habit.notificationId) {
        await NotificationService.cancelNotification(habit.notificationId);
      }

      // Если напоминания включены, создать новое уведомление
      if (updates.reminderEnabled && updates.reminderTime) {
        try {
          const reminderDate = new Date(updates.reminderTime);
          const notificationId = await NotificationService.scheduleHabitReminder(
            id,
            updates.name || habit.name,
            updates.icon || habit.icon,
            reminderDate.getHours(),
            reminderDate.getMinutes()
          );
          updates.notificationId = notificationId;
        } catch (error) {
          console.error('Failed to schedule notification:', error);
        }
      } else {
        updates.notificationId = null;
      }
    }

    setHabits(habits.map(h =>
      h.id === id ? { ...h, ...updates } : h
    ));
  };

  // Удалить привычку
  const deleteHabit = async (id) => {
    const habit = habits.find(h => h.id === id);

    // Отменить уведомление, если было запланировано
    if (habit?.notificationId) {
      await NotificationService.cancelNotification(habit.notificationId);
    }

    setHabits(habits.filter(h => h.id !== id));
  };

  // Отметить выполнение привычки
  const completeHabit = (id) => {
    const today = new Date().toISOString().split('T')[0];

    setHabits(habits.map(habit => {
      if (habit.id !== id) return habit;

      const newHistory = {
        ...habit.completionHistory,
        [today]: {
          completed: true,
          timestamp: new Date().toISOString(),
        }
      };

      // Пересчитать streak (упрощенная версия)
      const newStreak = habit.currentStreak + 1;
      const newBestStreak = Math.max(newStreak, habit.bestStreak);

      return {
        ...habit,
        completionHistory: newHistory,
        currentStreak: newStreak,
        bestStreak: newBestStreak,
      };
    }));
  };

  // Отменить выполнение привычки
  const uncompleteHabit = (id) => {
    const today = new Date().toISOString().split('T')[0];

    setHabits(habits.map(habit => {
      if (habit.id !== id) return habit;

      const newHistory = { ...habit.completionHistory };
      delete newHistory[today];

      return {
        ...habit,
        completionHistory: newHistory,
        currentStreak: Math.max(0, habit.currentStreak - 1),
      };
    }));
  };

  // Проверить выполнена ли привычка сегодня
  const isCompletedToday = (id) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return false;

    const today = new Date().toISOString().split('T')[0];
    return habit.completionHistory[today]?.completed || false;
  };

  // Перезагрузить привычки (полезно после очистки данных)
  const reloadHabits = async () => {
    setIsLoaded(false);
    setHabits([]); // Сначала очистить текущие привычки
    await loadHabitsFromStorage();
  };

  // Проверить и автоматически отметить привычки на основе Apple Health
  const checkHealthKitGoals = async () => {
    if (!AppleHealthService.isAvailable) {
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const updated = [];

    for (const habit of habits) {
      // Пропустить привычки, которые уже выполнены сегодня
      if (habit.completionHistory[today]?.completed) {
        continue;
      }

      // Проверить привычки с интеграцией Apple Health
      if (habit.healthKitEnabled && habit.healthKitMetric) {
        try {
          const { achieved, currentValue } = await AppleHealthService.checkGoalAchievement(
            habit.healthKitMetric,
            habit.targetValue || 1
          );

          if (achieved) {
            // Автоматически отметить привычку как выполненную
            updated.push({
              id: habit.id,
              name: habit.name,
              value: currentValue,
            });
            completeHabit(habit.id);
          }
        } catch (error) {
          console.error(`Error checking HealthKit goal for ${habit.name}:`, error);
        }
      }
    }

    return updated;
  };

  // Синхронизировать с iCloud
  const syncWithCloud = async () => {
    try {
      setIsSyncing(true);

      // Проверить доступность облака
      const availabilityStatus = await CloudStorageService.isAvailable();
      if (!availabilityStatus.available) {
        console.log('Cloud storage not available:', availabilityStatus.error);
        return { success: false, error: availabilityStatus.error };
      }

      // Синхронизировать данные
      const mergedHabits = await CloudStorageService.sync(habits);

      // Обновить локальное состояние
      setHabits(mergedHabits);

      // Также сохранить в AsyncStorage
      await AsyncStorageService.saveHabits(mergedHabits);

      // Обновить время последней синхронизации
      const syncTime = await CloudStorageService.getLastSyncTime();
      setLastSyncTime(syncTime);

      return { success: true };
    } catch (error) {
      console.error('Error syncing with cloud:', error);
      return { success: false, error: error.message };
    } finally {
      setIsSyncing(false);
    }
  };

  const value = {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    uncompleteHabit,
    isCompletedToday,
    reloadHabits,
    syncWithCloud,
    isSyncing,
    isLoaded,
    lastSyncTime,
    checkHealthKitGoals,
  };

  return (
    <HabitsContext.Provider value={value}>
      {children}
    </HabitsContext.Provider>
  );
};

// Хук для использования контекста
export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error('useHabits должен использоваться внутри HabitsProvider');
  }
  return context;
};
