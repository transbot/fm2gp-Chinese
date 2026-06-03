// src/hooks/useStepControl.ts

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Step,
  UseStepControlOptions,
  UseStepControlReturn,
} from '../lib/algorithms/types';

const DEFAULT_SPEED = 1;
const SPEED_OPTIONS = [0.5, 1, 1.5, 2, 3];
const STEP_THRESHOLD = 10000; // Warn threshold

export function useStepControl<TInput, TState>(
  options: UseStepControlOptions<TInput, TState>
): UseStepControlReturn<TState> {
  const {
    algorithm,
    initialInput,
    autoPlay = false,
    defaultSpeed = DEFAULT_SPEED,
    maxSteps = STEP_THRESHOLD,
  } = options;

  // State
  const [steps, setSteps] = useState<Step<TState>[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [speed, setSpeedState] = useState(defaultSpeed);

  // Refs for animation frame management
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const skipAnimationRef = useRef(false);

  // Derived state
  const totalSteps = steps.length;
  const currentState = steps[currentStep]?.state ?? algorithm.getInitialState();
  const currentStepData = steps[currentStep] ?? null;

  // Generate steps when input changes
  const generateStepsFromInput = useCallback((newInput: TInput) => {
    const validation = algorithm.validateInput(newInput);
    if (!validation.valid) {
      console.warn('Invalid input:', validation.error);
      return false;
    }

    const newSteps = algorithm.generateSteps(newInput);

    // Warn if too many steps
    if (newSteps.length > maxSteps) {
      console.warn(
        `Generated ${newSteps.length} steps, exceeding threshold of ${maxSteps}. ` +
        `Consider using smaller input or pagination.`
      );
    }

    setSteps(newSteps);
    setCurrentStep(0);
    return true;
  }, [algorithm, maxSteps]);

  // Initialize on mount
  useEffect(() => {
    generateStepsFromInput(initialInput);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Play/pause interval management
  useEffect(() => {
    if (isPlaying && currentStep < totalSteps - 1) {
      const interval = 1000 / speed; // ms per step
      playIntervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, interval);
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
    };
  }, [isPlaying, speed, totalSteps, currentStep]);

  // Actions
  const play = useCallback(() => {
    if (currentStep >= totalSteps - 1) {
      setCurrentStep(0); // Restart from beginning
    }
    setIsPlaying(true);
  }, [currentStep, totalSteps]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const stepForward = useCallback(() => {
    setIsPlaying(false);
    skipAnimationRef.current = true;
    setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const stepBackward = useCallback(() => {
    setIsPlaying(false);
    skipAnimationRef.current = true;
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const seek = useCallback((step: number) => {
    setIsPlaying(false);
    skipAnimationRef.current = true;
    setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)));
  }, [totalSteps]);

  const setSpeed = useCallback((newSpeed: number) => {
    setSpeedState(Math.max(0.5, Math.min(newSpeed, 3)));
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    skipAnimationRef.current = true;
  }, []);

  return {
    currentStep,
    totalSteps,
    currentState,
    isPlaying,
    speed,
    steps,
    play,
    pause,
    stepForward,
    stepBackward,
    seek,
    setSpeed,
    reset,
    currentStepData,
  };
}

// Export speed options for UI
export { SPEED_OPTIONS };
