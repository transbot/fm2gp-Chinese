// src/hooks/useStepControl.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStepControl } from './useStepControl';
import { AlgorithmVisualization, Step } from '../lib/algorithms/types';

// Create a mock algorithm for testing
interface TestInput {
  items: number[];
}

interface TestState {
  items: number[];
  currentIndex: number;
  processed: boolean;
}

const createMockAlgorithm = (): AlgorithmVisualization<TestInput, TestState> => ({
  id: 'test-algorithm',
  section: '1.0',

  generateSteps(input: TestInput): Step<TestState>[] {
    const steps: Step<TestState>[] = [];

    // Init step
    steps.push({
      state: {
        items: [...input.items],
        currentIndex: 0,
        processed: false,
      },
      operation: 'init',
      descriptionKey: 'test.init',
      highlights: [],
    });

    // Process each item
    for (let i = 0; i < input.items.length; i++) {
      steps.push({
        state: {
          items: [...input.items],
          currentIndex: i,
          processed: false,
        },
        operation: 'process',
        descriptionKey: 'test.process',
        highlights: [i],
      });
    }

    // Final step
    steps.push({
      state: {
        items: [...input.items],
        currentIndex: input.items.length - 1,
        processed: true,
      },
      operation: 'complete',
      descriptionKey: 'test.complete',
      highlights: [],
    });

    return steps;
  },

  validateInput(input: TestInput) {
    if (!input.items || input.items.length === 0) {
      return { valid: false, error: 'Items must not be empty' };
    }
    return { valid: true };
  },

  getInitialState(): TestState {
    return {
      items: [],
      currentIndex: 0,
      processed: false,
    };
  },

  describeStep(step: Step<TestState>, lang: 'en' | 'zh'): string {
    return `Step: ${step.operation}`;
  },

  getInvariant(lang: 'en' | 'zh'): string {
    return 'Test invariant';
  },

  getComplexity() {
    return {
      time: 'O(n)',
      space: 'O(1)',
    };
  },
});

