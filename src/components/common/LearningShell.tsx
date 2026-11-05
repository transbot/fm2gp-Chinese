import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
export function LearningShell({ title, description, children, wide = false }: {
    title: string;
    description?: string;
    children: ReactNode;
    wide?: boolean;
}) {
    const { lang, setLang } = useLanguage();
    return <main className={`learning-shell ${wide ? 'max-w-6xl' : 'max-w-4xl'}`}>
    <header className="flex flex-wrap items-center justify-between gap-3">
      <Link className="learning-secondary" to="/">{translations[lang].backToHome}</Link>
      <Link className="learning-secondary" to="/book">{lang === 'zh' ? '按章节学习' : 'Browse chapters'}</Link>
      <button className="learning-primary" onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}>{translations[lang].language}</button>
    </header>
    <div><h1 className="learning-title min-w-0">{title}</h1>{description && <p className="mt-3 text-gray-600 leading-7">{description}</p>}</div>
    {children}
  </main>;
}
export function TermHelp({ term, children, href }: {
    term: string;
    children: ReactNode;
    href: string;
}) {
    const { lang } = useLanguage();
    return <details className="learning-note"><summary className="cursor-pointer font-semibold">{term}</summary><div className="mt-3 space-y-3">{children}<p><Link className="learning-link" to={href}>{lang === 'zh' ? '查看书中说明' : 'Read the book guide'}</Link></p></div></details>;
}
