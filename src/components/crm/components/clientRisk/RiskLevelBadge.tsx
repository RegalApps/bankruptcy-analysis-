
import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";

interface RiskLevelBadgeProps {
  riskLevel: 'low' | 'medium' | 'high';
}

export const RiskLevelBadge = ({ riskLevel }: RiskLevelBadgeProps) => {
  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'text-green-500 bg-green-100';
      case 'medium': return 'text-amber-500 bg-amber-100';
      case 'high': return 'text-red-500 bg-red-100';
    }
  };

  return (
    <div className={`flex items-center px-2 py-1 rounded text-sm font-medium ${getRiskColor(riskLevel)}`}>
      {riskLevel === 'low' && <CheckCircle className="h-4 w-4 mr-1" />}
      {riskLevel === 'medium' && <AlertCircle className="h-4 w-4 mr-1" />}
      {riskLevel === 'high' && <AlertTriangle className="h-4 w-4 mr-1" />}
      {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
    </div>
  );
};
