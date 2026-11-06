import { useEffect, useState } from 'react';
import { StepController } from '../common/StepController';
export function usePlayback(total: number, initialStep = 0) {
    const clamp = (s: number) => Math.max(0, Math.min(total - 1, Number.isSafeInteger(s) ? s : 0));
    const [step, setStep] = useState(() => clamp(initialStep)), [playing, setPlaying] = useState(false), [speed, setSpeed] = useState(1);
    useEffect(() => { if (!playing || step >= total - 1)
        return; const timer = setTimeout(() => setStep(s => s + 1), 1000 / speed); return () => clearTimeout(timer); }, [playing, step, total, speed]);
    const pause = () => setPlaying(false);
    const seek = (s: number) => { pause(); setStep(clamp(s)); };
    const reset = () => seek(0);
    return { step, reset, pause, seek, controls: <StepController currentStep={step} totalSteps={total} isPlaying={playing && step < total - 1} speed={speed} onPlay={() => { if (step >= total - 1)
            setStep(0); setPlaying(true); }} onPause={pause} onSeek={seek} onStep={d => seek(step + (d === 'forward' ? 1 : -1))} onSpeedChange={setSpeed}/> };
}
