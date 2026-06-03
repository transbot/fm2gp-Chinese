import React, { useEffect, useRef } from 'react';
import { Home, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations } from '../i18n/translations';
import { Links } from './Links';
import { useLanguage } from '../context/LanguageContext';

const formatNumber = (n: number) => {
  if (n >= 1000000) return `${(n/1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n/1000).toFixed(1)}K`;
  return n.toString();
};

export function PrimeCounting() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const sieveOfEratosthenes = (n: number): boolean[] => {
    const isPrime = new Array(n + 1).fill(true);
    isPrime[0] = isPrime[1] = false;
    
    for (let i = 2; i * i <= n; i++) {
      if (isPrime[i]) {
        for (let j = i * i; j <= n; j += i) {
          isPrime[j] = false;
        }
      }
    }
    return isPrime;
  };

  const countPrimes = (isPrime: boolean[], n: number): number => {
    let count = 0;
    for (let i = 2; i <= n; i++) {
      if (isPrime[i]) count++;
    }
    return count;
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 400;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up graph dimensions
    const padding = {
      left: 60,   // Increased left padding for y-axis labels
      right: 40,
      top: 40,
      bottom: 60  // Increased bottom padding for x-axis label
    };
    const graphWidth = canvas.width - padding.left - padding.right;
    const graphHeight = canvas.height - padding.top - padding.bottom;

    // Calculate prime counts
    const maxN = 10000000; // 10^7
    const step = Math.max(1, Math.floor(maxN / 1000)); // Adjust step size for performance
    const isPrime = sieveOfEratosthenes(maxN);
    const points: [number, number][] = [];
    const approxPoints: [number, number][] = [];

    for (let n = 2; n <= maxN; n += step) {
      const count = countPrimes(isPrime, n);
      points.push([n, count]);
      // PNT approximation: n/ln(n)
      approxPoints.push([n, n / Math.log(n)]);
    }

    // Find max values for scaling
    const maxX = maxN;
    const maxY = Math.max(
      ...points.map(p => p[1]),
      ...approxPoints.map(p => p[1])
    );

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, canvas.height - padding.bottom);
    ctx.lineTo(canvas.width - padding.right, canvas.height - padding.bottom);
    ctx.stroke();

    // Add axis labels
    ctx.fillStyle = '#000';
    ctx.font = '14px Arial';
    
    // X-axis label
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('n', padding.left + graphWidth / 2, canvas.height - padding.bottom / 2);
    
    // Y-axis label
    ctx.textAlign = 'center';
    ctx.fillText('Count', padding.left / 2, padding.top + graphHeight / 2);

    // Draw grid and labels
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.font = '12px Arial';
    
    // Y-axis grid and labels
    for (let i = 0; i <= 10; i++) {
      const y = canvas.height - padding.bottom - (i * graphHeight / 10);
      const value = Math.round(maxY * i / 10);
      ctx.fillText(formatNumber(value), padding.left - 5, y);
      
      ctx.beginPath();
      ctx.strokeStyle = '#eee';
      ctx.moveTo(padding.left, y);
      ctx.lineTo(canvas.width - padding.right, y);
      ctx.stroke();
    }

    // X-axis grid and labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    for (let i = 0; i <= 10; i++) {
      const x = padding.left + (i * graphWidth / 10);
      const value = Math.round(maxX * i / 10);
      ctx.fillText(formatNumber(value), x, canvas.height - padding.bottom + 5);
      
      ctx.beginPath();
      ctx.strokeStyle = '#eee';
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, canvas.height - padding.bottom);
      ctx.stroke();
    }

    // Draw π(n)
    ctx.beginPath();
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    points.forEach(([x, y], i) => {
      const canvasX = padding.left + (x / maxX * graphWidth);
      const canvasY = canvas.height - padding.bottom - (y / maxY * graphHeight);
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
      const canvasY = canvas.height - padding.bottom - (y / maxY * graphHeight);
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
  };

  useEffect(() => {
    drawGraph();
  }, []);

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
          <h1 className="text-3xl font-bold">{t.primeCountingTitle}</h1>
        </div>
        <button
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <Languages className="w-4 h-4" />
          {t.language}
        </button>
      </div>

      <p className="text-gray-600">{t.primeCountingDescription}</p>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <canvas 
          ref={canvasRef}
          className="w-full"
          style={{ aspectRatio: '2/1' }}
        />
      </div>

      <Links lang={lang} />
    </div>
  );
}