// src/components/habits/CreateHabitModal.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Switch,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
import { useTranslation } from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-remix-icon';
import * as Haptics from 'expo-haptics';
import { Colors, Sizes } from '@/src/constants';
import { HABIT_ICON_CATEGORIES } from '@/src/constants/HabitIcons';
import { HabitIcon } from '@/src/components/common/HabitIcon';

export const CreateHabitModal = ({ visible, onClose, onSubmit }) => {
  const { t, i18n } = useTranslation();
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('checkbox-circle');
  const [selectedCategory, setSelectedCategory] = useState('health');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [everyDay, setEveryDay] = useState(true);
  const [selectedDays, setSelectedDays] = useState([1, 2, 3, 4, 5, 6, 0]); // 0 = Sunday, 1 = Monday, etc.
  const [isQuitHabit, setIsQuitHabit] = useState(false);

  // Анимация выезда карточки
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 65,
        friction: 11,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(SCREEN_HEIGHT);
    }
  }, [visible, slideAnim]);

  const weekDays = [
    { id: 1, short: t('days.mon'), full: t('days.monday') },
    { id: 2, short: t('days.tue'), full: t('days.tuesday') },
    { id: 3, short: t('days.wed'), full: t('days.wednesday') },
    { id: 4, short: t('days.thu'), full: t('days.thursday') },
    { id: 5, short: t('days.fri'), full: t('days.friday') },
    { id: 6, short: t('days.sat'), full: t('days.saturday') },
    { id: 0, short: t('days.sun'), full: t('days.sunday') },
  ];

  const handleSubmit = () => {
    if (name.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onSubmit({
        name: name.trim(),
        icon: selectedIcon,
        type: 'binary',
        reminderEnabled,
        reminderTime: reminderEnabled ? reminderTime.toISOString() : null,
        everyDay,
        selectedDays: everyDay ? [1, 2, 3, 4, 5, 6, 0] : selectedDays,
        isQuitHabit,
      });
      // Сбросить форму
      setName('');
      setSelectedIcon('checkbox-circle');
      setSelectedCategory('health');
      setReminderEnabled(false);
      setReminderTime(new Date());
      setEveryDay(true);
      setSelectedDays([1, 2, 3, 4, 5, 6, 0]);
      setIsQuitHabit(false);
    }
  };

  const handleEveryDayToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEveryDay(!everyDay);
    if (everyDay) {
      // Если отключаем "каждый день", выбираем все дни по умолчанию
      setSelectedDays([1, 2, 3, 4, 5, 6, 0]);
    }
  };

  const handleDayToggle = (dayId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDays(prev => {
      if (prev.includes(dayId)) {
        return prev.filter(d => d !== dayId);
      } else {
        return [...prev, dayId];
      }
    });
  };

  const handleIconSelect = (icon) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedIcon(icon);
  };

  const handleCategorySelect = (category) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(category);
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const handleTimePickerOpen = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowTimePicker(true);
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
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <TouchableWithoutFeedback>
              <Animated.View style={[styles.modal, { transform: [{ translateY: slideAnim }] }]}>
                <Text style={styles.title}>{t('habits.newHabit')}</Text>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={styles.scrollContent}
                  contentContainerStyle={styles.scrollContentContainer}
                >
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

                  {/* Category Tabs */}
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoryScroll}
                    contentContainerStyle={styles.categoryContainer}
                  >
                    {HABIT_ICON_CATEGORIES.map((category) => (
                      <TouchableOpacity
                        key={category.id}
                        style={[
                          styles.categoryTab,
                          selectedCategory === category.id && styles.categoryTabSelected,
                        ]}
                        onPress={() => handleCategorySelect(category.id)}
                      >
                        <Text style={[
                          styles.categoryTabText,
                          selectedCategory === category.id && styles.categoryTabTextSelected,
                        ]}>
                          {t(`iconCategories.${category.id}`)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  {/* Icon Grid */}
                  <View style={styles.iconGrid}>
                    {(HABIT_ICON_CATEGORIES.find(cat => cat.id === selectedCategory)?.icons || []).map((icon) => (
                      <TouchableOpacity
                        key={icon.id}
                        style={[
                          styles.iconButton,
                          selectedIcon === icon.id && styles.iconButtonSelected,
                        ]}
                        onPress={() => handleIconSelect(icon.id)}
                      >
                        <HabitIcon
                          name={icon.id}
                          size={28}
                          color={selectedIcon === icon.id ? Colors.primary : Colors.text}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Частота выполнения */}
                  <View style={styles.frequencySection}>
                    <TouchableOpacity
                      style={styles.frequencyHeader}
                      onPress={handleEveryDayToggle}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.label}>{t('habits.everyDay') || 'Каждый день'}</Text>
                      <Switch
                        value={everyDay}
                        onValueChange={handleEveryDayToggle}
                        trackColor={{ false: Colors.border, true: Colors.primary + '80' }}
                        thumbColor={everyDay ? Colors.primary : Colors.textDisabled}
                      />
                    </TouchableOpacity>

                    {!everyDay && (
                      <View style={styles.daysContainer}>
                        {weekDays.map((day) => (
                          <TouchableOpacity
                            key={day.id}
                            style={[
                              styles.dayButton,
                              selectedDays.includes(day.id) && styles.dayButtonSelected,
                            ]}
                            onPress={() => handleDayToggle(day.id)}
                          >
                            <Text
                              style={[
                                styles.dayButtonText,
                                selectedDays.includes(day.id) && styles.dayButtonTextSelected,
                              ]}
                            >
                              {day.short}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Режим отказа от привычки */}
                  <View style={styles.quitHabitSection}>
                    <TouchableOpacity
                      style={styles.quitHabitHeader}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setIsQuitHabit(!isQuitHabit);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.quitHabitInfo}>
                        <Text style={styles.label}>{t('habits.quitHabit')}</Text>
                        <Text style={styles.quitHabitDescription}>
                          {t('habits.quitHabitDescription')}
                        </Text>
                      </View>
                      <Switch
                        value={isQuitHabit}
                        onValueChange={(value) => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setIsQuitHabit(value);
                        }}
                        trackColor={{ false: Colors.border, true: Colors.error + '80' }}
                        thumbColor={isQuitHabit ? Colors.error : Colors.textDisabled}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Настройки напоминаний */}
                  <View style={styles.reminderSection}>
                    <TouchableOpacity
                      style={styles.reminderHeader}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setReminderEnabled(!reminderEnabled);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.label}>{t('habits.reminder')}</Text>
                      <Switch
                        value={reminderEnabled}
                        onValueChange={(value) => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setReminderEnabled(value);
                        }}
                        trackColor={{ false: Colors.border, true: Colors.primary + '80' }}
                        thumbColor={reminderEnabled ? Colors.primary : Colors.textDisabled}
                      />
                    </TouchableOpacity>

                    {reminderEnabled && (
                      <TouchableOpacity
                        style={styles.timeButton}
                        onPress={handleTimePickerOpen}
                      >
                        <Icon name="alarm-line" size={24} color={Colors.primary} />
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
                    onPress={handleClose}
                  >
                    <Text style={styles.buttonTextCancel}>{t('common.cancel')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.buttonSubmit]}
                    onPress={handleSubmit}
                    disabled={!name.trim()}
                  >
                    <Text style={styles.buttonTextSubmit}>{t('habits.create')}</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(57, 73, 171, 0.4)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Sizes.borderRadius.xl,
    borderTopRightRadius: Sizes.borderRadius.xl,
    padding: Sizes.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : Sizes.spacing.lg,
    maxHeight: SCREEN_HEIGHT * 0.85,
    ...Sizes.shadow.xl,
  },
  title: {
    fontSize: Sizes.fontSize.xxl,
    fontWeight: Sizes.fontWeight.bold,
    color: Colors.text,
    marginBottom: Sizes.spacing.lg,
  },
  scrollContent: {
    flexGrow: 1,
    flexShrink: 1,
  },
  scrollContentContainer: {
    paddingBottom: Sizes.spacing.md,
  },
  label: {
    fontSize: Sizes.fontSize.md,
    fontWeight: Sizes.fontWeight.semibold,
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
  categoryScroll: {
    marginBottom: Sizes.spacing.md,
    maxHeight: 40,
  },
  categoryContainer: {
    paddingRight: Sizes.spacing.md,
    gap: Sizes.spacing.sm,
  },
  categoryTab: {
    paddingHorizontal: Sizes.spacing.md,
    paddingVertical: Sizes.spacing.sm,
    borderRadius: Sizes.borderRadius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryTabSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryTabText: {
    fontSize: Sizes.fontSize.sm,
    fontWeight: Sizes.fontWeight.medium,
    color: Colors.text,
  },
  categoryTabTextSelected: {
    color: Colors.surface,
    fontWeight: Sizes.fontWeight.semibold,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Sizes.spacing.xl,
    gap: Sizes.spacing.sm,
  },
  iconButton: {
    width: 56,
    height: 56,
    borderRadius: Sizes.borderRadius.md,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...Sizes.shadow.sm,
  },
  iconButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#E8EAF6',
    ...Sizes.shadow.md,
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
    ...Sizes.shadow.sm,
  },
  buttonCancel: {
    backgroundColor: Colors.background,
  },
  buttonSubmit: {
    backgroundColor: Colors.primary,
    ...Sizes.shadow.md,
  },
  buttonTextCancel: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: Sizes.fontWeight.semibold,
    color: Colors.text,
  },
  buttonTextSubmit: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: Sizes.fontWeight.semibold,
    color: Colors.surface,
  },
  frequencySection: {
    marginBottom: Sizes.spacing.lg,
  },
  frequencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.spacing.md,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  dayButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dayButtonText: {
    fontSize: Sizes.fontSize.sm,
    fontWeight: Sizes.fontWeight.semibold,
    color: Colors.text,
  },
  dayButtonTextSelected: {
    color: Colors.surface,
  },
  quitHabitSection: {
    marginBottom: Sizes.spacing.lg,
  },
  quitHabitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quitHabitInfo: {
    flex: 1,
    marginRight: Sizes.spacing.md,
  },
  quitHabitDescription: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
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
    ...Sizes.shadow.sm,
  },
  timeButtonText: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: Sizes.fontWeight.semibold,
    color: Colors.text,
  },
});
