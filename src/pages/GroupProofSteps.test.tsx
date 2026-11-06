import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {MemoryRouter, Routes, Route} from 'react-router-dom';
import {afterEach, beforeEach, expect, it, vi} from 'vitest';
import {LanguageProvider} from '../context/LanguageContext';
import {Book} from './Book';

const expected = [
  ['order-left-translation','Lₐ(x) = ax,   Lₐ⁻¹(y) = a⁻¹y','左乘 a 后左乘 a⁻¹','Left multiplication by a has an inverse'],
  ['order-repeated-powers','|G| = N;   a¹, a², …, aᴺ⁺¹','鸽巢原理','pigeonhole principle'],
  ['order-cancel-on-right','aʲa⁻ⁱ = aⁱa⁻ⁱ = e','右乘 (aⁱ) 的逆元','Right-multiply both sides'],
  ['order-positive-exponent','aʲ⁻ⁱ = e,   j − i > 0','最小的才是元素的阶','least such exponent is the order'],
  ['cyclic-first-return','d = ord(a),   aᵈ = e','首次回到单位元素','first positive exponent'],
  ['cyclic-distinct-powers','0 ≤ i < j < d','与 d 的最小性矛盾','contradicting minimality'],
  ['cyclic-period','aᵏ⁺ᵈ = aᵏaᵈ = aᵏ','相隔 d 的幂相等','Exponents differing by d'],
  ['cyclic-product-closure','aⁱaʲ = aⁱ⁺ʲ,   a⁰ = e','对原群运算封闭','closed under the group operation'],
  ['cyclic-inverses','aᵏaᵈ⁻ᵏ = aᵈ = e','就是 aᵏ 的逆元','the inverse of aᵏ'],
  ['coset-equal-size','H → aH: h ↦ ah','每个陪集与 H 等大','each coset has the size of H'],
  ['coset-cover','a = ae ∈ aH','H 含单位元素','H contains the identity'],
  ['coset-intersection','ahₐ = bhᵦ   ⇒   a = b(hᵦhₐ⁻¹)','右乘 hₐ⁻¹','Right-multiply by hₐ⁻¹'],
  ['coset-forward-inclusion','ax = b((hᵦhₐ⁻¹)x) ∈ bH','aH ⊆ bH','aH ⊆ bH'],
  ['coset-reverse-inclusion','b = a(hₐhᵦ⁻¹),   bx = a((hₐhᵦ⁻¹)x) ∈ aH','改为右乘 hᵦ⁻¹','Right-multiply instead by hᵦ⁻¹'],
  ['coset-count','|G| = [G:H] · |H|','数出陪集个数','Counting them gives the index']
];
const mount=()=>render(<MemoryRouter initialEntries={["/book/6"]}><LanguageProvider><Routes><Route path="/book/:chapterId" element={<Book/>}/></Routes></LanguageProvider></MemoryRouter>);
const detail=(id:string)=>{
  const node=document.getElementById(id);
  expect(node,id).toBeInstanceOf(HTMLDetailsElement);
  return node as HTMLDetailsElement;
};
function toggle(id:string){fireEvent.click(detail(id).querySelector('summary')!);}
beforeEach(()=>{sessionStorage.clear();localStorage.setItem('fm2gp-language','en');});
afterEach(()=>{cleanup();vi.restoreAllMocks();});

it.each(['en','zh'])('keeps the 15 unique anchors, formulas and reasons paired in %s',lang=>{
  localStorage.setItem('fm2gp-language',lang);mount();
  const rows=[...document.querySelectorAll('#element-order ol > li, #cyclic-size ol > li, #coset-proof ol > li')];
  expect(rows).toHaveLength(15);
  expect(new Set([...document.querySelectorAll('[id]')].map(n=>n.id)).size).toBe(document.querySelectorAll('[id]').length);
  expected.forEach(([id,formula,zh,en],i)=>{
    const node=detail(id);
    expect(rows[i].querySelector('code')?.textContent).toBe(formula);
    expect(rows[i].querySelector('details')).toBe(node);
    expect(node.querySelector('summary')).toHaveTextContent(lang==='zh'?'查看本步依据':'Why this step is valid');
    expect(node.querySelector('p')).toHaveTextContent(lang==='zh'?zh:en);
    expect(node.open).toBe(false);
  });
});

it('toggles each reason independently and restores the mixture on remount',async()=>{
  const view=mount();
  toggle('element-order');toggle('order-left-translation');toggle('order-repeated-powers');
  toggle('order-left-translation');
  expect(detail('order-repeated-powers').open).toBe(true);
  await waitFor(()=>expect(sessionStorage.getItem('fm2gp-reading:order-repeated-powers')).toBe('open'));
  await waitFor(()=>expect(sessionStorage.getItem('fm2gp-reading:order-left-translation')).toBe('closed'));
  fireEvent.click(screen.getByRole('button',{name:'中文'}));
  expect(detail('order-repeated-powers')).toHaveTextContent('鸽巢原理');
  expect(detail('order-repeated-powers').open).toBe(true);
  expect(detail('order-left-translation').open).toBe(false);
  view.unmount();mount();
  expect(detail('element-order').open).toBe(true);
  expect(detail('order-left-translation').open).toBe(false);
  expect(detail('order-repeated-powers').open).toBe(true);
});

it('uses native toggling when disclosure storage is unavailable',async()=>{
  let failedWrites=0;
  for(const method of ['getItem','setItem'] as const) {
    const original=Storage.prototype[method];
    vi.spyOn(Storage.prototype,method).mockImplementation(function(this:Storage,...args:string[]){
      if(this===sessionStorage){if(method==='setItem')failedWrites++;throw new Error('unavailable');}
      return Reflect.apply(original,this,args);
    });
  }
  mount();toggle('coset-proof');toggle('coset-cover');toggle('coset-cover');toggle('coset-equal-size');
  await waitFor(()=>expect(failedWrites).toBeGreaterThan(0));
  expect(detail('coset-cover').open).toBe(false);
  expect(detail('coset-equal-size').open).toBe(true);
});
