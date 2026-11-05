import { useLanguage } from '../../context/LanguageContext';

export interface TraceLine { id: string; text: string }
// Reuses the existing light, locally scrolling code-block presentation.
export function TraceCode({ lines, active, label }: { lines: TraceLine[]; active: string; label: string }) {
  const { lang } = useLanguage();
  return <div role="region" aria-label={label} tabIndex={0} className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50">
    <pre className="text-sm p-3 w-max min-w-full"><code>{lines.map(line => <span key={line.id} data-line={line.id} aria-current={line.id === active ? 'step' : undefined} className={`block px-2 border-l-4 ${line.id === active ? 'border-blue-600 bg-blue-100 text-blue-950 font-semibold' : 'border-transparent'}`}><span aria-hidden="true">{line.id === active ? '→ ' : '  '}</span>{line.id === active && <span className="sr-only">{lang === 'zh' ? '当前语句：' : 'Current statement: '}</span>}{line.text}</span>)}</code></pre>
  </div>;
}
