// src/context/HabitsContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { AsyncStorageService } from '@/src/services/storage/AsyncStorageService';

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

  // Загрузить привычки при запуске
  useEffect(() => {
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
  const addHabit = (habit) => {
    const newHabit = {
      id: Date.now().toString(),
      ...habit,
      currentStreak: 0,
      bestStreak: 0,
      completionHistory: {},
      createdAt: new Date().toISOString(),
    };
    setHabits([...habits, newHabit]);
  };

  // Обновить привычку
  const updateHabit = (id, updates) => {
    setHabits(habits.map(habit =>
      habit.id === id ? { ...habit, ...updates } : habit
    ));
  };

  // Удалить привычку
  const deleteHabit = (id) => {
    setHabits(habits.filter(habit => habit.id !== id));
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

  const value = {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    uncompleteHabit,
    isCompletedToday,
    reloadHabits,
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
