// src/lib/algorithms/division.ts

import {
  AlgorithmVisualization,
  Step,
  ValidationResult,
  ComplexityInfo,
} from './types';

/**
 * Input for division algorithm
 */
export interface DivisionInput {
  dividend: number;
  divisor: number;
}

/**
 * State snapshot for each step of division algorithm
 */
export interface DivisionState {
  dividend: number;
  divisor: number;
  quotient: number;
  remainder: number;
  currentDividend: number;
  step: number;
}

/**
 * Division Algorithm visualization implementation
 * Section 4.5 in the book - demonstrates quotient/remainder through repeated subtraction
 */
export const divisionVisualization: AlgorithmVisualization<
  DivisionInput,
  DivisionState
> = {
  id: 'division',
  section: '4.5',

  generateSteps(input: DivisionInput): Step<DivisionState>[] {
    const { dividend, divisor } = input;
    const steps: Step<DivisionState>[] = [];

    // Initial state
    steps.push({
      state: {
        dividend,
        divisor,
        quotient: 0,
        remainder: dividend,
        currentDividend: dividend,
        step: 0,
      },
      operation: 'init',
      descriptionKey: 'divisionInit',
      highlights: [],
    });

    // Perform repeated subtraction
    let quotient = 0;
    let remainder = dividend;
    let stepNum = 0;

    while (remainder >= divisor) {
      stepNum++;
      remainder -= divisor;
      quotient++;

      steps.push({
        state: {
          dividend,
          divisor,
          quotient,
          remainder,
          currentDividend: remainder,
          step: stepNum,
        },
        operation: 'subtract',
        descriptionKey: 'divisionSubtract',
        highlights: [],
      });
    }

    // Final result step
    steps.push({
      state: {
        dividend,
        divisor,
        quotient,
        remainder,
        currentDividend: remainder,
        step: stepNum,
      },
      operation: 'result',
      descriptionKey: 'divisionResult',
      highlights: [],
    });

    return steps;
  },

  validateInput(input: DivisionInput): ValidationResult {
    if (input.divisor <= 0) {
      return {
        valid: false,
        error: 'Divisor must be positive',
        errorKey: 'divisionDivisorPositive',
      };
    }

    if (input.dividend < 0) {
      return {
        valid: false,
        error: 'Dividend must be non-negative',
        errorKey: 'divisionDividendNonNegative',
      };
    }

    if (input.dividend > 10000) {
      return {
        valid: false,
        error: 'Dividend is too large for visualization (max 10000)',
        errorKey: 'divisionTooLarge',
      };
    }

    return { valid: true };
  },

  getInitialState(): DivisionState {
    return {
      dividend: 0,
      divisor: 1,
      quotient: 0,
      remainder: 0,
      currentDividend: 0,
      step: 0,
    };
  },

  describeStep(step: Step<DivisionState>, lang: 'en' | 'zh'): string {
    const { state, operation } = step;
    const { dividend, divisor, quotient, remainder, step: stepNum } = state;

    const messages: Record<string, Record<'en' | 'zh', string>> = {
      init: {
        en: `Starting division: ${dividend} / ${divisor}. Initial quotient = 0, remainder = ${dividend}.`,
        zh: `开始除法运算：${dividend} / ${divisor}。初始商 = 0，余数 = ${dividend}。`,
      },
      subtract: {
        en: `Step ${stepNum}: Subtract ${divisor} from remainder. Quotient = ${quotient}, Remainder = ${remainder}.`,
        zh: `第 ${stepNum} 步：从余数中减去 ${divisor}。商 = ${quotient}，余数 = ${remainder}。`,
      },
      result: {
        en: `Division complete: ${dividend} = ${quotient} * ${divisor} + ${remainder}. Quotient = ${quotient}, Remainder = ${remainder}.`,
        zh: `除法完成：${dividend} = ${quotient} * ${divisor} + ${remainder}。商 = ${quotient}，余数 = ${remainder}。`,
      },
    };

    return messages[operation]?.[lang] ?? '';
  },

  getInvariant(lang: 'en' | 'zh'): string {
    return lang === 'en'
      ? 'dividend = quotient * divisor + remainder, where 0 <= remainder < divisor'
      : '被除数 = 商 * 除数 + 余数，其中 0 <= 余数 < 除数';
  },

  getComplexity(): ComplexityInfo {
    return {
      time: 'O(dividend / divisor)',
      space: 'O(1)',
      worstCase: 'dividend / divisor subtractions (when divisor = 1)',
      bestCase: '0 subtractions (when dividend < divisor)',
    };
  },
};
