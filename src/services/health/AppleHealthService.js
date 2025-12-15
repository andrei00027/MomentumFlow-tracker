// src/services/health/AppleHealthService.js
import AppleHealthKit from 'react-native-health';
import { Platform } from 'react-native';

const PERMISSIONS = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      AppleHealthKit.Constants.Permissions.SleepAnalysis,
      AppleHealthKit.Constants.Permissions.Workout,
    ],
    write: [],
  },
};

class AppleHealthService {
  constructor() {
    this.isInitialized = false;
    this.isAvailable = Platform.OS === 'ios';
  }

  /**
   * Инициализировать HealthKit и запросить разрешения
   * @returns {Promise<boolean>}
   */
  async initialize() {
    if (!this.isAvailable) {
      console.log('Apple Health is only available on iOS');
      return false;
    }

    return new Promise((resolve) => {
      AppleHealthKit.initHealthKit(PERMISSIONS, (error) => {
        if (error) {
          console.error('Error initializing HealthKit:', error);
          this.isInitialized = false;
          resolve(false);
        } else {
          console.log('HealthKit initialized successfully');
          this.isInitialized = true;
          resolve(true);
        }
      });
    });
  }

  /**
   * Проверить доступность HealthKit
   * @returns {Promise<boolean>}
   */
  async checkAvailability() {
    if (!this.isAvailable) {
      return false;
    }

    return new Promise((resolve) => {
      AppleHealthKit.isAvailable((error, available) => {
        if (error) {
          console.error('Error checking HealthKit availability:', error);
          resolve(false);
        } else {
          resolve(available);
        }
      });
    });
  }

  /**
   * Получить количество шагов за сегодня
   * @returns {Promise<number>}
   */
  async getStepsToday() {
    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) return 0;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const options = {
      date: new Date().toISOString(),
      includeManuallyAdded: true,
    };

