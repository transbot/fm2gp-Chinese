import React from 'react';
import { translations } from '../i18n/translations';

interface Step {
  powerOfTwo: number;
  value: number;
  isSelected: boolean;
}

interface CalculationDisplayProps {
  steps: Step[];
  result: number | null;
  firstNumber: number;
  secondNumber: number;
  lang: 'en' | 'zh';
}

export function CalculationDisplay({ steps, result, firstNumber, secondNumber, lang }: CalculationDisplayProps) {
  const t = translations[lang];

  const getAdditionFormula = (steps: Step[], firstNumber: number, secondNumber: number, result: number) => {
    const selectedSteps = steps.filter(step => step.isSelected);
    const terms = selectedSteps.map(step => `${step.value}`);
    const formula = `${firstNumber}×${secondNumber}=`;

    // If we have more than 3 terms or any term is longer than 8 digits,
    // format with line breaks for better readability
    const shouldBreak = terms.length > 3 || terms.some(term => term.length > 8);
    
    if (shouldBreak) {
      return (
        <div className="space-y-2">
          <div>{formula}</div>
          <div className="pl-4">
            {terms.map((term, index) => (
              <React.Fragment key={index}>
                {term}
                {index < terms.length - 1 && (
                  <span className="text-gray-500"> +</span>
                )}
                <br />
              </React.Fragment>
            ))}
          </div>
          <div>={result}</div>
        </div>
      );
    }

    // For shorter equations, keep them on one line
    return `${formula}${terms.join('+')}=${result}`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t.steps}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.powers}
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.doubling}
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.selected}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {steps.map((step, index) => (
              <tr key={index} className={step.isSelected ? 'bg-green-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">{step.powerOfTwo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{step.value}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {step.isSelected ? '✓' : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {result !== null && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-bold text-lg mb-2">{t.result}</h3>
          <div className="text-xl font-mono break-words">
            {getAdditionFormula(steps, firstNumber, secondNumber, result)}
          </div>
        </div>
      )}
    </div>
  );
}