import React from 'react';

interface ProgressBarProps {
  value: number;
  total: number;
  label?: string;
  showAmount?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  total, 
  label, 
  showAmount = true,
  className = '' 
}) => {
  const percentage = Math.min(100, Math.max(0, (value / total) * 100));

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between mb-1 text-sm font-medium">
        {label && <span className="text-gray-700">{label}</span>}
        {showAmount && <span className="text-gray-500">${value} / ${total}</span>}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};
