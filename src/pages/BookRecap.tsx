import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { recapTopics } from '../data/bookRecap';
import { SourceDemoLink } from '../components/book/SourceDemoLink';
import { bookCatalog, sectionAnchor } from '../data/bookCatalog';
const storageKey='fm2gp-recap-open';
const questionIds=new Set(recapTopics.flatMap(t=>t.questions.map(q=>q.id)));
function readExpanded():string[]{
  try{const saved:unknown=JSON.parse(sessionStorage.getItem(storageKey)||'[]');return Array.isArray(saved)?saved.filter((id):id is string=>typeof id==='string'&&questionIds.has(id)):[];}catch{return [];}
}
export function BookRecap(){
 const {lang}=useLanguage(),zh=lang==='zh',location=useLocation();
 const [expanded,setExpanded]=useState(readExpanded);
 const toggle=(id:string,open:boolean)=>setExpanded(previous=>{
  const next=open?[...new Set([...previous,id])]:previous.filter(v=>v!==id);
  try{sessionStorage.setItem(storageKey,JSON.stringify(next));}catch{/* Reading still works without storage. */}
  return next;
 });
 const demo=(path:string,topic:string)=><SourceDemoLink key={path} path={path} anchor={topic}/>;
 return <>
  <nav aria-label={zh?'全书回顾主题':'Book review topics'} className="learning-card !space-y-0 flex flex-wrap gap-3">{recapTopics.map(t=><Link key={t.id} className="learning-link" to={{pathname:location.pathname,search:location.search,hash:`#${t.id}`}}>{t.title[lang]}</Link>)}</nav>
  <p className="text-sm text-gray-600">{zh?'先尝试回答回顾问题，再展开参考解释；用相关章节和演示验证自己的理解。':'Try answering the review questions first, then open the reference explanations. Use the linked sections and demonstrations to check your understanding.'}</p>
  {recapTopics.map(topic=><section className="learning-card min-w-0" id={topic.id} key={topic.id}>
   <h2 className="text-xl font-semibold text-blue-900">{topic.title[lang]}</h2>
   <p className="leading-7">{topic.summary[lang]}</p>
   <nav aria-label={`${topic.title[lang]} · ${zh?'相关演示':'Related demonstrations'}`} data-testid={`${topic.id}-demos`} className="flex flex-wrap gap-x-5 gap-y-3">{topic.demos.map(path=>demo(path,topic.id))}</nav>
   <div className="space-y-5">{topic.questions.map((q,i)=><article key={q.id} className="border-t pt-4">
    <h3 className="font-semibold leading-7" id={`${q.id}-question`}>{zh?'回顾问题':'Review question'} {i+1} · {q.question[lang]}</h3>
    <details data-testid={q.id} className="learning-note mt-3" open={expanded.includes(q.id)} onToggle={e=>toggle(q.id,e.currentTarget.open)}>
     <summary className="cursor-pointer font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 rounded" aria-label={`${zh?'参考解释':'Reference explanation'}: ${q.question[lang]}`}>{zh?'参考解释':'Reference explanation'}</summary>
     <div className="mt-3 space-y-4 leading-7">{q.explanation.map((p,j)=><p key={j}>{p[lang]}</p>)}
      <nav aria-label={zh?'对应章节':'Related sections'} className="flex flex-wrap gap-x-5 gap-y-2">{q.sections.map(id=>{const section=bookCatalog.flatMap(c=>c.sections).find(s=>s.id===id)!;return <Link key={id} className="learning-link" to={`/book/${id.split('.')[0]}#${sectionAnchor(id)}`}>{zh?'第':'Section '}{id}{zh?'节':''} · {section.title[lang]}</Link>;})}</nav>
      <nav aria-label={zh?'验证解释的演示':'Demonstrations for checking the explanation'} className="flex flex-wrap gap-x-5 gap-y-2">{q.demos.map(path=>demo(path,topic.id))}</nav>
     </div>
    </details>
   </article>)}</div>
  </section>)}
 </>;
}
