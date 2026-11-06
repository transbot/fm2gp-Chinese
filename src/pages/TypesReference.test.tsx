import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import {afterEach, it, expect} from 'vitest';
import {Book} from './Book';
import {LanguageProvider} from '../context/LanguageContext';

function mount(chapter: string) {
  localStorage.setItem('fm2gp-language','en');
  render(<MemoryRouter initialEntries={['/book/'+chapter+'?source=test&tag=two+words']}><LanguageProvider><Routes><Route path="/book/:chapterId" element={<Book/>}/></Routes></LanguageProvider></MemoryRouter>);
}
afterEach(cleanup);

it('interprets the very same bits after keyboard or language changes',()=>{
  mount('10');
  const bits=screen.getByText('01000001');
  fireEvent.click(screen.getByRole('radio',{name:'8-bit unsigned integer'}));
  expect(screen.getByRole('status')).toHaveTextContent('65');
  fireEvent.click(screen.getByRole('radio',{name:'ASCII character'}));
  expect(screen.getByRole('status')).toHaveTextContent('A');
  fireEvent.click(screen.getByRole('button',{name:'中文'}));
  expect(screen.getByRole('radio',{name:'ASCII 字符'})).toBeChecked();
  expect(screen.getByText('01000001')).toBe(bits);
});

it('links from the manually opened counterexample with its own anchor and the full query',()=>{
  mount('C');
  const card=document.getElementById('cpp-subtraction');
  const link=card?.querySelector('a[href^="/concepts/algebra?"]');
  expect(link).toBeTruthy();
  expect(new URL(link!.getAttribute('href')!,location.origin).searchParams.get('from'))
    .toBe('/book/C?source=test&tag=two+words#cpp-subtraction');
  expect(card).toHaveTextContent('(5 − 3) − 3 = −1');
  expect(card).toHaveTextContent('5 − (3 − 3) = 5');
  expect(screen.getByText('Result: bbb',{exact:true})).toBeInTheDocument();
});
