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

if (typeof HTMLCanvasElement !== 'undefined') {
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    configurable: true,
    value(this: HTMLCanvasElement) {
      return {
        canvas: this,
        beginPath: () => {},
        arc: () => {},
        clearRect: () => {},
        closePath: () => {},
        fill: () => {},
        fillText: () => {},
        lineTo: () => {},
        moveTo: () => {},
        setLineDash: () => {},
        stroke: () => {},
      } as unknown as CanvasRenderingContext2D;
    },
  });
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
