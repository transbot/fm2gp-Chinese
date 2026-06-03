import { fireEvent, render, screen } from '@testing-library/react';
import type React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '../../context/LanguageContext';
import { BubbleSort } from './BubbleSort';
import { Calculator } from '../Calculator';
import { Cycle } from './Cycle';
import { Division } from './Division';
import { EulerTheorem } from './EulerTheorem';
import { ExtendedGcd } from '../ExtendedGcd';
import { FermatTheorem } from './FermatTheorem';
import { FastFibonacci } from '../FastFibonacci';
import { Fibonacci } from '../Fibonacci';
import { FrequencyCount } from './FrequencyCount';
import { Gcm } from '../Gcm';
import { GraphTraversal } from './GraphTraversal';
import { HeapOperations } from './HeapOperations';
import { InsertionSort } from './InsertionSort';
import { LinearSearch } from './LinearSearch';
import { MergeSort } from './MergeSort';
import { MillerRabin } from '../MillerRabin';
import { PalindromicPrimes } from '../PalindromicPrimes';
import { PowerAlgorithm } from './PowerAlgorithm';
import { PrefixSum } from './PrefixSum';
import { PrimeChecker } from '../PrimeChecker';
import { QuickSort } from './QuickSort';
import { Reverse } from './Reverse';
import { Sieve } from '../Sieve';
import { SelectionSort } from './SelectionSort';
import { SteinGcd } from './SteinGcd';
import { Swap } from './Swap';
import { TwoSum } from './TwoSum';

vi.mock('reactflow', () => {
  return {
    default: () => null,
    Controls: () => null,
    Background: () => null,
    Handle: () => null,
    MarkerType: { ArrowClosed: 'arrowclosed' },
    Position: { Bottom: 'bottom', Top: 'top' },
    useEdgesState: (initial: unknown[]) => [initial, () => {}, () => {}],
    useNodesState: (initial: unknown[]) => [initial, () => {}, () => {}],
  };
});

class TestResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = TestResizeObserver as typeof ResizeObserver;
}

function renderAlgorithm(component: React.ReactElement) {
  return render(
    <LanguageProvider>
      <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        {component}
      </MemoryRouter>
    </LanguageProvider>
  );
}

describe('beginner extension algorithm validation errors', () => {
  it('shows an empty-array error on bubble sort', () => {
    renderAlgorithm(<BubbleSort />);

    const input = screen.getByPlaceholderText('5, 1, 4, 2, 8');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    expect(screen.getByText('Array must not be empty')).toBeInTheDocument();
  });

  it('shows an empty-array error on insertion sort', () => {
    renderAlgorithm(<InsertionSort />);

    const input = screen.getByPlaceholderText('5, 2, 4, 6, 1, 3');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    expect(screen.getByText('Array must not be empty')).toBeInTheDocument();
  });

  it('shows an empty-array error on selection sort', () => {
    renderAlgorithm(<SelectionSort />);

    const input = screen.getByPlaceholderText('64, 25, 12, 22, 11');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    expect(screen.getByText('Array must not be empty')).toBeInTheDocument();
  });

  it('shows an invalid-range error on prefix sum', () => {
    renderAlgorithm(<PrefixSum />);

    const [leftInput, rightInput] = screen.getAllByRole('spinbutton');
    fireEvent.change(leftInput, { target: { value: '4' } });
    fireEvent.change(rightInput, { target: { value: '1' } });
    fireEvent.blur(rightInput);

    expect(
      screen.getByText('Range must satisfy 0 <= left <= right < array length')
    ).toBeInTheDocument();
  });

  it('shows an empty-target error on frequency count', () => {
    renderAlgorithm(<FrequencyCount />);

    const input = screen.getByPlaceholderText('apple');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    expect(screen.getByText('Target must not be empty')).toBeInTheDocument();
  });

  it('shows a too-small error on two sum', () => {
    renderAlgorithm(<TwoSum />);

    const input = screen.getByPlaceholderText('2, 7, 11, 15');
    fireEvent.change(input, { target: { value: '1' } });
    fireEvent.blur(input);

    expect(screen.getByText('Array must contain at least two values')).toBeInTheDocument();
  });
});

describe('core algorithm validation errors', () => {
  it('shows an empty-array error on linear search', () => {
    renderAlgorithm(<LinearSearch />);

    const input = screen.getByPlaceholderText('5, 3, 8, 4, 2, 7, 1, 6, 9, 0');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    expect(screen.getByRole('alert')).toHaveTextContent('Array must not be empty');
  });

  it('shows an empty-array error on reverse', () => {
    renderAlgorithm(<Reverse />);

    const input = screen.getByPlaceholderText('1, 2, 3, 4, 5, 6, 7, 8');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    expect(screen.getByRole('alert')).toHaveTextContent('Array must not be empty');
  });

  it('shows an invalid range error on swap', () => {
    renderAlgorithm(<Swap />);

    const [, , , secondEnd] = screen.getAllByRole('spinbutton');
    fireEvent.change(secondEnd, { target: { value: '2' } });
    fireEvent.blur(secondEnd);

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid second range');
  });

  it('shows a non-positive divisor error on division', () => {
    renderAlgorithm(<Division />);

    const [, divisorInput] = screen.getAllByRole('spinbutton');
    fireEvent.change(divisorInput, { target: { value: '0' } });
    fireEvent.blur(divisorInput);

    expect(screen.getByRole('alert')).toHaveTextContent('Divisor must be positive');
  });

  it('shows a negative exponent error on power', () => {
    renderAlgorithm(<PowerAlgorithm />);

    const [, exponentInput] = screen.getAllByRole('spinbutton');
    fireEvent.change(exponentInput, { target: { value: '-1' } });
    fireEvent.blur(exponentInput);

    expect(screen.getByRole('alert')).toHaveTextContent('Exponent must be non-negative');
  });
});

