import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useTranslation } from 'react-i18next';
import { Colors, Sizes } from '@/src/constants';
import { useHabits } from '@/src/context/HabitsContext';
import { useMemo } from 'react';
import { tPlural } from '@/src/i18n';

// Configure Russian locale for calendar
LocaleConfig.locales['ru'] = {
  monthNames: [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ],
  monthNamesShort: [
    'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
    'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
  ],
  dayNames: [
    'Воскресенье', 'Понедельник', 'Вторник', 'Среда',
    'Четверг', 'Пятница', 'Суббота'
  ],
  dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  today: 'Сегодня'
};

LocaleConfig.locales['en'] = {
  monthNames: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  monthNamesShort: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ],
  dayNames: [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday'
  ],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: 'Today'
};

// Indonesian locale
LocaleConfig.locales['id'] = {
  monthNames: [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ],
  monthNamesShort: [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ],
  dayNames: [
    'Minggu', 'Senin', 'Selasa', 'Rabu',
    'Kamis', 'Jumat', 'Sabtu'
  ],
  dayNamesShort: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
  today: 'Hari ini'
};

// Chinese locale
LocaleConfig.locales['zh'] = {
  monthNames: [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ],
  monthNamesShort: [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ],
  dayNames: [
    '星期日', '星期一', '星期二', '星期三',
    '星期四', '星期五', '星期六'
  ],
  dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
  today: '今天'
};

// Spanish locale
LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ],
  monthNamesShort: [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ],
  dayNames: [
    'Domingo', 'Lunes', 'Martes', 'Miércoles',
    'Jueves', 'Viernes', 'Sábado'
  ],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: 'Hoy'
};

export default function CalendarScreen() {
  const { t, i18n } = useTranslation();
  const { habits } = useHabits();

  // Set calendar locale based on current app language
  const supportedLocales = ['ru', 'en', 'id', 'zh', 'es'];
  LocaleConfig.defaultLocale = supportedLocales.includes(i18n.language) ? i18n.language : 'en';

  // Подготовить marked dates для календаря
  const markedDates = useMemo(() => {
    const marked: any = {};

    habits.forEach(habit => {
      Object.keys(habit.completionHistory || {}).forEach(date => {
        if (habit.completionHistory[date].completed) {
          if (!marked[date]) {
            marked[date] = { dots: [] };
          }
          marked[date].dots.push({
            color: Colors.success,
          });
        }
      });
    });

    return marked;
  }, [habits]);

  // Подсчитать статистику за последний месяц
  const monthStats = useMemo(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    let completedDays = 0;
    const checkedDates = new Set();

    habits.forEach(habit => {
      Object.keys(habit.completionHistory || {}).forEach(dateStr => {
        const date = new Date(dateStr);
        if (date >= thirtyDaysAgo && date <= today && habit.completionHistory[dateStr].completed) {
          if (!checkedDates.has(dateStr)) {
            checkedDates.add(dateStr);
            completedDays++;
          }
        }
      });
    });

    return completedDays;
  }, [habits]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('calendar.title')}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsCard}>
          <Text style={styles.statsLabel}>{t('calendar.activeDaysMonth')}</Text>
          <Text style={styles.statsValue}>{tPlural('calendar.days', monthStats)}</Text>
        </View>

        <View style={styles.calendarContainer}>
          <Calendar
            key={i18n.language}
            markedDates={markedDates}
            markingType="multi-dot"
            firstDay={1}
            theme={{
              backgroundColor: Colors.background,
              calendarBackground: Colors.surface,
              textSectionTitleColor: Colors.textSecondary,
              selectedDayBackgroundColor: Colors.primary,
              selectedDayTextColor: Colors.surface,
              todayTextColor: Colors.primary,
              dayTextColor: Colors.text,
              textDisabledColor: Colors.textDisabled,
              dotColor: Colors.success,
              monthTextColor: Colors.text,
              textMonthFontWeight: 'bold',
              textMonthFontSize: Sizes.fontSize.xl,
              textDayFontSize: Sizes.fontSize.md,
              textDayHeaderFontSize: Sizes.fontSize.sm,
            }}
          />
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.success }]} />
            <Text style={styles.legendText}>{t('calendar.completedHabit')}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Sizes.spacing.md,
    paddingVertical: Sizes.spacing.sm,
  },
  headerTitle: {
    fontSize: Sizes.fontSize.xxl,
    fontWeight: 'bold',
    color: Colors.text,
  },
  content: {
    flex: 1,
  },
  statsCard: {
    backgroundColor: Colors.surface,
    margin: Sizes.spacing.md,
    padding: Sizes.spacing.lg,
    borderRadius: Sizes.borderRadius.lg,
    alignItems: 'center',
  },
  statsLabel: {
    fontSize: Sizes.fontSize.md,
    color: Colors.textSecondary,
    marginBottom: Sizes.spacing.xs,
  },
  statsValue: {
    fontSize: Sizes.fontSize.xxxl,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  calendarContainer: {
    backgroundColor: Colors.surface,
    margin: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.lg,
    padding: Sizes.spacing.sm,
    overflow: 'hidden',
  },
  legend: {
    margin: Sizes.spacing.md,
    padding: Sizes.spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Sizes.borderRadius.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Sizes.spacing.sm,
  },
  legendText: {
    fontSize: Sizes.fontSize.md,
    color: Colors.text,
  },
});
