import { useCallback, useEffect, useRef, useState } from 'react';
import { Home, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations } from '../i18n/translations';
import { Links } from './Links';
import { useLanguage } from '../context/LanguageContext';
import { buildPrimeCountingSeries } from '../lib/algorithms/prime_counting';
import { ResponsiveVisualFrame } from './common/ResponsiveVisualFrame';

const PRIME_COUNTING_MAX_N = 1_000_000;
const PRIME_COUNTING_SAMPLES = 600;
const CHART_MIN_WIDTH = 640;
const CHART_ASPECT_RATIO = 2;

const formatNumber = (n: number) => {
  if (n >= 1000000) return `${(n/1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n/1000).toFixed(1)}K`;
  return n.toString();
};

export function PrimeCounting() {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chartWidth, setChartWidth] = useState(CHART_MIN_WIDTH);
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cssWidth = Math.max(CHART_MIN_WIDTH, chartWidth);
    const cssHeight = Math.round(cssWidth / CHART_ASPECT_RATIO);
    const pixelRatio = window.devicePixelRatio || 1;

    canvas.width = Math.round(cssWidth * pixelRatio);
    canvas.height = Math.round(cssHeight * pixelRatio);
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    // Set up graph dimensions
    const padding = {
      left: 60,   // Increased left padding for y-axis labels
      right: 40,
      top: 40,
      bottom: 60  // Increased bottom padding for x-axis label
    };
    const graphWidth = cssWidth - padding.left - padding.right;
    const graphHeight = cssHeight - padding.top - padding.bottom;

    const { points, approxPoints, maxX, maxY } = buildPrimeCountingSeries({
      maxN: PRIME_COUNTING_MAX_N,
      samples: PRIME_COUNTING_SAMPLES,
    });

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, cssHeight - padding.bottom);
    ctx.lineTo(cssWidth - padding.right, cssHeight - padding.bottom);
    ctx.stroke();

    // Add axis labels
    ctx.fillStyle = '#000';
    ctx.font = '14px Arial';
    
    // X-axis label
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('n', padding.left + graphWidth / 2, cssHeight - padding.bottom / 2);
    
    // Y-axis label
    ctx.textAlign = 'center';
    ctx.fillText('Count', padding.left / 2, padding.top + graphHeight / 2);

    // Draw grid and labels
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.font = '12px Arial';
    
    // Y-axis grid and labels
    for (let i = 0; i <= 10; i++) {
      const y = cssHeight - padding.bottom - (i * graphHeight / 10);
      const value = Math.round(maxY * i / 10);
      ctx.fillText(formatNumber(value), padding.left - 5, y);
      
      ctx.beginPath();
      ctx.strokeStyle = '#eee';
      ctx.moveTo(padding.left, y);
      ctx.lineTo(cssWidth - padding.right, y);
      ctx.stroke();
    }

    // X-axis grid and labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    for (let i = 0; i <= 10; i++) {
      const x = padding.left + (i * graphWidth / 10);
      const value = Math.round(maxX * i / 10);
      ctx.fillText(formatNumber(value), x, cssHeight - padding.bottom + 5);
      
      ctx.beginPath();
      ctx.strokeStyle = '#eee';
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, cssHeight - padding.bottom);
      ctx.stroke();
    }

    // Draw π(n)
    ctx.beginPath();
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    points.forEach(([x, y], i) => {
      const canvasX = padding.left + (x / maxX * graphWidth);
      const canvasY = cssHeight - padding.bottom - (y / maxY * graphHeight);
      if (i === 0) ctx.moveTo(canvasX, canvasY);
      else ctx.lineTo(canvasX, canvasY);
    });
    ctx.stroke();

    // Draw n/ln(n)
    ctx.beginPath();
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    approxPoints.forEach(([x, y], i) => {
      const canvasX = padding.left + (x / maxX * graphWidth);
      const canvasY = cssHeight - padding.bottom - (y / maxY * graphHeight);
      if (i === 0) ctx.moveTo(canvasX, canvasY);
      else ctx.lineTo(canvasX, canvasY);
    });
    ctx.stroke();

    // Add legend
    const legendX = padding.left + 20;
    const legendY = padding.top + 20;
    
    // π(n)
    ctx.beginPath();
    ctx.strokeStyle = '#2563eb';
    ctx.moveTo(legendX, legendY);
    ctx.lineTo(legendX + 30, legendY);
    ctx.stroke();
    ctx.fillStyle = '#000';
    ctx.textAlign = 'left';
    ctx.fillText('π(n)', legendX + 40, legendY);

    // n/ln(n)
    ctx.beginPath();
    ctx.strokeStyle = '#dc2626';
    ctx.moveTo(legendX, legendY + 20);
    ctx.lineTo(legendX + 30, legendY + 20);
    ctx.stroke();
    ctx.fillText('n/ln(n)', legendX + 40, legendY + 20);
  }, [chartWidth]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const updateWidth = () => {
      setChartWidth(Math.max(CHART_MIN_WIDTH, Math.round(frame.clientWidth)));
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(frame);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="safe-app-x safe-app-bottom max-w-4xl mx-auto py-4 sm:py-6 space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full min-w-0 flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Link
            to="/"
            className="touch-target flex items-center justify-center gap-2 rounded-lg bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
          >
            <Home className="w-4 h-4" />
            {t.backToHome}
          </Link>
          <h1 className="min-w-0 max-w-[18rem] break-words text-2xl font-bold sm:max-w-none sm:text-3xl">{t.primeCountingTitle}</h1>
        </div>
        <button
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          className="touch-target flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          <Languages className="w-4 h-4" />
          {t.language}
        </button>
      </div>

      <p className="text-gray-600">{t.primeCountingDescription}</p>

      <div ref={frameRef} className="bg-white rounded-lg shadow-lg p-4">
        <ResponsiveVisualFrame
          label={lang === 'zh' ? '素数计数图表' : 'Prime counting chart'}
          minWidth={CHART_MIN_WIDTH}
        >
          <canvas ref={canvasRef} className="block max-w-none" />
        </ResponsiveVisualFrame>
      </div>

      <Links lang={lang} />
    </div>
  );
}
