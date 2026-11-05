import { useCallback, useEffect, useRef, useState } from 'react';
import { Home, Languages, Play, Pause } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations } from '../i18n/translations';
import { Links } from './Links';
import { useLanguage } from '../context/LanguageContext';
import { ResponsiveVisualFrame } from './common/ResponsiveVisualFrame';

const MAX_SIDES = 500;

export function PiUpperBound() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sides, setSides] = useState<number>(6);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const animationRef = useRef<number>();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const lowerBound = sides * Math.sin(Math.PI / sides);
  const upperBound = sides * Math.tan(Math.PI / sides);

  const drawPolygon = (ctx: CanvasRenderingContext2D, sides: number) => {
    const canvas = ctx.canvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    // Fit even the circumscribed triangle (circumradius = 2 * inradius).
    const radius = Math.min(centerX, centerY) * 0.44;

    // Tangent sides touch the same unit circle at the inscribed vertices.
    const outerRadius = radius / Math.cos(Math.PI / sides);
    ctx.beginPath();
    ctx.strokeStyle = '#047857';
    ctx.lineWidth = 3;
    for (let i = 0; i < sides; i++) {
      const angle = ((2 * i + 1) * Math.PI) / sides;
      const x = centerX + outerRadius * Math.cos(angle);
      const y = centerY + outerRadius * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    // Draw circle
    ctx.beginPath();
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw polygon
    ctx.beginPath();
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();

    // Draw vertices
    ctx.fillStyle = '#dc2626';
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Draw radii to vertices
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);
  };

  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  const toggleAnimation = () => {
    if (!isAnimating) {
      if (sides >= MAX_SIDES) {
        setSides(3); // Reset to start if we've reached the maximum
      }
      setIsAnimating(true);
    } else {
      stopAnimation();
      setIsAnimating(false);
    }
  };

  useEffect(() => {
    if (!isAnimating) {
      return stopAnimation;
    }

    if (sides >= MAX_SIDES) {
      stopAnimation();
      setIsAnimating(false);
      return stopAnimation;
    }

    const delay = sides <= 10 ? 1000 : 100; // Slower for first 10 polygons
    timeoutRef.current = setTimeout(() => {
      animationRef.current = requestAnimationFrame(() => {
        setSides((prev) => Math.min(prev + 1, MAX_SIDES));
      });
    }, delay);

    return stopAnimation;
  }, [isAnimating, sides, stopAnimation]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 600;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw current state
    drawPolygon(ctx, sides);
  }, [sides]);

  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, [stopAnimation]);

  const handleSidesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 3 && value <= MAX_SIDES) {
      setSides(value);
    }
  };

  return (
    <div className="safe-app-x safe-app-bottom max-w-4xl mx-auto py-4 sm:py-6 space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full min-w-0 flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Link
            to="/"
            className="learning-secondary flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            {t.backToHome}
          </Link>
          <h1 className="learning-title min-w-0">{t.piUpperBoundTitle}</h1>
        </div>
        <button
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          className="learning-primary flex items-center justify-center gap-2"
        >
          <Languages className="w-4 h-4" />
          {t.language}
        </button>
      </div>

      <p className="text-gray-600">{t.piUpperBoundDescription}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <label className="text-sm font-medium text-gray-700">
                {t.numberOfSides}
              </label>
              <input
                aria-label={t.numberOfSides}
                type="range"
                min="3"
                max={MAX_SIDES}
                value={sides}
                onChange={handleSidesChange}
                className="touch-target w-full"
              />
              <span className="font-mono w-16 text-center">{sides}</span>
            </div>

            <button
              onClick={toggleAnimation}
              className="touch-target flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {isAnimating ? (
                <>
                  <Pause className="w-4 h-4" />
                  {t.pause}
                </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                  {sides >= MAX_SIDES ? (t.reset) : (t.animate)}
                  </>
                )}
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2 text-red-700">{t.lowerBound}</h3>
            <p className="font-mono">n sin(π/n) = {lowerBound.toFixed(6)}</p>
            <h3 className="font-semibold mt-4 mb-2 text-emerald-700">{t.upperBound}</h3>
            <p className="font-mono">n tan(π/n) = {upperBound.toFixed(6)}</p>
            <p className="mt-4 font-semibold">{sides === 6 ? '3 < π < 2√3 ≈ 3.464102' : `${lowerBound.toFixed(6)} < π < ${upperBound.toFixed(6)}`}</p>
            <p className="mt-2 text-xs text-gray-500">{t.piRoundingNote}</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-2">{t.explanation}</h3>
            <p className="text-gray-700">{t.piExplanation}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <ResponsiveVisualFrame
            label={lang === 'zh' ? '单位圆的内接与外切正多边形' : 'Inscribed and circumscribed polygons of a unit circle'}
            minWidth={240}
          >
          <canvas 
            ref={canvasRef}
            className="w-full"
            style={{ aspectRatio: '1/1' }}
          />
          </ResponsiveVisualFrame>
          <div className="space-y-2 text-sm mt-3">
            <p className="text-blue-700">● {t.piUnitCircle}</p>
            <p className="text-red-700">— {t.piInscribed}</p>
            <p className="text-emerald-700">— {t.piCircumscribed}</p>
          </div>
        </div>
      </div>

      <Links lang={lang} />
    </div>
  );
}
