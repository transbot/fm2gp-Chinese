import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ResponsiveVisualFrame } from './ResponsiveVisualFrame';

describe('ResponsiveVisualFrame', () => {
  it('renders children inside a labeled region', () => {
    render(
      <ResponsiveVisualFrame label="Prime counting chart">
        <canvas data-testid="chart" />
      </ResponsiveVisualFrame>
    );

    const region = screen.getByRole('region', { name: 'Prime counting chart' });
    expect(within(region).getByTestId('chart')).toBeInTheDocument();
  });

  it('uses the default minimum width as a px CSS variable', () => {
    render(
      <ResponsiveVisualFrame label="Default width">
        <div>wide content</div>
      </ResponsiveVisualFrame>
    );

    const content = screen.getByTestId('responsive-visual-frame-content');
    expect(content).toHaveStyle({ '--visual-min-width': '360px' });
  });

  it('uses a custom minimum width as a px CSS variable', () => {
    render(
      <ResponsiveVisualFrame label="Custom width" minWidth={640}>
        <div>wide content</div>
      </ResponsiveVisualFrame>
    );

    const content = screen.getByTestId('responsive-visual-frame-content');
    expect(content).toHaveStyle({ '--visual-min-width': '640px' });
  });

  it('merges outer and content classes without adding dependencies', () => {
    render(
      <ResponsiveVisualFrame
        label="Classes"
        className="rounded-lg"
        contentClassName="bg-white"
      >
        <div>wide content</div>
      </ResponsiveVisualFrame>
    );

    expect(screen.getByRole('region', { name: 'Classes' })).toHaveClass('rounded-lg');
    expect(screen.getByTestId('responsive-visual-frame-content')).toHaveClass('bg-white');
  });
});
