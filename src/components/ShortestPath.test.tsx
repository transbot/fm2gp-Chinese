import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderAlgorithm } from '../test/renderAlgorithm';
import { ShortestPath } from './ShortestPath';

describe('linked shortest-path explanation', () => {
  it('connects the candidate arithmetic, path highlight and selected matrix cell', () => {
    renderAlgorithm(<ShortestPath />);
    fireEvent.click(screen.getByRole('button', { name: 'Start Calculation' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next Power' }));
    expect(screen.getByTestId('selected-distance')).toHaveTextContent('7');
    const expensive = screen.getByRole('button', { name: /A → B → F.*16/ });
    const best = screen.getByRole('button', { name: /A → D → F.*7/ });
    fireEvent.click(expensive);
    expect(screen.getByTestId('route-graph')).toHaveAttribute('data-path', 'A → B → F');
    fireEvent.click(best);
    expect(screen.getByTestId('route-graph')).toHaveAttribute('data-path', 'A → D → F');
    const matrix = screen.getByRole('region', { name: 'Shortest path distance matrix' });
    expect(within(matrix).getByRole('button', { name: 'A → F: 7' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(within(matrix).getByRole('button', { name: 'A → G: ∞' }));
    expect(screen.getByLabelText('Destination')).toHaveValue('6');
    fireEvent.click(screen.getByRole('button', { name: 'Next Power' }));
    expect(screen.getByTestId('selected-distance')).toHaveTextContent('11');
    fireEvent.click(screen.getByRole('button', { name: 'Previous Power' }));
    expect(screen.getByTestId('selected-distance')).toHaveTextContent('∞');
  });

  it('translates the active step and explains terms after switching language', () => {
    renderAlgorithm(<ShortestPath />);
    fireEvent.click(screen.getByRole('button', { name: 'Start Calculation' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next Power' }));
    fireEvent.click(screen.getByRole('button', { name: '中文' }));
    expect(screen.getByRole('heading', { name: '最多走 2 条边' })).toBeInTheDocument();
    expect(screen.getByText(/不是把每个格子里的数字分别乘方/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '热带半环' })).toBeInTheDocument();
    expect(screen.getByTestId('selected-distance')).toHaveTextContent('7');
    fireEvent.click(screen.getByRole('button', { name: '重置' }));
    expect(screen.getByRole('heading', { name: '最多走 1 条边' })).toBeInTheDocument();
  });
});
