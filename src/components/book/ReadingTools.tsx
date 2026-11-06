import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Native details owns the open state. Seed it synchronously on mount so that
// restoring scroll never measures the shorter, collapsed layout first.
export function ReadingDetail({id,label,children}:{id:string;label:ReactNode;children:ReactNode}) {
  const key = 'fm2gp-reading:' + id;
  const [initial] = useState(() => {
    try { return sessionStorage.getItem(key) === 'open'; } catch { return false; }
  });
  return <details id={id} data-reader-disclosure="" open={initial} className="learning-note min-w-0"
    onToggle={e => {
      if (e.target !== e.currentTarget) return;
      try { sessionStorage.setItem(key,e.currentTarget.open ? 'open' : 'closed'); } catch { /* storage is optional */ }
    }}>
    <summary className="cursor-pointer font-semibold rounded focus-visible:outline focus-visible:outline-blue-600">{label}</summary>
    <div className="mt-3 space-y-3 leading-7">{children}</div>
  </details>;
}

export function ReadingLink({to,children}:{to:string;children:ReactNode}) {
  const {search}=useLocation();
  const [pathname,hash]=to.split('#');
  return <Link className="learning-link" to={{pathname,search,hash:hash ? '#'+hash : ''}}>{children}</Link>;
}
