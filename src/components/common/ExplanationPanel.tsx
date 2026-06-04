// src/components/common/ExplanationPanel.tsx

import { Info, Clock, Database } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import { ComplexityInfo } from '../../lib/algorithms/types';
import { ResponsiveVisualFrame } from './ResponsiveVisualFrame';

interface ExplanationPanelProps {
  stepDescription: string;
  invariant?: string;
  complexity?: ComplexityInfo;
  codeSnippet?: string;
  operationType?: string;
}

export function ExplanationPanel({
  stepDescription,
  invariant,
  complexity,
  codeSnippet,
  operationType,
}: ExplanationPanelProps) {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-4 space-y-4">
      {/* Current operation */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <Info className="w-4 h-4" />
          <span>{t.currentOperation || 'Current Operation'}</span>
          {operationType && (
            <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-mono">
              {operationType}
            </span>
          )}
        </div>
        <p className="text-gray-800 bg-white rounded-lg p-3 border border-gray-200">
          {stepDescription}
        </p>
      </div>

      {/* Invariant */}
      {invariant && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <span className="text-lg">⚖️</span>
            <span>{t.invariant || 'Invariant'}</span>
          </div>
          <p className="text-gray-700 bg-amber-50 rounded-lg p-3 border border-amber-200 text-sm italic">
            {invariant}
          </p>
        </div>
      )}

      {/* Complexity */}
      {complexity && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <Clock className="w-4 h-4" />
            <span>{t.complexity || 'Complexity'}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-lg p-2 border border-gray-200">
              <div className="text-xs text-gray-500">{t.timeComplexity || 'Time'}</div>
              <div className="font-mono text-blue-600">{complexity.time}</div>
            </div>
            <div className="bg-white rounded-lg p-2 border border-gray-200">
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Database className="w-3 h-3" />
                {t.spaceComplexity || 'Space'}
              </div>
              <div className="font-mono text-purple-600">{complexity.space}</div>
            </div>
          </div>
          {complexity.worstCase && (
            <div className="text-xs text-gray-500">
              <span className="font-medium">{t.worstCase || 'Worst'}:</span> {lang === 'zh' && complexity.worstCaseZh ? complexity.worstCaseZh : complexity.worstCase}
            </div>
          )}
          {complexity.bestCase && (
            <div className="text-xs text-gray-500">
              <span className="font-medium">{t.bestCase || 'Best'}:</span> {lang === 'zh' && complexity.bestCaseZh ? complexity.bestCaseZh : complexity.bestCase}
            </div>
          )}
        </div>
      )}

      {/* Code snippet */}
      {codeSnippet && (
        <details className="space-y-2">
          <summary className="cursor-pointer text-gray-700 font-medium hover:text-blue-600">
            {t.viewCode || 'View Code'}
          </summary>
          <ResponsiveVisualFrame
            label={t.viewCode || 'View Code'}
            className="rounded-lg bg-gray-900 p-3"
            contentClassName="min-w-max"
          >
            <pre className="text-xs text-gray-100">
              <code>{codeSnippet}</code>
            </pre>
          </ResponsiveVisualFrame>
        </details>
      )}
    </div>
  );
}
