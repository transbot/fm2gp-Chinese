// src/lib/algorithms/cycle.ts

import {
  AlgorithmVisualization,
  Step,
  ValidationResult,
  ComplexityInfo,
} from './types';

/**
 * Input for cycle decomposition algorithm
 * permutation[i] = where element at position i goes
 */
export interface CycleInput {
  array: number[];
  permutation: number[];
}

/**
 * A single cycle in the decomposition
 */
export interface Cycle {
  positions: number[]; // Positions in the original array
  values: number[];    // Values at those positions
}

/**
 * State snapshot for each step of cycle decomposition
 */
export interface CycleState {
  array: number[];
  permutation: number[];
  visited: boolean[];
  currentCycle: number[];      // Positions in the current cycle being traced
  cycles: Cycle[];             // All completed cycles
  currentPosition: number | null; // Current position being explored
  tracingFrom: number | null;  // Starting position of current cycle
}

/**
 * Cycle decomposition algorithm visualization
 * Section 11.4 - Finding disjoint cycles in a permutation
 */
export const cycleVisualization: AlgorithmVisualization<
  CycleInput,
  CycleState
> = {
  id: 'cycle',
  section: '11.4',

  generateSteps(input: CycleInput): Step<CycleState>[] {
    const { array, permutation } = input;
    const steps: Step<CycleState>[] = [];
    const n = array.length;
    const visited: boolean[] = new Array(n).fill(false);
    const cycles: Cycle[] = [];

    // Initial state
    steps.push({
      state: {
        array: [...array],
        permutation: [...permutation],
        visited: [...visited],
        currentCycle: [],
        cycles: [],
        currentPosition: null,
        tracingFrom: null,
      },
      operation: 'init',
      descriptionKey: 'cycleInit',
      highlights: [],
    });

    // Find all cycles
    for (let start = 0; start < n; start++) {
      if (visited[start]) continue;

      // Start tracing a new cycle
      const currentCycle: number[] = [];
      let current = start;

      // Step: starting new cycle
      steps.push({
        state: {
          array: [...array],
          permutation: [...permutation],
          visited: [...visited],
          currentCycle: [],
          cycles: [...cycles],
          currentPosition: start,
          tracingFrom: start,
        },
        operation: 'start_cycle',
        descriptionKey: 'cycleStart',
        highlights: [start],
      });

      // Follow the cycle
      while (!visited[current]) {
        visited[current] = true;
        currentCycle.push(current);

        // Step: visiting position in cycle
        steps.push({
          state: {
            array: [...array],
            permutation: [...permutation],
            visited: [...visited],
            currentCycle: [...currentCycle],
            cycles: [...cycles],
            currentPosition: current,
            tracingFrom: start,
          },
          operation: 'visit',
          descriptionKey: 'cycleVisit',
          highlights: [current],
        });

        // Move to next position in the cycle
        const next = permutation[current];

        // Step: following permutation
        steps.push({
          state: {
            array: [...array],
            permutation: [...permutation],
            visited: [...visited],
            currentCycle: [...currentCycle],
            cycles: [...cycles],
            currentPosition: next,
            tracingFrom: start,
          },
          operation: 'follow',
          descriptionKey: 'cycleFollow',
          highlights: [current, next],
        });

        current = next;
      }

      // Cycle complete - add to cycles list
      const completedCycle: Cycle = {
        positions: [...currentCycle],
        values: currentCycle.map(pos => array[pos]),
      };
      cycles.push(completedCycle);

      // Step: cycle completed
      steps.push({
        state: {
          array: [...array],
          permutation: [...permutation],
          visited: [...visited],
          currentCycle: [],
          cycles: [...cycles],
          currentPosition: null,
          tracingFrom: null,
        },
        operation: 'complete_cycle',
        descriptionKey: 'cycleComplete',
        highlights: currentCycle,
      });
    }

    // Final state - all cycles found
    steps.push({
      state: {
        array: [...array],
        permutation: [...permutation],
        visited: [...visited],
        currentCycle: [],
        cycles: [...cycles],
        currentPosition: null,
        tracingFrom: null,
      },
      operation: 'done',
      descriptionKey: 'cycleAllComplete',
      highlights: [],
    });

    return steps;
  },

  validateInput(input: CycleInput): ValidationResult {
    const { array, permutation } = input;

    if (!array || array.length === 0) {
      return {
        valid: false,
        error: 'Array must not be empty',
        errorKey: 'cycleEmptyArray',
      };
    }

    if (!permutation || permutation.length !== array.length) {
      return {
        valid: false,
        error: 'Permutation must have the same length as array',
        errorKey: 'cyclePermutationLength',
      };
    }

    if (array.length > 20) {
      return {
        valid: false,
        error: 'Array must have at most 20 elements for visualization',
        errorKey: 'cycleTooLarge',
      };
    }

    // Validate permutation is a valid permutation (0 to n-1, each appearing once)
    const n = array.length;
    const seen = new Set<number>();
    for (const p of permutation) {
      if (p < 0 || p >= n || seen.has(p)) {
        return {
          valid: false,
          error: 'Invalid permutation: must be a rearrangement of 0 to n-1',
          errorKey: 'cycleInvalidPermutation',
        };
      }
      seen.add(p);
    }

    return { valid: true };
  },

  getInitialState(): CycleState {
    return {
      array: [],
      permutation: [],
      visited: [],
      currentCycle: [],
      cycles: [],
      currentPosition: null,
      tracingFrom: null,
    };
  },

  describeStep(step: Step<CycleState>, lang: 'en' | 'zh'): string {
    const { state, operation } = step;
    const { currentPosition, currentCycle, cycles, tracingFrom, array, permutation } = state;

    const formatCycle = (positions: number[]) => {
      return '(' + positions.map(p => array[p]).join(' -> ') + ')';
    };

    const messages: Record<string, Record<'en' | 'zh', string>> = {
      init: {
        en: `Starting cycle decomposition on array of ${array.length} elements.`,
        zh: `开始对包含 ${array.length} 个元素的数组进行循环分解。`,
      },
      start_cycle: {
        en: `Starting a new cycle from position ${tracingFrom} (value: ${array[tracingFrom!]}).`,
        zh: `从位置 ${tracingFrom}（值：${array[tracingFrom!]}）开始追踪新的循环。`,
      },
      visit: {
        en: `Visiting position ${currentPosition} (value: ${array[currentPosition!]}). This position maps to ${permutation[currentPosition!]}.`,
        zh: `访问位置 ${currentPosition}（值：${array[currentPosition!]}）。该位置映射到 ${permutation[currentPosition!]}。`,
      },
      follow: {
        en: `Following permutation: position ${currentCycle[currentCycle.length - 1]} -> ${currentPosition}.`,
        zh: `跟随置换：位置 ${currentCycle[currentCycle.length - 1]} -> ${currentPosition}。`,
      },
      complete_cycle: {
        en: `Cycle complete: ${formatCycle(cycles[cycles.length - 1]?.positions || [])}. Found ${cycles.length} cycle(s) so far.`,
        zh: `循环完成：${formatCycle(cycles[cycles.length - 1]?.positions || [])}。目前已找到 ${cycles.length} 个循环。`,
      },
      done: {
        en: `All cycles found! Total: ${cycles.length} disjoint cycles. Each element belongs to exactly one cycle.`,
        zh: `所有循环已找到！共 ${cycles.length} 个不相交的循环。每个元素恰好属于一个循环。`,
      },
    };

    return messages[operation]?.[lang] ?? '';
  },

  getInvariant(lang: 'en' | 'zh'): string {
    return lang === 'en'
      ? 'Each element is in exactly one cycle; visited + current positions cover unique elements.'
      : '每个元素恰好属于一个循环；已访问位置 + 当前位置覆盖互不重复的元素。';
  },

  getComplexity(): ComplexityInfo {
    return {
      time: 'O(n)',
      space: 'O(n)',
      worstCase: 'Single cycle containing all n elements',
      bestCase: 'n fixed points (identity permutation)',
    };
  },
};

/**
 * Generate a random permutation of 0 to n-1
 */
export function generateRandomPermutation(n: number): number[] {
  const perm = Array.from({ length: n }, (_, i) => i);
  // Fisher-Yates shuffle
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  return perm;
}

/**
 * Create default input for cycle visualization
 */
export function createDefaultCycleInput(): CycleInput {
  const array = [10, 20, 30, 40, 50, 60, 70, 80];
  // A permutation with 3 cycles: (0->2->5->0), (1->3->7->1), (4->6->4)
  const permutation = [2, 3, 5, 7, 6, 0, 4, 1];
  return { array, permutation };
}

/**
 * Parse permutation from string input
 */
export function parsePermutation(input: string, n: number): number[] | null {
  try {
    const values = input.split(/[,\s]+/).map(s => parseInt(s.trim(), 10));
    if (values.length !== n) return null;
    if (values.some(v => isNaN(v) || v < 0 || v >= n)) return null;

    // Check if it's a valid permutation
    const seen = new Set<number>();
    for (const v of values) {
      if (seen.has(v)) return null;
      seen.add(v);
    }
    return values;
  } catch {
    return null;
  }
}
