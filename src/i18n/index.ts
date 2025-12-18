import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import ru from './locales/ru.json';
import id from './locales/id.json';
import zh from './locales/zh.json';
import es from './locales/es.json';

const LANGUAGE_STORAGE_KEY = '@momentum_flow_language';

const resources = {
  en: { translation: en },
  ru: { translation: ru },
  id: { translation: id },
  zh: { translation: zh },
  es: { translation: es },
};

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

// Get device locale
const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';

// Russian plural rules:
// 1, 21, 31... → one (день)
// 2-4, 22-24, 32-34... → few (дня)
// 0, 5-20, 25-30... → many (дней)
export const getPluralSuffix = (count: number, lang: string): string => {
  if (lang !== 'ru') {
    return count === 1 ? 'one' : 'other';
  }

  const absCount = Math.abs(count);
  const mod10 = absCount % 10;
  const mod100 = absCount % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return 'one';
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return 'few';
  }
  return 'many';
};

// Helper to translate with proper Russian pluralization
export const tPlural = (key: string, count: number): string => {
  const lang = i18n.language;
  const suffix = getPluralSuffix(count, lang);
  const pluralKey = `${key}_${suffix}`;

  // Try plural key first, fallback to base key
  if (i18n.exists(pluralKey)) {
    return i18n.t(pluralKey, { count });
  }
  return i18n.t(key, { count });
};

// Change language and save to storage
export const changeLanguage = async (languageCode: LanguageCode): Promise<void> => {
  await i18n.changeLanguage(languageCode);
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
};

// Get saved language from storage
export const getSavedLanguage = async (): Promise<LanguageCode | null> => {
  try {
    const savedLang = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLang && SUPPORTED_LANGUAGES.some(lang => lang.code === savedLang)) {
      return savedLang as LanguageCode;
    }
    return null;
  } catch {
    return null;
  }
};

// Initialize language (call this on app start)
export const initializeLanguage = async (): Promise<void> => {
  const savedLang = await getSavedLanguage();
  if (savedLang) {
    await i18n.changeLanguage(savedLang);
  }
};

// Get current language
export const getCurrentLanguage = (): LanguageCode => {
  return i18n.language as LanguageCode;
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: deviceLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Initialize saved language after i18n is set up
initializeLanguage();

export default i18n;
