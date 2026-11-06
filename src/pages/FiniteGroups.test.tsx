import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {MemoryRouter,Route,Routes} from 'react-router-dom';
import {LanguageProvider} from '../context/LanguageContext';
import {Book} from './Book';

function mount() {
  return render(<MemoryRouter initialEntries={['/book/6?source=group-reader&tag=two+words&q=coset#section-6-3']}>
    <LanguageProvider><Routes><Route path="/book/:chapterId" element={<Book/>}/></Routes></LanguageProvider>
  </MemoryRouter>);
}
const selects=()=>['Choose an element','Choose a coset representative'].map(name=>screen.getByRole('combobox',{name}) as HTMLSelectElement);
const change=(i:number,value:number)=>fireEvent.change(selects()[i],{target:{value:String(value)}});
const elementKey='fm2gp:book:6.4:element', repKey='fm2gp:book:6.5:representative';
beforeEach(()=>{sessionStorage.clear();localStorage.setItem('fm2gp-language','en');});
afterEach(()=>{cleanup();vi.restoreAllMocks();});

describe('Chapter 6 selectors',()=>{
  it.each([[null,null],['',''],['0','7'],['3x','2.0'],['03',' 6']])('defaults for %s and %s',(a,b)=>{
    if(a!==null)sessionStorage.setItem(elementKey,a);
    if(b!==null)sessionStorage.setItem(repKey,b);
    mount();expect(selects().map(s=>s.value)).toEqual(['2','3']);
  });
  it('reads both independently and restores the selection and ordered output on remount',()=>{
    sessionStorage.setItem(elementKey,'3');
    const first=mount();expect(selects().map(s=>s.value)).toEqual(['3','3']);
    change(1,6);expect(sessionStorage.getItem(repKey)).toBe('6');
    first.unmount();mount();expect(selects().map(s=>s.value)).toEqual(['3','6']);
    expect(screen.getByTestId('power-sequence')).toHaveTextContent('3 → 2 → 6 → 4 → 5 → 1');
    expect(screen.getByTestId('coset-products')).toHaveTextContent('6 → 5 → 3');
    expect(screen.getByTestId('coset-members')).toHaveTextContent('{3, 5, 6}');
  });
  it('keeps both selectors usable when storage access throws',()=>{
    for(const method of ['getItem','setItem'] as const) {
      const original=Storage.prototype[method];
      vi.spyOn(Storage.prototype,method).mockImplementation(function(this:Storage,...args:string[]){
        if(this===sessionStorage)throw new Error('storage unavailable');
        return Reflect.apply(original,this,args);
      });
    }
    mount();expect(selects().map(s=>s.value)).toEqual(['2','3']);
    change(0,3);change(1,6);expect(selects().map(s=>s.value)).toEqual(['3','6']);
    expect(screen.getByTestId('coset-products')).toHaveTextContent('6 → 5 → 3');
  });
  it.each(['fermat','euler'])('uses the %s card even when location has the earlier section hash',demo=>{
    mount();const link=document.querySelector('#lagrange-'+demo+' a[href^="/'+demo+'?"]');
    expect(link).toBeTruthy();
    expect(new URL(link!.getAttribute('href')!,location.origin).searchParams.get('from')).toBe('/book/6?source=group-reader&tag=two+words&q=coset#lagrange-'+demo);
  });
});
