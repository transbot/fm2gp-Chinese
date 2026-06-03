import {
  AlgorithmVisualization,
  ComplexityInfo,
  Step,
  ValidationResult,
} from './types';

export interface InsertionSortInput {
  array: number[];
}

export interface InsertionSortState {
  array: number[];
  originalArray: number[];
  currentIndex: number;
  compareIndex: number;
  key: number | null;
  sortedEnd: number;
  comparisons: number;
  shifts: number;
  insertions: number;
}

export const insertionSortVisualization: AlgorithmVisualization<
  InsertionSortInput,
  InsertionSortState
> = {
  id: 'insertion-sort',

  generateSteps(input: InsertionSortInput): Step<InsertionSortState>[] {
    const originalArray = [...input.array];
    const array = [...input.array];
    const steps: Step<InsertionSortState>[] = [];
    let comparisons = 0;
    let shifts = 0;
    let insertions = 0;

    const makeState = (
      currentIndex: number,
      compareIndex: number,
      key: number | null,
      sortedEnd: number
    ): InsertionSortState => ({
      array: [...array],
      originalArray,
      currentIndex,
      compareIndex,
      key,
      sortedEnd,
      comparisons,
      shifts,
      insertions,
    });

    steps.push({
      state: makeState(1, -1, null, Math.min(0, array.length - 1)),
      operation: 'init',
      descriptionKey: 'insertionSortInit',
      highlights: [],
    });

    for (let i = 1; i < array.length; i++) {
      const key = array[i];
      let j = i - 1;

      steps.push({
        state: makeState(i, j, key, i - 1),
        operation: 'select_key',
        descriptionKey: 'insertionSortSelectKey',
        highlights: [i],
      });

      while (j >= 0) {
        comparisons++;
        steps.push({
          state: makeState(i, j, key, i - 1),
          operation: 'compare',
          descriptionKey: 'insertionSortCompare',
          highlights: [j, j + 1],
        });

        if (array[j] <= key) {
          break;
        }

        array[j + 1] = array[j];
        shifts++;
        steps.push({
          state: makeState(i, j, key, i - 1),
          operation: 'shift',
          descriptionKey: 'insertionSortShift',
          highlights: [j, j + 1],
          animation: { type: 'move' },
        });
        j--;
      }

      array[j + 1] = key;
      insertions++;
      steps.push({
        state: makeState(i, j + 1, key, i),
        operation: 'insert',
        descriptionKey: 'insertionSortInsert',
        highlights: [j + 1],
      });
    }

    steps.push({
      state: makeState(array.length, -1, null, array.length - 1),
      operation: 'complete',
      descriptionKey: 'insertionSortComplete',
      highlights: array.map((_, index) => index),
    });

    return steps;
  },

  validateInput(input: InsertionSortInput): ValidationResult {
    if (!input.array || input.array.length === 0) {
      return {
        valid: false,
        error: 'Array must not be empty',
        errorKey: 'insertionSortEmptyArray',
      };
    }

    if (input.array.length > 50) {
      return {
        valid: false,
        error: 'Array must have at most 50 elements',
        errorKey: 'insertionSortTooLarge',
      };
    }

    return { valid: true };
  },

  getInitialState(): InsertionSortState {
    return {
      array: [],
      originalArray: [],
      currentIndex: 0,
      compareIndex: -1,
      key: null,
      sortedEnd: -1,
      comparisons: 0,
      shifts: 0,
      insertions: 0,
    };
  },

  describeStep(step: Step<InsertionSortState>, lang: 'en' | 'zh'): string {
    const { state, operation } = step;
    const { currentIndex, compareIndex, key, comparisons, shifts, insertions } = state;

    const messages: Record<string, Record<'en' | 'zh', string>> = {
      init: {
        en: 'Start with the first element as a sorted prefix.',
        zh: '先把第一个元素看作已经排好序的前缀。',
      },
      select_key: {
        en: `Select ${key} at index ${currentIndex} and insert it into the sorted prefix.`,
        zh: `选择索引 ${currentIndex} 处的 ${key}，准备插入已排序前缀。`,
      },
      compare: {
        en: `Compare ${key} with the element at index ${compareIndex}. Comparisons: ${comparisons}.`,
        zh: `比较 ${key} 与索引 ${compareIndex} 处的元素。已比较 ${comparisons} 次。`,
      },
      shift: {
        en: `Shift the larger element one position to the right. Shifts: ${shifts}.`,
        zh: `把较大的元素右移一位。已移动 ${shifts} 次。`,
      },
      insert: {
        en: `Insert ${key} into position ${compareIndex}. Insertions: ${insertions}.`,
        zh: `把 ${key} 插入位置 ${compareIndex}。已插入 ${insertions} 次。`,
      },
      complete: {
        en: `Insertion sort complete after ${comparisons} comparisons and ${shifts} shifts.`,
        zh: `插入排序完成，共比较 ${comparisons} 次，移动 ${shifts} 次。`,
      },
    };

    return messages[operation]?.[lang] ?? '';
  },

  getInvariant(lang: 'en' | 'zh'): string {
    return lang === 'en'
      ? 'Before each pass, the prefix to the left of the key is sorted.'
      : '每一轮开始前，当前 key 左侧的前缀已经有序。';
  },

  getComplexity(): ComplexityInfo {
    return {
      time: 'O(n^2)',
      space: 'O(1)',
      worstCase: 'O(n^2) comparisons and shifts when the array is reverse sorted',
      worstCaseZh: '数组逆序时需要 O(n^2) 次比较和移动',
      bestCase: 'O(n) comparisons when the array is already sorted',
      bestCaseZh: '数组已有序时只需要 O(n) 次比较',
    };
  },
};
