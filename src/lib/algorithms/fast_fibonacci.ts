// src/lib/algorithms/fast_fibonacci.ts

import {
  AlgorithmVisualization,
  Step,
  ValidationResult,
  ComplexityInfo,
} from './types';

/**
 * Input for fast Fibonacci algorithm
 */
export interface FastFibonacciInput {
  n: number;
}

/**
 * Matrix state for 2x2 matrix
 */
export interface Matrix2x2 {
  a: bigint;
  b: bigint;
  c: bigint;
  d: bigint;
}

/**
 * State snapshot for each step of fast Fibonacci using matrix exponentiation
 */
export interface FastFibonacciState {
  n: number;
  currentN: number;
  matrix: Matrix2x2;
  result: bigint;
  phase: 'init' | 'power' | 'multiply' | 'done';
  stepNum: number;
  binaryDigits: number[];
  currentBitIndex: number;
  operationCount: {
    additions: number;
    multiplications: number;
  };
}

/**
 * Identity matrix
 */
const identityMatrix = (): Matrix2x2 => ({
  a: 1n,
  b: 0n,
  c: 0n,
  d: 1n,
});

/**
 * Base Fibonacci matrix [[1, 1], [1, 0]]
 */
const baseFibMatrix = (): Matrix2x2 => ({
  a: 1n,
  b: 1n,
  c: 1n,
  d: 0n,
});

/**
 * Multiply two 2x2 matrices
 */
const multiplyMatrix = (m1: Matrix2x2, m2: Matrix2x2): { result: Matrix2x2; ops: { adds: number; mults: number } } => {
  return {
    result: {
      a: m1.a * m2.a + m1.b * m2.c,
      b: m1.a * m2.b + m1.b * m2.d,
      c: m1.c * m2.a + m1.d * m2.c,
      d: m1.c * m2.b + m1.d * m2.d,
    },
    ops: { adds: 4, mults: 8 },
  };
};

/**
 * Fast Fibonacci Algorithm visualization using Matrix Exponentiation
 * Based on the identity: [[1,1],[1,0]]^n = [[F(n+1), F(n)], [F(n), F(n-1)]]
 *
 * Time complexity: O(log n)
 * Space complexity: O(1)
 */
export const fastFibonacciVisualization: AlgorithmVisualization<
  FastFibonacciInput,
  FastFibonacciState
