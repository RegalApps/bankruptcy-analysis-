
import { AlertTriangle, CheckCircle, Info, ArrowRight } from "lucide-react";

interface Risk {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  regulation?: string;
  impact?: string;
  requiredAction?: string;
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
      <h3 className="font-medium mb-4">Risk Assessment</h3>
      <div className="space-y-4">
        {risks ? (
          risks.map((risk, index) => (
            <div 
              key={index} 
              className={`space-y-3 p-4 rounded-lg border ${getSeverityBg(risk.severity)}`}
            >
              <div className="flex items-start space-x-3">
                {risk.severity === 'high' ? (
                  <AlertTriangle className={`h-5 w-5 ${getSeverityColor(risk.severity)} mt-0.5 flex-shrink-0`} />
                ) : (
                  <CheckCircle className={`h-5 w-5 ${getSeverityColor(risk.severity)} mt-0.5 flex-shrink-0`} />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{risk.type}</h4>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getSeverityBg(risk.severity)} ${getSeverityColor(risk.severity)}`}>
                      {risk.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{risk.description}</p>
                </div>
              </div>

              {risk.impact && (
                <div className="pl-8">
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="font-medium text-foreground">Impact:</p>
                    <p>{risk.impact}</p>
                  </div>
                </div>
              )}

              {risk.requiredAction && (
                <div className="pl-8">
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="font-medium text-foreground">Required Action:</p>
                    <div className="flex items-start">
                      <ArrowRight className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0" />
                      <p>{risk.requiredAction}</p>
                    </div>
                  </div>
                </div>
              )}

              {risk.regulation && (
                <div className="pl-8 pt-2 border-t">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Info className="h-3 w-3 mr-1" />
                    <span>Regulation: {risk.regulation}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No risks identified</p>
        )}
      </div>
    </div>
  );
};
