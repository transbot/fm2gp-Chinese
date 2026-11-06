import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from '../context/LanguageContext';
import { ReaderNavigation } from '../components/common/ReaderNavigation';
import { Book } from './Book';
import { recapTopics } from '../data/bookRecap';
let y=0;
const original=Element.prototype.scrollIntoView;
beforeEach(()=>{
 y=0;localStorage.setItem('fm2gp-language','en');sessionStorage.clear();window.history.replaceState(null,'','/book/14?q=recap&source=reader');
 vi.spyOn(window,'scrollY','get').mockImplementation(()=>y);vi.spyOn(window,'scrollTo').mockImplementation((_x,next)=>{y=next??0;window.dispatchEvent(new Event('scroll'));});
 vi.stubGlobal('requestAnimationFrame',(cb:FrameRequestCallback)=>setTimeout(()=>cb(0),0));vi.stubGlobal('cancelAnimationFrame',clearTimeout);
 Element.prototype.scrollIntoView=vi.fn(function(this:Element){window.scrollTo(0,100+recapTopics.findIndex(t=>t.id===this.id)*100);});
});
afterEach(()=>{cleanup();vi.restoreAllMocks();vi.unstubAllGlobals();Element.prototype.scrollIntoView=original;});
const mount=()=>render(<BrowserRouter><LanguageProvider><Routes><Route path="/book/:chapterId" element={<Book/>}/><Route path="*" element={<h1>Demo</h1>}/></Routes><ReaderNavigation/></LanguageProvider></BrowserRouter>);
const topicLink=(id:string)=>document.querySelector(`nav a[href$="#${id}"]`)!;
it('uses Router history entries for theme navigation and preserves all query parameters',async()=>{
 mount();fireEvent.click(topicLink('review-power'));await waitFor(()=>expect(y).toBe(100));const key=window.history.state.key;window.scrollTo(0,137);
 fireEvent.click(topicLink('review-gcd'));await waitFor(()=>expect(y).toBe(200));expect(window.history.state.key).not.toBe(key);expect(location.search).toBe('?q=recap&source=reader');window.scrollTo(0,245);
 window.history.back();await waitFor(()=>expect(y).toBe(137));expect(location.hash).toBe('#review-power');window.history.forward();await waitFor(()=>expect(y).toBe(245));expect(location.hash).toBe('#review-gcd');
});
it.each(recapTopics.map(t=>[t.id,t.questions[0].id]))('restores %s departure position and expanded explanation through explicit source return',async(id,question)=>{
 mount();fireEvent.click(topicLink(id));await waitFor(()=>expect(location.hash).toBe('#'+id));
 const detail=screen.getByTestId(question);fireEvent.click(detail.querySelector('summary')!);await waitFor(()=>expect(detail).toHaveAttribute('open'));
 fireEvent.click(screen.getByRole('button',{name:'中文'}));expect(detail).toHaveAttribute('open');fireEvent.click(screen.getByRole('button',{name:'English'}));
 window.scrollTo(0,777);const link=screen.getByTestId(id+'-demos').querySelector('a')!;const target=new URL(link.href).pathname;fireEvent.click(link);await screen.findByRole('heading',{name:'Demo'});await waitFor(()=>expect(y).toBe(0));
 expect(new URLSearchParams(location.search).get('from')).toBe('/book/14?q=recap&source=reader#'+id);
 fireEvent.click(screen.getByRole('link',{name:'Return to source section / exercise'}));await waitFor(()=>expect(location.pathname).toBe('/book/14'));await waitFor(()=>expect(y).toBe(777));expect(location.hash).toBe('#'+id);expect(location.search).toBe('?q=recap&source=reader');expect(screen.getByTestId(question)).toHaveAttribute('open');
 window.history.back();await waitFor(()=>expect(location.pathname).toBe(target));window.history.forward();await waitFor(()=>expect(y).toBe(777));
});
it('locates a direct hash, restores it on a fresh mount, and tolerates malformed stored disclosures',async()=>{
 sessionStorage.setItem('fm2gp-recap-open','{broken');window.history.replaceState(null,'','/book/14?q=recap#review-iterators');mount();await waitFor(()=>expect(y).toBe(300));cleanup();window.scrollTo(0,0);mount();await waitFor(()=>expect(y).toBe(300));expect(screen.getByRole('heading',{level:1})).toHaveTextContent('Conclusions');
});

it('restores the six pre-existing disclosure IDs from the phase 6 session key',()=>{
 const ids=['power-conditions','power-matrices','gcd-loop','gcd-useful-return','iterators-forward','iterators-buffer'];
 sessionStorage.setItem('fm2gp-recap-open',JSON.stringify(ids));mount();
 for(const id of ids)expect(screen.getByTestId(id)).toHaveAttribute('open');
});
