// src/lib/algorithms/heap.ts

import {
  AlgorithmVisualization,
  Step,
  ValidationResult,
  ComplexityInfo,
} from './types';

/**
 * Input for heap operations
 */
export interface HeapInput {
  array: number[];
  operation: 'heapify' | 'insert' | 'delete';
  value?: number; // Value to insert
}

/**
 * State snapshot for each step of heap operations
 */
export interface HeapState {
  array: number[];
  heapTree: number[]; // Same as array but conceptually a tree
  currentIndex: number;
  parentIndex: number;
  leftChildIndex: number;
  rightChildIndex: number;
  swapped: boolean;
  heapType: 'max';
  operation: 'heapify' | 'insert' | 'delete';
  phase: string;
  isHeap: boolean;
}

/**
 * Get parent index in heap
 */
function getParentIndex(index: number): number {
  return Math.floor((index - 1) / 2);
}

/**
 * Get left child index in heap
 */
function getLeftChildIndex(index: number): number {
  return 2 * index + 1;
}

/**
 * Get right child index in heap
 */
function getRightChildIndex(index: number): number {
  return 2 * index + 2;
}

/**
 * Sift down element at given index (for max-heap)
 */
function siftDown(
  arr: number[],
  startIndex: number,
  steps: Step<HeapState>[],
  operation: string
): void {
  let index = startIndex;
  const n = arr.length;

  while (true) {
    const left = getLeftChildIndex(index);
    const right = getRightChildIndex(index);
    let largest = index;

    // Compare with left child
    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }

    // Compare with right child
    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }

    // Add step showing comparison
    steps.push({
      state: {
        array: [...arr],
        heapTree: [...arr],
        currentIndex: index,
        parentIndex: getParentIndex(index),
        leftChildIndex: left,
        rightChildIndex: right,
        swapped: false,
        heapType: 'max',
        operation: operation as any,
        phase: 'compare',
        isHeap: false,
      },
      operation: 'compare',
      descriptionKey: 'heapCompare',
      highlights: [index, left, right].filter(i => i < n),
    });

    if (largest !== index) {
      // Swap with largest child
      [arr[index], arr[largest]] = [arr[largest], arr[index]];

      steps.push({
        state: {
          array: [...arr],
          heapTree: [...arr],
          currentIndex: largest,
          parentIndex: index,
          leftChildIndex: getLeftChildIndex(largest),
          rightChildIndex: getRightChildIndex(largest),
          swapped: true,
          heapType: 'max',
          operation: operation as any,
          phase: 'swap',
          isHeap: false,
        },
        operation: 'swap',
        descriptionKey: 'heapSwap',
        highlights: [index, largest],
        animation: { type: 'swap' },
      });

      index = largest;
    } else {
      // Heap property satisfied at this node
      break;
    }
  }
}

/**
 * Sift up element at given index (for max-heap)
 */
function siftUp(
  arr: number[],
  startIndex: number,
  steps: Step<HeapState>[],
  operation: string
): void {
  let index = startIndex;

  while (index > 0) {
    const parent = getParentIndex(index);

    // Add step showing comparison
    steps.push({
      state: {
        array: [...arr],
        heapTree: [...arr],
        currentIndex: index,
        parentIndex: parent,
        leftChildIndex: getLeftChildIndex(index),
        rightChildIndex: getRightChildIndex(index),
        swapped: false,
        heapType: 'max',
        operation: operation as any,
        phase: 'compare',
        isHeap: false,
      },
      operation: 'compare',
      descriptionKey: 'heapCompareUp',
      highlights: [index, parent],
    });

    if (arr[index] > arr[parent]) {
      // Swap with parent
      [arr[index], arr[parent]] = [arr[parent], arr[index]];

      steps.push({
        state: {
          array: [...arr],
          heapTree: [...arr],
          currentIndex: parent,
          parentIndex: getParentIndex(parent),
          leftChildIndex: getLeftChildIndex(parent),
          rightChildIndex: getRightChildIndex(parent),
          swapped: true,
          heapType: 'max',
          operation: operation as any,
          phase: 'swap',
          isHeap: false,
        },
        operation: 'swap',
        descriptionKey: 'heapSwapUp',
        highlights: [index, parent],
        animation: { type: 'swap' },
      });

      index = parent;
    } else {
      // Heap property satisfied
      break;
    }
  }
}

