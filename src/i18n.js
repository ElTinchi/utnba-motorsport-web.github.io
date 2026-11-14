import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import esJson from './locales/es.json?raw';
import enJson from './locales/en.json?raw';
import ptJson from './locales/pt.json?raw';

const parseLocale = (locale) => JSON.parse(locale.replace(/^\uFEFF/, ''));
const es = parseLocale(esJson);
const en = parseLocale(enJson);
const pt = parseLocale(ptJson);

// Only written by an explicit choice. The old 'utnba_lang' key also held
// auto-detected values, so it is dropped instead of trusted.
export const LANGUAGE_CHOICE_KEY = 'utnba_lang_choice';
try { localStorage.removeItem('utnba_lang'); } catch { /* storage blocked */ }

export const SUPPORTED_LANGUAGES = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
      pt: { translation: pt },
    },
    fallbackLng: 'es',
    supportedLngs: ['es', 'en', 'pt'],
    interpolation: {
      escapeValue: false,
    },
    // Spanish unless the visitor picked another language in the switcher.
    // The browser language is ignored on purpose: many people in Argentina run
    // their browser in English, got the English site and then Chrome's machine
    // translation back to Spanish.
    detection: {
      order: ['localStorage'],
      caches: [],
      lookupLocalStorage: LANGUAGE_CHOICE_KEY,
    },
  });

export default i18n;
