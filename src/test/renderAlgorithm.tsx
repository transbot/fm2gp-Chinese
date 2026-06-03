import { render } from '@testing-library/react';
import type React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../context/LanguageContext';

class TestResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = TestResizeObserver as typeof ResizeObserver;
}

export function renderAlgorithm(component: React.ReactElement) {
  return render(
    <LanguageProvider>
      <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        {component}
      </MemoryRouter>
    </LanguageProvider>
  );
}
