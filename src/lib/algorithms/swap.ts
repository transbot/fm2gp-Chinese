// src/lib/algorithms/swap.ts

import {
  AlgorithmVisualization,
  Step,
  ValidationResult,
  ComplexityInfo,
} from './types';

/**
 * Input for swap algorithm
 * Swaps two adjacent ranges: [firstStart, firstEnd) and [secondStart, secondEnd)
 */
export interface SwapInput {
  array: number[];
  firstStart: number;
  firstEnd: number;
  secondStart: number;
  secondEnd: number;
}

/**
 * State snapshot for each step of swap algorithm
 */
export interface SwapState {
  array: number[];
  firstRange: [number, number];  // [start, end)
  secondRange: [number, number]; // [start, end)
  swapIndex: number;  // Current position being swapped
  swapped: boolean;   // Whether swap is complete
}

/**
 * Swap Algorithm visualization implementation
 * Section 11.2 in the book - demonstrates swapping two adjacent ranges
 */
export const swapVisualization: AlgorithmVisualization<
  SwapInput,
  SwapState
> = {
  id: 'swap',
  section: '11.2',

  generateSteps(input: SwapInput): Step<SwapState>[] {
    const { array, firstStart, firstEnd, secondStart, secondEnd } = input;
    const steps: Step<SwapState>[] = [];
    const arr = [...array];

    // Calculate range sizes
    const firstSize = firstEnd - firstStart;
    const secondSize = secondEnd - secondStart;
    const minSize = Math.min(firstSize, secondSize);

    // Initial state
    steps.push({
      state: {
        array: [...arr],
        firstRange: [firstStart, firstEnd],
        secondRange: [secondStart, secondEnd],
        swapIndex: -1,
        swapped: false,
      },
      operation: 'init',
      descriptionKey: 'swapInit',
      highlights: [],
    });

    // Perform element-by-element swap
    for (let i = 0; i < minSize; i++) {
      const firstIdx = firstStart + i;
      const secondIdx = secondStart + i;

      // Swap elements
      const temp = arr[firstIdx];
      arr[firstIdx] = arr[secondIdx];
      arr[secondIdx] = temp;

      steps.push({
        state: {
          array: [...arr],
          firstRange: [firstStart, firstEnd],
          secondRange: [secondStart, secondEnd],
          swapIndex: i,
          swapped: false,
        },
        operation: 'swap',
        descriptionKey: 'swapElement',
        highlights: [firstIdx, secondIdx],
        animation: { type: 'swap', duration: 300 },
      });
    }

    // Final state
    steps.push({
      state: {
        array: [...arr],
        firstRange: [firstStart, firstEnd],
        secondRange: [secondStart, secondEnd],
        swapIndex: minSize - 1,
        swapped: true,
      },
      operation: 'complete',
      descriptionKey: 'swapComplete',
      highlights: [],
    });

    return steps;
  },

  validateInput(input: SwapInput): ValidationResult {
    const { array, firstStart, firstEnd, secondStart, secondEnd } = input;
    const n = array.length;

    // Check array size
    if (n === 0) {
      return {
        valid: false,
        error: 'Array must not be empty',
        errorKey: 'swapEmptyArray',
      };
    }

    if (n > 50) {
      return {
        valid: false,
        error: 'Array must have at most 50 elements',
        errorKey: 'swapTooLarge',
      };
    }

    // Check first range validity
    if (firstStart < 0 || firstEnd > n || firstStart >= firstEnd) {
      return {
        valid: false,
        error: 'Invalid first range',
        errorKey: 'swapInvalidFirstRange',
      };
    }

    // Check second range validity
    if (secondStart < 0 || secondEnd > n || secondStart >= secondEnd) {
      return {
        valid: false,
        error: 'Invalid second range',
        errorKey: 'swapInvalidSecondRange',
      };
    }

    // Check that ranges are adjacent (first range ends where second starts)
    if (firstEnd !== secondStart) {
      return {
        valid: false,
        error: 'Ranges must be adjacent',
        errorKey: 'swapRangesNotAdjacent',
      };
    }

    // Check ranges don't overlap
    if (firstStart >= secondStart || firstEnd > secondStart) {
      // This is already covered by adjacent check, but explicit
      return {
        valid: false,
        error: 'Ranges must not overlap',
        errorKey: 'swapRangesOverlap',
      };
    }

    return { valid: true };
  },

  getInitialState(): SwapState {
    return {
      array: [],
      firstRange: [0, 0],
      secondRange: [0, 0],
      swapIndex: -1,
      swapped: false,
    };
  },

  describeStep(step: Step<SwapState>, lang: 'en' | 'zh'): string {
    const { state, operation, highlights } = step;
    const { array, firstRange, secondRange, swapIndex } = state;

    const messages: Record<string, Record<'en' | 'zh', string>> = {
      init: {
        en: `Initial array: [${array.join(', ')}]. Will swap range [${firstRange[0]}, ${firstRange[1]}) with [${secondRange[0]}, ${secondRange[1]}).`,
        zh: `初始数组：[${array.join(', ')}]。将交换区间 [${firstRange[0]}, ${firstRange[1]}) 与 [${secondRange[0]}, ${secondRange[1]})。`,
      },
      swap: {
        en: `Swapping elements at index ${highlights?.[0]} and ${highlights?.[1]}: ${array[highlights?.[0] ?? 0]} <-> ${array[highlights?.[1] ?? 0]}.`,
        zh: `交换索引 ${highlights?.[0]} 和 ${highlights?.[1]} 的元素：${array[highlights?.[0] ?? 0]} <-> ${array[highlights?.[1] ?? 0]}。`,
      },
      complete: {
        en: `Swap complete! Final array: [${array.join(', ')}].`,
        zh: `交换完成！最终数组：[${array.join(', ')}]。`,
      },
    };

    return messages[operation]?.[lang] ?? '';
  },

  getInvariant(lang: 'en' | 'zh'): string {
    return lang === 'en'
      ? 'Elements at corresponding positions in both ranges are being exchanged pairwise.'
      : '两个区间中对应位置的元素正被成对交换。';
  },

  getComplexity(): ComplexityInfo {
    return {
      time: 'O(min(n, m))',
      space: 'O(1)',
      worstCase: 'n swaps where n = size of smaller range',
      worstCaseZh: 'n 次交换，n 为较小范围的大小',
      bestCase: '1 swap (when one range has size 1)',
      bestCaseZh: '1 次交换（当一个范围大小为 1）',
    };
  },
};
