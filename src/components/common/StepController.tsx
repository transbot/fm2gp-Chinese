// src/components/common/StepController.tsx

import React from 'react';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import { SPEED_OPTIONS } from '../../hooks/useStepControl';

interface StepControllerProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onStep: (direction: 'forward' | 'backward') => void;
  onSpeedChange: (speed: number) => void;
  onSeek: (step: number) => void;
  disabled?: boolean;
}

export function StepController({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  onPlay,
  onPause,
  onStep,
  onSpeedChange,
  onSeek,
  disabled = false,
}: StepControllerProps) {
  const { lang } = useLanguage();
  const t = translations[lang] as any;

  const progress = totalSteps > 0 ? (currentStep / (totalSteps - 1)) * 100 : 0;
  const canGoBack = currentStep > 0 && !disabled;
  const canGoForward = currentStep < totalSteps - 1 && !disabled;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{t.currentStep || 'Step'}: {currentStep + 1}</span>
          <span>{t.totalSteps || 'Total'}: {totalSteps}</span>
        </div>
        <input
          type="range"
          min={0}
          max={totalSteps - 1}
          value={currentStep}
          onChange={(e) => onSeek(Number(e.target.value))}
          disabled={disabled || totalSteps <= 1}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progress}%, #e5e7eb ${progress}%, #e5e7eb 100%)`
          }}
        />
      </div>

      {/* Control buttons */}
      <div className="flex items-center justify-center gap-2">
        {/* Step backward */}
        <button
          onClick={() => onStep('backward')}
          disabled={!canGoBack}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title={t.stepBackward || 'Step Backward'}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Play/Pause */}
        <button
          onClick={isPlaying ? onPause : onPlay}
          disabled={disabled || totalSteps <= 1}
          className="p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title={isPlaying ? (t.pause || 'Pause') : (t.play || 'Play')}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>

        {/* Step forward */}
        <button
          onClick={() => onStep('forward')}
          disabled={!canGoForward}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title={t.stepForward || 'Step Forward'}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Speed selector */}
      <div className="flex items-center justify-center gap-2">
        <label className="text-sm text-gray-600">{t.speed || 'Speed'}:</label>
        <select
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          disabled={disabled}
          className="px-3 py-1 rounded-lg border border-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {SPEED_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}x
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
