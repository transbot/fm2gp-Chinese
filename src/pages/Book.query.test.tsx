import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {afterEach, beforeEach, expect, it, vi} from 'vitest';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Book} from './Book';
import {LanguageProvider} from '../context/LanguageContext';
import {ReaderNavigation} from '../components/common/ReaderNavigation';

const suffix='?source=proof-reader&tag=two+words';
beforeEach(()=>{sessionStorage.clear();window.history.replaceState(null,'','/book'+suffix);vi.spyOn(window,'scrollTo').mockImplementation(()=>{});});
afterEach(()=>{cleanup();vi.restoreAllMocks();});
function mount(lang:string) {
 localStorage.setItem('fm2gp-language',lang);
 render(<BrowserRouter><LanguageProvider><Routes><Route path="/book" element={<Book/>}/><Route path="/book/:chapterId" element={<Book/>}/><Route path="/power" element={<h1>Power</h1>}/></Routes><ReaderNavigation/></LanguageProvider></BrowserRouter>);
}
const params=(search:string)=>Object.fromEntries(new URLSearchParams(search));
const original={source:'proof-reader',tag:'two words'};
it.each(['zh','en'])('preserves full directory context through the actual reading sequence (%s)',async lang=>{
 mount(lang);const q=lang==='zh'?'归纳':'induction';
 fireEvent.change(screen.getByRole('searchbox'),{target:{value:q}});
 const expected={...original,q};
 const section=document.querySelector('a[href$="#section-9-7"]')!;
 expect(params(new URL(section.getAttribute('href')!,location.origin).search)).toEqual(expected);
 fireEvent.click(section);
 await waitFor(()=>expect(location.pathname).toBe('/book/9'));
 expect(params(location.search)).toEqual(expected);
 const proof=document.getElementById('addition-associativity') as HTMLDetailsElement;
 proof.open=true;fireEvent(proof,new Event('toggle'));
 const demo=proof.querySelector('a[href^="/power?"]')!;
 const from=new URL(demo.getAttribute('href')!,location.origin).searchParams.get('from')!;
 expect(from).toBe('/book/9'+location.search+'#addition-associativity');
 fireEvent.click(demo);
 fireEvent.click(await screen.findByRole('link',{name:lang==='zh'?'返回来源章节／习题':'Return to source section / exercise'}));
 await waitFor(()=>expect(location.hash).toBe('#addition-associativity'));
 expect(params(location.search)).toEqual(expected);
 expect(document.getElementById('addition-associativity')).toHaveAttribute('open');
 fireEvent.click(screen.getByRole('link',{name:lang==='zh'?'返回章节目录':'Back to chapter directory'}));
 expect(screen.getByRole('searchbox')).toHaveValue(q);expect(params(location.search)).toEqual(expected);
 fireEvent.change(screen.getByRole('searchbox'),{target:{value:''}});
 expect(params(location.search)).toEqual(original);
});
it.each(['zh','en'])('preserves queries and exact anchors on all result kinds and ordinary demos (%s)',lang=>{
 mount(lang);fireEvent.change(screen.getByRole('searchbox'),{target:{value:'9.2'}});
 const expected={...original,q:'9.2'};
 for(const hash of ['', '#section-9-2','#exercise-9-2']) {
  const link=document.querySelector(hash?`a[href$="${hash}"]`:'article h2 a')!;
  const url=new URL(link.getAttribute('href')!,location.origin);
  expect(url.pathname).toBe('/book/9');expect(url.hash).toBe(hash);expect(params(url.search)).toEqual(expected);
 }
 fireEvent.click(document.querySelector('a[href$="#exercise-9-2"]')!);
 const link=document.querySelector('#exercise-9-2 a[href^="/pi-upper-bound?"]')!;
 expect(link).not.toBeNull();
 const source=new URL(link.getAttribute('href')!,location.origin).searchParams.get('from')!;
 expect(source).toBe('/book/9'+location.search+'#exercise-9-2');
});
