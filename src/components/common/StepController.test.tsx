import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '../../context/LanguageContext';
import { StepController } from './StepController';

function renderController() {
  return render(
    <LanguageProvider>
      <StepController
        currentStep={1}
        totalSteps={4}
        isPlaying={false}
        speed={1}
        onPlay={vi.fn()}
        onPause={vi.fn()}
        onStep={vi.fn()}
        onSpeedChange={vi.fn()}
        onSeek={vi.fn()}
      />
    </LanguageProvider>
  );
}

describe('StepController', () => {
  it('labels progress and speed controls for assistive technology', () => {
    renderController();

    expect(screen.getByRole('slider', { name: 'Step progress' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Speed' })).toBeInTheDocument();
  });
});
