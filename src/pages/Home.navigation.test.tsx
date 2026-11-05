import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { LanguageProvider } from '../context/LanguageContext';
import { Home } from './Home';
afterEach(cleanup);
function Destination() {
  const navigate = useNavigate();
  return <button onClick={() => navigate(-1)}>Browser back</button>;
}
it('restores a home search from the URL and preserves it after visiting a result', () => {
  localStorage.setItem('fm2gp-language', 'en');
  render(<MemoryRouter initialEntries={['/?q=Fibonacci%20remainder']}><LanguageProvider><Routes><Route path="/" element={<Home/>}/><Route path="/division" element={<Destination/>}/></Routes></LanguageProvider></MemoryRouter>);
  expect(screen.getByRole('searchbox')).toHaveValue('Fibonacci remainder');
  fireEvent.change(screen.getByRole('searchbox'), {target:{value:'quotient_remainder'}});
  fireEvent.click(within(screen.getByTestId('lesson-results')).getByRole('link'));
  fireEvent.click(screen.getByRole('button', {name:'Browser back'}));
  expect(screen.getByRole('searchbox')).toHaveValue('quotient_remainder');
  expect(within(screen.getByTestId('lesson-results')).getAllByRole('link')).toHaveLength(1);
});
