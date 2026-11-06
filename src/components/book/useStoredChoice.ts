import {useState} from 'react';

// Read during the first render, before the reader restores its scroll position.
export function useStoredChoice<T extends string>(key:string, options:readonly T[], fallback:T) {
  const [value,setValue]=useState<T>(()=>{
    try {
      const saved=sessionStorage.getItem(key);
      return options.find(option=>option===saved) ?? fallback;
    } catch { return fallback; }
  });
  function choose(raw:string) {
    const next=options.find(option=>option===raw);
    if(next===undefined)return;
    setValue(next);
    try { sessionStorage.setItem(key,next); } catch { /* Local interaction still works. */ }
  }
  return {value,choose};
}
