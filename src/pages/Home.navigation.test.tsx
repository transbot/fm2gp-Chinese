import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { LanguageProvider } from '../context/LanguageContext';
import { Home } from './Home';
import { Book } from './Book';
import { ReaderNavigation } from '../components/common/ReaderNavigation';

// jsdom models scroll calls; the browser script measures real bounding boxes.
let y = 0;
const originalScrollIntoView = Element.prototype.scrollIntoView;
beforeEach(() => {
  vi.useFakeTimers(); y=0; localStorage.setItem('fm2gp-language','en');
  vi.spyOn(window,'scrollY','get').mockImplementation(()=>y);
  vi.spyOn(window,'scrollTo').mockImplementation((_x,next)=>{y=next??0;window.dispatchEvent(new Event('scroll'));});
  vi.stubGlobal('requestAnimationFrame',(cb:FrameRequestCallback)=>setTimeout(()=>cb(0),16));
  vi.stubGlobal('cancelAnimationFrame',clearTimeout);
  Element.prototype.scrollIntoView=vi.fn(function(this:Element){y=this.id==='exercise-4-6'?1800:900;window.dispatchEvent(new Event('scroll'));});
});
afterEach(()=>{cleanup();vi.restoreAllMocks();Element.prototype.scrollIntoView=originalScrollIntoView;vi.unstubAllGlobals();vi.useRealTimers();});
const frame=()=>act(()=>vi.advanceTimersByTime(32));
const scroll=(value:number)=>act(()=>window.scrollTo(0,value));
function HistoryControls() {
  const navigate = useNavigate();
  return <><button onClick={()=>navigate(-1)}>Browser back</button><button onClick={()=>navigate(1)}>Browser forward</button></>;
}
const mount=(path='/')=>{
  render(<MemoryRouter initialEntries={[path]}><LanguageProvider><Routes><Route path="/" element={<Home/>}/><Route path="/book" element={<Book/>}/><Route path="/book/:chapterId" element={<Book/>}/><Route path="/division" element={<h1>Division destination</h1>}/></Routes><ReaderNavigation/><HistoryControls/></LanguageProvider></MemoryRouter>);frame();
};
const type=(text:string,expectedY:number)=>{
  const field=screen.getByRole('searchbox');field.focus();
  for(let i=1;i<=text.length;i++){fireEvent.change(field,{target:{value:text.slice(0,i)}});frame();expect(window.scrollY).toBe(expectedY);expect(field).toHaveFocus();}
};
it('keeps actual navigation scroll stable for typing, deletion, clear and reset',()=>{
  mount();scroll(1200);type('Fibonacci remainder',1200);
  const field=screen.getByRole('searchbox');
  for(let i='Fibonacci remainder'.length-1;i>=0;i--){fireEvent.change(field,{target:{value:'Fibonacci remainder'.slice(0,i)}});frame();expect(window.scrollY).toBe(1200);expect(field).toHaveFocus();}
  type('Fibonacci remainder',1200);fireEvent.change(field,{target:{value:''}});frame();expect(window.scrollY).toBe(1200);
  type('Fibonacci remainder',1200);fireEvent.click(screen.getByRole('button',{name:'Reset'}));frame();expect(window.scrollY).toBe(1200);expect(field).toHaveValue('');
});
it('restores query and entry-specific reading positions on back and forward',()=>{
  mount();scroll(1200);type('Fibonacci remainder',1200);
  fireEvent.click(within(screen.getByTestId('lesson-results')).getByRole('link'));frame();expect(window.scrollY).toBe(0);
  scroll(480);fireEvent.click(screen.getByRole('button',{name:'Browser back'}));frame();expect(screen.getByRole('searchbox')).toHaveValue('Fibonacci remainder');expect(window.scrollY).toBe(1200);
  fireEvent.click(screen.getByRole('button',{name:'Browser forward'}));frame();expect(screen.getByRole('heading',{name:'Division destination'})).toBeInTheDocument();expect(window.scrollY).toBe(480);
});
it('restores a freshly opened URL query and result',()=>{
  mount('/?q=Fibonacci%20remainder');expect(screen.getByRole('searchbox')).toHaveValue('Fibonacci remainder');expect(within(screen.getByTestId('lesson-results')).getAllByRole('link')).toHaveLength(1);
});
it.each(['section','exercise'])('keeps book query edits stable and returns to the %s source anchor',kind=>{
  mount('/book');scroll(120);type(kind==='section'?'Section 4.6':'Exercise 4.6',120);
  const field=screen.getByRole('searchbox');fireEvent.change(field,{target:{value:''}});frame();expect(window.scrollY).toBe(120);
  type(kind==='section'?'Section 4.6':'Exercise 4.6',120);const anchor=`${kind}-4-6`;
  fireEvent.click(document.querySelector(`a[href*="#${anchor}"]`)!);frame();expect(window.scrollY).toBe(kind==='section'?900:1800);
  fireEvent.click(document.querySelector(`#${anchor} a[href^="/division"]`)!);frame();expect(window.scrollY).toBe(0);
  fireEvent.click(screen.getByRole('link',{name:'Return to source section / exercise'}));frame();expect(window.scrollY).toBe(kind==='section'?900:1800);
  scroll(980);fireEvent.click(document.querySelector(`#${anchor} a[href^="/division"]`)!);frame();
  fireEvent.click(screen.getByRole('button',{name:'Browser back'}));frame();expect(window.scrollY).toBe(980);
});
