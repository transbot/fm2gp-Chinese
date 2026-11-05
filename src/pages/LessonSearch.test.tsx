import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../context/LanguageContext';
import { Home } from './Home';
import { Book } from './Book';

afterEach(cleanup);
it.each(['zh', 'en'])('renders discoverable concept links in the %s home search without duplicate power results', lang => {
  localStorage.setItem('fm2gp-language', lang);
  render(<MemoryRouter><LanguageProvider><Home /></LanguageProvider></MemoryRouter>);
  const input = screen.getByRole('searchbox');
  for (const query of ['霍纳', 'Horner', '8.1']) {
    fireEvent.change(input, { target: { value: query } });
    const result = within(screen.getByTestId('lesson-results'));
    expect(result.getByRole('link', { name: /霍纳|Horner/ })).toHaveAttribute('href', '/horner');
  }
  fireEvent.change(input, { target: { value: '矩阵与可达性' } });
  expect(within(screen.getByTestId('lesson-results')).getByRole('link', { name: /矩阵与可达性|Matrices and reachability/ })).toHaveAttribute('href', '/concepts/matrices');
  fireEvent.change(input, { target: { value: 'power' } });
  expect(screen.getByTestId('lesson-results').querySelectorAll('a[href="/power"]')).toHaveLength(1);
});

it.each(['zh', 'en'])('renders the associated section in the %s chapter search', lang => {
  localStorage.setItem('fm2gp-language', lang);
  render(<MemoryRouter initialEntries={['/book']}><LanguageProvider><Book /></LanguageProvider></MemoryRouter>);
  for (const query of ['霍纳', 'Horner', '8.1']) {
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: query } });
    expect(screen.getByRole('link', { name: /^(第8.1节|Section 8.1)/ }).getAttribute('href')).toContain('#section-8-1');
  }
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: '矩阵与可达性' } });
  expect(screen.getByRole('link', { name: /^(第8.5节|Section 8.5)/ }).getAttribute('href')).toContain('#section-8-5');
});
