
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

interface Risk {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  regulation?: string | null;
}

interface RiskAssessmentProps {
  risks?: Risk[];
}

export const RiskAssessment: React.FC<RiskAssessmentProps> = ({ risks }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'high':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-green-50';
      case 'medium':
        return 'bg-yellow-50';
      case 'high':
        return 'bg-red-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="p-4 rounded-md bg-muted">
      <h3 className="font-medium mb-2">Risk Assessment</h3>
      <div className="space-y-3">
        {risks ? (
          risks.map((risk, index) => (
            <div 
              key={index} 
              className={`flex items-start space-x-2 text-sm p-3 rounded-md ${getSeverityBg(risk.severity)}`}
            >
              {risk.severity === 'high' ? (
                <AlertTriangle className={`h-5 w-5 ${getSeverityColor(risk.severity)} mt-0.5 flex-shrink-0`} />
              ) : (
                <CheckCircle className={`h-5 w-5 ${getSeverityColor(risk.severity)} mt-0.5 flex-shrink-0`} />
              )}
              <div className="flex-1">
                <p className="font-medium">{risk.type}</p>
                <p className="text-muted-foreground text-xs mt-1">{risk.description}</p>
                {risk.regulation && (
                  <div className="mt-2 flex items-center text-xs text-muted-foreground">
                    <Info className="h-3 w-3 mr-1" />
                    <span>Ref: {risk.regulation}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No risks identified</p>
        )}
      </div>
    </div>
  );
};
