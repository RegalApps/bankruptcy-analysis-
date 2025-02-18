
import { AlertTriangle, CheckCircle } from "lucide-react";

interface Risk {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
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

  return (
    <div className="p-4 rounded-md bg-muted">
      <h3 className="font-medium mb-2">Risk Assessment</h3>
      <div className="space-y-2">
        {risks ? (
          risks.map((risk, index) => (
            <div key={index} className="flex items-start space-x-2 text-sm">
              {risk.severity === 'high' ? (
                <AlertTriangle className={`h-4 w-4 ${getSeverityColor(risk.severity)} mt-0.5`} />
              ) : (
                <CheckCircle className={`h-4 w-4 ${getSeverityColor(risk.severity)} mt-0.5`} />
              )}
              <div>
                <p className="font-medium">{risk.type}</p>
                <p className="text-muted-foreground text-xs">{risk.description}</p>
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
