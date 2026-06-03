import {
  AlgorithmVisualization,
  ComplexityInfo,
  Step,
  ValidationResult,
} from './types';

export interface SelectionSortInput {
  array: number[];
}

export interface SelectionSortState {
  array: number[];
  originalArray: number[];
  currentPass: number;
  scanIndex: number;
  minIndex: number;
  sortedUntil: number;
  comparisons: number;
  swaps: number;
}

export const selectionSortVisualization: AlgorithmVisualization<
  SelectionSortInput,
  SelectionSortState
> = {
  id: 'selection-sort',

  generateSteps(input: SelectionSortInput): Step<SelectionSortState>[] {
    const originalArray = [...input.array];
    const array = [...input.array];
    const steps: Step<SelectionSortState>[] = [];
    let comparisons = 0;
    let swaps = 0;

    const makeState = (
      currentPass: number,
      scanIndex: number,
      minIndex: number,
      sortedUntil: number
    ): SelectionSortState => ({
      array: [...array],
      originalArray,
      currentPass,
      scanIndex,
      minIndex,
      sortedUntil,
      comparisons,
      swaps,
    });

    steps.push({
      state: makeState(0, -1, -1, -1),
      operation: 'init',
      descriptionKey: 'selectionSortInit',
      highlights: [],
    });

    for (let i = 0; i < array.length - 1; i++) {
      let minIndex = i;
      steps.push({
        state: makeState(i, i, minIndex, i - 1),
        operation: 'select_minimum',
        descriptionKey: 'selectionSortSelectMinimum',
        highlights: [i],
      });

      for (let j = i + 1; j < array.length; j++) {
        comparisons++;
        steps.push({
          state: makeState(i, j, minIndex, i - 1),
          operation: 'compare',
          descriptionKey: 'selectionSortCompare',
          highlights: [j, minIndex],
        });

        if (array[j] < array[minIndex]) {
          minIndex = j;
          steps.push({
            state: makeState(i, j, minIndex, i - 1),
            operation: 'new_minimum',
            descriptionKey: 'selectionSortNewMinimum',
            highlights: [minIndex],
          });
        }
      }

      if (minIndex !== i) {
        [array[i], array[minIndex]] = [array[minIndex], array[i]];
        swaps++;
        steps.push({
          state: makeState(i, minIndex, i, i - 1),
          operation: 'swap',
          descriptionKey: 'selectionSortSwap',
          highlights: [i, minIndex],
          animation: { type: 'swap' },
        });
      }

      steps.push({
        state: makeState(i, -1, i, i),
        operation: 'lock',
        descriptionKey: 'selectionSortLock',
        highlights: [i],
      });
    }

    steps.push({
      state: makeState(array.length - 1, -1, -1, array.length - 1),
      operation: 'complete',
      descriptionKey: 'selectionSortComplete',
      highlights: array.map((_, index) => index),
    });

    return steps;
  },

  validateInput(input: SelectionSortInput): ValidationResult {
    if (!input.array || input.array.length === 0) {
      return {
        valid: false,
        error: 'Array must not be empty',
        errorKey: 'selectionSortEmptyArray',
      };
    }

    if (input.array.length > 50) {
      return {
        valid: false,
        error: 'Array must have at most 50 elements',
        errorKey: 'selectionSortTooLarge',
      };
    }

    return { valid: true };
  },

  getInitialState(): SelectionSortState {
    return {
      array: [],
      originalArray: [],
      currentPass: 0,
      scanIndex: -1,
      minIndex: -1,
      sortedUntil: -1,
      comparisons: 0,
      swaps: 0,
    };
  },

  describeStep(step: Step<SelectionSortState>, lang: 'en' | 'zh'): string {
    const { state, operation } = step;
    const { currentPass, scanIndex, minIndex, comparisons, swaps } = state;

    const messages: Record<string, Record<'en' | 'zh', string>> = {
      init: {
        en: 'Start with the whole array unsorted.',
        zh: '开始时整个数组都未排序。',
      },
      select_minimum: {
        en: `Pass ${currentPass + 1}: assume index ${currentPass} holds the minimum.`,
        zh: `第 ${currentPass + 1} 轮：先假设索引 ${currentPass} 是最小值位置。`,
      },
      compare: {
        en: `Compare index ${scanIndex} with current minimum index ${minIndex}. Comparisons: ${comparisons}.`,
        zh: `比较索引 ${scanIndex} 与当前最小值索引 ${minIndex}。已比较 ${comparisons} 次。`,
      },
      new_minimum: {
        en: `A new minimum was found at index ${minIndex}.`,
        zh: `在索引 ${minIndex} 找到新的最小值。`,
      },
      swap: {
        en: `Swap the minimum into position ${currentPass}. Swaps: ${swaps}.`,
        zh: `把最小值交换到位置 ${currentPass}。已交换 ${swaps} 次。`,
      },
      lock: {
        en: `Position ${currentPass} is fixed; the sorted prefix grows by one.`,
        zh: `位置 ${currentPass} 已确定，已排序前缀增加一个元素。`,
      },
      complete: {
        en: `Selection sort complete after ${comparisons} comparisons and ${swaps} swaps.`,
        zh: `选择排序完成，共比较 ${comparisons} 次，交换 ${swaps} 次。`,
      },
    };

    return messages[operation]?.[lang] ?? '';
  },

  getInvariant(lang: 'en' | 'zh'): string {
    return lang === 'en'
      ? 'After each pass, the sorted prefix contains the smallest elements in final order.'
      : '每一轮结束后，已排序前缀包含当前最小的一批元素，且位置已经固定。';
  },

  getComplexity(): ComplexityInfo {
    return {
      time: 'O(n^2)',
      space: 'O(1)',
      worstCase: 'O(n^2) comparisons regardless of input order',
      worstCaseZh: '无论输入顺序如何，都需要 O(n^2) 次比较',
      bestCase: 'O(n^2) comparisons, but zero swaps if already sorted',
      bestCaseZh: '数组已有序时仍需 O(n^2) 次比较，但可以不交换',
    };
  },
};
