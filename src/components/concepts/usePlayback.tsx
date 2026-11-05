import { useEffect, useState } from 'react';
import { StepController } from '../common/StepController';
export function usePlayback(total: number) {
    const [step, setStep] = useState(0), [playing, setPlaying] = useState(false), [speed, setSpeed] = useState(1);
    useEffect(() => { if (!playing || step >= total - 1)
        return; const timer = setTimeout(() => setStep(s => s + 1), 1000 / speed); return () => clearTimeout(timer); }, [playing, step, total, speed]);
    const seek = (s: number) => { setPlaying(false); setStep(Math.max(0, Math.min(total - 1, s))); };
    const reset = () => { setStep(0); setPlaying(false); };
    return { step, reset, controls: <StepController currentStep={step} totalSteps={total} isPlaying={playing && step < total - 1} speed={speed} onPlay={() => { if (step >= total - 1)
            setStep(0); setPlaying(true); }} onPause={() => setPlaying(false)} onSeek={seek} onStep={d => seek(step + (d === 'forward' ? 1 : -1))} onSpeedChange={setSpeed}/> };
}
