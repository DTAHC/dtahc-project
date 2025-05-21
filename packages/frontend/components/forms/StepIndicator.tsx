'use client';

import { memo } from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

const StepIndicator = memo(({ currentStep, totalSteps, steps }: StepIndicatorProps) => {
  return (
    <div className="flex justify-between p-4 bg-gray-100">
      {steps.map((label, index) => (
        <div 
          key={index}
          className={`step ${currentStep >= index + 1 ? 'active' : ''}`}
        >
          <div className={`step-number ${currentStep >= index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
            {index + 1}
          </div>
          <div className="step-label">{label}</div>
        </div>
      ))}

      <style jsx>{`
        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          position: relative;
        }
        
        .step-number {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          font-weight: bold;
        }
        
        .step-label {
          font-size: 14px;
          text-align: center;
        }
        
        .step:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 15px;
          right: -50%;
          width: 100%;
          height: 2px;
          background-color: #e5e7eb;
          z-index: 0;
        }
        
        .step.active:not(:last-child)::after {
          background-color: #2563eb;
        }
      `}</style>
    </div>
  );
});

StepIndicator.displayName = 'StepIndicator';

export default StepIndicator;