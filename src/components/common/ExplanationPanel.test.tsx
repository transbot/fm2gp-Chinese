import { fireEvent, render, screen } from '@testing-library/react';
import type React from 'react';
import { describe, expect, it } from 'vitest';
import { LanguageProvider } from '../../context/LanguageContext';
import { ExplanationPanel } from './ExplanationPanel';

function renderPanel(component: React.ReactElement) {
  return render(<LanguageProvider>{component}</LanguageProvider>);
}

describe('ExplanationPanel', () => {
  it('scopes code snippets in a labeled visual frame', () => {
    renderPanel(
      <ExplanationPanel
        stepDescription="Current step"
        codeSnippet="const veryLongIdentifier = matrixPower(baseMatrix, exponent);"
      />
    );

    fireEvent.click(screen.getByText('View Code'));

    expect(screen.getByRole('region', { name: 'View Code' })).toBeInTheDocument();
  });
});
