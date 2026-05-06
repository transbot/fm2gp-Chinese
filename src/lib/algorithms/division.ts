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
  totalSubtractions: number; // Total number of subtractions needed
  isCompressed?: boolean; // Whether this step represents multiple subtractions
  subtractionsInStep?: number; // How many subtractions this step represents
}

// Maximum steps to show before compression
const MAX_VISIBLE_STEPS = 50;

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
    const totalQuotient = Math.floor(dividend / divisor);
    const totalSubtractions = totalQuotient;

    // Initial state
    steps.push({
      state: {
        dividend,
        divisor,
        quotient: 0,
        remainder: dividend,
        currentDividend: dividend,
        step: 0,
        totalSubtractions,
      },
      operation: 'init',
      descriptionKey: 'divisionInit',
      highlights: [],
    });

    // If too many steps, use compressed representation
    if (totalSubtractions > MAX_VISIBLE_STEPS) {
      // Show first few steps
      let quotient = 0;
      let remainder = dividend;

      // First 10 steps individually
      for (let i = 0; i < 10 && remainder >= divisor; i++) {
        remainder -= divisor;
        quotient++;
        steps.push({
          state: {
            dividend,
            divisor,
            quotient,
            remainder,
            currentDividend: remainder,
            step: quotient,
            totalSubtractions,
          },
          operation: 'subtract',
          descriptionKey: 'divisionSubtract',
          highlights: [],
        });
      }

      // Jump to milestones (25%, 50%, 75%)
      const milestones = [0.25, 0.5, 0.75];
      for (const milestone of milestones) {
        const targetQuotient = Math.floor(totalSubtractions * milestone);
        if (targetQuotient > quotient) {
          const subtractionsNeeded = targetQuotient - quotient;
          remainder -= divisor * subtractionsNeeded;
          quotient = targetQuotient;
          steps.push({
            state: {
              dividend,
              divisor,
              quotient,
              remainder,
              currentDividend: remainder,
              step: quotient,
              totalSubtractions,
              isCompressed: true,
              subtractionsInStep: subtractionsNeeded,
            },
            operation: 'subtract_batch',
            descriptionKey: 'divisionSubtractBatch',
            highlights: [],
          });
        }
      }

      // Jump to near end (last 10 steps)
      if (totalSubtractions - 10 > quotient) {
        const targetQuotient = totalSubtractions - 10;
        const subtractionsNeeded = targetQuotient - quotient;
        remainder -= divisor * subtractionsNeeded;
        quotient = targetQuotient;
        steps.push({
          state: {
            dividend,
            divisor,
            quotient,
            remainder,
            currentDividend: remainder,
            step: quotient,
            totalSubtractions,
            isCompressed: true,
            subtractionsInStep: subtractionsNeeded,
          },
          operation: 'subtract_batch',
          descriptionKey: 'divisionSubtractBatch',
          highlights: [],
        });
      }

      // Last 10 steps individually
      while (remainder >= divisor) {
        remainder -= divisor;
        quotient++;
        steps.push({
          state: {
            dividend,
            divisor,
            quotient,
            remainder,
            currentDividend: remainder,
            step: quotient,
            totalSubtractions,
          },
          operation: 'subtract',
          descriptionKey: 'divisionSubtract',
          highlights: [],
        });
      }
    } else {
      // Normal case: show all steps
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
            totalSubtractions,
          },
          operation: 'subtract',
          descriptionKey: 'divisionSubtract',
          highlights: [],
        });
      }
    }

    // Final result step
    steps.push({
      state: {
        dividend,
        divisor,
        quotient: totalQuotient,
        remainder: dividend - totalQuotient * divisor,
        currentDividend: dividend - totalQuotient * divisor,
        step: totalSubtractions,
        totalSubtractions,
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

    // Increased limit since we now compress steps
    if (input.dividend > 1000000) {
      return {
        valid: false,
        error: 'Dividend is too large for visualization (max 1000000)',
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
      totalSubtractions: 0,
    };
  },

  describeStep(step: Step<DivisionState>, lang: 'en' | 'zh'): string {
    const { state, operation } = step;
    const { dividend, divisor, quotient, remainder, step: stepNum, isCompressed, subtractionsInStep, totalSubtractions } = state;

    const messages: Record<string, Record<'en' | 'zh', string>> = {
      init: {
        en: `Starting division: ${dividend} / ${divisor}. Initial quotient = 0, remainder = ${dividend}.${totalSubtractions > 50 ? ` (Will need ${totalSubtractions} subtractions - showing key steps)` : ''}`,
        zh: `开始除法运算：${dividend} / ${divisor}。初始商 = 0，余数 = ${dividend}。${totalSubtractions > 50 ? `（需要 ${totalSubtractions} 次减法 - 显示关键步骤）` : ''}`,
      },
      subtract: {
        en: `Step ${stepNum}: Subtract ${divisor} from remainder. Quotient = ${quotient}, Remainder = ${remainder}.`,
        zh: `第 ${stepNum} 步：从余数中减去 ${divisor}。商 = ${quotient}，余数 = ${remainder}。`,
      },
      subtract_batch: {
        en: `Jump: Subtract ${divisor} × ${subtractionsInStep} = ${divisor * (subtractionsInStep || 0)} from remainder. Quotient = ${quotient}, Remainder = ${remainder}.`,
        zh: `跳跃：从余数中减去 ${divisor} × ${subtractionsInStep} = ${divisor * (subtractionsInStep || 0)}。商 = ${quotient}，余数 = ${remainder}。`,
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
      worstCaseZh: 'dividend / divisor 次减法（当 divisor = 1）',
      bestCase: '0 subtractions (when dividend < divisor)',
      bestCaseZh: '0 次减法（当 dividend < divisor）',
    };
  },
};
