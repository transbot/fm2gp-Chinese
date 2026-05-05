// src/lib/algorithms/merge_sort.ts

import {
  AlgorithmVisualization,
  Step,
  ValidationResult,
  ComplexityInfo,
} from './types';

/**
 * Input for merge sort algorithm
 */
export interface MergeSortInput {
  array: number[];
}

/**
 * State snapshot for each step of merge sort
 */
export interface MergeSortState {
  /** Original array (for reference) */
  originalArray: number[];
  /** Current state of the array being sorted */
  array: number[];
  /** Current phase: divide or merge */
  phase: 'init' | 'divide' | 'merge' | 'complete';
  /** Current recursion level (depth) */
  level: number;
  /** Left subarray being processed (for divide) */
  leftArray: number[];
  /** Right subarray being processed (for divide) */
  rightArray: number[];
  /** Current merge indices */
  mergeLeft?: number;
  mergeRight?: number;
  mergeMid?: number;
  /** Current merged result during merge phase */
  mergedArray: number[];
  /** Left index in current merge */
  mergeI?: number;
  /** Right index in current merge */
  mergeJ?: number;
  /** Elements being compared in current step */
  comparing?: [number, number];
  /** Total comparisons made */
  comparisons: number;
  /** Range being processed [start, end) */
  rangeStart?: number;
  rangeEnd?: number;
}

/**
 * Merge Sort algorithm visualization implementation
 * Advanced algorithm (not in the book)
 */
export const mergeSortVisualization: AlgorithmVisualization<
  MergeSortInput,
  MergeSortState
> = {
  id: 'merge-sort',
  isAdvanced: true,

  generateSteps(input: MergeSortInput): Step<MergeSortState>[] {
    const { array } = input;
    const steps: Step<MergeSortState>[] = [];
    let comparisons = 0;

    // Initial state
    steps.push({
      state: {
        originalArray: [...array],
        array: [...array],
        phase: 'init',
        level: 0,
        leftArray: [],
        rightArray: [],
        mergedArray: [],
        comparisons: 0,
      },
      operation: 'init',
      descriptionKey: 'mergeSortInit',
      highlights: [],
    });

    // Create a copy to sort
    const arr = [...array];

    // Recursively generate steps
    generateMergeSortSteps(arr, 0, arr.length, 0, steps, () => comparisons++);

    // Final state
    steps.push({
      state: {
        originalArray: [...array],
        array: [...arr],
        phase: 'complete',
        level: 0,
        leftArray: [],
        rightArray: [],
        mergedArray: [],
        comparisons,
      },
      operation: 'complete',
      descriptionKey: 'mergeSortComplete',
      highlights: [],
    });

    return steps;
  },

  validateInput(input: MergeSortInput): ValidationResult {
    if (!input.array || input.array.length === 0) {
      return {
        valid: false,
        error: 'Array must not be empty',
        errorKey: 'mergeSortEmptyArray',
      };
    }

    if (input.array.length > 32) {
      return {
        valid: false,
        error: 'Array must have at most 32 elements for visualization',
        errorKey: 'mergeSortTooLarge',
      };
    }

    return { valid: true };
  },

  getInitialState(): MergeSortState {
    return {
      originalArray: [],
      array: [],
      phase: 'init',
      level: 0,
      leftArray: [],
      rightArray: [],
      mergedArray: [],
      comparisons: 0,
    };
  },

  describeStep(step: Step<MergeSortState>, lang: 'en' | 'zh'): string {
    const { state, operation } = step;
    const {
      array,
      leftArray,
      rightArray,
      mergedArray,
      level,
      mergeI,
      mergeJ,
      comparing,
      comparisons,
      rangeStart,
      rangeEnd,
    } = state;

    const indent = '  '.repeat(level);

    const messages: Record<string, Record<'en' | 'zh', string>> = {
      init: {
        en: `Starting merge sort on array [${array.join(', ')}].`,
        zh: `开始归并排序，数组 [${array.join(', ')}]。`,
      },
      divide: {
        en: `${indent}Dividing array at level ${level}: [${leftArray.join(', ')}] and [${rightArray.join(', ')}]`,
        zh: `${indent}第 ${level} 层分割数组：[${leftArray.join(', ')}] 和 [${rightArray.join(', ')}]`,
      },
      merge_start: {
        en: `${indent}Merging at level ${level}: [${leftArray.join(', ')}] and [${rightArray.join(', ')}]`,
        zh: `${indent}第 ${level} 层归并：[${leftArray.join(', ')}] 和 [${rightArray.join(', ')}]`,
      },
      merge_compare: {
        en: `${indent}Comparing ${comparing?.[0] ?? '?'} and ${comparing?.[1] ?? '?'} at level ${level}`,
        zh: `${indent}第 ${level} 层比较 ${comparing?.[0] ?? '?'} 和 ${comparing?.[1] ?? '?'}`,
      },
      merge_pick_left: {
        en: `${indent}Picking ${comparing?.[0] ?? '?'} from left array at level ${level}`,
        zh: `${indent}第 ${level} 层从左数组选取 ${comparing?.[0] ?? '?'}`,
      },
      merge_pick_right: {
        en: `${indent}Picking ${comparing?.[1] ?? '?'} from right array at level ${level}`,
        zh: `${indent}第 ${level} 层从右数组选取 ${comparing?.[1] ?? '?'}`,
      },
      merge_result: {
        en: `${indent}Merged result at level ${level}: [${mergedArray.join(', ')}]`,
        zh: `${indent}第 ${level} 层归并结果：[${mergedArray.join(', ')}]`,
      },
      complete: {
        en: `Merge sort complete! Sorted array: [${array.join(', ')}]. Total comparisons: ${comparisons}`,
        zh: `归并排序完成！排序结果：[${array.join(', ')}]。总比较次数：${comparisons}`,
      },
    };

    return messages[operation]?.[lang] ?? '';
  },

  getInvariant(lang: 'en' | 'zh'): string {
    return lang === 'en'
      ? 'Each subarray is sorted before merging. Merge combines two sorted subarrays into one sorted array.'
      : '每个子数组在归并前已排序。归并将两个已排序的子数组合并为一个已排序的数组。';
  },

  getComplexity(): ComplexityInfo {
    return {
      time: 'O(n log n)',
      space: 'O(n)',
      worstCase: 'O(n log n) - always divides evenly and merges',
      bestCase: 'O(n log n) - even when already sorted',
    };
  },
};

