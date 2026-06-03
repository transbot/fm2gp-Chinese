// src/lib/algorithms/reverse.ts

import {
  AlgorithmVisualization,
  Step,
  ValidationResult,
  ComplexityInfo,
} from './types';

/**
 * Input for reverse algorithm
 */
export interface ReverseInput {
  array: number[];
}

/**
 * State snapshot for each step of reverse
 */
export interface ReverseState {
  array: number[];
  leftIndex: number;
  rightIndex: number;
  swapped: boolean;
  swapCount: number;
}

/**
 * Reverse algorithm visualization implementation
 * Section 11.5 in the book - bidirectional reversal
 */
export const reverseVisualization: AlgorithmVisualization<
  ReverseInput,
  ReverseState
> = {
  id: 'reverse',
  section: '11.5',

  generateSteps(input: ReverseInput): Step<ReverseState>[] {
    const { array } = input;
    const steps: Step<ReverseState>[] = [];
    const arr = [...array];

    // Initial state
    steps.push({
      state: {
        array: [...arr],
        leftIndex: 0,
        rightIndex: arr.length - 1,
        swapped: false,
        swapCount: 0,
      },
      operation: 'init',
      descriptionKey: 'reverseInit',
      highlights: [],
    });

    // Perform bidirectional reversal
    let left = 0;
    let right = arr.length - 1;
    let swapCount = 0;

    while (left < right) {
      // Show pointers moving into position
      steps.push({
        state: {
          array: [...arr],
          leftIndex: left,
          rightIndex: right,
          swapped: false,
          swapCount,
        },
        operation: 'pointers',
        descriptionKey: 'reversePointers',
        highlights: [left, right],
        animation: { type: 'highlight' },
      });

      // Swap elements
      const temp = arr[left];
      arr[left] = arr[right];
      arr[right] = temp;
      swapCount++;

      steps.push({
        state: {
          array: [...arr],
          leftIndex: left,
          rightIndex: right,
          swapped: true,
          swapCount,
        },
        operation: 'swap',
        descriptionKey: 'reverseSwap',
        highlights: [left, right],
        animation: { type: 'swap' },
      });

      // Move pointers inward
      left++;
      right--;
    }

    // Final state
    steps.push({
      state: {
        array: [...arr],
        leftIndex: left,
        rightIndex: right,
        swapped: false,
        swapCount,
      },
      operation: 'complete',
      descriptionKey: 'reverseComplete',
      highlights: [],
    });

    return steps;
  },

  validateInput(input: ReverseInput): ValidationResult {
    if (!input.array || input.array.length === 0) {
      return {
        valid: false,
        error: 'Array must not be empty',
        errorKey: 'reverseEmptyArray',
      };
    }

    if (input.array.length > 50) {
      return {
        valid: false,
        error: 'Array must have at most 50 elements',
        errorKey: 'reverseTooLarge',
      };
    }

    return { valid: true };
  },

  getInitialState(): ReverseState {
    return {
      array: [],
      leftIndex: 0,
      rightIndex: -1,
      swapped: false,
      swapCount: 0,
    };
  },

  describeStep(step: Step<ReverseState>, lang: 'en' | 'zh'): string {
    const { state, operation } = step;
    const { array, leftIndex, rightIndex, swapCount } = state;

    const messages: Record<string, Record<'en' | 'zh', string>> = {
      init: {
        en: `Starting reverse algorithm. Array has ${array.length} elements. Left pointer at index 0, right pointer at index ${array.length - 1}.`,
        zh: `开始逆序算法。数组有 ${array.length} 个元素。左指针在索引 0，右指针在索引 ${array.length - 1}。`,
      },
      pointers: {
        en: `Left pointer at index ${leftIndex} (value ${array[leftIndex]}), right pointer at index ${rightIndex} (value ${array[rightIndex]}). Preparing to swap.`,
        zh: `左指针在索引 ${leftIndex}（值 ${array[leftIndex]}），右指针在索引 ${rightIndex}（值 ${array[rightIndex]}）。准备交换。`,
      },
      swap: {
        en: `Swapped elements at indices ${leftIndex} and ${rightIndex}. Now array[${leftIndex}] = ${array[leftIndex]}, array[${rightIndex}] = ${array[rightIndex]}. (${swapCount} swap${swapCount > 1 ? 's' : ''} completed)`,
        zh: `已交换索引 ${leftIndex} 和 ${rightIndex} 处的元素。现在 array[${leftIndex}] = ${array[leftIndex]}，array[${rightIndex}] = ${array[rightIndex]}。（已完成 ${swapCount} 次交换）`,
      },
      complete: {
        en: `Reverse complete! Array is now fully reversed. Total swaps: ${swapCount}.`,
        zh: `逆序完成！数组已完全反转。共交换 ${swapCount} 次。`,
      },
    };

    return messages[operation]?.[lang] ?? '';
  },

  getInvariant(lang: 'en' | 'zh'): string {
    return lang === 'en'
      ? 'Elements outside [leftIndex, rightIndex] are in their final reversed positions.'
      : '区间 [leftIndex, rightIndex] 之外的元素已处于最终逆序位置。';
  },

  getComplexity(): ComplexityInfo {
    return {
      time: 'O(n)',
      space: 'O(1)',
      worstCase: 'n/2 swaps for array of size n',
      worstCaseZh: 'n/2 次交换（对于长度为 n 的数组）',
      bestCase: '0 swaps for empty or single-element array',
      bestCaseZh: '0 次交换（空数组或单元素数组）',
    };
  },
};
