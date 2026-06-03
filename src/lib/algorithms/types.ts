// src/lib/algorithms/types.ts

/**
 * Core interface that all algorithm visualizations must implement.
 * Enables unified step control, explanation panels, and animations.
 */
export interface AlgorithmVisualization<TInput, TState> {
  /** Algorithm identifier for routing and translation keys */
  id: string;

  /** Section reference in the book (e.g., "10.7") */
  section?: string;

  /** Whether this is an advanced (non-book) algorithm */
  isAdvanced?: boolean;

  /** Generate all steps for visualization (pre-generated for seek/backward support) */
  generateSteps(input: TInput): Step<TState>[];

  /** Validate user input before generating steps */
  validateInput(input: TInput): ValidationResult;

  /** Get initial/empty state */
  getInitialState(): TState;

  /** Describe current step for ExplanationPanel */
  describeStep(step: Step<TState>, lang: 'en' | 'zh'): string;

  /** Optional invariant description */
  getInvariant?(lang: 'en' | 'zh'): string;

  /** Complexity information */
  getComplexity(): ComplexityInfo;
}

/** Single step in algorithm execution */
export interface Step<TState> {
  /** Current state snapshot */
  state: TState;

  /** Operation type identifier (e.g., 'compare', 'swap') */
  operation: string;

  /** Translation key for step description */
  descriptionKey: string;

  /** Indices of elements to highlight */
  highlights?: number[];

  /** Optional animation specification */
  animation?: AnimationSpec;
}

/** Animation specification for a step */
export interface AnimationSpec {
  type: 'swap' | 'move' | 'highlight' | 'fade' | 'none';
  duration?: number;
  easing?: 'linear' | 'ease' | 'ease-in-out';
}

/** Complexity information */
export interface ComplexityInfo {
  time: string;
  space: string;
  worstCase?: string;
  worstCaseZh?: string;
  bestCase?: string;
  bestCaseZh?: string;
}

/** Result of input validation */
export interface ValidationResult {
  valid: boolean;
  error?: string;
  errorKey?: string;  // Translation key for error message
}

/** Options for step control hook */
export interface UseStepControlOptions<TInput, TState> {
  algorithm: AlgorithmVisualization<TInput, TState>;
  initialInput: TInput;
  autoPlay?: boolean;
  defaultSpeed?: number;
  maxSteps?: number;  // Warn if exceeded
}

/** Return type for step control hook */
export interface UseStepControlReturn<TState> {
  // State
  currentStep: number;
  totalSteps: number;
  currentState: TState;
  isPlaying: boolean;
  speed: number;
  steps: Step<TState>[];

  // Actions
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  seek: (step: number) => void;
  setSpeed: (speed: number) => void;
  reset: () => void;

  // Info
  currentStepData: Step<TState> | null;
}
