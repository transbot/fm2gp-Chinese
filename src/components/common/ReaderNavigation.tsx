import { useEffect, useLayoutEffect, useRef } from 'react';
import { Link, useLocation, useNavigationType, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { algorithmCatalog } from '../../data/algorithmCatalog';
import { algorithmBookLink, conceptLessons, bookResources, repoFile } from '../../data/bookCatalog';
import { bookLearningPath } from '../../data/bookLearningPath';
import { translations } from '../../i18n/translations';
import { AlgorithmNavigation } from './AlgorithmNavigation';
export function ReaderNavigation() {
    const location = useLocation(), [params] = useSearchParams(), { lang } = useLanguage(), zh = lang === 'zh';
    const navigationType = useNavigationType();
    const positions = useRef(new Map<string, number>());
    const previous = useRef<typeof location>();
    const algorithm = algorithmCatalog.find(a => a.path === location.pathname), lesson = conceptLessons.find(l => l.path === location.pathname);
    useEffect(() => {
        const original = window.history.scrollRestoration;
        window.history.scrollRestoration = 'manual';
        return () => { window.history.scrollRestoration = original; };
    }, []);
    useLayoutEffect(() => {
        const from = previous.current;
        // Search edits replace the current entry, including clearing/resetting
        // an already empty query. They are not a new reading destination.
        const editingQuery = navigationType === 'REPLACE' && from?.pathname === location.pathname && from.hash === location.hash;
        // A review link carries the source entry key; an explicit source return
        // restores that entry's actual departure position, not just its anchor.
        const readerReturn = location.state?.readerReturn;
        const returningToSource = readerReturn?.url === location.pathname + location.search + location.hash && typeof readerReturn?.key === 'string';
        // Native same-document hash entries may have no router key (all appear
        // as "default"). Do not let an unrelated fragment claim their POP scroll.
        const url = location.pathname + location.search + location.hash;
        const popKey = location.key === 'default' ? 'default:' + url : location.key;
        const saved = editingQuery && from
            ? positions.current.get(from.key) ?? window.scrollY
            : navigationType === 'POP' ? positions.current.get(popKey)
            : returningToSource ? (readerReturn.key === 'default' ? positions.current.get('default:' + url) : undefined) ?? positions.current.get(readerReturn.key) : undefined;
        previous.current = location;
        const record = () => {
            positions.current.set(popKey, window.scrollY);
            // Sources can be linked from an entry which did not yet have a hash.
            if (popKey !== location.key) positions.current.set(location.key, window.scrollY);
        };
        const timer = requestAnimationFrame(() => {
            const target = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
            // A known history entry restores its reading position, even if it
            // has a hash. A new explicit anchor navigation selects the anchor.
            if (saved !== undefined)
                window.scrollTo(0, saved);
            else if (target) {
                // Reveal a nested reading entry before measuring it. Only this
                // fallback scrolls to the anchor: a saved position wins above.
                let detail = target.closest<HTMLDetailsElement>('details[data-reader-disclosure]');
                while (detail) {
                    detail.open = true;
                    detail = detail.parentElement?.closest<HTMLDetailsElement>('details[data-reader-disclosure]') ?? null;
                }
                target.scrollIntoView();
            }
            else
                window.scrollTo(0, 0);
            record();
        });
        window.addEventListener('scroll', record, { passive: true });
        // Record while the old page is visible, not during effect cleanup after
        // a shorter new page may already have clamped the browser's scrollY.
        return () => { cancelAnimationFrame(timer); window.removeEventListener('scroll', record); };
    }, [location, navigationType]);
    if (!algorithm && !lesson)
        return null;
    const route = params.get('route');
    const sequence = route === 'book' ? bookLearningPath.map(s => algorithmCatalog.find(a => a.id === s.id)!.path) : route === 'concepts' ? ['/concepts/algebra', '/power', '/concepts/matrices', '/shortest-path', '/concepts/iterators'] : [];
    const index = sequence.indexOf(location.pathname);
    const rawFrom = params.get('from');
    const from = rawFrom?.startsWith('/book') ? rawFrom : algorithm ? algorithmBookLink(algorithm.id) : `/book/${lesson!.sections[0].split('.')[0]}`;
    const readerSource = location.state?.readerSource;
    const returnState = readerSource?.url === from && typeof readerSource?.key === 'string' ? {readerReturn: readerSource} : undefined;
    const withContext = (path: string) => `${path}?${new URLSearchParams({ ...route ? { route } : {}, ...from ? { from } : {} })}`;
    const prerequisite = lesson?.prerequisite ?? (algorithm?.id === 'fast-fibonacci' ? '/power' : algorithm?.id === 'shortest-path' ? '/concepts/matrices' : algorithm?.id === 'binary-search' ? '/concepts/iterators' : undefined);
    return <aside className="learning-shell max-w-6xl" aria-label={zh ? '学习导航' : 'Learning navigation'}><nav className="learning-card !space-y-0 flex flex-wrap gap-4">
    {from && <Link className="learning-link" to={from} state={returnState}>{zh ? '返回来源章节／习题' : 'Return to source section / exercise'}</Link>}
    {prerequisite && <Link className="learning-link" to={prerequisite}>{zh ? '建议先学：相关概念' : 'Learn first: prerequisite concepts'}</Link>}
    {index > 0 && <Link className="learning-link" to={withContext(sequence[index - 1])}>{zh ? '本路线上一站' : 'Previous stop on this route'}</Link>}
    {index >= 0 && index < sequence.length - 1 && <Link className="learning-link" to={withContext(sequence[index + 1])}>{zh ? '本路线下一站' : 'Next stop on this route'}</Link>}
    <Link className="learning-link" to="/book/A">{zh ? '记法速查' : 'Notation'}</Link>
    <Link className="learning-link" to="/book/B">{zh ? '证明方法' : 'Proof techniques'}</Link>
    <Link className="learning-link" to="/book/C">{zh ? 'C++语法' : 'C++ syntax'}</Link>
    {bookResources.filter(r => r.kind === 'code' && (lesson?.codePaths ? lesson.codePaths.includes(r.path) : r.chapter === (lesson?.sections[0].split('.')[0] ?? algorithm?.source.section?.split('.')[0])) && r.path.endsWith('.h')).map(r => <a key={r.path} className="learning-link" href={repoFile(r.path)}>{zh ? '配套代码：' : 'Companion code: '}{r.path.split('/').pop()}</a>)}
    {algorithm && <span className="text-sm text-gray-500">{translations[lang][algorithm.titleKey]}</span>}
  </nav>{algorithm && !sequence.length && <AlgorithmNavigation algorithmId={algorithm.id} lang={lang}/>}</aside>;
}
