import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import App from '../App';

vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

afterEach(() => { cleanup(); document.head.querySelectorAll('link[rel="canonical"],meta[name="description"]').forEach(e => e.remove()); });

it('canonical follows SPA navigation while preserving reader query and hash', async () => {
  window.history.replaceState({}, '', '/fermat?from=%2Fbook%2F6%23lagrange-fermat');
  const existingCanonical = document.createElement('link');
  existingCanonical.rel = 'canonical';
  existingCanonical.href = 'https://fm2gp-chinese.bookzhou.com/';
  document.head.append(existingCanonical);
  render(<App />);
  const canonical = () => document.head.querySelector('link[rel="canonical"]')?.getAttribute('href');
  await waitFor(() => expect(canonical()).toBe('https://fm2gp-chinese.bookzhou.com/fermat'));
  expect(new URLSearchParams(window.location.search).get('from')).toBe('/book/6#lagrange-fermat');
  window.history.pushState({}, '', '/shortest-path/?route=concepts#demo');
  fireEvent(window, new PopStateEvent('popstate'));
  await waitFor(() => expect(canonical()).toBe('https://fm2gp-chinese.bookzhou.com/shortest-path'));
  expect(window.location.search + window.location.hash).toBe('?route=concepts#demo');
  expect(document.head.querySelector('link[rel="canonical"]')).toBe(existingCanonical);
  expect(document.title).toContain('Shortest');
  expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
});
