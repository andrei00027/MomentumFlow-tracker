// src/services/notifications/NotificationService.js
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Настройка поведения уведомлений
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  /**
   * Запросить разрешение на отправку уведомлений
   */
  async requestPermissions() {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return false;
      }

      // Для Android: создать канал уведомлений
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('habits', {
          name: 'Напоминания о привычках',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#6366F1',
        });
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Запланировать ежедневное напоминание для привычки
   * @param {string} habitId - ID привычки
   * @param {string} habitName - Название привычки
   * @param {string} habitIcon - Иконка привычки
   * @param {number} hour - Час (0-23)
   * @param {number} minute - Минута (0-59)
   * @returns {Promise<string>} - ID уведомления
   */
  async scheduleHabitReminder(habitId, habitName, habitIcon, hour, minute) {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `${habitIcon} ${habitName}`,
          body: 'Пора выполнить привычку!',
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: { habitId },
        },
        trigger: {
          hour,
          minute,
          repeats: true,
        },
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  }

  /**
   * Отменить уведомление по ID
   * @param {string} notificationId - ID уведомления
   */
  async cancelNotification(notificationId) {
    try {
      if (notificationId) {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
      }
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  /**
   * Отменить все уведомления
   */
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }

  /**
   * Получить все запланированные уведомления
   */
  async getAllScheduledNotifications() {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }
}

export default new NotificationService();
