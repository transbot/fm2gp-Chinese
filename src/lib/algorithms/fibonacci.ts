// src/lib/algorithms/fibonacci.ts

import {
  AlgorithmVisualization,
  Step,
  ValidationResult,
  ComplexityInfo,
} from './types';

/**
 * Input for basic Fibonacci algorithm
 */
export interface FibonacciInput {
  n: number;
}

/**
 * State snapshot for each step of recursive Fibonacci
 */
export interface FibonacciState {
  n: number;
  currentN: number;
  depth: number;
  maxDepth: number;
  callStack: number[];
  result: number;
  additions: number;
  phase: 'computing' | 'done';
  currentResult: number;
}

/**
 * Basic Recursive Fibonacci Algorithm visualization
 * Demonstrates the naive recursive approach with O(phi^n) time complexity
 *
 * Note: For visualization purposes, we simulate the recursion step-by-step
 * rather than generating all recursive calls (which would be exponential)
 */
export const fibonacciVisualization: AlgorithmVisualization<
  FibonacciInput,
  FibonacciState
> = {
  id: 'fibonacci',
  section: '10.7',

  generateSteps(input: FibonacciInput): Step<FibonacciState>[] {
    const { n } = input;
    const steps: Step<FibonacciState>[] = [];

    // For visualization, we show the iterative DP approach but explain
    // the recursive relationship. This is more practical for step-by-step viewing.
    // We track the recursion depth and show how values build up.

    // Initial state
    steps.push({
      state: {
        n,
        currentN: 0,
        depth: 0,
        maxDepth: n,
        callStack: [n],
        result: 0,
        additions: 0,
        phase: 'computing',
        currentResult: 0,
      },
      operation: 'init',
      descriptionKey: 'fibonacciInit',
      highlights: [],
    });

    if (n === 0) {
      steps.push({
        state: {
          n,
          currentN: 0,
          depth: 0,
          maxDepth: 0,
          callStack: [],
          result: 0,
          additions: 0,
          phase: 'done',
          currentResult: 0,
        },
        operation: 'base_case',
        descriptionKey: 'fibonacciBaseCase',
        highlights: [],
      });
      return steps;
    }

    if (n === 1) {
      steps.push({
        state: {
          n,
          currentN: 1,
          depth: 0,
          maxDepth: 1,
          callStack: [],
          result: 1,
          additions: 0,
          phase: 'done',
          currentResult: 1,
        },
        operation: 'base_case',
        descriptionKey: 'fibonacciBaseCase',
        highlights: [],
      });
      return steps;
    }

    // Simulate the recursive computation using iteration for visualization
    // We show the recursive relationship at each step
    let additions = 0;
    const fibValues: number[] = [0, 1];

    for (let i = 2; i <= n; i++) {
      additions++;
      const fibI = fibValues[i - 1] + fibValues[i - 2];
      fibValues.push(fibI);

      steps.push({
        state: {
          n,
          currentN: i,
          depth: i,
          maxDepth: n,
          callStack: [i - 1, i - 2],
          result: fibI,
          additions,
          phase: 'computing',
          currentResult: fibI,
        },
        operation: 'recurse',
        descriptionKey: 'fibonacciRecurse',
        highlights: [i - 1, i - 2],
      });
    }

    // Final result
    steps.push({
      state: {
        n,
        currentN: n,
        depth: n,
        maxDepth: n,
        callStack: [],
        result: fibValues[n],
        additions,
        phase: 'done',
        currentResult: fibValues[n],
      },
      operation: 'result',
      descriptionKey: 'fibonacciResult',
      highlights: [],
    });

    return steps;
  },

  validateInput(input: FibonacciInput): ValidationResult {
    if (input.n < 0) {
      return {
        valid: false,
        error: 'n must be non-negative',
        errorKey: 'fibonacciNonNegative',
      };
    }

    if (input.n > 40) {
      return {
        valid: false,
        error: 'For recursive Fibonacci, n should be at most 40 for practical demonstration',
        errorKey: 'fibonacciTooLarge',
      };
    }

    return { valid: true };
  },

  getInitialState(): FibonacciState {
    return {
      n: 0,
      currentN: 0,
      depth: 0,
      maxDepth: 0,
      callStack: [],
      result: 0,
      additions: 0,
      phase: 'computing',
      currentResult: 0,
    };
  },

  describeStep(step: Step<FibonacciState>, lang: 'en' | 'zh'): string {
    const { state, operation } = step;
    const { n, currentN, depth, result, additions, callStack } = state;

    const messages: Record<string, Record<'en' | 'zh', string>> = {
      init: {
        en: `Starting Fibonacci calculation for F(${n}). Will use recursive relation F(n) = F(n-1) + F(n-2).`,
        zh: `开始计算 F(${n})。将使用递推关系 F(n) = F(n-1) + F(n-2)。`,
      },
      base_case: {
        en: `Base case: F(${n}) = ${n}.`,
        zh: `基础情况：F(${n}) = ${n}。`,
      },
      recurse: {
        en: `Computing F(${currentN}) = F(${callStack[0]}) + F(${callStack[1]}) = ${result}. Additions so far: ${additions}.`,
        zh: `计算 F(${currentN}) = F(${callStack[0]}) + F(${callStack[1]}) = ${result}。目前加法次数：${additions}。`,
      },
      result: {
        en: `Fibonacci calculation complete: F(${n}) = ${result}. Total additions: ${additions}.`,
        zh: `斐波那契计算完成：F(${n}) = ${result}。总加法次数：${additions}。`,
      },
    };

    return messages[operation]?.[lang] ?? '';
  },

  getInvariant(lang: 'en' | 'zh'): string {
    return lang === 'en'
      ? 'F(n) = F(n-1) + F(n-2), with F(0) = 0, F(1) = 1'
      : 'F(n) = F(n-1) + F(n-2)，其中 F(0) = 0，F(1) = 1';
  },

  getComplexity(): ComplexityInfo {
    return {
      time: 'O(phi^n)',
      space: 'O(n)',
      worstCase: 'Exponential time - approximately 1.618^n recursive calls',
      worstCaseZh: '指数时间 - 约 1.618^n 次递归调用',
      bestCase: 'O(1) for n = 0 or n = 1 (base cases)',
      bestCaseZh: 'O(1) 当 n = 0 或 n = 1（基本情况）',
    };
  },
};
