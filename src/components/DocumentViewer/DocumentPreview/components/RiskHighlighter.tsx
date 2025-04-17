
import React from "react";
import { Risk } from "@/components/DocumentViewer/types";
import { cn } from "@/lib/utils";

interface RiskHighlighterProps {
  risk: Risk;
  isActive?: boolean;
  onClick?: () => void;
}

export const RiskHighlighter: React.FC<RiskHighlighterProps> = ({
  risk,
  isActive = false,
  onClick = () => {}
}) => {
  if (!risk.position) return null;
  
  const { x, y, width, height } = risk.position;
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-red-500 bg-red-200/40 hover:bg-red-200/60';
      case 'medium':
        return 'border-amber-500 bg-amber-200/40 hover:bg-amber-200/60';
      case 'low':
        return 'border-green-500 bg-green-200/40 hover:bg-green-200/60';
      default:
        return 'border-blue-500 bg-blue-200/40 hover:bg-blue-200/60';
    }
  };
  
  return (
    <div
      className={cn(
        "absolute border-2 rounded-sm transition-all cursor-pointer",
        getSeverityColor(risk.severity),
        isActive && "ring-2 ring-primary shadow-md"
      )}
      style={{
        top: `${y * 100}%`,
        left: `${x * 100}%`,
        width: `${width * 100}%`,
        height: `${height * 100}%`,
        zIndex: isActive ? 20 : 10,
        transition: "all 0.2s ease"
      }}
      onClick={onClick}
      title={risk.description}
    />
  );
};
