import React, { useEffect, useRef, useState } from 'react';
import { Home, Languages, Play, Pause } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations } from '../i18n/translations';
import { Links } from './Links';
import { useLanguage } from '../context/LanguageContext';

export function PiUpperBound() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sides, setSides] = useState<number>(3);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState<number>(0);
  const animationRef = useRef<number>();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const MAX_SIDES = 500;

  const calculatePerimeter = (sides: number): number => {
    const angleStep = (2 * Math.PI) / sides;
    const sideLength = 2 * Math.sin(angleStep / 2);
    return sides * sideLength;
  };

  const drawPolygon = (ctx: CanvasRenderingContext2D, sides: number) => {
    const canvas = ctx.canvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;

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

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  };

  const animate = () => {
    if (!isAnimating) return;
    
    if (sides >= MAX_SIDES) {
      stopAnimation();
      setIsAnimating(false);
      return;
    }

    setSides(prev => prev + 1);
    
    // Calculate delay based on current number of sides
    const delay = sides <= 10 ? 1000 : 100; // Slower for first 10 polygons
    
    timeoutRef.current = setTimeout(() => {
      if (isAnimating) {
        animationRef.current = requestAnimationFrame(animate);
      }
    }, delay);
  };

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
    if (isAnimating) {
      animate();
    }
    return () => {
      stopAnimation();
    };
  }, [isAnimating]);

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

    // Calculate current value
    const perimeter = calculatePerimeter(sides);
    setCurrentValue(perimeter);
  }, [sides]);

  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, []);

  const handleSidesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 3 && value <= MAX_SIDES) {
      setSides(value);
    }
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
          <h1 className="text-3xl font-bold">{t.piUpperBoundTitle}</h1>
        </div>
        <button
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <Languages className="w-4 h-4" />
          {t.language}
        </button>
      </div>

      <p className="text-gray-600">{t.piUpperBoundDescription}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">
                {t.numberOfSides}
              </label>
              <input
                type="range"
                min="3"
                max={MAX_SIDES}
                value={sides}
                onChange={handleSidesChange}
                className="w-full"
              />
              <span className="font-mono w-16 text-center">{sides}</span>
            </div>

            <button
              onClick={toggleAnimation}
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
                  {sides >= MAX_SIDES ? t.reset : t.animate}
                </>
              )}
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2">{t.upperBound}</h3>
            <p className="font-mono text-lg">{(currentValue / 2).toFixed(6)}</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-2">{t.explanation}</h3>
            <p className="text-gray-700">{t.piExplanation}</p>
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