/**
 * Check if array satisfies max-heap property
 */
function isMaxHeap(arr: number[]): boolean {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    const left = getLeftChildIndex(i);
    const right = getRightChildIndex(i);
    if (left < n && arr[i] < arr[left]) return false;
    if (right < n && arr[i] < arr[right]) return false;
  }
  return true;
}

/**
 * Heap operations visualization implementation
 * Advanced algorithm (not in the book)
 */
export const heapVisualization: AlgorithmVisualization<
  HeapInput,
  HeapState
> = {
  id: 'heap',
  isAdvanced: true,

  generateSteps(input: HeapInput): Step<HeapState>[] {
    const { array, operation, value } = input;
    const steps: Step<HeapState>[] = [];
    const arr = [...array];

    // Initial state
    steps.push({
      state: {
        array: [...arr],
        heapTree: [...arr],
        currentIndex: -1,
        parentIndex: -1,
        leftChildIndex: -1,
        rightChildIndex: -1,
        swapped: false,
        heapType: 'max',
        operation,
        phase: 'init',
        isHeap: false,
      },
      operation: 'init',
      descriptionKey: 'heapInit',
      highlights: [],
    });

    if (operation === 'heapify') {
      // Build max-heap using Floyd's algorithm (sift down from last parent to root)
      const n = arr.length;
      const lastParent = Math.floor(n / 2) - 1;

      for (let i = lastParent; i >= 0; i--) {
        steps.push({
          state: {
            array: [...arr],
            heapTree: [...arr],
            currentIndex: i,
            parentIndex: getParentIndex(i),
            leftChildIndex: getLeftChildIndex(i),
            rightChildIndex: getRightChildIndex(i),
            swapped: false,
            heapType: 'max',
            operation: 'heapify',
            phase: 'heapify_node',
            isHeap: false,
          },
          operation: 'heapify_node',
          descriptionKey: 'heapifyNode',
          highlights: [i],
        });

        siftDown(arr, i, steps, 'heapify');
      }

      // Final state - heap is complete
      steps.push({
        state: {
          array: [...arr],
          heapTree: [...arr],
          currentIndex: -1,
          parentIndex: -1,
          leftChildIndex: -1,
          rightChildIndex: -1,
          swapped: false,
          heapType: 'max',
          operation: 'heapify',
          phase: 'complete',
          isHeap: true,
        },
        operation: 'complete',
        descriptionKey: 'heapComplete',
        highlights: [],
      });
    } else if (operation === 'insert') {
      if (value !== undefined) {
        // Insert at the end
        arr.push(value);

        steps.push({
          state: {
            array: [...arr],
            heapTree: [...arr],
            currentIndex: arr.length - 1,
            parentIndex: getParentIndex(arr.length - 1),
            leftChildIndex: -1,
            rightChildIndex: -1,
            swapped: false,
            heapType: 'max',
            operation: 'insert',
            phase: 'insert',
            isHeap: false,
          },
          operation: 'insert',
          descriptionKey: 'heapInsert',
          highlights: [arr.length - 1],
        });

        // Sift up
        siftUp(arr, arr.length - 1, steps, 'insert');

        // Final state
        steps.push({
          state: {
            array: [...arr],
            heapTree: [...arr],
            currentIndex: -1,
            parentIndex: -1,
            leftChildIndex: -1,
            rightChildIndex: -1,
            swapped: false,
            heapType: 'max',
            operation: 'insert',
            phase: 'complete',
            isHeap: true,
          },
          operation: 'complete',
          descriptionKey: 'heapInsertComplete',
          highlights: [],
        });
      }
    } else if (operation === 'delete') {
      if (arr.length > 0) {
        // Show root to be deleted
        steps.push({
          state: {
            array: [...arr],
            heapTree: [...arr],
            currentIndex: 0,
            parentIndex: -1,
            leftChildIndex: getLeftChildIndex(0),
            rightChildIndex: getRightChildIndex(0),
            swapped: false,
            heapType: 'max',
            operation: 'delete',
            phase: 'delete_select',
            isHeap: isMaxHeap(arr),
          },
          operation: 'delete_select',
          descriptionKey: 'heapDeleteSelect',
          highlights: [0],
        });

        // Swap root with last element
        const lastIdx = arr.length - 1;
        [arr[0], arr[lastIdx]] = [arr[lastIdx], arr[0]];

        steps.push({
          state: {
            array: [...arr],
            heapTree: [...arr],
            currentIndex: lastIdx,
            parentIndex: 0,
            leftChildIndex: -1,
            rightChildIndex: -1,
            swapped: true,
            heapType: 'max',
            operation: 'delete',
            phase: 'delete_swap',
            isHeap: false,
          },
          operation: 'delete_swap',
          descriptionKey: 'heapDeleteSwap',
          highlights: [0, lastIdx],
          animation: { type: 'swap' },
        });

        // Remove last element (was the root)
        const removedValue = arr.pop();

        steps.push({
          state: {
            array: [...arr],
            heapTree: [...arr],
            currentIndex: -1,
            parentIndex: -1,
            leftChildIndex: -1,
            rightChildIndex: -1,
            swapped: false,
            heapType: 'max',
            operation: 'delete',
            phase: 'delete_remove',
            isHeap: false,
          },
          operation: 'delete_remove',
          descriptionKey: 'heapDeleteRemove',
          highlights: [],
        });

        // Sift down from root if heap is not empty
        if (arr.length > 0) {
          siftDown(arr, 0, steps, 'delete');
        }

        // Final state
        steps.push({
          state: {
            array: [...arr],
            heapTree: [...arr],
            currentIndex: -1,
            parentIndex: -1,
            leftChildIndex: -1,
            rightChildIndex: -1,
            swapped: false,
            heapType: 'max',
            operation: 'delete',
            phase: 'complete',
            isHeap: true,
          },
          operation: 'complete',
          descriptionKey: 'heapDeleteComplete',
          highlights: [],
        });
      }
    }

    return steps;
  },

  validateInput(input: HeapInput): ValidationResult {
    if (!input.array || input.array.length === 0) {
      if (input.operation !== 'insert') {
        return {
          valid: false,
          error: 'Array must not be empty',
          errorKey: 'heapEmptyArray',
        };
      }
    }

    if (input.array.length > 31) {
      return {
        valid: false,
        error: 'Array must have at most 31 elements (for visualization)',
        errorKey: 'heapTooLarge',
      };
    }

    if (input.operation === 'insert' && input.value === undefined) {
      return {
        valid: false,
        error: 'Insert operation requires a value',
        errorKey: 'heapInsertNoValue',
      };
    }

    return { valid: true };
  },

  getInitialState(): HeapState {
    return {
      array: [],
      heapTree: [],
      currentIndex: -1,
      parentIndex: -1,
      leftChildIndex: -1,
      rightChildIndex: -1,
      swapped: false,
      heapType: 'max',
      operation: 'heapify',
      phase: 'init',
      isHeap: false,
    };
  },

  describeStep(step: Step<HeapState>, lang: 'en' | 'zh'): string {
    const { state } = step;
    const { array, currentIndex, parentIndex, swapped, operation, phase, isHeap } = state;

    const leftChild = getLeftChildIndex(currentIndex);
    const rightChild = getRightChildIndex(currentIndex);

    const messages: Record<string, Record<'en' | 'zh', string>> = {
      init: {
        en: `Starting ${operation} operation. Array has ${array.length} elements.`,
        zh: `开始${operation === 'heapify' ? '堆化' : operation === 'insert' ? '插入' : '删除'}操作。数组有 ${array.length} 个元素。`,
      },
      heapify_node: {
        en: `Heapifying node at index ${currentIndex} (value ${array[currentIndex]}).`,
        zh: `堆化索引 ${currentIndex} 处的节点（值 ${array[currentIndex]}）。`,
      },
      compare: {
        en: currentIndex >= 0 && currentIndex < array.length
          ? `Comparing node ${currentIndex} (value ${array[currentIndex]}) with children at indices ${leftChild} and ${rightChild}.`
          : 'Comparing nodes.',
        zh: currentIndex >= 0 && currentIndex < array.length
          ? `比较节点 ${currentIndex}（值 ${array[currentIndex]}）与其子节点（索引 ${leftChild} 和 ${rightChild}）。`
          : '比较节点。',
      },
      compare_up: {
        en: currentIndex >= 0 && parentIndex >= 0
          ? `Comparing node ${currentIndex} (value ${array[currentIndex]}) with parent at index ${parentIndex} (value ${array[parentIndex]}).`
          : 'Comparing with parent.',
        zh: currentIndex >= 0 && parentIndex >= 0
          ? `比较节点 ${currentIndex}（值 ${array[currentIndex]}）与其父节点（索引 ${parentIndex}，值 ${array[parentIndex]}）。`
          : '与父节点比较。',
      },
      swap: {
        en: swapped && currentIndex >= 0 && parentIndex >= 0
          ? `Swapped values. Node at index ${parentIndex} now has value ${array[parentIndex]}.`
          : 'Swapped elements.',
        zh: swapped && currentIndex >= 0 && parentIndex >= 0
          ? `已交换。索引 ${parentIndex} 处的节点现在的值是 ${array[parentIndex]}。`
          : '已交换元素。',
      },
      swap_up: {
        en: `Swapped with parent. New position at index ${parentIndex}.`,
        zh: `已与父节点交换。新位置在索引 ${parentIndex}。`,
      },
      insert: {
        en: `Inserted value ${array[array.length - 1]} at the end of the array (index ${array.length - 1}). Now sifting up.`,
        zh: `已将值 ${array[array.length - 1]} 插入到数组末尾（索引 ${array.length - 1}）。开始向上筛选。`,
      },
      delete_select: {
        en: `Selected root (index 0, value ${array[0]}) for deletion. This is the maximum element.`,
        zh: `选择根节点（索引 0，值 ${array[0]}）进行删除。这是最大元素。`,
      },
      delete_swap: {
        en: `Swapped root with last element. Will remove last element and sift down from root.`,
        zh: `已将根节点与最后一个元素交换。将移除最后一个元素并从根节点向下筛选。`,
      },
      delete_remove: {
        en: `Removed the maximum element. Now sifting down from root.`,
        zh: `已移除最大元素。开始从根节点向下筛选。`,
      },
      complete: {
        en: `${operation === 'heapify' ? 'Heapify' : operation === 'insert' ? 'Insert' : 'Delete'} complete! The array now satisfies max-heap property.`,
        zh: `${operation === 'heapify' ? '堆化' : operation === 'insert' ? '插入' : '删除'}完成！数组现在满足最大堆性质。`,
      },
    };

    // Map phase to message key
    let key = phase;
    if (phase === 'compare') key = 'compare';
    if (phase === 'swap') key = swapped ? 'swap' : 'compare';
    if (operation === 'insert' && phase === 'compare') key = 'compare_up';
    if (operation === 'insert' && phase === 'swap') key = 'swap_up';

    return messages[key]?.[lang] ?? messages[phase]?.[lang] ?? '';
  },

  getInvariant(lang: 'en' | 'zh'): string {
    return lang === 'en'
      ? 'Parent >= children (max-heap property)'
      : '父节点 >= 子节点（最大堆性质）';
  },

  getComplexity(): ComplexityInfo {
    return {
      time: 'Heapify: O(n), Insert: O(log n), Delete: O(log n)',
      space: 'O(1)',
      worstCase: 'Heapify processes n/2 nodes, each potentially sifting down O(log n) levels',
      worstCaseZh: '堆化处理 n/2 个节点，每个可能下沉 O(log n) 层',
      bestCase: 'Already a heap - O(n) for heapify verification',
      bestCaseZh: '已是堆 - O(n) 用于堆化验证',
    };
  },
};
