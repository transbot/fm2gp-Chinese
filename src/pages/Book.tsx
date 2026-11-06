import { useLayoutEffect, useMemo, useState } from 'react';
import { Chapter9 } from '../components/book/Chapter9';
import { AppendixReference } from '../components/book/AppendixReference';
import { readingKeywords } from '../data/readingSections';
import { BookRecap } from './BookRecap';
import { Link, useLocation, useNavigationType, useParams, useSearchParams } from 'react-router-dom';
import { LearningShell } from '../components/common/LearningShell';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';
import { algorithmCatalog } from '../data/algorithmCatalog';
import { bookCatalog, bookResources, chapterExercises, conceptLessons, sectionAlgorithms, searchBook, sectionAnchor, exerciseAnchor, repoFile } from '../data/bookCatalog';
// A router replacement may be deferred. Keep the visible editor current on
// every keystroke, and restore it from the URL on actual history navigation.
function DirectorySearch({query,label,update}:{query:string;label:string;update:(q:string)=>void}) {
    const [draft,setDraft]=useState(query);
    const navigation=useNavigationType();
    useLayoutEffect(()=>{if(navigation!=='REPLACE')setDraft(query);},[query,navigation]);
    return <label className="block">{label}<input className="learning-input w-full mt-2" type="search" value={draft}
      onChange={event=>{const next=event.target.value;setDraft(next);update(next);}}/></label>;
}
export function Book() {
    const { lang } = useLanguage(), zh = lang === 'zh', t = translations[lang];
    const { chapterId } = useParams();
    const location = useLocation();
    const [params, setParams] = useSearchParams();
    const query = params.get('q') || '';
    const matches = useMemo(()=>chapterId ? [] : searchBook(query),[chapterId,query]);
    const chapter = bookCatalog.find(c => c.id === chapterId);
    const from = (anchor: string) => `?from=${encodeURIComponent(`${location.pathname}${location.search}#${anchor}`)}`;
    return <LearningShell title={chapter ? `${chapter.id} · ${chapter.title[lang]}` : zh ? '按本书章节学习' : 'Learn chapter by chapter'} description={chapter?.guide[lang] ?? (zh ? '按章节寻找演示、代码和习题；没有交互的内容提供阅读导引。' : 'Find demonstrations, code, and exercises by chapter. Reading guides cover topics without an interactive lesson.')}>
    {!chapterId ? <>
      <DirectorySearch query={query} label={zh ? '搜索章节、节号、习题、术语或函数' : 'Search chapters, sections, exercises, terms, or functions'}
        update={value=>{const next=new URLSearchParams(params);if(value)next.set('q',value);else next.delete('q');setParams(next,{replace:true});}}/>
      {/* Keep enough document height below the search field when results shrink. */}
      <div className="min-h-screen"><div className="grid sm:grid-cols-2 gap-4">{matches.map(c => <article className="learning-card" key={c.id}><h2 className="text-lg font-semibold"><Link className="learning-link" to={{pathname: `/book/${c.id}`, search: location.search, hash: ''}}>{c.id} · {c.title[lang]}</Link></h2><p className="text-sm leading-6">{c.guide[lang]}</p>{query && <ul className="space-y-2">{c.sections.map(s => <li key={s.id}><Link className="learning-link" to={{pathname: `/book/${c.id}`, search: location.search, hash: `#${sectionAnchor(s.id)}`}}>{zh ? '第' : 'Section '}{s.id}{zh ? '节' : ''} · {s.title[lang]}</Link></li>)}{c.exercises.map(e => <li key={e.id}><Link className="learning-link" to={{pathname: `/book/${c.id}`, search: location.search, hash: `#${exerciseAnchor(e.id)}`}}>{zh ? '习题' : 'Exercise'} {e.id}</Link></li>)}</ul>}</article>)}</div>
      {!matches.length && <p role="status">{zh ? '未找到匹配资料。试试节号或函数名。' : 'No matching resources. Try a section number or function name.'}</p>}</div>
    </> : chapter ? <>
      <Link className="learning-link" to={{pathname: '/book', search: location.search, hash: ''}}>{zh ? '返回章节目录' : 'Back to chapter directory'}</Link>

      {chapter.id === '14' ? <BookRecap/> : <nav className="learning-card !space-y-0 flex flex-wrap gap-3">{chapter.sections.map(s => <Link className="learning-link" key={s.id} to={{ pathname: location.pathname, search: location.search, hash: `#${sectionAnchor(s.id)}` }}>{s.id} {s.title[lang]}</Link>)}</nav>}
      {chapter.id === '8' && <nav className="learning-card" aria-label={zh ? '多项式学习路线' : 'Polynomial learning route'}><h2 className="text-xl font-semibold">{zh ? '多项式学习路线' : 'Polynomial learning route'}</h2><p>{zh ? '先用霍纳法则求值，再用带余除法理解A(r)为何等于余数，最后把求余接入泛型GCD循环。第8.8节解释有理数系数为什么能够相除。' : 'Evaluate with Horner, use division to understand why A(r) equals the remainder, then connect remainders to generic GCD. Section 8.8 explains division of rational coefficients.'}</p><div className="flex flex-wrap gap-4"><Link className="learning-link" to={'/horner' + from(sectionAnchor('8.1'))}>{zh ? '霍纳法则' : 'Horner'}</Link><Link className="learning-link" to={'/polynomial-gcd' + from(sectionAnchor('8.7'))}>{zh ? '带余除法与GCD' : 'Division and GCD'}</Link><Link className="learning-link" to={{pathname:location.pathname,search:location.search,hash:'#section-8-8'}}>{zh ? '第8.8节：域' : 'Section 8.8: fields'}</Link></div></nav>}
      {chapter.sections.map(s => {
                const demos = sectionAlgorithms(s.id), lessons = conceptLessons.filter(l => l.sections.includes(s.id));
                return <section className="learning-card" id={sectionAnchor(s.id)} key={s.id}>
        <h2 className="text-xl font-semibold">{zh ? '第' : 'Section '}{s.id}{zh ? '节' : ''} · {s.title[lang]}</h2>
        {s.id in readingKeywords && (chapter.id === '9' ? <Chapter9 section={s.id}/> : <AppendixReference section={s.id}/>)}
        {!(s.id in readingKeywords) && !demos.length && !lessons.length && <p>{zh ? '阅读导引：结合本章导读阅读这一节，留意定义、前提与例子之间的关系。' : 'Reading guide: use the chapter overview to connect this section’s definitions, assumptions, and examples.'}</p>}
        {demos.map(a => <p key={a.id}><Link className="learning-link" to={a.path + from(sectionAnchor(s.id))}>{zh ? '交互演示：' : 'Interactive: '}{t[a.titleKey]}</Link></p>)}
        {lessons.filter(l => !demos.some(a => a.path === l.path)).map(l => <p key={l.id}><Link className="learning-link" to={l.path + from(sectionAnchor(s.id))}>{zh ? '概念演示：' : 'Concept lab: '}{l.title[lang]}</Link></p>)}
      </section>;
            })}
      <section className="learning-card"><h2 className="text-xl font-semibold">{zh ? '配套代码与阅读资料' : 'Companion code and reading'}</h2>
        {bookResources.filter(r => r.chapter === chapter.id || r.chapter === 'all').filter((r, i, resources) => resources.findIndex(item => item.path === r.path) === i).map(r => <div key={r.path} className="space-y-2"><a className="learning-link" href={repoFile(r.path)}>{r.path.split('/').pop()}</a>{'functions' in r && <div className="flex flex-wrap gap-3">{r.functions?.map(f => <a className="learning-link text-sm" key={f.line} href={repoFile(r.path, f.line)}>{f.name} · L{f.line}</a>)}</div>}</div>)}
      </section>
      {chapterExercises.filter(e => e.id.split('.')[0] === chapter.id).map(e => <section key={e.id} id={exerciseAnchor(e.id)} className="learning-card"><h2 className="text-lg font-semibold">{zh ? '习题' : 'Exercise'} {e.id}</h2>
        {e.resources.map(r => <p key={r.path}><a className="learning-link" href={repoFile(r.path)}>{r.kind === 'program' ? (zh ? '程序' : 'Program') : e.id === '2.1' ? (zh ? '提示与参考' : 'Hint and reference') : (zh ? '参考解答' : 'Reference solution')} · {r.format.toUpperCase()}</a></p>)}
        {algorithmCatalog.filter(a => a.source.type === 'exercise' && a.source.section === e.id).map(a => <Link key={a.id} className="learning-link" to={a.path + from(exerciseAnchor(e.id))}>{t[a.titleKey]}</Link>)}
        {e.id === '4.6' && <Link className="learning-link" to={'/division' + from(exerciseAnchor(e.id))}>{zh ? '斐波那契求余演示：45÷6' : 'Fibonacci remainder demonstration: 45÷6'}</Link>}
        {e.id === '11.13' && <Link className="learning-link" to={'/reverse' + from(exerciseAnchor(e.id))}>{zh ? '递归反转演示：九元素' : 'Recursive reverse demonstration: nine elements'}</Link>}
        {e.id === '8.3' && <Link className="learning-link" to={'/polynomial-gcd' + from(exerciseAnchor(e.id))}>{zh ? '多项式GCD演示：前两题' : 'Polynomial GCD demonstration: first two parts'}</Link>}
        {e.id === '8.7' && <Link className="learning-link" to={'/concepts/matrices' + from(exerciseAnchor(e.id))}>{zh ? '可达性演示' : 'Reachability demonstration'}</Link>}
        {!e.resources.length && <p>{zh ? '阅读题目与本章导引；此处尚无参考解答。' : 'Read the exercise with the chapter guide; no reference solution is available here yet.'}</p>}
        {e.id === '7.1' && <p className="text-sm text-gray-600">{zh ? '原 PDF 外链已失效；现提供可访问的配套程序。' : 'The original PDF link is unavailable; the companion program remains accessible.'}</p>}
      </section>)}
    </> : <p>{zh ? '未找到这一章。' : 'Chapter not found.'} <Link className="learning-link" to={{pathname: '/book', search: location.search, hash: ''}}>{zh ? '返回目录' : 'Back to directory'}</Link></p>}
  </LearningShell>;
}
