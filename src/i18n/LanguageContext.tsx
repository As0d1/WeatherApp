import { getLocales } from 'expo-localization';
import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';

import { usePersistentState } from '../hooks/usePersistentState';
import { isLanguage, translations, type Language, type TranslationKey } from './translations';

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function deviceLanguage(): Language {
  const code = getLocales()[0]?.languageCode;
  return isLanguage(code) ? code : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = usePersistentState<Language>(
    'language',
    deviceLanguage(),
    isLanguage,
  );

  const t = useCallback((key: TranslationKey) => translations[language][key], [language]);
  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside a LanguageProvider');
  }
  return context;
}
