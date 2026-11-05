import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from '../context/LanguageContext';
import { ReaderNavigation } from '../components/common/ReaderNavigation';
import { Division } from '../components/algorithms/Division';
import { Book } from './Book';

let y=0;
const originalScrollIntoView=Element.prototype.scrollIntoView;
beforeEach(()=>{
  y=0;localStorage.setItem('fm2gp-language','en');
  window.history.replaceState(null,'','/book/4');
  vi.spyOn(window,'scrollY','get').mockImplementation(()=>y);
  vi.spyOn(window,'scrollTo').mockImplementation((_x,next)=>{y=next??0;window.dispatchEvent(new Event('scroll'));});
  vi.stubGlobal('requestAnimationFrame',(cb:FrameRequestCallback)=>setTimeout(()=>cb(0),0));
  vi.stubGlobal('cancelAnimationFrame',clearTimeout);
  Element.prototype.scrollIntoView=vi.fn(function(this:Element){window.scrollTo(0,this.id==='section-4-5'?450:this.id==='section-4-6'?600:900);});
});
afterEach(()=>{cleanup();vi.restoreAllMocks();vi.unstubAllGlobals();Element.prototype.scrollIntoView=originalScrollIntoView;});
const mount=()=>render(<BrowserRouter><LanguageProvider><Routes><Route path="/book/:chapterId" element={<Book/>}/><Route path="/division" element={<Division/>}/></Routes><ReaderNavigation/></LanguageProvider></BrowserRouter>);
const section=(id:string)=>document.querySelector(`nav a[href$="#section-${id}"]`)!;
const click=async(id:string,expected:number)=>{fireEvent.click(section(id));await waitFor(()=>expect(window.location.hash).toBe('#section-'+id));await waitFor(()=>expect(y).toBe(expected));};
it('gives consecutive section links independent BrowserRouter keys and explicit query-preserving targets',async()=>{
  window.history.replaceState(null,'','/book/4?q=Fibonacci%20remainder');mount();
  expect(section('4-5')).toHaveAttribute('href','/book/4?q=Fibonacci%20remainder#section-4-5');
  await click('4-5',450);const key45=window.history.state.key;expect(key45).toBeTypeOf('string');
  await click('4-6',600);expect(window.history.state.key).toBeTypeOf('string');expect(window.history.state.key).not.toBe(key45);
  expect(new URLSearchParams(window.location.search).get('q')).toBe('Fibonacci remainder');
});
it('restores each actual departure position after manual scrolling and repeated POP navigation',async()=>{
  mount();await click('4-5',450);const key45=window.history.state.key;window.scrollTo(0,537);
  await click('4-6',600);const key46=window.history.state.key;window.scrollTo(0,723);
  window.history.back();await waitFor(()=>expect(window.location.hash).toBe('#section-4-5'));await waitFor(()=>expect(y).toBe(537));expect(window.history.state.key).toBe(key45);
  window.scrollTo(0,584);window.history.forward();await waitFor(()=>expect(window.location.hash).toBe('#section-4-6'));await waitFor(()=>expect(y).toBe(723));expect(window.history.state.key).toBe(key46);
  window.history.back();await waitFor(()=>expect(window.location.hash).toBe('#section-4-5'));await waitFor(()=>expect(y).toBe(584));
});
it('positions a direct hash address and a fresh mount at the same hash',async()=>{
  window.history.replaceState(null,'','/book/4?q=test#section-4-6');mount();await waitFor(()=>expect(y).toBe(600));
  cleanup();window.scrollTo(0,0);mount();await waitFor(()=>expect(y).toBe(600));expect(window.location.search).toBe('?q=test');
});
it.each(['section','exercise'])('returns from division to its %s 4.6 source',async kind=>{
  window.history.replaceState(null,'','/book/4?q=Fibonacci');mount();
  fireEvent.click(document.querySelector(`#${kind}-4-6 a[href^="/division"]`)!);
  await screen.findByLabelText('A: original dividend');fireEvent.click(screen.getByRole('link',{name:'Return to source section / exercise'}));
  await waitFor(()=>expect(window.location.hash).toBe(`#${kind}-4-6`));await waitFor(()=>expect(y).toBe(kind==='section'?600:900));expect(window.location.search).toBe('?q=Fibonacci');
});
