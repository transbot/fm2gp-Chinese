// src/lib/algorithms/linear_search.ts

import {
  AlgorithmVisualization,
  Step,
  ValidationResult,
  ComplexityInfo,
} from './types';

/**
 * Input for linear search algorithm
 */
export interface LinearSearchInput {
  array: number[];
  target: number;
}

/**
 * State snapshot for each step of linear search
 */
export interface LinearSearchState {
  array: number[];
  target: number;
  currentIndex: number;
  found: boolean;
  foundIndex: number | null;
  comparisons: number;
}

/**
 * Linear Search algorithm visualization implementation
 * Section 10.7 in the book
 */
export const linearSearchVisualization: AlgorithmVisualization<
  LinearSearchInput,
  LinearSearchState
> = {
  id: 'linear-search',
  section: '10.7',

  generateSteps(input: LinearSearchInput): Step<LinearSearchState>[] {
    const { array, target } = input;
    const steps: Step<LinearSearchState>[] = [];

    // Initial state
    steps.push({
      state: {
        array: [...array],
        target,
        currentIndex: 0,
        found: false,
        foundIndex: null,
        comparisons: 0,
      },
      operation: 'init',
      descriptionKey: 'linearSearchInit',
      highlights: [],
    });

    // Iterate through array
    for (let i = 0; i < array.length; i++) {
      const comparisons = i + 1;
      const isMatch = array[i] === target;

      steps.push({
        state: {
          array: [...array],
          target,
          currentIndex: i,
          found: isMatch,
          foundIndex: isMatch ? i : null,
          comparisons,
        },
        operation: isMatch ? 'found' : 'compare',
        descriptionKey: isMatch ? 'linearSearchFound' : 'linearSearchCompare',
        highlights: [i],
      });

      // If found, we stop
      if (isMatch) {
        break;
      }
    }

    // Final step if not found
    const lastStep = steps[steps.length - 1];
    if (!lastStep.state.found) {
      steps.push({
        state: {
          array: [...array],
          target,
          currentIndex: array.length,
          found: false,
          foundIndex: null,
          comparisons: array.length,
        },
        operation: 'not_found',
        descriptionKey: 'linearSearchNotFound',
        highlights: [],
      });
    }

    return steps;
  },

  validateInput(input: LinearSearchInput): ValidationResult {
    if (!input.array || input.array.length === 0) {
      return {
        valid: false,
        error: 'Array must not be empty',
        errorKey: 'linearSearchEmptyArray',
      };
    }

    if (input.array.length > 100) {
      return {
        valid: false,
        error: 'Array must have at most 100 elements',
        errorKey: 'linearSearchTooLarge',
      };
    }

    return { valid: true };
  },

  getInitialState(): LinearSearchState {
    return {
      array: [],
      target: 0,
      currentIndex: 0,
      found: false,
      foundIndex: null,
      comparisons: 0,
    };
  },

  describeStep(step: Step<LinearSearchState>, lang: 'en' | 'zh'): string {
    const { state, operation } = step;
    const { currentIndex, target, foundIndex, comparisons, array } = state;

    const messages: Record<string, Record<'en' | 'zh', string>> = {
      init: {
        en: `Starting linear search for target ${target} in array of ${array.length} elements.`,
        zh: `开始线性查找，目标值 ${target}，数组包含 ${array.length} 个元素。`,
      },
      compare: {
        en: `Comparing element at index ${currentIndex} (value ${array[currentIndex]}) with target ${target}. Not equal, continuing. (${comparisons} comparisons so far)`,
        zh: `比较索引 ${currentIndex} 处的元素（值 ${array[currentIndex]}) 与目标值 ${target}。不相等，继续查找。（已比较 ${comparisons} 次）`,
      },
      found: {
        en: `Found target ${target} at index ${foundIndex}! Search completed after ${comparisons} comparisons.`,
        zh: `在索引 ${foundIndex} 处找到目标值 ${target}！查找完成，共比较 ${comparisons} 次。`,
      },
      not_found: {
        en: `Target ${target} not found after checking all ${array.length} elements.`,
        zh: `检查完所有 ${array.length} 个元素后，未找到目标值 ${target}。`,
      },
    };

    return messages[operation]?.[lang] ?? '';
  },

  getInvariant(lang: 'en' | 'zh'): string {
    return lang === 'en'
      ? 'All elements in [0, currentIndex) have been checked and are not equal to target.'
      : '区间 [0, currentIndex) 内的所有元素已被检查且不等于目标值。';
  },

  getComplexity(): ComplexityInfo {
    return {
      time: 'O(n)',
      space: 'O(1)',
      worstCase: 'n comparisons (target not in array or at last position)',
      worstCaseZh: 'n 次比较（目标不在数组中或在最后位置）',
      bestCase: '1 comparison (target at first position)',
      bestCaseZh: '1 次比较（目标在第一个位置）',
    };
  },
};
