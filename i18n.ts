import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';
import translationJA from './locales/ja/translation.json';

const resources = {
  en: {
    translation: translationEN,
  },
  es: {
    translation: translationES,
  },
  ja: {
    translation: translationJA,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false, // Set to true for debugging
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
    }
  });

export default i18n;