import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'zh';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'fm2gp-language';

// Web apps can read browser/device language preferences, not OS settings directly.
const detectUserLanguage = (): Language => {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === 'zh' || saved === 'en') return saved;
  } catch { /* Language detection still works when storage is unavailable. */ }
  const preferences = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const preference of preferences) {
    const language = preference.toLowerCase().split('-')[0];
    if (language === 'zh' || language === 'en') return language;
  }
  return 'en';
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  // 使用 useState 的函数形式来确保初始值只计算一次
  const [lang, updateLang] = useState<Language>(() => detectUserLanguage());
  const setLang = (language: Language) => {
    updateLang(language);
    try { localStorage.setItem(LANGUAGE_STORAGE_KEY, language); } catch { /* Optional persistence. */ }
  };

  // Keep assistive technology and browser language metadata in sync.
  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
