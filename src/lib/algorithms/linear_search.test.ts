// src/lib/algorithms/linear_search.test.ts

import { describe, it, expect } from 'vitest';
import { linearSearchVisualization } from './linear_search';

describe('linearSearchVisualization', () => {
  describe('generateSteps', () => {
    it('should generate correct steps for finding target', () => {
      const input = { array: [5, 3, 8, 1, 9], target: 8 };
      const steps = linearSearchVisualization.generateSteps(input);

      expect(steps.length).toBeGreaterThan(2);
      expect(steps[0].operation).toBe('init');
      expect(steps[0].state.array).toEqual([5, 3, 8, 1, 9]);
      expect(steps[0].state.target).toBe(8);
      expect(steps[0].state.found).toBe(false);

      const foundStep = steps.find((s) => s.operation === 'found');
      expect(foundStep).toBeDefined();
      expect(foundStep?.state.foundIndex).toBe(2);
      expect(foundStep?.state.currentIndex).toBe(2);
    });

    it('should generate notFound step when target not in array', () => {
      const input = { array: [1, 2, 3], target: 99 };
      const steps = linearSearchVisualization.generateSteps(input);

      const notFoundStep = steps.find((s) => s.operation === 'not_found');
      expect(notFoundStep).toBeDefined();
      expect(notFoundStep?.state.found).toBe(false);
      expect(notFoundStep?.state.foundIndex).toBeNull();
    });

    it('should find target at first position', () => {
      const input = { array: [7, 2, 3, 4, 5], target: 7 };
      const steps = linearSearchVisualization.generateSteps(input);

      expect(steps.length).toBe(2); // init + found
      const foundStep = steps.find((s) => s.operation === 'found');
      expect(foundStep?.state.foundIndex).toBe(0);
      expect(foundStep?.state.comparisons).toBe(1);
    });

    it('should find target at last position', () => {
      const input = { array: [1, 2, 3, 4, 5], target: 5 };
      const steps = linearSearchVisualization.generateSteps(input);

      const foundStep = steps.find((s) => s.operation === 'found');
      expect(foundStep?.state.foundIndex).toBe(4);
      expect(foundStep?.state.comparisons).toBe(5);
    });

    it('should highlight current index being compared', () => {
      const input = { array: [1, 2, 3], target: 2 };
      const steps = linearSearchVisualization.generateSteps(input);

      const compareStep = steps.find((s) => s.operation === 'compare');
      expect(compareStep?.highlights).toEqual([0]);
    });

    it('should count comparisons correctly', () => {
      const input = { array: [1, 2, 3, 4, 5], target: 3 };
      const steps = linearSearchVisualization.generateSteps(input);

      const foundStep = steps.find((s) => s.operation === 'found');
      expect(foundStep?.state.comparisons).toBe(3);
    });
  });

  describe('validateInput', () => {
    it('should validate empty array', () => {
      const result = linearSearchVisualization.validateInput({
        array: [],
        target: 5,
      });
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should accept valid input', () => {
      const result = linearSearchVisualization.validateInput({
        array: [1, 2, 3],
        target: 2,
      });
      expect(result.valid).toBe(true);
    });

    it('should reject array larger than 100 elements', () => {
      const largeArray = Array(101).fill(1);
      const result = linearSearchVisualization.validateInput({
        array: largeArray,
        target: 5,
      });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('100');
    });

    it('should accept array with exactly 100 elements', () => {
      const array = Array(100).fill(1);
      const result = linearSearchVisualization.validateInput({
        array,
        target: 5,
      });
      expect(result.valid).toBe(true);
    });
  });

  describe('getInitialState', () => {
    it('should return correct initial state', () => {
      const initialState = linearSearchVisualization.getInitialState();

      expect(initialState.array).toEqual([]);
      expect(initialState.target).toBe(0);
      expect(initialState.currentIndex).toBe(0);
      expect(initialState.found).toBe(false);
      expect(initialState.foundIndex).toBeNull();
      expect(initialState.comparisons).toBe(0);
    });
  });

  describe('describeStep', () => {
    it('should return English description', () => {
      const steps = linearSearchVisualization.generateSteps({
        array: [1, 2, 3],
        target: 2,
      });
      const description = linearSearchVisualization.describeStep(
        steps[0],
        'en'
      );
      expect(description).toContain('Starting linear search');
    });

    it('should return Chinese description', () => {
      const steps = linearSearchVisualization.generateSteps({
        array: [1, 2, 3],
        target: 2,
      });
      const description = linearSearchVisualization.describeStep(
        steps[0],
        'zh'
      );
      expect(description).toContain('开始线性查找');
    });
  });

  describe('getInvariant', () => {
    it('should return English invariant', () => {
      const invariant = linearSearchVisualization.getInvariant!('en');
      expect(invariant).toContain('currentIndex');
    });

    it('should return Chinese invariant', () => {
      const invariant = linearSearchVisualization.getInvariant!('zh');
      expect(invariant).toContain('currentIndex');
    });
  });

  describe('getComplexity', () => {
    it('should return correct complexity', () => {
      const complexity = linearSearchVisualization.getComplexity();
      expect(complexity.time).toBe('O(n)');
      expect(complexity.space).toBe('O(1)');
      expect(complexity.worstCase).toBeDefined();
      expect(complexity.bestCase).toBeDefined();
    });
  });
});
