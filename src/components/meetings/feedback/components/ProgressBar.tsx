
import React from "react";

interface ProgressBarProps {
  percentage: number;
}

export const ProgressBar = ({ percentage }: ProgressBarProps) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6 dark:bg-gray-700">
      <div 
        className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out" 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};
