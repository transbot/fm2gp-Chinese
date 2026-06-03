import {
  AlgorithmVisualization,
  ComplexityInfo,
  Step,
  ValidationResult,
} from './types';

export interface FrequencyCountInput {
  values: string[];
  target: string;
}

export interface FrequencyCountState {
  values: string[];
  currentIndex: number;
  currentValue: string | null;
  counts: Record<string, number>;
  target: string;
  targetCount: number;
  distinctCount: number;
}

export const frequencyCountVisualization: AlgorithmVisualization<
  FrequencyCountInput,
  FrequencyCountState
> = {
  id: 'frequency-count',

  generateSteps(input: FrequencyCountInput): Step<FrequencyCountState>[] {
    const values = input.values.map((value) => value.trim()).filter(Boolean);
    const target = input.target.trim();
    const counts: Record<string, number> = {};
    const steps: Step<FrequencyCountState>[] = [];

    const makeState = (currentIndex: number, currentValue: string | null): FrequencyCountState => ({
      values,
      currentIndex,
      currentValue,
      counts: { ...counts },
      target,
      targetCount: counts[target] ?? 0,
      distinctCount: Object.keys(counts).length,
    });

    steps.push({
      state: makeState(-1, null),
      operation: 'init',
      descriptionKey: 'frequencyCountInit',
      highlights: [],
    });

    values.forEach((value, index) => {
      steps.push({
        state: makeState(index, value),
        operation: 'read_value',
        descriptionKey: 'frequencyCountRead',
        highlights: [index],
      });

      counts[value] = (counts[value] ?? 0) + 1;
      steps.push({
        state: makeState(index, value),
        operation: 'increment_count',
        descriptionKey: 'frequencyCountIncrement',
        highlights: [index],
      });
    });

    steps.push({
      state: makeState(-1, null),
      operation: 'complete',
      descriptionKey: 'frequencyCountComplete',
      highlights: [],
    });

    return steps;
  },

  validateInput(input: FrequencyCountInput): ValidationResult {
    const values = input.values.map((value) => value.trim()).filter(Boolean);

    if (values.length === 0) {
      return {
        valid: false,
        error: 'Values must not be empty',
        errorKey: 'frequencyCountEmptyValues',
      };
    }

    if (values.length > 60) {
      return {
        valid: false,
        error: 'Values must have at most 60 items',
        errorKey: 'frequencyCountTooLarge',
      };
    }

    if (!input.target.trim()) {
      return {
        valid: false,
        error: 'Target must not be empty',
        errorKey: 'frequencyCountEmptyTarget',
      };
    }

    return { valid: true };
  },

  getInitialState(): FrequencyCountState {
    return {
      values: [],
      currentIndex: -1,
      currentValue: null,
      counts: {},
      target: '',
      targetCount: 0,
      distinctCount: 0,
    };
  },

  describeStep(step: Step<FrequencyCountState>, lang: 'en' | 'zh'): string {
    const { state, operation } = step;
    const { currentIndex, currentValue, target, targetCount, distinctCount } = state;

    const messages: Record<string, Record<'en' | 'zh', string>> = {
      init: {
        en: 'Start with an empty table of counts.',
        zh: '从一张空的计数表开始。',
      },
      read_value: {
        en: `Read value "${currentValue}" at index ${currentIndex}.`,
        zh: `读取索引 ${currentIndex} 处的值“${currentValue}”。`,
      },
      increment_count: {
        en: `Increment the count for "${currentValue}". Distinct values: ${distinctCount}.`,
        zh: `把“${currentValue}”的计数加一。不同值数量：${distinctCount}。`,
      },
      complete: {
        en: `Counting complete. "${target}" appears ${targetCount} time(s).`,
        zh: `计数完成。“${target}”出现了 ${targetCount} 次。`,
      },
    };

    return messages[operation]?.[lang] ?? '';
  },

  getInvariant(lang: 'en' | 'zh'): string {
    return lang === 'en'
      ? 'After reading index i, the table stores exact counts for the prefix values[0..i].'
      : '读完索引 i 后，计数表准确记录了前缀 values[0..i] 中每个值的出现次数。';
  },

  getComplexity(): ComplexityInfo {
    return {
      time: 'O(n)',
      space: 'O(k)',
      worstCase: 'O(n) time and O(k) space for k distinct values',
      worstCaseZh: '有 k 个不同值时，需要 O(n) 时间和 O(k) 空间',
      bestCase: 'O(n) because every value must be read once',
      bestCaseZh: '每个值都必须读取一次，因此最好情况仍为 O(n)',
    };
  },
};
