// src/components/common/AlgorithmLayout.tsx

import { ReactNode } from 'react';
import { Home, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import { Links } from '../Links';
import { DeveloperNote } from '../DeveloperNote';
import { AlgorithmVisualization } from '../../lib/algorithms/types';
import { AlgorithmNavigation } from './AlgorithmNavigation';

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
    const baseTitle = t[titleKey] || titleKey;
    if (algorithm.isAdvanced) {
      const advancedSuffix = lang === 'zh' ? ' (进阶)' : ' (Advanced)';
      return `${baseTitle}${advancedSuffix}`;
    }
    return baseTitle;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors"
          >
            <Home className="w-4 h-4" />
            {t.backToHome}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            {buildTitle()}
          </h1>
        </div>
        <button
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md"
        >
          <Languages className="w-4 h-4" />
          {t.language}
        </button>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-lg">
        {t[descriptionKey] || descriptionKey}
      </p>

      {/* Algorithm content */}
      {children}

      <AlgorithmNavigation algorithmId={algorithm.id} lang={lang} />

      {/* Developer note */}
      {devNoteKey && <DeveloperNote noteKey={devNoteKey} />}

      {/* Links */}
      <Links lang={lang} />
    </div>
  );
}
