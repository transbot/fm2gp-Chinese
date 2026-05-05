// src/lib/algorithms/stein_gcd.ts

import {
  AlgorithmVisualization,
  Step,
  ValidationResult,
  ComplexityInfo,
} from './types';

/**
 * Input for Stein's GCD algorithm
 */
export interface SteinGcdInput {
  a: number;
  b: number;
}

/**
 * State snapshot for each step of Stein's GCD algorithm
 */
export interface SteinGcdState {
  a: number;
  b: number;
  gcd: number;
  shift: number;
  step: number;
  operation: string;
  bitInfo: {
    aEven: boolean;
    bEven: boolean;
    shiftAmount?: number;
  };
  euclideanSteps?: number;
}

/**
 * Stein's GCD (Binary GCD) Algorithm visualization implementation
 * Section 12.1-12.2 in the book - uses bitwise operations instead of modulo
 */
export const steinGcdVisualization: AlgorithmVisualization<
  SteinGcdInput,
  SteinGcdState
> = {
  id: 'stein-gcd',
  section: '12.1',

  generateSteps(input: SteinGcdInput): Step<SteinGcdState>[] {
    const { a, b } = input;
    const steps: Step<SteinGcdState>[] = [];

    // Count Euclidean steps for comparison
    const euclideanSteps = countEuclideanSteps(a, b);

    // Initial state
    steps.push({
      state: {
        a,
        b,
        gcd: 0,
        shift: 0,
        step: 0,
        operation: 'init',
        bitInfo: {
          aEven: (a & 1) === 0,
          bEven: (b & 1) === 0,
        },
        euclideanSteps,
      },
      operation: 'init',
      descriptionKey: 'steinGcdInit',
      highlights: [],
    });

    // Handle zero cases
    if (a === 0 || b === 0) {
      const result = a === 0 ? b : a;
      steps.push({
        state: {
          a: 0,
          b: result,
          gcd: result,
          shift: 0,
          step: 1,
          operation: 'zero_case',
          bitInfo: { aEven: false, bEven: false },
          euclideanSteps,
        },
        operation: 'result',
        descriptionKey: 'steinGcdZeroCase',
        highlights: [],
      });
      return steps;
    }

    // Find common power of 2
    let shift = 0;
    let currentA = a;
    let currentB = b;
    let stepNum = 0;

    while ((currentA & 1) === 0 && (currentB & 1) === 0) {
      stepNum++;
      shift++;
      currentA >>= 1;
      currentB >>= 1;

      steps.push({
        state: {
          a: currentA,
          b: currentB,
          gcd: 0,
          shift,
          step: stepNum,
          operation: 'common_shift',
          bitInfo: {
            aEven: true,
            bEven: true,
            shiftAmount: 1,
          },
          euclideanSteps,
        },
        operation: 'shift',
        descriptionKey: 'steinGcdCommonShift',
        highlights: [],
      });
    }

    // Make a odd (if even)
    while ((currentA & 1) === 0) {
      stepNum++;
      currentA >>= 1;

      steps.push({
        state: {
          a: currentA,
          b: currentB,
          gcd: 0,
          shift,
          step: stepNum,
          operation: 'make_a_odd',
          bitInfo: {
            aEven: true,
            bEven: false,
            shiftAmount: 1,
          },
          euclideanSteps,
        },
        operation: 'shift',
        descriptionKey: 'steinGcdMakeOdd',
        highlights: [],
      });
    }

    // Main loop - binary GCD
    while (currentB !== 0) {
      // Make b odd (if even)
      while ((currentB & 1) === 0) {
        stepNum++;
        currentB >>= 1;

        steps.push({
          state: {
            a: currentA,
            b: currentB,
            gcd: 0,
            shift,
            step: stepNum,
            operation: 'make_b_odd',
            bitInfo: {
              aEven: false,
              bEven: true,
              shiftAmount: 1,
            },
            euclideanSteps,
          },
          operation: 'shift',
          descriptionKey: 'steinGcdMakeOdd',
          highlights: [],
        });
      }

      // Now both are odd, apply subtraction
      if (currentA >= currentB) {
        stepNum++;
        currentA = currentA - currentB;

        steps.push({
          state: {
            a: currentA,
            b: currentB,
            gcd: 0,
            shift,
            step: stepNum,
            operation: 'subtract_a',
            bitInfo: {
              aEven: (currentA & 1) === 0,
              bEven: false,
            },
            euclideanSteps,
          },
          operation: 'subtract',
          descriptionKey: 'steinGcdSubtract',
          highlights: [],
        });

        // Make result odd again (will be even after odd-odd subtraction)
        while ((currentA & 1) === 0 && currentA !== 0) {
          stepNum++;
          currentA >>= 1;

          steps.push({
            state: {
              a: currentA,
              b: currentB,
              gcd: 0,
              shift,
              step: stepNum,
              operation: 'shift_after_subtract_a',
              bitInfo: {
                aEven: true,
                bEven: false,
                shiftAmount: 1,
              },
              euclideanSteps,
            },
            operation: 'shift',
            descriptionKey: 'steinGcdShiftAfterSubtract',
            highlights: [],
          });
        }
      } else {
        stepNum++;
        currentB = currentB - currentA;

        steps.push({
          state: {
            a: currentA,
            b: currentB,
            gcd: 0,
            shift,
            step: stepNum,
            operation: 'subtract_b',
            bitInfo: {
              aEven: false,
              bEven: (currentB & 1) === 0,
            },
            euclideanSteps,
          },
          operation: 'subtract',
          descriptionKey: 'steinGcdSubtract',
          highlights: [],
        });

        // Make result odd again
        while ((currentB & 1) === 0 && currentB !== 0) {
          stepNum++;
          currentB >>= 1;

          steps.push({
            state: {
              a: currentA,
              b: currentB,
              gcd: 0,
              shift,
              step: stepNum,
              operation: 'shift_after_subtract_b',
              bitInfo: {
                aEven: false,
                bEven: true,
                shiftAmount: 1,
              },
              euclideanSteps,
            },
            operation: 'shift',
            descriptionKey: 'steinGcdShiftAfterSubtract',
            highlights: [],
          });
        }
      }
    }

    // Final result - multiply back by common power of 2
    const finalGcd = currentA << shift;
    steps.push({
      state: {
        a: currentA,
        b: 0,
        gcd: finalGcd,
        shift,
        step: stepNum + 1,
        operation: 'final_shift',
        bitInfo: {
          aEven: false,
          bEven: false,
          shiftAmount: shift,
        },
        euclideanSteps,
      },
      operation: 'result',
      descriptionKey: 'steinGcdFinal',
      highlights: [],
    });

    return steps;
  },

  validateInput(input: SteinGcdInput): ValidationResult {
    if (input.a < 0 || input.b < 0) {
      return {
        valid: false,
        error: 'Numbers must be non-negative',
        errorKey: 'steinGcdNegative',
      };
    }

    if (input.a > 1000000 || input.b > 1000000) {
      return {
        valid: false,
        error: 'Numbers too large for visualization (max 1,000,000)',
        errorKey: 'steinGcdTooLarge',
      };
    }

    return { valid: true };
  },

  getInitialState(): SteinGcdState {
    return {
      a: 0,
      b: 0,
      gcd: 0,
      shift: 0,
      step: 0,
      operation: 'init',
      bitInfo: { aEven: false, bEven: false },
      euclideanSteps: 0,
    };
  },

  describeStep(step: Step<SteinGcdState>, lang: 'en' | 'zh'): string {
    const { state } = step;
    const { a, b, gcd, shift, step: stepNum, operation, bitInfo, euclideanSteps } = state;

    const messages: Record<string, Record<'en' | 'zh', string>> = {
      init: {
        en: `Starting Stein's GCD with a=${a}, b=${b}. a is ${bitInfo.aEven ? 'even' : 'odd'}, b is ${bitInfo.bEven ? 'even' : 'odd'}. Euclidean would take ${euclideanSteps} steps.`,
        zh: `开始斯坦因GCD：a=${a}, b=${b}。a是${bitInfo.aEven ? '偶数' : '奇数'}，b是${bitInfo.bEven ? '偶数' : '奇数'}。欧几里得算法需要 ${euclideanSteps} 步。`,
      },
      common_shift: {
        en: `Both a and b are even. Shift right by 1 (divide by 2). a=${a}, b=${b}, common shift=${shift}.`,
        zh: `a和b都是偶数。右移1位（除以2）。a=${a}, b=${b}, 公共位移=${shift}。`,
      },
      make_a_odd: {
        en: `a is even. Shift right by 1: a=${a} (now odd).`,
        zh: `a是偶数。右移1位：a=${a}（现在是奇数）。`,
      },
      make_b_odd: {
        en: `b is even. Shift right by 1: b=${b} (now odd).`,
        zh: `b是偶数。右移1位：b=${b}（现在是奇数）。`,
      },
      subtract_a: {
        en: `Both odd, a >= b. Subtract: a = ${a + b} - ${b} = ${a}. Result is ${bitInfo.aEven ? 'even' : 'odd'}.`,
        zh: `两者均为奇数，a >= b。减法：a = ${a + b} - ${b} = ${a}。结果是${bitInfo.aEven ? '偶数' : '奇数'}。`,
      },
      subtract_b: {
        en: `Both odd, b > a. Subtract: b = ${a + b} - ${a} = ${b}. Result is ${bitInfo.bEven ? 'even' : 'odd'}.`,
        zh: `两者均为奇数，b > a。减法：b = ${a + b} - ${a} = ${b}。结果是${bitInfo.bEven ? '偶数' : '奇数'}。`,
      },
      shift_after_subtract_a: {
        en: `a is even after subtraction. Shift right: a=${a}.`,
        zh: `减法后a是偶数。右移：a=${a}。`,
      },
      shift_after_subtract_b: {
        en: `b is even after subtraction. Shift right: b=${b}.`,
        zh: `减法后b是偶数。右移：b=${b}。`,
      },
      final_shift: {
        en: `GCD found! Shift left by ${shift} to restore common factor: GCD = ${gcd}. Stein took ${stepNum} steps vs ${euclideanSteps} for Euclidean.`,
        zh: `找到GCD！左移${shift}位恢复公共因子：GCD = ${gcd}。斯坦因算法用${stepNum}步，欧几里得用${euclideanSteps}步。`,
      },
      zero_case: {
        en: `One number is zero. GCD = ${gcd}.`,
        zh: `一个数为零。GCD = ${gcd}。`,
      },
    };

    return messages[operation]?.[lang] ?? '';
  },

  getInvariant(lang: 'en' | 'zh'): string {
    return lang === 'en'
      ? 'gcd(a, b) = gcd(original_a, original_b) throughout the algorithm'
      : '在整个算法过程中，gcd(a, b) = gcd(原a, 原b)';
  },

  getComplexity(): ComplexityInfo {
    return {
      time: 'O(log(max(a, b)))',
      space: 'O(1)',
      worstCase: 'Approximately 2 * log(max(a, b)) operations',
      bestCase: 'O(1) when one number is 0',
    };
  },
};

/**
 * Count Euclidean algorithm steps for comparison
 */
function countEuclideanSteps(a: number, b: number): number {
  if (a === 0 || b === 0) return 1;

  let steps = 0;
  let currentA = Math.max(a, b);
  let currentB = Math.min(a, b);

  while (currentB !== 0) {
    steps++;
    const remainder = currentA % currentB;
    currentA = currentB;
    currentB = remainder;
  }

  return steps;
}