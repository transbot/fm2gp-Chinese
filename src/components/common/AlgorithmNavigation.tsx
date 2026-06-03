import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getAlgorithmNavigation,
  getDifficultyLabel,
  getSourceLabel,
  Language,
} from '../../data/algorithmCatalog';
import { translations } from '../../i18n/translations';

interface AlgorithmNavigationProps {
  algorithmId: string;
  lang: Language;
}

const labels = {
  en: {
    topic: 'Topic',
    source: 'Source',
    difficulty: 'Difficulty',
    concept: 'Core Concept',
    before: 'Learn First',
    after: 'Next Step',
    previous: 'Previous',
    next: 'Next',
  },
  zh: {
    topic: '主题',
    source: '来源',
    difficulty: '难度',
    concept: '核心概念',
    before: '建议先学',
    after: '接着学习',
    previous: '上一篇',
    next: '下一篇',
  },
};

export function AlgorithmNavigation({ algorithmId, lang }: AlgorithmNavigationProps) {
  const navigation = getAlgorithmNavigation(algorithmId);
  if (!navigation) {
    return null;
  }

  const t = translations[lang];
  const currentLabel = t[navigation.current.titleKey] ?? navigation.current.titleKey;
  const sourceLabel = getSourceLabel(navigation.current, lang);
  const difficultyLabel = getDifficultyLabel(navigation.current.difficulty, lang);

  return (
    <nav className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 sm:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {labels[lang].topic}
          </div>
          <div className="mt-1 text-base font-semibold text-gray-800">
            {navigation.topic.title[lang]}
          </div>
          <div className="text-sm text-gray-600 mt-1">{currentLabel}</div>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-200">
            {labels[lang].source}: {sourceLabel}
          </span>
          <span className="px-2 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100">
            {labels[lang].difficulty}: {difficultyLabel}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
          <div className="text-xs font-medium text-blue-700">{labels[lang].concept}</div>
          <div className="mt-1 text-gray-800">{navigation.current.coreConcept[lang]}</div>
        </div>
        <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
          <div className="text-xs font-medium text-gray-500">{labels[lang].before}</div>
          <div className="mt-1 text-gray-800">
            {navigation.previous
              ? t[navigation.previous.titleKey] ?? navigation.previous.titleKey
              : lang === 'zh' ? '这是本主题的起点' : 'This is the start of this topic'}
          </div>
        </div>
        <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
          <div className="text-xs font-medium text-gray-500">{labels[lang].after}</div>
          <div className="mt-1 text-gray-800">
            {navigation.next
              ? t[navigation.next.titleKey] ?? navigation.next.titleKey
              : lang === 'zh' ? '本主题已完成' : 'This topic is complete'}
          </div>
        </div>
      </div>

      {navigation.current.learningNote && (
        <div className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {navigation.current.learningNote[lang]}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {navigation.previous ? (
          <Link
            to={navigation.previous.path}
            className="group flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 hover:bg-blue-50 hover:border-blue-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:text-blue-600 shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-gray-500">{labels[lang].previous}</div>
              <div className="text-sm font-medium text-gray-800 group-hover:text-blue-700 truncate">
                {t[navigation.previous.titleKey] ?? navigation.previous.titleKey}
              </div>
            </div>
          </Link>
        ) : (
          <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-400">
            {labels[lang].previous}
          </div>
        )}

        {navigation.next ? (
          <Link
            to={navigation.next.path}
            className="group flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 hover:bg-blue-50 hover:border-blue-200 transition-colors"
          >
            <div className="min-w-0">
              <div className="text-xs text-gray-500">{labels[lang].next}</div>
              <div className="text-sm font-medium text-gray-800 group-hover:text-blue-700 truncate">
                {t[navigation.next.titleKey] ?? navigation.next.titleKey}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-600 shrink-0" />
          </Link>
        ) : (
          <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-400 sm:text-right">
            {labels[lang].next}
          </div>
        )}
      </div>
    </nav>
  );
}
