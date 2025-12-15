// src/services/storage/CloudStorageService.js
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

const CLOUD_FILE_NAME = 'habits_backup.json';

class CloudStorageService {
  constructor() {
    // Путь к облачному хранилищу
    // Для iCloud нужно использовать cacheDirectory или documentDirectory
    // в зависимости от конфигурации entitlements
    this.cloudDirectory = FileSystem.documentDirectory;
    this.cloudFilePath = `${this.cloudDirectory}${CLOUD_FILE_NAME}`;

    // Для настоящей работы с iCloud Drive требуется:
    // 1. EAS Build с настройкой iCloud capabilities
    // 2. Правильные entitlements в app.json
    // 3. Включенный iCloud Drive на устройстве
  }

  /**
   * Синхронизировать данные с облаком
   * @param {Array} localHabits - локальные привычки
   * @returns {Promise<Array>} - объединенные привычки
   */
  async sync(localHabits) {
    try {
      // iOS автоматически синхронизирует documentDirectory с iCloud Drive
      if (Platform.OS !== 'ios') {
        console.log('Cloud sync is only available on iOS');
        return localHabits;
      }

      // Проверить, существует ли файл в облаке
      const fileInfo = await FileSystem.getInfoAsync(this.cloudFilePath);

      if (fileInfo.exists) {
        // Загрузить данные из облака
        const cloudData = await this.loadFromCloud();

        // Объединить локальные и облачные данные
        const mergedHabits = this.mergeHabits(localHabits, cloudData);

        // Сохранить объединенные данные обратно в облако
        await this.saveToCloud(mergedHabits);

        return mergedHabits;
      } else {
        // Если файла нет, создать первую синхронизацию
        await this.saveToCloud(localHabits);
        return localHabits;
      }
    } catch (error) {
      console.error('Error during cloud sync:', error);
      // В случае ошибки вернуть локальные данные
      return localHabits;
    }
  }

  /**
   * Загрузить данные из облака
   * @returns {Promise<Array>}
   */
  async loadFromCloud() {
    try {
      const content = await FileSystem.readAsStringAsync(this.cloudFilePath);
      return JSON.parse(content);
    } catch (error) {
      console.error('Error loading from cloud:', error);
      return [];
    }
  }

  /**
   * Сохранить данные в облако
   * @param {Array} habits
   */
  async saveToCloud(habits) {
    try {
      const content = JSON.stringify(habits, null, 2);
      await FileSystem.writeAsStringAsync(this.cloudFilePath, content);
      console.log('Data saved to cloud:', this.cloudFilePath);
    } catch (error) {
      console.error('Error saving to cloud:', error);
      throw error;
    }
  }

  /**
   * Объединить локальные и облачные данные
   * Стратегия: последнее обновление побеждает (last-write-wins)
   * @param {Array} localHabits
   * @param {Array} cloudHabits
   * @returns {Array}
   */
  mergeHabits(localHabits, cloudHabits) {
    const habitMap = new Map();

    // Добавить облачные привычки
    cloudHabits.forEach(habit => {
      habitMap.set(habit.id, habit);
    });

    // Обновить/добавить локальные привычки
    localHabits.forEach(habit => {
      const existing = habitMap.get(habit.id);

      if (!existing) {
        // Новая привычка, добавить
        habitMap.set(habit.id, habit);
      } else {
        // Привычка существует, сравнить даты обновления
        const localDate = new Date(habit.createdAt || 0);
        const cloudDate = new Date(existing.createdAt || 0);

        // Взять более новую версию
        if (localDate >= cloudDate) {
          habitMap.set(habit.id, habit);
        }
      }
    });

    return Array.from(habitMap.values());
  }

  /**
   * Проверить доступность облачного хранилища
   * @returns {Promise<{available: boolean, error?: string}>}
   */
  async isAvailable() {
    try {
      if (Platform.OS !== 'ios') {
        return { available: false, error: 'Синхронизация доступна только на iOS' };
      }

      // Проверить доступность директории
      const info = await FileSystem.getInfoAsync(this.cloudDirectory);

      if (!info.exists) {
        return { available: false, error: 'Директория документов недоступна' };
      }

      return { available: true };
    } catch (error) {
      console.error('Error checking cloud availability:', error);
      return {
        available: false,
        error: `Ошибка доступа к файловой системе: ${error.message}`
      };
    }
  }

  /**
   * Получить последнюю дату синхронизации
   * @returns {Promise<Date|null>}
   */
  async getLastSyncTime() {
    try {
      const fileInfo = await FileSystem.getInfoAsync(this.cloudFilePath);
      if (fileInfo.exists && fileInfo.modificationTime) {
        return new Date(fileInfo.modificationTime * 1000);
      }
      return null;
    } catch (error) {
      console.error('Error getting last sync time:', error);
      return null;
    }
  }

  /**
   * Принудительно загрузить данные из облака
   * @returns {Promise<Array>}
   */
  async forceDownload() {
    try {
      const cloudHabits = await this.loadFromCloud();
      return cloudHabits;
    } catch (error) {
      console.error('Error forcing download:', error);
      return [];
    }
  }

  /**
   * Принудительно выгрузить данные в облако
   * @param {Array} habits
   */
  async forceUpload(habits) {
    try {
      await this.saveToCloud(habits);
    } catch (error) {
      console.error('Error forcing upload:', error);
      throw error;
    }
  }
}

export default new CloudStorageService();
