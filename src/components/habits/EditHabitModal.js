// src/components/habits/EditHabitModal.js
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Switch,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, Sizes } from '@/src/constants';

const EMOJI_OPTIONS = ['🧘', '💧', '💪', '📚', '🏃', '🎯', '🌱', '✨', '🎨', '🎵', '🍎', '😴'];

export const EditHabitModal = ({ visible, onClose, onSubmit, habit }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('✨');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Обновить форму при изменении habit
  useEffect(() => {
    if (habit) {
      setName(habit.name || '');
      setSelectedEmoji(habit.icon || '✨');
      setReminderEnabled(habit.reminderEnabled || false);
      if (habit.reminderTime) {
        setReminderTime(new Date(habit.reminderTime));
      }
    }
  }, [habit]);

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit({
        name: name.trim(),
        icon: selectedEmoji,
        reminderEnabled,
        reminderTime: reminderEnabled ? reminderTime.toISOString() : null,
      });
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      setReminderTime(selectedTime);
    }
  };

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modal}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>{t('habits.editHabit')}</Text>

            <Text style={styles.label}>{t('habits.name')}</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={t('habits.namePlaceholder')}
              placeholderTextColor={Colors.textDisabled}
              autoFocus
            />

            <Text style={styles.label}>{t('habits.selectIcon')}</Text>
            <View style={styles.emojiGrid}>
              {EMOJI_OPTIONS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[
                    styles.emojiButton,
                    selectedEmoji === emoji && styles.emojiButtonSelected,
                  ]}
                  onPress={() => setSelectedEmoji(emoji)}
                >
                  <Text style={styles.emoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Настройки напоминаний */}
            <View style={styles.reminderSection}>
              <View style={styles.reminderHeader}>
                <Text style={styles.label}>{t('habits.reminder')}</Text>
                <Switch
                  value={reminderEnabled}
                  onValueChange={setReminderEnabled}
                  trackColor={{ false: Colors.border, true: Colors.primary + '80' }}
                  thumbColor={reminderEnabled ? Colors.primary : Colors.textDisabled}
                />
              </View>

              {reminderEnabled && (
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={styles.timeButtonIcon}>⏰</Text>
                  <Text style={styles.timeButtonText}>{formatTime(reminderTime)}</Text>
                </TouchableOpacity>
              )}
            </View>

            {showTimePicker && (
              <DateTimePicker
                value={reminderTime}
                mode="time"
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleTimeChange}
              />
            )}
          </ScrollView>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={onClose}
            >
              <Text style={styles.buttonTextCancel}>{t('common.cancel')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonSubmit]}
              onPress={handleSubmit}
              disabled={!name.trim()}
            >
              <Text style={styles.buttonTextSubmit}>{t('common.save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Sizes.borderRadius.xl,
    borderTopRightRadius: Sizes.borderRadius.xl,
    padding: Sizes.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : Sizes.spacing.lg,
  },
  title: {
    fontSize: Sizes.fontSize.xxl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Sizes.spacing.lg,
  },
  label: {
    fontSize: Sizes.fontSize.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Sizes.spacing.sm,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: Sizes.borderRadius.md,
    padding: Sizes.spacing.md,
    fontSize: Sizes.fontSize.lg,
    color: Colors.text,
    marginBottom: Sizes.spacing.lg,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizes.spacing.sm,
    marginBottom: Sizes.spacing.xl,
  },
  emojiButton: {
    width: 56,
    height: 56,
    borderRadius: Sizes.borderRadius.md,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#E8EAF6',
  },
  emoji: {
    fontSize: 28,
  },
  buttons: {
    flexDirection: 'row',
    gap: Sizes.spacing.md,
  },
  button: {
    flex: 1,
    padding: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.md,
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: Colors.background,
  },
  buttonSubmit: {
    backgroundColor: Colors.primary,
  },
  buttonTextCancel: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  buttonTextSubmit: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: '600',
    color: Colors.surface,
  },
  reminderSection: {
    marginBottom: Sizes.spacing.lg,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.spacing.md,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Sizes.borderRadius.md,
    padding: Sizes.spacing.md,
    gap: Sizes.spacing.md,
  },
  timeButtonIcon: {
    fontSize: 24,
  },
  timeButtonText: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: '600',
    color: Colors.text,
  },
});