describe('useStepControl', () => {
  let mockAlgorithm: AlgorithmVisualization<TestInput, TestState>;

  beforeEach(() => {
    mockAlgorithm = createMockAlgorithm();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() =>
        useStepControl({
          algorithm: mockAlgorithm,
          initialInput: { items: [1, 2, 3] },
        })
      );

      expect(result.current.currentStep).toBe(0);
      expect(result.current.isPlaying).toBe(false);
      expect(result.current.speed).toBe(1);
      expect(result.current.totalSteps).toBe(5); // init + 3 process + complete
    });

    it('should initialize with autoPlay enabled', () => {
      const { result } = renderHook(() =>
        useStepControl({
          algorithm: mockAlgorithm,
          initialInput: { items: [1, 2] },
          autoPlay: true,
        })
      );

      expect(result.current.isPlaying).toBe(true);
    });

    it('should initialize with custom speed', () => {
      const { result } = renderHook(() =>
        useStepControl({
          algorithm: mockAlgorithm,
          initialInput: { items: [1, 2] },
          defaultSpeed: 2,
        })
      );

      expect(result.current.speed).toBe(2);
    });

    it('should return current state from current step', () => {
      const { result } = renderHook(() =>
        useStepControl({
          algorithm: mockAlgorithm,
          initialInput: { items: [1, 2, 3] },
        })
      );

      expect(result.current.currentState.items).toEqual([1, 2, 3]);
      expect(result.current.currentState.processed).toBe(false);
    });

    it('should return current step data', () => {
      const { result } = renderHook(() =>
        useStepControl({
          algorithm: mockAlgorithm,
          initialInput: { items: [1, 2, 3] },
        })
      );

      expect(result.current.currentStepData).not.toBeNull();
      expect(result.current.currentStepData?.operation).toBe('init');
    });
  });

  describe('play/pause', () => {
    it('should start playing when play() is called', () => {
      const { result } = renderHook(() =>
        useStepControl({
          algorithm: mockAlgorithm,
          initialInput: { items: [1, 2, 3] },
        })
      );

      act(() => {
        result.current.play();
      });

      expect(result.current.isPlaying).toBe(true);
    });

    it('should pause when pause() is called', () => {
      const { result } = renderHook(() =>
        useStepControl({
          algorithm: mockAlgorithm,
          initialInput: { items: [1, 2, 3] },
          autoPlay: true,
        })
      );

      act(() => {
        result.current.pause();
      });

      expect(result.current.isPlaying).toBe(false);
    });

    it('should restart from beginning when play() called at end', () => {
      const { result } = renderHook(() =>
        useStepControl({
          algorithm: mockAlgorithm,
          initialInput: { items: [1, 2] },
        })
      );

      // Go to the last step
      act(() => {
        result.current.seek(result.current.totalSteps - 1);
      });

      expect(result.current.currentStep).toBe(result.current.totalSteps - 1);

      // Play should restart from beginning
      act(() => {
        result.current.play();
      });

      expect(result.current.currentStep).toBe(0);
      expect(result.current.isPlaying).toBe(true);
    });

    it('should advance steps automatically while playing', () => {
      const { result } = renderHook(() =>
        useStepControl({
          algorithm: mockAlgorithm,
          initialInput: { items: [1, 2, 3] },
        })
      );

      act(() => {
        result.current.play();
      });

      expect(result.current.currentStep).toBe(0);

      // Advance timer by 1 second (default speed)
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.currentStep).toBe(1);
    });

    it('should stop playing when reaching the end', () => {
      const { result } = renderHook(() =>
        useStepControl({
          algorithm: mockAlgorithm,
          initialInput: { items: [1] }, // Only 3 steps: init, process, complete
        })
      );

      act(() => {
        result.current.play();
      });

      // Advance to the end
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(result.current.isPlaying).toBe(false);
    });
  });

  describe('step forward/backward', () => {
    it('should step forward correctly', () => {
      const { result } = renderHook(() =>
        useStepControl({
          algorithm: mockAlgorithm,
          initialInput: { items: [1, 2, 3] },
        })
      );

      expect(result.current.currentStep).toBe(0);

      act(() => {
        result.current.stepForward();
      });

      expect(result.current.currentStep).toBe(1);
      expect(result.current.isPlaying).toBe(false);
    });

    it('should not step forward beyond last step', () => {
      const { result } = renderHook(() =>
        useStepControl({
          algorithm: mockAlgorithm,
          initialInput: { items: [1] },
        })
      );

      const lastStep = result.current.totalSteps - 1;

      // Go to last step
      act(() => {
        result.current.seek(lastStep);
      });

      // Try to step forward
      act(() => {
        result.current.stepForward();
      });

      expect(result.current.currentStep).toBe(lastStep);
    });

    it('should step backward correctly', () => {
      const { result } = renderHook(() =>
        useStepControl({
          algorithm: mockAlgorithm,
          initialInput: { items: [1, 2, 3] },
        })
      );

      // Go to step 2
      act(() => {
        result.current.seek(2);
      });

      expect(result.current.currentStep).toBe(2);

      act(() => {
        result.current.stepBackward();
      });

      expect(result.current.currentStep).toBe(1);
    });

    it('should not step backward beyond first step', () => {
      const { result } = renderHook(() =>
        useStepControl({
          algorithm: mockAlgorithm,
          initialInput: { items: [1, 2, 3] },
        })
      );

      expect(result.current.currentStep).toBe(0);

      act(() => {
        result.current.stepBackward();
      });

      expect(result.current.currentStep).toBe(0);
    });

    it('should pause when stepping', () => {
      const { result } = renderHook(() =>
        useStepControl({
          algorithm: mockAlgorithm,
          initialInput: { items: [1, 2, 3] },
          autoPlay: true,
        })
      );

      expect(result.current.isPlaying).toBe(true);

      act(() => {
        result.current.stepForward();
      });

      expect(result.current.isPlaying).toBe(false);
    });
  });

  describe('seek', () => {
    it('should seek to specific step', () => {
      const { result } = renderHook(() =>
        useStepControl({
          algorithm: mockAlgorithm,
          initialInput: { items: [1, 2, 3] },
        })
      );

      act(() => {
        result.current.seek(3);
      });

      expect(result.current.currentStep).toBe(3);
      expect(result.current.isPlaying).toBe(false);
    });

    it('should clamp seek to valid range', () => {
      const { result } = renderHook(() =>
        useStepControl({
          algorithm: mockAlgorithm,
          initialInput: { items: [1, 2, 3] },
        })
      );

      // Seek beyond max
      act(() => {
        result.current.seek(100);
      });

      expect(result.current.currentStep).toBe(result.current.totalSteps - 1);

      // Seek below min
      act(() => {
        result.current.seek(-5);
      });

      expect(result.current.currentStep).toBe(0);
    });

    it('should pause when seeking', () => {
      const { result } = renderHook(() =>
        useStepControl({
          algorithm: mockAlgorithm,
          initialInput: { items: [1, 2, 3] },
          autoPlay: true,
        })
      );

      expect(result.current.isPlaying).toBe(true);

      act(() => {
        result.current.seek(2);
      });

      expect(result.current.isPlaying).toBe(false);
    });
  });

  describe('speed control', () => {
    it('should set speed within valid range', () => {
      const { result } = renderHook(() =>
        useStepControl({
          algorithm: mockAlgorithm,
          initialInput: { items: [1, 2, 3] },
        })
      );

      act(() => {
        result.current.setSpeed(2);
      });

      expect(result.current.speed).toBe(2);

      act(() => {
        result.current.setSpeed(3);
      });

      expect(result.current.speed).toBe(3);
    });

    it('should clamp speed to min value', () => {
      const { result } = renderHook(() =>
        useStepControl({
          algorithm: mockAlgorithm,
          initialInput: { items: [1, 2, 3] },
        })
      );

      act(() => {
        result.current.setSpeed(0.1);
      });

      expect(result.current.speed).toBe(0.5);
    });

    it('should clamp speed to max value', () => {
      const { result } = renderHook(() =>
        useStepControl({
          algorithm: mockAlgorithm,
          initialInput: { items: [1, 2, 3] },
        })
      );

      act(() => {
        result.current.setSpeed(10);
      });

      expect(result.current.speed).toBe(3);
    });

    it('should affect play speed', () => {
      const { result } = renderHook(() =>
        useStepControl({
          algorithm: mockAlgorithm,
          initialInput: { items: [1, 2, 3] },
        })
      );

      // Set speed to 2x
      act(() => {
        result.current.setSpeed(2);
        result.current.play();
      });

      // At 2x speed, 500ms should advance one step
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.currentStep).toBe(1);
    });
  });

  describe('reset', () => {
    it('should reset to first step', () => {
      const { result } = renderHook(() =>
        useStepControl({
          algorithm: mockAlgorithm,
          initialInput: { items: [1, 2, 3] },
        })
      );

      // Move to step 3
      act(() => {
        result.current.seek(3);
      });

      expect(result.current.currentStep).toBe(3);

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.currentStep).toBe(0);
      expect(result.current.isPlaying).toBe(false);
    });

    it('should stop playing when reset', () => {
      const { result } = renderHook(() =>
        useStepControl({
          algorithm: mockAlgorithm,
          initialInput: { items: [1, 2, 3] },
          autoPlay: true,
        })
      );

      expect(result.current.isPlaying).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.isPlaying).toBe(false);
    });
  });

  describe('steps array', () => {
    it('should provide access to all steps', () => {
      const { result } = renderHook(() =>
        useStepControl({
          algorithm: mockAlgorithm,
          initialInput: { items: [1, 2] },
        })
      );

      expect(result.current.steps).toHaveLength(result.current.totalSteps);
      expect(result.current.steps[0].operation).toBe('init');
      expect(result.current.steps[result.current.totalSteps - 1].operation).toBe(
        'complete'
      );
    });
  });
});