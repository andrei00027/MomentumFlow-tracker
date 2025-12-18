import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Platform, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-remix-icon';
import { Colors, Sizes } from '@/src/constants';
import { useHabits } from '@/src/context/HabitsContext';
import { useAuth } from '@/src/context/AuthContext';
import { SUPPORTED_LANGUAGES, changeLanguage, LanguageCode } from '@/src/i18n';

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const { syncWithCloud, isSyncing, lastSyncTime, checkHealthKitGoals } = useHabits();
  const { user, signOut, deleteAccount } = useAuth();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const handleLanguageChange = async (langCode: LanguageCode) => {
    try {
      await changeLanguage(langCode);
      setLanguageModalVisible(false);
    } catch {
      Alert.alert(t('common.error'), t('errors.generic'));
    }
  };

  const getCurrentLanguageName = () => {
    const currentLang = SUPPORTED_LANGUAGES.find(lang => lang.code === i18n.language);
    return currentLang?.nativeName || 'English';
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('profile.deleteAccount'),
      t('profile.deleteAccountConfirm'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
            } catch {
              Alert.alert(t('common.error'), t('errors.generic'));
            }
          },
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'MomentumFlow',
      t('profile.aboutMessage'),
      [{ text: t('profile.ok') }]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      t('profile.signOut'),
      t('profile.signOutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.signOut'),
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch {
              Alert.alert(t('common.error'), t('errors.generic'));
            }
          },
        },
      ]
    );
  };

  const handleSync = async () => {
    if (Platform.OS !== 'ios') {
      Alert.alert(t('profile.unavailableIOS'), t('profile.iCloudUnavailable'));
      return;
    }

    const result = await syncWithCloud();
    if (result.success) {
      Alert.alert(t('common.success'), t('profile.iCloudSyncSuccess'));
    } else {
      Alert.alert(
        t('profile.iCloudSyncError'),
        result.error || t('profile.iCloudSyncErrorMessage')
      );
    }
  };

  const handleCheckHealthGoals = async () => {
    if (Platform.OS !== 'ios') {
      Alert.alert(t('profile.unavailableIOS'), t('profile.healthUnavailable'));
      return;
    }

    try {
      const updated = await checkHealthKitGoals();
      if (updated && updated.length > 0) {
        const names = updated.map(h => `• ${h.name}`).join('\n');
        Alert.alert(
          t('profile.healthCheckTitle'),
          t('profile.healthCheckSuccess', { habits: names })
        );
      } else {
        Alert.alert(t('common.success'), t('profile.healthCheckNoData'));
      }
    } catch {
      Alert.alert(t('common.error'), t('profile.healthCheckError'));
    }
  };

  const formatSyncTime = (date: Date | null) => {
    if (!date) return t('profile.never');
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return t('profile.justNow');
    if (minutes < 60) return t('profile.minutesAgo', { count: minutes });
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return t('profile.hoursAgo', { count: hours });
    const days = Math.floor(hours / 24);
    return t('profile.daysAgo', { count: days });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('profile.title')}</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Аватар и имя */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Icon name="user-3-fill" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.username}>{user?.fullName || user?.email || t('profile.user')}</Text>
          {user?.email && <Text style={styles.userEmail}>{user.email}</Text>}
        </View>

        {/* Настройки */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.settings')}</Text>

          {/* Выбор языка */}
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setLanguageModalVisible(true)}
          >
            <Icon name="global-fill" size={24} color={Colors.primary} style={{ marginRight: Sizes.spacing.md }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.settingText}>{t('profile.language')}</Text>
              <Text style={styles.settingSubtext}>{getCurrentLanguageName()}</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          {/* iCloud синхронизация */}
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleSync}
              disabled={isSyncing}
            >
              <Icon name="cloud-fill" size={24} color={Colors.primary} style={{ marginRight: Sizes.spacing.md }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.settingText}>{t('profile.syncWithICloud')}</Text>
                <Text style={styles.settingSubtext}>
                  {t('profile.iCloudLastSync', { time: formatSyncTime(lastSyncTime) })}
                </Text>
              </View>
              {isSyncing ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Text style={styles.settingArrow}>›</Text>
              )}
            </TouchableOpacity>
          )}

          {/* Apple Health интеграция */}
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleCheckHealthGoals}
            >
              <Icon name="heart-pulse-fill" size={24} color={Colors.error} style={{ marginRight: Sizes.spacing.md }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.settingText}>{t('profile.health')}</Text>
                <Text style={styles.settingSubtext}>
                  {t('profile.connectHealth')}
                </Text>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.settingItem} onPress={handleAbout}>
            <Icon name="information-fill" size={24} color={Colors.primary} style={{ marginRight: Sizes.spacing.md }} />
            <Text style={styles.settingText}>{t('profile.about')}</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleDeleteAccount}>
            <Icon name="delete-bin-fill" size={24} color={Colors.error} style={{ marginRight: Sizes.spacing.md }} />
            <Text style={[styles.settingText, styles.settingTextDanger]}>{t('profile.deleteAccount')}</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleSignOut}>
            <Icon name="logout-box-r-fill" size={24} color={Colors.error} style={{ marginRight: Sizes.spacing.md }} />
            <Text style={[styles.settingText, styles.settingTextDanger]}>{t('profile.signOut')}</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Версия приложения */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('profile.version')}</Text>
          <Text style={styles.footerSubtext}>{t('profile.madeWithLove')}</Text>
        </View>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={languageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setLanguageModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('profile.selectLanguage')}</Text>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  i18n.language === lang.code && styles.languageOptionSelected,
                ]}
                onPress={() => handleLanguageChange(lang.code)}
              >
                <Text
                  style={[
                    styles.languageOptionText,
                    i18n.language === lang.code && styles.languageOptionTextSelected,
                  ]}
                >
                  {lang.nativeName}
                </Text>
                {i18n.language === lang.code && (
                  <Icon name="check-line" size={20} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setLanguageModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
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
  profileSection: {
    alignItems: 'center',
    paddingVertical: Sizes.spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Sizes.spacing.md,
  },
  username: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.text,
  },
  userEmail: {
    fontSize: Sizes.fontSize.md,
    color: Colors.textSecondary,
    marginTop: Sizes.spacing.xs,
  },
  section: {
    padding: Sizes.spacing.md,
  },
  sectionTitle: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Sizes.spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.lg,
    marginBottom: Sizes.spacing.sm,
  },
  settingText: {
    flex: 1,
    fontSize: Sizes.fontSize.lg,
    color: Colors.text,
    fontWeight: '600',
  },
  settingTextDanger: {
    color: Colors.error,
  },
  settingSubtext: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Sizes.spacing.xs,
  },
  settingArrow: {
    fontSize: 24,
    color: Colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    padding: Sizes.spacing.xl,
  },
  footerText: {
    fontSize: Sizes.fontSize.md,
    color: Colors.textSecondary,
    marginBottom: Sizes.spacing.xs,
  },
  footerSubtext: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textDisabled,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Sizes.spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: Sizes.borderRadius.xl,
    padding: Sizes.spacing.lg,
    width: '100%',
    maxWidth: 340,
  },
  modalTitle: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Sizes.spacing.lg,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Sizes.spacing.md,
    paddingHorizontal: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.md,
    marginBottom: Sizes.spacing.xs,
  },
  languageOptionSelected: {
    backgroundColor: Colors.primary + '15',
  },
  languageOptionText: {
    fontSize: Sizes.fontSize.lg,
    color: Colors.text,
  },
  languageOptionTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  modalCloseButton: {
    marginTop: Sizes.spacing.md,
    paddingVertical: Sizes.spacing.md,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: Sizes.fontSize.md,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});
