// src/components/habits/HabitActionSheet.js
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { Colors, Sizes } from '@/src/constants';

export const HabitActionSheet = ({ visible, onClose, habit, onEdit, onDelete }) => {
  const handleDelete = () => {
    onClose();
    // Показать подтверждение перед удалением
    setTimeout(() => {
      Alert.alert(
        'Удалить привычку?',
        `Вы уверены, что хотите удалить "${habit?.name}"? Это действие нельзя отменить.`,
        [
          {
            text: 'Отмена',
            style: 'cancel',
          },
          {
            text: 'Удалить',
            style: 'destructive',
            onPress: () => onDelete(habit?.id),
          },
        ]
      );
    }, 300);
  };

  const handleEdit = () => {
    onClose();
    setTimeout(() => {
      onEdit(habit);
    }, 300);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <View style={styles.header}>
                <Text style={styles.habitIcon}>{habit?.icon}</Text>
                <Text style={styles.habitName}>{habit?.name}</Text>
              </View>

              <TouchableOpacity style={styles.option} onPress={handleEdit}>
                <Text style={styles.optionIcon}>✏️</Text>
                <Text style={styles.optionText}>Редактировать</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.option} onPress={handleDelete}>
                <Text style={styles.optionIcon}>🗑️</Text>
                <Text style={[styles.optionText, styles.optionTextDanger]}>Удалить</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Sizes.borderRadius.xl,
    borderTopRightRadius: Sizes.borderRadius.xl,
    padding: Sizes.spacing.lg,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: Sizes.spacing.md,
    marginBottom: Sizes.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  habitIcon: {
    fontSize: 48,
    marginBottom: Sizes.spacing.sm,
  },
  habitName: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.text,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Sizes.spacing.md,
    paddingHorizontal: Sizes.spacing.lg,
    backgroundColor: Colors.background,
    borderRadius: Sizes.borderRadius.md,
    marginBottom: Sizes.spacing.sm,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: Sizes.spacing.md,
  },
  optionText: {
    fontSize: Sizes.fontSize.lg,
    color: Colors.text,
    fontWeight: '600',
  },
  optionTextDanger: {
    color: Colors.error,
  },
  cancelButton: {
    marginTop: Sizes.spacing.md,
    paddingVertical: Sizes.spacing.md,
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Sizes.borderRadius.md,
  },
  cancelButtonText: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