> = {
  id: 'fast-fibonacci',
  section: '10.7',
  isAdvanced: true,

  generateSteps(input: FastFibonacciInput): Step<FastFibonacciState>[] {
    const { n } = input;
    const steps: Step<FastFibonacciState>[] = [];

    // Handle base cases
    if (n === 0) {
      steps.push({
        state: {
          n,
          currentN: 0,
          matrix: identityMatrix(),
          result: 0n,
          phase: 'done',
          stepNum: 0,
          binaryDigits: [],
          currentBitIndex: -1,
          operationCount: { additions: 0, multiplications: 0 },
        },
        operation: 'base_case',
        descriptionKey: 'fastFibonacciBaseCase',
        highlights: [],
      });
      return steps;
    }

    if (n === 1) {
      steps.push({
        state: {
          n,
          currentN: 1,
          matrix: baseFibMatrix(),
          result: 1n,
          phase: 'done',
          stepNum: 0,
          binaryDigits: [],
          currentBitIndex: -1,
          operationCount: { additions: 0, multiplications: 0 },
        },
        operation: 'base_case',
        descriptionKey: 'fastFibonacciBaseCase',
        highlights: [],
      });
      return steps;
    }

    // Get binary representation of n-1 (we compute [[1,1],[1,0]]^(n-1))
    const exp = n - 1;
    const binaryDigits = exp.toString(2).split('').map(Number);

    // Initial state
    steps.push({
      state: {
        n,
        currentN: exp,
        matrix: identityMatrix(),
        result: 0n,
        phase: 'init',
        stepNum: 0,
        binaryDigits,
        currentBitIndex: 0,
        operationCount: { additions: 0, multiplications: 0 },
      },
      operation: 'init',
      descriptionKey: 'fastFibonacciInit',
      highlights: [],
    });

    let result = identityMatrix();
    let base = baseFibMatrix();
    let opCount = { additions: 0, multiplications: 0 };

    // Binary exponentiation: process each bit from MSB to LSB
    for (let i = 0; i < binaryDigits.length; i++) {
      const bit = binaryDigits[i];

      // Square the base matrix
      const squareResult = multiplyMatrix(base, base);
      opCount.adds += squareResult.ops.adds;
      opCount.mults += squareResult.ops.mults;

      steps.push({
        state: {
          n,
          currentN: exp,
          matrix: base,
          result: 0n,
          phase: 'power',
          stepNum: i + 1,
          binaryDigits,
          currentBitIndex: i,
          operationCount: { ...opCount },
        },
        operation: 'square',
        descriptionKey: 'fastFibonacciSquare',
        highlights: [],
      });

      base = squareResult.result;

      // If bit is 1, multiply result by base
      if (bit === 1) {
        const multResult = multiplyMatrix(result, base);
        opCount.adds += multResult.ops.adds;
        opCount.mults += multResult.ops.mults;

        result = multResult.result;

        steps.push({
          state: {
            n,
            currentN: exp,
            matrix: base,
            result: result.a,
            phase: 'multiply',
            stepNum: i + 1,
            binaryDigits,
            currentBitIndex: i,
            operationCount: { ...opCount },
          },
          operation: 'multiply',
          descriptionKey: 'fastFibonacciMultiply',
          highlights: [i],
        });
      }
    }

    // Final result: F(n) = result[0][0]
    const fibResult = result.a;

    steps.push({
      state: {
        n,
        currentN: exp,
        matrix: result,
        result: fibResult,
        phase: 'done',
        stepNum: binaryDigits.length,
        binaryDigits,
        currentBitIndex: binaryDigits.length - 1,
        operationCount: opCount,
      },
      operation: 'result',
      descriptionKey: 'fastFibonacciResult',
      highlights: [],
    });

    return steps;
  },

  validateInput(input: FastFibonacciInput): ValidationResult {
    if (input.n < 0) {
      return {
        valid: false,
        error: 'n must be non-negative',
        errorKey: 'fibonacciNonNegative',
      };
    }

    if (input.n > 1000) {
      return {
        valid: false,
        error: 'For visualization, n should be at most 1000',
        errorKey: 'fastFibonacciTooLargeForViz',
      };
    }

    return { valid: true };
  },

  getInitialState(): FastFibonacciState {
    return {
      n: 0,
      currentN: 0,
      matrix: identityMatrix(),
      result: 0n,
      phase: 'init',
      stepNum: 0,
      binaryDigits: [],
      currentBitIndex: -1,
      operationCount: { additions: 0, multiplications: 0 },
    };
  },

  describeStep(step: Step<FastFibonacciState>, lang: 'en' | 'zh'): string {
    const { state, operation } = step;
    const { n, matrix, result, phase, stepNum, binaryDigits, currentBitIndex, operationCount } = state;

    const formatMatrix = (m: Matrix2x2): string => {
      return `[[${m.a}, ${m.b}], [${m.c}, ${m.d}]]`;
    };

    const messages: Record<string, Record<'en' | 'zh', string>> = {
      base_case: {
        en: `Base case: F(${n}) = ${n}.`,
        zh: `基础情况：F(${n}) = ${n}。`,
      },
      init: {
        en: `Starting matrix exponentiation for F(${n}). Binary representation of ${n-1}: ${binaryDigits.join('')}₂.`,
        zh: `开始矩阵幂运算计算 F(${n})。${n-1} 的二进制表示：${binaryDigits.join('')}₂。`,
      },
      square: {
        en: `Step ${stepNum}: Square the base matrix. Current matrix: ${formatMatrix(matrix)}.`,
        zh: `步骤 ${stepNum}：对基础矩阵进行平方。当前矩阵：${formatMatrix(matrix)}。`,
      },
      multiply: {
        en: `Bit ${currentBitIndex} is 1. Multiply result matrix. Result so far: ${formatMatrix(matrix)}. F(${n}) = ${result}.`,
        zh: `第 ${currentBitIndex} 位是 1。乘以结果矩阵。当前结果：${formatMatrix(matrix)}。F(${n}) = ${result}。`,
      },
      result: {
        en: `Matrix exponentiation complete! F(${n}) = ${result}. Total operations: ${operationCount.additions} additions, ${operationCount.multiplications} multiplications.`,
        zh: `矩阵幂运算完成！F(${n}) = ${result}。总操作：${operationCount.additions} 次加法，${operationCount.multiplications} 次乘法。`,
      },
    };

    return messages[operation]?.[lang] ?? '';
  },

  getInvariant(lang: 'en' | 'zh'): string {
    return lang === 'en'
      ? '[[1,1],[1,0]]^n = [[F(n+1), F(n)], [F(n), F(n-1)]]'
      : '[[1,1],[1,0]]^n = [[F(n+1), F(n)], [F(n), F(n-1)]]（矩阵恒等式）';
  },

  getComplexity(): ComplexityInfo {
    return {
      time: 'O(log n)',
      space: 'O(1)',
      worstCase: 'O(log n) matrix multiplications',
      bestCase: 'O(log n) - same for all n',
    };
  },
};