    return new Promise((resolve) => {
      AppleHealthKit.getStepCount(options, (error, results) => {
        if (error) {
          console.error('Error getting steps:', error);
          resolve(0);
        } else {
          resolve(results.value || 0);
        }
      });
    });
  }

  /**
   * Получить тренировки за сегодня
   * @returns {Promise<Array>}
   */
  async getWorkoutsToday() {
    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) return [];
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const now = new Date();

    const options = {
      startDate: today.toISOString(),
      endDate: now.toISOString(),
      limit: 100,
    };

    return new Promise((resolve) => {
      AppleHealthKit.getSamples(options, (error, results) => {
        if (error) {
          console.error('Error getting workouts:', error);
          resolve([]);
        } else {
          resolve(results || []);
        }
      });
    });
  }

  /**
   * Проверить была ли тренировка сегодня
   * @returns {Promise<boolean>}
   */
  async hasWorkoutToday() {
    const workouts = await this.getWorkoutsToday();
    return workouts.length > 0;
  }

  /**
   * Получить количество сожженных калорий за сегодня
   * @returns {Promise<number>}
   */
  async getActiveEnergyToday() {
    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) return 0;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const now = new Date();

    const options = {
      startDate: today.toISOString(),
      endDate: now.toISOString(),
    };

    return new Promise((resolve) => {
      AppleHealthKit.getActiveEnergyBurned(options, (error, results) => {
        if (error) {
          console.error('Error getting active energy:', error);
          resolve(0);
        } else {
          resolve(results.value || 0);
        }
      });
    });
  }

  /**
   * Получить данные о сне за последнюю ночь
   * @returns {Promise<{totalMinutes: number, quality: string}>}
   */
  async getSleepLastNight() {
    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) return { totalMinutes: 0, quality: 'unknown' };
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(18, 0, 0, 0); // Начинаем с 18:00 вчера

    const now = new Date();

    const options = {
      startDate: yesterday.toISOString(),
      endDate: now.toISOString(),
    };

    return new Promise((resolve) => {
      AppleHealthKit.getSleepSamples(options, (error, results) => {
        if (error) {
          console.error('Error getting sleep data:', error);
          resolve({ totalMinutes: 0, quality: 'unknown' });
        } else {
          if (!results || results.length === 0) {
            resolve({ totalMinutes: 0, quality: 'unknown' });
            return;
          }

          // Подсчитать общее время сна
          let totalMinutes = 0;
          results.forEach((sample) => {
            if (sample.value === 'ASLEEP' || sample.value === 'INBED') {
              const start = new Date(sample.startDate);
              const end = new Date(sample.endDate);
              const minutes = (end - start) / (1000 * 60);
              totalMinutes += minutes;
            }
          });

          // Определить качество сна (простая логика)
          let quality = 'good';
          if (totalMinutes < 360) quality = 'poor'; // Меньше 6 часов
          else if (totalMinutes < 420) quality = 'fair'; // Меньше 7 часов
          else if (totalMinutes >= 480) quality = 'excellent'; // 8+ часов

          resolve({ totalMinutes: Math.round(totalMinutes), quality });
        }
      });
    });
  }

  /**
   * Получить дистанцию ходьбы/бега за сегодня (в километрах)
   * @returns {Promise<number>}
   */
  async getDistanceToday() {
    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) return 0;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const now = new Date();

    const options = {
      startDate: today.toISOString(),
      endDate: now.toISOString(),
    };

    return new Promise((resolve) => {
      AppleHealthKit.getDistanceWalkingRunning(options, (error, results) => {
        if (error) {
          console.error('Error getting distance:', error);
          resolve(0);
        } else {
          // Результат в метрах, конвертируем в км
          const kilometers = (results.value || 0) / 1000;
          resolve(Math.round(kilometers * 100) / 100); // Округляем до 2 знаков
        }
      });
    });
  }

  /**
   * Проверить достижение цели по метрике
   * @param {string} metricType - тип метрики (steps, workout, sleep, calories, distance)
   * @param {number} targetValue - целевое значение
   * @returns {Promise<{achieved: boolean, currentValue: number}>}
   */
  async checkGoalAchievement(metricType, targetValue) {
    let currentValue = 0;
    let achieved = false;

    try {
      switch (metricType) {
        case 'steps':
          currentValue = await this.getStepsToday();
          achieved = currentValue >= targetValue;
          break;

        case 'workout':
          const hasWorkout = await this.hasWorkoutToday();
          currentValue = hasWorkout ? 1 : 0;
          achieved = hasWorkout;
          break;

        case 'sleep':
          const sleepData = await this.getSleepLastNight();
          currentValue = sleepData.totalMinutes;
          achieved = currentValue >= targetValue;
          break;

        case 'calories':
          currentValue = await this.getActiveEnergyToday();
          achieved = currentValue >= targetValue;
          break;

        case 'distance':
          currentValue = await this.getDistanceToday();
          achieved = currentValue >= targetValue;
          break;

        default:
          console.warn(`Unknown metric type: ${metricType}`);
      }
    } catch (error) {
      console.error('Error checking goal achievement:', error);
    }

    return { achieved, currentValue };
  }

  /**
   * Получить все поддерживаемые типы метрик
   * @returns {Array}
   */
  getSupportedMetrics() {
    return [
      {
        id: 'steps',
        name: 'Шаги',
        icon: '👣',
        unit: 'шагов',
        defaultTarget: 10000,
      },
      {
        id: 'workout',
        name: 'Тренировка',
        icon: '💪',
        unit: 'тренировок',
        defaultTarget: 1,
      },
      {
        id: 'sleep',
        name: 'Сон',
        icon: '😴',
        unit: 'минут',
        defaultTarget: 480, // 8 часов
      },
      {
        id: 'calories',
        name: 'Калории',
        icon: '🔥',
        unit: 'ккал',
        defaultTarget: 500,
      },
      {
        id: 'distance',
        name: 'Дистанция',
        icon: '🏃',
        unit: 'км',
        defaultTarget: 5,
      },
    ];
  }
}

export default new AppleHealthService();
