// src/components/common/AlgorithmLayout.tsx

import { ReactNode } from 'react';
import { Home, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import { Links } from '../Links';
import { DeveloperNote } from '../DeveloperNote';
import { AlgorithmVisualization } from '../../lib/algorithms/types';


interface AlgorithmLayoutProps<TInput, TState> {
  titleKey: string;
  descriptionKey: string;
  devNoteKey?: string;
  algorithm: AlgorithmVisualization<TInput, TState>;
  children: ReactNode;
}

export function AlgorithmLayout<TInput, TState>({
  titleKey,
  descriptionKey,
  devNoteKey,
  algorithm,
  children,
}: AlgorithmLayoutProps<TInput, TState>) {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  // Build title with section reference
  const buildTitle = () => {
    const baseTitle = t[titleKey];
    if (algorithm.isAdvanced) {
      const advancedSuffix = lang === 'zh' ? ' (进阶)' : ' (Advanced)';
      return `${baseTitle}${advancedSuffix}`;
    }
    return baseTitle;
  };

  return (
    <div className="safe-app-x safe-app-bottom max-w-4xl mx-auto py-4 sm:py-6 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full min-w-0 flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Link
            to="/"
            className="learning-secondary flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            {t.backToHome}
          </Link>
          <h1 className="learning-title min-w-0">
            {buildTitle()}
          </h1>
        </div>
        <button
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          className="learning-primary flex items-center justify-center gap-2"
        >
          <Languages className="w-4 h-4" />
          {t.language}
        </button>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-lg">
        {t[descriptionKey]}
      </p>

      {/* Algorithm content */}
      {children}



      {/* Developer note */}
      {devNoteKey && <DeveloperNote noteKey={devNoteKey} />}

      {/* Links */}
      <Links lang={lang} />
    </div>
  );
}
