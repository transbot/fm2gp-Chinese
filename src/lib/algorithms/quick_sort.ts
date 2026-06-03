// src/lib/algorithms/quick_sort.ts

import {
  AlgorithmVisualization,
  Step,
  ValidationResult,
  ComplexityInfo,
} from './types';

/**
 * Input for quick sort algorithm
 */
export interface QuickSortInput {
  array: number[];
}

/**
 * State snapshot for each step of quick sort
 */
export interface QuickSortState {
  array: number[];
  pivot: number | null;
  pivotIndex: number | null;
  low: number;
  high: number;
  i: number;  // Boundary for elements less than pivot
  j: number;  // Current element being compared
  sorted: number[];  // Indices that are in final sorted position
  comparing: [number, number] | null;
  swapping: [number, number] | null;
  partitionComplete: boolean;
  recursionStack: [number, number][];  // Stack of subarrays to process
}

/**
 * Quick Sort algorithm visualization implementation
 * Uses Lomuto partition scheme (pivot = last element)
 * This is an ADVANCED algorithm not covered in the book
 */
export const quickSortVisualization: AlgorithmVisualization<
  QuickSortInput,
  QuickSortState
> = {
  id: 'quick-sort',
  isAdvanced: true,

  generateSteps(input: QuickSortInput): Step<QuickSortState>[] {
    const { array } = input;
    const steps: Step<QuickSortState>[] = [];
    const arr = [...array];
    const sorted: number[] = [];

    // Track recursion stack for visualization
    const recursionStack: [number, number][] = [];

    const initialState: QuickSortState = {
      array: [...arr],
      pivot: null,
      pivotIndex: null,
      low: 0,
      high: arr.length - 1,
      i: -1,
      j: 0,
      sorted: [],
      comparing: null,
      swapping: null,
      partitionComplete: false,
      recursionStack: [[0, arr.length - 1]],
    };

    // Initial state
    steps.push({
      state: { ...initialState },
      operation: 'init',
      descriptionKey: 'quickSortInit',
      highlights: [],
    });

    // Helper to add partition steps
    const partition = (low: number, high: number): number => {
      const pivot = arr[high];
      let i = low - 1;

      // Show pivot selection
      steps.push({
        state: {
          array: [...arr],
          pivot,
          pivotIndex: high,
          low,
          high,
          i,
          j: low,
          sorted: [...sorted],
          comparing: null,
          swapping: null,
          partitionComplete: false,
          recursionStack: [...recursionStack],
        },
        operation: 'select_pivot',
        descriptionKey: 'quickSortSelectPivot',
        highlights: [high],
        animation: { type: 'highlight' },
      });

      for (let j = low; j < high; j++) {
        // Show comparison
        steps.push({
          state: {
            array: [...arr],
            pivot,
            pivotIndex: high,
            low,
            high,
            i,
            j,
            sorted: [...sorted],
            comparing: [j, high],
            swapping: null,
            partitionComplete: false,
            recursionStack: [...recursionStack],
          },
          operation: 'compare',
          descriptionKey: 'quickSortCompare',
          highlights: [j, high],
          animation: { type: 'highlight' },
        });

        if (arr[j] < pivot) {
          i++;

          if (i !== j) {
            // Swap arr[i] and arr[j]
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;

            steps.push({
              state: {
                array: [...arr],
                pivot,
                pivotIndex: high,
                low,
                high,
                i,
                j,
                sorted: [...sorted],
                comparing: null,
                swapping: [i, j],
                partitionComplete: false,
                recursionStack: [...recursionStack],
              },
              operation: 'swap',
              descriptionKey: 'quickSortSwap',
              highlights: [i, j],
              animation: { type: 'swap' },
            });
          }
        }
      }

      // Place pivot in correct position
      const pivotFinalIndex = i + 1;
      if (pivotFinalIndex !== high) {
        const temp = arr[pivotFinalIndex];
        arr[pivotFinalIndex] = arr[high];
        arr[high] = temp;

        steps.push({
          state: {
            array: [...arr],
            pivot,
            pivotIndex: pivotFinalIndex,
            low,
            high,
            i,
            j: high,
            sorted: [...sorted],
            comparing: null,
            swapping: [pivotFinalIndex, high],
            partitionComplete: true,
            recursionStack: [...recursionStack],
          },
          operation: 'place_pivot',
          descriptionKey: 'quickSortPlacePivot',
          highlights: [pivotFinalIndex],
          animation: { type: 'swap' },
        });
      } else {
        steps.push({
          state: {
            array: [...arr],
            pivot,
            pivotIndex: pivotFinalIndex,
            low,
            high,
            i,
            j: high,
            sorted: [...sorted],
            comparing: null,
            swapping: null,
            partitionComplete: true,
            recursionStack: [...recursionStack],
          },
          operation: 'place_pivot',
          descriptionKey: 'quickSortPlacePivot',
          highlights: [pivotFinalIndex],
          animation: { type: 'highlight' },
        });
      }

      return pivotFinalIndex;
    };

    // Iterative quick sort using a stack
    const stack: [number, number][] = [[0, arr.length - 1]];

    while (stack.length > 0) {
      const [low, high] = stack.pop()!;

      if (low < high) {
        recursionStack.push([low, high]);
        const pi = partition(low, high);
        sorted.push(pi);

        // Mark pivot as sorted
        steps.push({
          state: {
            array: [...arr],
            pivot: arr[pi],
            pivotIndex: pi,
            low,
            high,
            i: pi - 1,
            j: high,
            sorted: [...sorted],
            comparing: null,
            swapping: null,
            partitionComplete: true,
            recursionStack: [...recursionStack],
          },
          operation: 'partition_complete',
          descriptionKey: 'quickSortPartitionComplete',
          highlights: [pi],
          animation: { type: 'highlight' },
        });

        // Push subarrays to stack (right first, so left is processed first)
        if (pi + 1 < high) {
          stack.push([pi + 1, high]);
        }
        if (low < pi - 1) {
          stack.push([low, pi - 1]);
        }

        recursionStack.pop();
      } else if (low === high) {
        // Single element is already sorted
        sorted.push(low);
        steps.push({
          state: {
            array: [...arr],
            pivot: null,
            pivotIndex: null,
            low,
            high,
            i: low,
            j: low,
            sorted: [...sorted],
            comparing: null,
            swapping: null,
            partitionComplete: true,
            recursionStack: [...recursionStack],
          },
          operation: 'single_sorted',
          descriptionKey: 'quickSortSingleSorted',
          highlights: [low],
          animation: { type: 'highlight' },
        });
      }
    }

    // Final sorted state
    steps.push({
      state: {
        array: [...arr],
        pivot: null,
        pivotIndex: null,
        low: 0,
        high: arr.length - 1,
        i: -1,
        j: -1,
        sorted: Array.from({ length: arr.length }, (_, i) => i),
        comparing: null,
        swapping: null,
        partitionComplete: false,
        recursionStack: [],
      },
      operation: 'complete',
      descriptionKey: 'quickSortComplete',
      highlights: [],
      animation: { type: 'none' },
    });

    return steps;
  },

  validateInput(input: QuickSortInput): ValidationResult {
    if (!input.array || input.array.length === 0) {
      return {
        valid: false,
        error: 'Array must not be empty',
        errorKey: 'quickSortEmptyArray',
      };
    }

    if (input.array.length > 30) {
      return {
        valid: false,
        error: 'Array must have at most 30 elements for visualization',
        errorKey: 'quickSortTooLarge',
      };
    }

    // Check for valid numbers
    if (input.array.some(n => isNaN(n) || !isFinite(n))) {
      return {
        valid: false,
        error: 'Array must contain only valid numbers',
        errorKey: 'quickSortInvalidNumbers',
      };
    }

    return { valid: true };
  },

  getInitialState(): QuickSortState {
    return {
      array: [],
      pivot: null,
      pivotIndex: null,
      low: 0,
      high: -1,
      i: -1,
      j: 0,
      sorted: [],
      comparing: null,
      swapping: null,
      partitionComplete: false,
      recursionStack: [],
    };
  },

  describeStep(step: Step<QuickSortState>, lang: 'en' | 'zh'): string {
    const { state, operation } = step;
    const {
      array,
      pivot,
      pivotIndex,
      low,
      high,
      j,
      sorted,
      comparing,
      swapping,
    } = state;

    const messages: Record<string, Record<'en' | 'zh', string>> = {
      init: {
        en: `Starting Quick Sort. Array has ${array.length} elements. We'll use the Lomuto partition scheme with the last element as pivot.`,
        zh: `开始快速排序。数组有 ${array.length} 个元素。我们将使用 Lomuto 分区方案，以最后一个元素作为基准。`,
      },
      select_pivot: {
        en: `Selecting pivot: arr[${pivotIndex}] = ${pivot}. This is the last element in the current subarray [${low}, ${high}].`,
        zh: `选择基准：arr[${pivotIndex}] = ${pivot}。这是当前子数组 [${low}, ${high}] 中的最后一个元素。`,
      },
      compare: {
        en: comparing
          ? `Comparing arr[${j}] = ${array[j]} with pivot ${pivot}. ${array[j] < pivot! ? 'Less than pivot, will move to left partition.' : 'Greater or equal to pivot, stays in right partition.'}`
          : '',
        zh: comparing
          ? `比较 arr[${j}] = ${array[j]} 与基准 ${pivot}。${array[j] < pivot! ? '小于基准，将移到左分区。' : '大于或等于基准，保留在右分区。'}`
          : '',
      },
      swap: {
        en: swapping
          ? `Swapping arr[${swapping[0]}] = ${array[swapping[0]]} with arr[${swapping[1]}] = ${array[swapping[1]]}. Element moved to left partition.`
          : '',
        zh: swapping
          ? `交换 arr[${swapping[0]}] = ${array[swapping[0]]} 与 arr[${swapping[1]}] = ${array[swapping[1]]}。元素移至左分区。`
          : '',
      },
      place_pivot: {
        en: pivotIndex !== null
          ? `Placing pivot in its final position at index ${pivotIndex}. All elements to the left are smaller, all to the right are larger or equal.`
          : '',
        zh: pivotIndex !== null
          ? `将基准放置在最终位置索引 ${pivotIndex}。左侧所有元素都较小，右侧所有元素都较大或相等。`
          : '',
      },
      partition_complete: {
        en: pivotIndex !== null
          ? `Partition complete! Pivot ${array[pivotIndex]} is now at index ${pivotIndex} in its final sorted position. ${sorted.length} elements sorted.`
          : '',
        zh: pivotIndex !== null
          ? `分区完成！基准 ${array[pivotIndex]} 现在位于索引 ${pivotIndex} 的最终排序位置。已排序 ${sorted.length} 个元素。`
          : '',
      },
      single_sorted: {
        en: `Single element at index ${low} = ${array[low]} is already in its final position.`,
        zh: `索引 ${low} 处的单个元素 ${array[low]} 已处于最终位置。`,
      },
      complete: {
        en: `Quick Sort complete! Array is now fully sorted. Total elements: ${array.length}.`,
        zh: `快速排序完成！数组已完全排序。总元素数：${array.length}。`,
      },
    };

    return messages[operation]?.[lang] ?? '';
  },

  getInvariant(lang: 'en' | 'zh'): string {
    return lang === 'en'
      ? 'After each partition, the pivot is in its final sorted position. Elements left of pivot are smaller; elements right of pivot are larger or equal.'
      : '每次分区后，基准处于最终排序位置。基准左侧的元素较小；右侧的元素较大或相等。';
  },

  getComplexity(): ComplexityInfo {
    return {
      time: 'O(n log n)',
      space: 'O(log n)',
      worstCase: 'O(n²) - when array is already sorted or reverse sorted',
      worstCaseZh: 'O(n²) - 当数组已排序或逆序',
      bestCase: 'O(n log n) - when partitions are balanced',
      bestCaseZh: 'O(n log n) - 当分区均衡',
    };
  },
};
