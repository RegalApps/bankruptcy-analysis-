
import React from "react";
import { cn } from "@/lib/utils";
import { Risk } from "../../types";

interface RiskHighlighterProps {
  risk: Risk;
  isActive: boolean;
  onClick: () => void;
}

export const RiskHighlighter: React.FC<RiskHighlighterProps> = ({
  risk,
  isActive,
  onClick
}) => {
  if (!risk.position) return null;

  const { x, y, width, height } = risk.position;

  const getSeverityColor = (severity: 'high' | 'medium' | 'low' = 'medium') => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/20 border-red-500';
      case 'medium':
        return 'bg-amber-500/20 border-amber-500';
      case 'low':
        return 'bg-blue-500/20 border-blue-500';
      default:
        return 'bg-amber-500/20 border-amber-500';
    }
  };

  return (
    <div
      className={cn(
        'absolute border-2 rounded pointer-events-auto transition-all duration-200',
        getSeverityColor(risk.severity as 'high' | 'medium' | 'low'),
        isActive ? 'z-20 ring-2 ring-offset-2 ring-primary' : 'z-10 opacity-50 hover:opacity-100'
      )}
      style={{
        left: `${x * 100}%`,
        top: `${y * 100}%`,
        width: `${width * 100}%`,
        height: `${height * 100}%`,
      }}
      onClick={onClick}
      title={risk.description || risk.type}
    />
  );
};