/**
 * Helper function to recursively generate merge sort steps
 */
function generateMergeSortSteps(
  arr: number[],
  start: number,
  end: number,
  level: number,
  steps: Step<MergeSortState>[],
  getComparison: () => number
): void {
  if (end - start <= 1) {
    return; // Base case: single element or empty
  }

  const mid = Math.floor((start + end) / 2);

  // Divide step
  const leftArray = arr.slice(start, mid);
  const rightArray = arr.slice(mid, end);

  steps.push({
    state: {
      originalArray: [...arr],
      array: [...arr],
      phase: 'divide',
      level,
      leftArray: [...leftArray],
      rightArray: [...rightArray],
      mergedArray: [],
      comparisons: getComparison() - 1,
      rangeStart: start,
      rangeEnd: end,
    },
    operation: 'divide',
    descriptionKey: 'mergeSortDivide',
    highlights: Array.from({ length: end - start }, (_, i) => start + i),
  });

  // Recursively sort left half
  generateMergeSortSteps(arr, start, mid, level + 1, steps, getComparison);

  // Recursively sort right half
  generateMergeSortSteps(arr, mid, end, level + 1, steps, getComparison);

  // Merge step
  merge(arr, start, mid, end, level, steps, getComparison);
}

/**
 * Merge two sorted subarrays
 */
