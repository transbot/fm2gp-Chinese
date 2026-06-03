import {
  AlgorithmVisualization,
  ComplexityInfo,
  Step,
  ValidationResult,
} from './types';

export interface BubbleSortInput {
  array: number[];
}

export interface BubbleSortState {
  array: number[];
  originalArray: number[];
  leftIndex: number;
  rightIndex: number;
  sortedFrom: number;
  pass: number;
  comparisons: number;
  swaps: number;
}

export const bubbleSortVisualization: AlgorithmVisualization<BubbleSortInput, BubbleSortState> = {
  id: 'bubble-sort',

  generateSteps(input: BubbleSortInput): Step<BubbleSortState>[] {
    const originalArray = [...input.array];
    const array = [...input.array];
    const steps: Step<BubbleSortState>[] = [];
    let comparisons = 0;
    let swaps = 0;

    const makeState = (
      leftIndex: number,
      rightIndex: number,
      sortedFrom: number,
      pass: number
    ): BubbleSortState => ({
      array: [...array],
      originalArray,
      leftIndex,
      rightIndex,
      sortedFrom,
      pass,
      comparisons,
      swaps,
    });

    steps.push({
      state: makeState(-1, -1, array.length, 0),
      operation: 'init',
      descriptionKey: 'bubbleSortInit',
      highlights: [],
    });

    for (let end = array.length - 1; end > 0; end--) {
      let swappedInPass = false;
      const pass = array.length - end;

      for (let index = 0; index < end; index++) {
        comparisons++;
        steps.push({
          state: makeState(index, index + 1, end + 1, pass),
          operation: 'compare',
          descriptionKey: 'bubbleSortCompare',
          highlights: [index, index + 1],
        });

        if (array[index] > array[index + 1]) {
          [array[index], array[index + 1]] = [array[index + 1], array[index]];
          swaps++;
          swappedInPass = true;
          steps.push({
            state: makeState(index, index + 1, end + 1, pass),
            operation: 'swap',
            descriptionKey: 'bubbleSortSwap',
            highlights: [index, index + 1],
            animation: { type: 'swap' },
          });
        }
      }

      steps.push({
        state: makeState(-1, -1, end, pass),
        operation: 'pass_complete',
        descriptionKey: 'bubbleSortPassComplete',
        highlights: [end],
      });

      if (!swappedInPass) {
        break;
      }
    }

    steps.push({
      state: makeState(-1, -1, 0, Math.max(0, array.length - 1)),
      operation: 'complete',
      descriptionKey: 'bubbleSortComplete',
      highlights: array.map((_, index) => index),
    });

    return steps;
  },

  validateInput(input: BubbleSortInput): ValidationResult {
    if (!input.array || input.array.length === 0) {
      return {
        valid: false,
        error: 'Array must not be empty',
        errorKey: 'bubbleSortEmptyArray',
      };
    }

    if (input.array.length > 50) {
      return {
        valid: false,
        error: 'Array must have at most 50 elements',
        errorKey: 'bubbleSortTooLarge',
      };
    }

    return { valid: true };
  },

  getInitialState(): BubbleSortState {
    return {
      array: [],
      originalArray: [],
      leftIndex: -1,
      rightIndex: -1,
      sortedFrom: 0,
      pass: 0,
      comparisons: 0,
      swaps: 0,
    };
  },

  describeStep(step: Step<BubbleSortState>, lang: 'en' | 'zh'): string {
    const { state, operation } = step;
    const { leftIndex, rightIndex, pass, comparisons, swaps } = state;

    const messages: Record<string, Record<'en' | 'zh', string>> = {
      init: {
        en: 'Start bubble sort. Each pass moves the largest remaining value to the right.',
        zh: '开始冒泡排序。每一轮都会把未排序部分的最大值推到右侧。',
      },
      compare: {
        en: `Compare adjacent indices ${leftIndex} and ${rightIndex}. Comparisons: ${comparisons}.`,
        zh: `比较相邻索引 ${leftIndex} 和 ${rightIndex}。已比较 ${comparisons} 次。`,
      },
      swap: {
        en: `Swap the adjacent out-of-order values. Swaps: ${swaps}.`,
        zh: `交换这两个逆序的相邻元素。已交换 ${swaps} 次。`,
      },
      pass_complete: {
        en: `Pass ${pass} complete; the right side has one more final value.`,
        zh: `第 ${pass} 轮完成；右侧又多了一个最终位置的元素。`,
      },
      complete: {
        en: `Bubble sort complete after ${comparisons} comparisons and ${swaps} swaps.`,
        zh: `冒泡排序完成，共比较 ${comparisons} 次，交换 ${swaps} 次。`,
      },
    };

    return messages[operation]?.[lang] ?? '';
  },

  getInvariant(lang: 'en' | 'zh'): string {
    return lang === 'en'
      ? 'After each pass, the suffix on the right contains the largest values in final sorted order.'
      : '每一轮结束后，右侧后缀都包含已经处于最终位置的最大元素。';
  },

  getComplexity(): ComplexityInfo {
    return {
      time: 'O(n^2)',
      space: 'O(1)',
      worstCase: 'O(n^2) comparisons and swaps when small values start near the end',
      worstCaseZh: '较小值位于末尾时，需要 O(n^2) 次比较和交换',
      bestCase: 'O(n) comparisons with early exit when the array is already sorted',
      bestCaseZh: '数组已有序且启用提前结束时，只需 O(n) 次比较',
    };
  },
};
