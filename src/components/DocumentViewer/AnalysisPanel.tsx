
import { FileText, AlertTriangle, CheckCircle } from "lucide-react";
import { DocumentDetails, Risk } from "./types";
import { DeadlineManager } from "./DeadlineManager";

interface AnalysisPanelProps {
  document: DocumentDetails;
  onDeadlineUpdated: () => void;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ document, onDeadlineUpdated }) => {
  const analysisContent = document.analysis?.[0]?.content;
  const extractedInfo = analysisContent?.extracted_info;
  const risks = analysisContent?.risks || [];

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
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="p-2 rounded-md bg-primary/10">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{document.title}</h2>
          <p className="text-sm text-muted-foreground">{document.type}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-md bg-muted">
          <h3 className="font-medium mb-2">Document Details</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Client Name:</span>
              <p>{extractedInfo?.clientName || 'Not extracted'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Trustee Name:</span>
              <p>{extractedInfo?.trusteeName || 'Not extracted'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Date Signed:</span>
              <p>{extractedInfo?.dateSigned || 'Not extracted'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Form Number:</span>
              <p>{extractedInfo?.formNumber || 'Not extracted'}</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-md bg-muted">
          <h3 className="font-medium mb-2">Risk Assessment</h3>
          <div className="space-y-2">
            {risks.length > 0 ? (
              risks.map((risk: Risk, index: number) => (
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

        <DeadlineManager 
          document={document}
          onDeadlineUpdated={onDeadlineUpdated}
        />
      </div>
    </div>
  );
};
