import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';
import { afterEach, beforeEach, it, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Book } from './Book';
import { LanguageProvider } from '../context/LanguageContext';

beforeEach(() => {sessionStorage.clear();localStorage.setItem('fm2gp-language','en');});
afterEach(cleanup);
function book(id:string) {
  render(<MemoryRouter initialEntries={['/book/'+id]}><LanguageProvider><Routes><Route path="/book/:chapterId" element={<Book/>}/></Routes></LanguageProvider></MemoryRouter>);
}
it('keeps the two reverse rewrites distinct and scoped to different expressions',()=>{
  book('9');
  expect(document.getElementById('assoc-outer')?.textContent).toContain('Reverse (9.2) with first argument a and second argument b + k');
  expect(document.getElementById('assoc-inner')?.textContent).toContain('Reverse (9.2) inside the right argument of a +');
});
it('separates arbitrary truth assignments from attainable integer examples in both languages',()=>{
  book('A');
  const table=screen.getByRole('table');
  const rows=within(table).getAllByRole('row').slice(1);
  expect(rows.map(r=>within(r).getAllByRole('cell').map(c=>c.textContent))).toEqual([
    ['T','T','T','T'],['T','F','F','F'],['F','T','T','T'],['F','F','T','T']
  ]);
  expect(screen.getByText(/No integer realizes/)).toBeInTheDocument();
  expect(screen.getByText(/n = 4.*p ⇒ q is true.*q ⇒ p is false/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'中文'}));
  expect(screen.getByText(/没有整数能实现/)).toBeInTheDocument();
  expect(screen.getByText(/n = 4.*p ⇒ q 为真.*q ⇒ p 为假/)).toBeInTheDocument();
});
