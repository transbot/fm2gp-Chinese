import React, { useState } from 'react';
import { Home, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations } from '../i18n/translations';
import { Links } from './Links';
import { useLanguage } from '../context/LanguageContext';

// 定义无穷大
const INF = Number.MAX_SAFE_INTEGER;

// 初始邻接矩阵
const initialMatrix = [
  [0, 6, INF, 3, INF, INF, INF],
  [INF, 0, INF, INF, 2, 10, INF],
  [7, INF, 0, INF, INF, INF, INF],
  [INF, INF, 5, 0, INF, 4, INF],
  [INF, INF, INF, INF, 0, INF, 3],
  [INF, INF, 6, INF, 7, 0, 8],
  [INF, 9, INF, INF, INF, INF, 0]
];

interface Step {
  power: number;
  matrix: number[][];
  description: string;
}

export function ShortestPath() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isComplete, setIsComplete] = useState(false);
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  // 在热带半环上的矩阵乘法
  const multiplyMatrix = (a: number[][], b: number[][]): number[][] => {
    const n = a.length;
    const result = Array(n).fill(0).map(() => Array(n).fill(INF));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        for (let k = 0; k < n; k++) {
          if (a[i][k] !== INF && b[k][j] !== INF) {
            const sum = a[i][k] + b[k][j];
            result[i][j] = Math.min(result[i][j], sum);
          }
        }
      }
    }

    return result;
  };

  // 计算矩阵幂
  const matrixPower = (matrix: number[][], power: number): number[][] => {
    if (power === 1) return matrix;

    const half = Math.floor(power / 2);
    const halfPower = matrixPower(matrix, half);
    const result = multiplyMatrix(halfPower, halfPower);

    return power % 2 === 1 ? multiplyMatrix(result, matrix) : result;
  };

  const startCalculation = () => {
    const newSteps: Step[] = [{
      power: 1,
      matrix: initialMatrix,
      description: t.initialMatrix
    }];

    setSteps(newSteps);
    setCurrentStep(0);
    setIsComplete(false);
  };

  const nextStep = () => {
    if (currentStep < 0 || isComplete) return;

    const power = steps[currentStep].power;
    if (power >= 6) { // n-1 = 6 for a 7x7 matrix
      setIsComplete(true);
      return;
    }

    const nextPower = power + 1;
    const nextMatrix = matrixPower(initialMatrix, nextPower);

    const newSteps = [...steps, {
      power: nextPower,
      matrix: nextMatrix,
      description: t.powerStep.replace('{0}', nextPower.toString())
    }];

    setSteps(newSteps);
    setCurrentStep(prev => prev + 1);
  };

  const reset = () => {
    setSteps([]);
    setCurrentStep(-1);
    setIsComplete(false);
  };

  const formatValue = (value: number): string => {
    return value === INF ? '∞' : value.toString();
  };

  const getNodeLabel = (index: number): string => {
    return String.fromCharCode(65 + index);
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
          <h1 className="text-3xl font-bold">{t.shortestPathTitle}</h1>
        </div>
        <button
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <Languages className="w-4 h-4" />
          {t.language}
        </button>
      </div>

      <p className="text-gray-600">{t.shortestPathDescription}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">初始有向图</h2>
          <img 
            src="/images/p.147.directed.graph.png" 
            alt="Initial directed graph"
            className="w-full"
          />
        </div>

        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={startCalculation}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              {t.startCalculation}
            </button>
            <button
              onClick={nextStep}
              disabled={currentStep < 0 || isComplete}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.nextPower}
            </button>
            <button
              onClick={reset}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              {t.reset}
            </button>
          </div>

          {steps.length > 0 && currentStep >= 0 && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-bold mb-4">
                  {steps[currentStep].description}
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 bg-gray-50"></th>
                        {initialMatrix.map((_, i) => (
                          <th key={i} className="px-3 py-2 bg-gray-50 font-medium">
                            {getNodeLabel(i)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {steps[currentStep].matrix.map((row, i) => (
                        <tr key={i}>
                          <td className="px-3 py-2 font-medium bg-gray-50">
                            {getNodeLabel(i)}
                          </td>
                          {row.map((value, j) => (
                            <td 
                              key={j}
                              className={`px-3 py-2 text-center ${
                                value !== INF && value !== 0 ? 'font-mono' : ''
                              }`}
                            >
                              {formatValue(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {isComplete && (
                <div className="bg-green-100 p-6 rounded-lg">
                  <p className="text-lg font-semibold text-green-800">
                    {t.calculationComplete}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Links lang={lang} />
    </div>
  );
}