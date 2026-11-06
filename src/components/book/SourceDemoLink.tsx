import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { lessonSearchCatalog } from '../../data/algorithmCatalog';

export function SourceDemoLink({path,anchor,entries=[]}:{path:string;anchor:string;entries?:string[]}) {
  const location=useLocation(), {lang}=useLanguage();
  const current=location.hash.slice(1);
  const source=location.pathname+location.search+'#'+(entries.includes(current)?current:anchor);
  const lesson=lessonSearchCatalog.find(l=>l.path===path);
  if (!lesson) throw new Error('Unknown demonstration: '+path);
  return <Link className="learning-link" to={path+'?'+new URLSearchParams({from:source})}
    state={{readerSource:{key:location.key,url:source}}}>{lesson.title[lang]}</Link>;
}
