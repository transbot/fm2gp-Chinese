import React, { useEffect, useRef, useState } from 'react';
import { Home, Languages, Play, Pause } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations } from '../i18n/translations';
import { Links } from './Links';
import { useLanguage } from '../context/LanguageContext';

// Generate random uppercase letters
const generateRandomLetters = (count: number): string[] => {
  return Array.from({ length: count }, () => 
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  );
};

interface Element {
  value: string;
  index: number;
  angle: number;
}

export function Rotate() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [elements, setElements] = useState<Element[]>([]);
  const [steps, setSteps] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const animationRef = useRef<number>();
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const TOTAL_ELEMENTS = 7;
  const ANIMATION_DURATION = 2000; // 2 seconds

  useEffect(() => {
    const letters = generateRandomLetters(TOTAL_ELEMENTS);
    const newElements = letters.map((letter, index) => ({
      value: letter,
      index,
      angle: (index * 2 * Math.PI) / TOTAL_ELEMENTS
    }));
    setElements(newElements);
  }, []);

  const drawCircle = (ctx: CanvasRenderingContext2D, rotation: number) => {
    const canvas = ctx.canvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.7;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw circle
    ctx.beginPath();
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw elements
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    elements.forEach(element => {
      const angle = element.angle + rotation;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      // Draw element
      ctx.fillStyle = '#1f2937';
      ctx.fillText(element.value, x, y);

      // Draw index
      ctx.font = '14px Arial';
      ctx.fillStyle = '#6b7280';
      ctx.fillText(element.index.toString(), 
        x + 20 * Math.cos(angle),
        y + 20 * Math.sin(angle)
      );
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 500;
    canvas.height = 500;

    // Draw initial state
    drawCircle(ctx, currentRotation);
  }, [elements, currentRotation]);

  const animate = (startTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const targetRotation = (steps * 2 * Math.PI) / TOTAL_ELEMENTS;
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / ANIMATION_DURATION, 1);

    const currentRot = progress * targetRotation;
    setCurrentRotation(currentRot);

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(() => animate(startTime));
    } else {
      setIsAnimating(false);
    }
  };

  const startAnimation = () => {
    if (isAnimating) {
      setIsAnimating(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    } else {
      setIsAnimating(true);
      animate(Date.now());
    }
  };

  const reset = () => {
    setSteps(0);
    setCurrentRotation(0);
    setIsAnimating(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    const letters = generateRandomLetters(TOTAL_ELEMENTS);
    const newElements = letters.map((letter, index) => ({
      value: letter,
      index,
      angle: (index * 2 * Math.PI) / TOTAL_ELEMENTS
    }));
    setElements(newElements);
  };

  const getSubintervals = () => {
    const m = TOTAL_ELEMENTS - steps;
    const firstSubinterval = elements.slice(0, m).map(e => e.value);
    const secondSubinterval = elements.slice(m).map(e => e.value);
    return { firstSubinterval, secondSubinterval };
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors"
          >
            <Home className="w-4 h-4" />
            {t.backToHome}
          </Link>
          <h1 className="text-3xl font-bold">{t.rotateTitle}</h1>
        </div>
        <button
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <Languages className="w-4 h-4" />
          {t.language}
        </button>
      </div>

      <p className="text-gray-600">{t.rotateDescription}</p>
      <p className="text-gray-600">{t.rotateExplanation}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">
                {t.steps}
              </label>
              <input
                type="range"
                min="0"
                max={TOTAL_ELEMENTS - 1}
                value={steps}
                onChange={(e) => setSteps(parseInt(e.target.value))}
                className="w-full"
              />
              <span className="font-mono w-8 text-center">{steps}</span>
            </div>

            <div className="flex gap-4">
              <button
                onClick={startAnimation}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {isAnimating ? (
                  <>
                    <Pause className="w-4 h-4" />
                    {t.pause}
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    {t.animate}
                  </>
                )}
              </button>
              <button
                onClick={reset}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                {t.reset}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-semibold mb-2">{t.subintervalSwap}</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">{t.firstSubinterval}:</span>{' '}
                  <span className="font-mono">
                    [{getSubintervals().firstSubinterval.join(', ')}]
                  </span>
                </p>
                <p>
                  <span className="font-medium">{t.secondSubinterval}:</span>{' '}
                  <span className="font-mono">
                    [{getSubintervals().secondSubinterval.join(', ')}]
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <canvas 
            ref={canvasRef}
            className="w-full"
            style={{ aspectRatio: '1/1' }}
          />
        </div>
      </div>

      <Links lang={lang} />
    </div>
  );
}