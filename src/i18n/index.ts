import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import es from './locales/es.json';
import gl from './locales/gl.json';
import ast from './locales/ast.json';
import eu from './locales/eu.json';
import ca from './locales/ca.json';
import oc from './locales/oc.json';
import ad from './locales/ad.json';
import en from './locales/en.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import it from './locales/it.json';

const LANGUAGE_KEY = 'snowstrat-language';

// Get saved language from localStorage or default to Spanish
const getSavedLanguage = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(LANGUAGE_KEY) || 'es';
  }
  return 'es';
};

export const saveLanguage = (lang: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LANGUAGE_KEY, lang);
  }
};

const resources = {
  es: { translation: es },
  gl: { translation: gl },
  ast: { translation: ast },
  eu: { translation: eu },
  ca: { translation: ca },
  oc: { translation: oc },
  ad: { translation: ad },
  en: { translation: en },
  fr: { translation: fr },
  de: { translation: de },
  it: { translation: it },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getSavedLanguage(),
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

export type SupportedLanguage = keyof typeof resources;

export const SUPPORTED_LANGUAGES: { code: SupportedLanguage; name: string; flag: string }[] = [
  { code: 'es', name: 'Español', flag: 'ES' },
  { code: 'gl', name: 'Galego', flag: 'GL' },
  { code: 'ast', name: 'Asturianu', flag: 'AST' },
  { code: 'eu', name: 'Euskara', flag: 'EU' },
  { code: 'ca', name: 'Català', flag: 'CA' },
  { code: 'oc', name: 'Aranés', flag: 'OC' },
  { code: 'ad', name: 'Andorrà', flag: 'AD' },
  { code: 'en', name: 'English', flag: 'GB' },
  { code: 'fr', name: 'Français', flag: 'FR' },
  { code: 'de', name: 'Deutsch', flag: 'DE' },
  { code: 'it', name: 'Italiano', flag: 'IT' },
];
