// src/lib/algorithms/power.ts

import {
  AlgorithmVisualization,
  Step,
  ValidationResult,
  ComplexityInfo,
} from './types';

/**
 * Input for power algorithm
 */
export interface PowerInput {
  base: number;
  exponent: number;
}

/**
 * State snapshot for each step of power algorithm
 */
export interface PowerState {
  base: number;
  exponent: number;
  result: number;
  currentPower: number;
  currentExp: number;
  steps: PowerStepRecord[];
}

/**
 * Record of each step in the power algorithm
 */
export interface PowerStepRecord {
  n: number;
  currentPower: number;
  result: number;
  action: 'check_odd' | 'square' | 'done';
  isOdd?: boolean;
}

/**
 * Power Algorithm visualization implementation
 * Section 7.5 in the book - O(log n) power algorithm derived from Egyptian multiplication
 *
 * This is the power_accumulate_semigroup algorithm from the book:
 *   while (true) {
 *     if (odd(n)) {
 *       r = r * a;
 *       if (n == 1) return r;
 *     }
 *     n = half(n);
 *     a = a * a;
 *   }
 *
 * Key insight: Replace + with * (and doubling with squaring) in Egyptian multiplication
 * Invariant: result * currentPower^n = base^exponent
 */
export const powerVisualization: AlgorithmVisualization<
  PowerInput,
  PowerState
> = {
  id: 'power',
  section: '7.5',

  generateSteps(input: PowerInput): Step<PowerState>[] {
    const { base, exponent } = input;
    const steps: Step<PowerState>[] = [];
    const stepRecords: PowerStepRecord[] = [];

    // Handle n = 0 case (power_monoid)
    if (exponent === 0) {
      steps.push({
        state: {
          base,
          exponent,
          result: 1,
          currentPower: base,
          currentExp: 0,
          steps: [],
        },
        operation: 'init',
        descriptionKey: 'powerInit',
        highlights: [],
      });

      steps.push({
        state: {
          base,
          exponent,
          result: 1,
          currentPower: base,
          currentExp: 0,
          steps: [{ n: 0, currentPower: base, result: 1, action: 'done' }],
        },
        operation: 'result',
        descriptionKey: 'powerZeroExponent',
        highlights: [],
      });

      return steps;
    }

    // Initial state
    steps.push({
      state: {
        base,
        exponent,
        result: 1,
        currentPower: base,
        currentExp: exponent,
        steps: [],
      },
      operation: 'init',
      descriptionKey: 'powerInit',
      highlights: [],
    });

    let result = 1;
    let currentPower = base;
    let n = exponent;

    // Main loop following power_accumulate_semigroup from the book
    while (true) {
      // Check if n is odd
      const isOdd = n % 2 === 1;

      if (isOdd) {
        // Multiply result by currentPower (r = r * a in the book)
        stepRecords.push({
          n,
          currentPower,
          result,
          action: 'check_odd',
          isOdd: true,
        });

        steps.push({
          state: {
            base,
            exponent,
            result,
            currentPower,
            currentExp: n,
            steps: [...stepRecords],
          },
          operation: 'multiply',
          descriptionKey: 'powerMultiply',
          highlights: [],
        });

        result *= currentPower;
        stepRecords[stepRecords.length - 1].result = result;

        // Early exit optimization from the book: if (n == 1) return r;
        if (n === 1) {
          steps.push({
            state: {
              base,
              exponent,
              result,
              currentPower,
              currentExp: 0,
              steps: [...stepRecords, { n: 0, currentPower, result, action: 'done' }],
            },
            operation: 'result',
            descriptionKey: 'powerResult',
            highlights: [],
          });
          return steps;
        }
      } else {
        stepRecords.push({
          n,
          currentPower,
          result,
          action: 'check_odd',
          isOdd: false,
        });
      }

      // n = half(n); a = a * a;
      steps.push({
        state: {
          base,
          exponent,
          result,
          currentPower,
          currentExp: n,
          steps: [...stepRecords],
        },
        operation: 'square',
        descriptionKey: 'powerSquare',
        highlights: [],
      });

      const oldPower = currentPower;
      currentPower = currentPower * currentPower;  // a = a * a (squaring)
      n = Math.floor(n / 2);  // n = half(n)

      stepRecords.push({
        n,
        currentPower,
        result,
        action: 'square',
      });
    }
  },

  validateInput(input: PowerInput): ValidationResult {
    if (input.base < 0) {
      return {
        valid: false,
        error: 'Base must be non-negative',
        errorKey: 'powerBaseNonNegative',
      };
    }

    if (input.exponent < 0) {
      return {
        valid: false,
        error: 'Exponent must be non-negative',
        errorKey: 'powerExponentNonNegative',
      };
    }

    if (input.exponent > 100) {
      return {
        valid: false,
        error: 'Exponent is too large for visualization (max 100)',
        errorKey: 'powerExponentTooLarge',
      };
    }

    // Check for potential overflow
    if (input.base > 1 && input.exponent > 63) {
      return {
        valid: false,
        error: 'Result may overflow. Please use smaller values.',
        errorKey: 'powerResultOverflow',
      };
    }

    return { valid: true };
  },

  getInitialState(): PowerState {
    return {
      base: 0,
      exponent: 0,
      result: 1,
      currentPower: 0,
      currentExp: 0,
      steps: [],
    };
  },

  describeStep(step: Step<PowerState>, lang: 'en' | 'zh'): string {
    const { state, operation } = step;
    const { base, exponent, result, currentPower, currentExp } = state;

    const messages: Record<string, Record<'en' | 'zh', string>> = {
      init: {
        en: `Starting power calculation: ${base}^${exponent}. Initial: result = 1, currentPower = ${base}, n = ${exponent}.`,
        zh: `开始幂运算：${base}^${exponent}。初始：结果 = 1，当前幂 = ${base}，n = ${exponent}。`,
      },
      multiply: {
        en: `n = ${currentExp} is odd. Multiply result by currentPower: ${result} * ${currentPower} = ${result * currentPower}.`,
        zh: `n = ${currentExp} 是奇数。将结果乘以当前幂：${result} * ${currentPower} = ${result * currentPower}。`,
      },
      square: {
        en: `Square currentPower: ${currentPower}^2 = ${currentPower * currentPower}, n = floor(${currentExp}/2) = ${Math.floor(currentExp / 2)}.`,
        zh: `当前幂自乘：${currentPower}^2 = ${currentPower * currentPower}，n = floor(${currentExp}/2) = ${Math.floor(currentExp / 2)}。`,
      },
      result: {
        en: `Power calculation complete: ${base}^${exponent} = ${result}.`,
        zh: `幂运算完成：${base}^${exponent} = ${result}。`,
      },
    };

    return messages[operation]?.[lang] ?? '';
  },

  getInvariant(lang: 'en' | 'zh'): string {
    return lang === 'en'
      ? 'result * currentPower^n = base^exponent'
      : 'result * currentPower^n = base^exponent（循环不变式）';
  },

  getComplexity(): ComplexityInfo {
    return {
      time: 'O(log n)',
      space: 'O(1)',
      worstCase: '2 * log2(n) multiplications (when all bits are 1)',
      worstCaseZh: '2 * log2(n) 次乘法（当所有位都为 1）',
      bestCase: 'log2(n) squarings (when n is power of 2)',
      bestCaseZh: 'log2(n) 次平方（当 n 是 2 的幂）',
    };
  },
};