describe('number theory validation errors', () => {
  it('shows an empty-input error on prime checker', () => {
    renderAlgorithm(<PrimeChecker />);

    const input = screen.getByPlaceholderText('Enter a number to check');
    fireEvent.blur(input);

    expect(screen.getByRole('alert')).toHaveTextContent('Please enter a number');
  });

  it('shows an invalid range error on sieve', () => {
    renderAlgorithm(<Sieve />);

    fireEvent.click(screen.getByRole('button', { name: /Generate/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Please enter a number between 2 and 9999'
    );
  });

  it('shows a negative input error on Stein GCD', () => {
    renderAlgorithm(<SteinGcd />);

    const [firstInput] = screen.getAllByRole('spinbutton');
    fireEvent.change(firstInput, { target: { value: '-1' } });
    fireEvent.blur(firstInput);

    expect(screen.getByRole('alert')).toHaveTextContent('Numbers must be non-negative');
  });

  it('shows a required-input error on extended GCD', () => {
    renderAlgorithm(<ExtendedGcd />);

    const [firstInput] = screen.getAllByRole('textbox');
    fireEvent.change(firstInput, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /Initialize/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('Both numbers are required');
  });

  it('shows an invalid base error on Fermat theorem', () => {
    renderAlgorithm(<FermatTheorem />);

    const [baseInput] = screen.getAllByRole('spinbutton');
    fireEvent.change(baseInput, { target: { value: '0' } });
    fireEvent.blur(baseInput);

    expect(screen.getByRole('alert')).toHaveTextContent('Base a must be between 1 and 1000');
  });

  it('shows an invalid modulus error on Euler theorem', () => {
    renderAlgorithm(<EulerTheorem />);

    const [, modulusInput] = screen.getAllByRole('spinbutton');
    fireEvent.change(modulusInput, { target: { value: '0' } });
    fireEvent.blur(modulusInput);

    expect(screen.getByRole('alert')).toHaveTextContent('Modulus n must be at least 1');
  });

  it('shows an invalid n error on Miller-Rabin', () => {
    renderAlgorithm(<MillerRabin />);

    const input = screen.getByPlaceholderText('e.g. 561');
    fireEvent.change(input, { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /Initialize/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('n must be > 1');
  });
});

describe('legacy algorithm validation errors', () => {
  it('shows a required-input error on Egyptian multiplication', () => {
    renderAlgorithm(<Calculator />);

    fireEvent.click(screen.getByRole('button', { name: /^Calculate$/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('Both numbers are required');
  });

  it('shows a required-input error on Euclidean GCM', () => {
    renderAlgorithm(<Gcm />);

    fireEvent.click(screen.getByRole('button', { name: /^Calculate$/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('Both numbers are required');
  });

  it('shows a non-negative input error on recursive Fibonacci', () => {
    renderAlgorithm(<Fibonacci />);

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '-1' } });
    fireEvent.blur(input);

    expect(screen.getByRole('alert')).toHaveTextContent('n must be non-negative');
  });

  it('shows a too-large input error on fast Fibonacci', () => {
    renderAlgorithm(<FastFibonacci />);

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '1001' } });
    fireEvent.blur(input);

    expect(screen.getByRole('alert')).toHaveTextContent(
      'For visualization, n should be at most 1000'
    );
  });

  it('shows an invalid permutation error on cycle decomposition', () => {
    renderAlgorithm(<Cycle />);

    const permutationInput = screen.getByPlaceholderText('2, 0, 1, 3, 4');
    fireEvent.change(permutationInput, { target: { value: '0, 0, 1, 2, 3, 4, 5, 6' } });
    fireEvent.click(screen.getByRole('button', { name: /^Reset$/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid permutation');
  });
});

describe('remaining interactive algorithm validation errors', () => {
  it('shows an empty-graph error on graph traversal', () => {
    renderAlgorithm(<GraphTraversal />);

    for (const nodeId of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']) {
      const removeButton = screen.queryByRole('button', { name: nodeId });
      if (removeButton) {
        fireEvent.click(removeButton);
      }
    }
    fireEvent.click(screen.getByRole('button', { name: /^Reset$/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('Graph must have at least one node');
  });

  it('shows an empty-array error on merge sort', () => {
    renderAlgorithm(<MergeSort />);

    const input = screen.getByPlaceholderText('38, 27, 43, 3, 9, 82, 10');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    expect(screen.getByRole('alert')).toHaveTextContent('Array must not be empty');
  });

  it('shows an empty-array error on quick sort', () => {
    renderAlgorithm(<QuickSort />);

    const input = screen.getByPlaceholderText('3, 7, 2, 9, 1, 5, 8, 4, 6');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    expect(screen.getByRole('alert')).toHaveTextContent('Array must not be empty');
  });

  it('shows an empty-array error on heap operations', () => {
    renderAlgorithm(<HeapOperations />);

    const input = screen.getByPlaceholderText('4, 10, 3, 5, 1, 2, 8');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Array must not be empty for heapify/delete operations'
    );
  });

  it('shows a missing insert value error on heap operations', () => {
    renderAlgorithm(<HeapOperations />);

    fireEvent.click(screen.getByRole('button', { name: /Insert/i }));
    const valueInput = screen.getByPlaceholderText('15');
    fireEvent.change(valueInput, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /^Reset$/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('Insert operation requires a value');
  });

  it('shows a missing maximum error on palindromic primes', () => {
    renderAlgorithm(<PalindromicPrimes />);

    fireEvent.click(screen.getByRole('button', { name: /^Generate$/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Please enter a number between 2 and 9999'
    );
  });
});