function merge(
  arr: number[],
  start: number,
  mid: number,
  end: number,
  level: number,
  steps: Step<MergeSortState>[],
  getComparison: () => number
): void {
  const leftArray = arr.slice(start, mid);
  const rightArray = arr.slice(mid, end);
  const mergedArray: number[] = [];

  let i = 0;
  let j = 0;
  let k = start;

  // Merge start step
  steps.push({
    state: {
      originalArray: [...arr],
      array: [...arr],
      phase: 'merge',
      level,
      leftArray: [...leftArray],
      rightArray: [...rightArray],
      mergedArray: [],
      mergeLeft: start,
      mergeRight: mid,
      mergeMid: mid,
      mergeI: 0,
      mergeJ: 0,
      mergedArray: [],
      comparisons: getComparison() - 1,
      rangeStart: start,
      rangeEnd: end,
    },
    operation: 'merge_start',
    descriptionKey: 'mergeSortMergeStart',
    highlights: Array.from({ length: end - start }, (_, idx) => start + idx),
  });

  // Compare and merge
  while (i < leftArray.length && j < rightArray.length) {
    const comparisons = getComparison();

    // Compare step
    steps.push({
      state: {
        originalArray: [...arr],
        array: [...arr],
        phase: 'merge',
        level,
        leftArray: [...leftArray],
        rightArray: [...rightArray],
        mergedArray: [...mergedArray],
        mergeLeft: start,
        mergeRight: mid,
        mergeMid: mid,
        mergeI: i,
        mergeJ: j,
        comparing: [leftArray[i], rightArray[j]],
        comparisons: comparisons,
        rangeStart: start,
        rangeEnd: end,
      },
      operation: 'merge_compare',
      descriptionKey: 'mergeSortCompare',
      highlights: [start + k],
    });

    if (leftArray[i] <= rightArray[j]) {
      // Pick from left
      arr[k] = leftArray[i];
      mergedArray.push(leftArray[i]);

      steps.push({
        state: {
          originalArray: [...arr],
          array: [...arr],
          phase: 'merge',
          level,
          leftArray: [...leftArray],
          rightArray: [...rightArray],
          mergedArray: [...mergedArray],
          mergeLeft: start,
          mergeRight: mid,
          mergeMid: mid,
          mergeI: i,
          mergeJ: j,
          comparing: [leftArray[i], rightArray[j]],
          comparisons: comparisons,
          rangeStart: start,
          rangeEnd: end,
        },
        operation: 'merge_pick_left',
        descriptionKey: 'mergeSortPickLeft',
        highlights: [start + k],
      });

      i++;
    } else {
      // Pick from right
      arr[k] = rightArray[j];
      mergedArray.push(rightArray[j]);

      steps.push({
        state: {
          originalArray: [...arr],
          array: [...arr],
          phase: 'merge',
          level,
          leftArray: [...leftArray],
          rightArray: [...rightArray],
          mergedArray: [...mergedArray],
          mergeLeft: start,
          mergeRight: mid,
          mergeMid: mid,
          mergeI: i,
          mergeJ: j,
          comparing: [leftArray[i], rightArray[j]],
          comparisons: comparisons,
          rangeStart: start,
          rangeEnd: end,
        },
        operation: 'merge_pick_right',
        descriptionKey: 'mergeSortPickRight',
        highlights: [start + k],
      });

      j++;
    }
    k++;
  }

  // Copy remaining elements from left
  while (i < leftArray.length) {
    arr[k] = leftArray[i];
    mergedArray.push(leftArray[i]);
    i++;
    k++;
  }

  // Copy remaining elements from right
  while (j < rightArray.length) {
    arr[k] = rightArray[j];
    mergedArray.push(rightArray[j]);
    j++;
    k++;
  }

  // Merge result step
  steps.push({
    state: {
      originalArray: [...arr],
      array: [...arr],
      phase: 'merge',
      level,
      leftArray: [...leftArray],
      rightArray: [...rightArray],
      mergedArray: [...arr.slice(start, end)],
      mergeLeft: start,
      mergeRight: mid,
      mergeMid: mid,
      comparisons: getComparison() - 1,
      rangeStart: start,
      rangeEnd: end,
    },
    operation: 'merge_result',
    descriptionKey: 'mergeSortResult',
    highlights: Array.from({ length: end - start }, (_, idx) => start + idx),
  });
}