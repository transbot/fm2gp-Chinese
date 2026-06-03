import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'zh';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 检测用户的操作系统语言
const detectUserLanguage = (): Language => {
  // 获取浏览器语言设置
  const browserLang = navigator.language.toLowerCase();
  
  // 检查是否为中文
  if (browserLang.startsWith('zh')) {
    return 'zh';
  }
  
  // 默认返回英文
  return 'en';
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  // 使用 useState 的函数形式来确保初始值只计算一次
  const [lang, setLang] = useState<Language>(() => detectUserLanguage());

  // 在组件挂载时检测语言
  useEffect(() => {
    const detectedLang = detectUserLanguage();
    setLang(detectedLang);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}