
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

  // Determine form type for specialized display
  const formType = extractedInfo?.type || document.type;
  const isForm31 = formType?.includes('form-31') || formType?.includes('proof-of-claim') || (extractedInfo?.formNumber === '31');
  const isForm47 = formType?.includes('form-47') || formType?.includes('consumer-proposal') || (extractedInfo?.formNumber === '47');

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="p-2 rounded-md bg-primary/10">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{document.title}</h2>
          <p className="text-sm text-muted-foreground">
            {isForm31 ? 'Form 31 - Proof of Claim' : 
             isForm47 ? 'Form 47 - Consumer Proposal' : 
             document.type}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-md bg-muted">
          <h3 className="font-medium mb-2">Document Details</h3>
          <div className="space-y-2 text-sm">
            {/* Generic fields */}
            <div>
              <span className="text-muted-foreground">Client Name:</span>
              <p>{extractedInfo?.clientName || 'Not extracted'}</p>
            </div>

            {/* Form 31 specific fields */}
            {isForm31 && (
              <>
                <div>
                  <span className="text-muted-foreground">Creditor Name:</span>
                  <p>{extractedInfo?.claimantName || extractedInfo?.creditorName || 'Not extracted'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Claim Amount:</span>
                  <p>{extractedInfo?.claimAmount || 'Not extracted'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Claim Type:</span>
                  <p>{extractedInfo?.claimType || 'Not extracted'}</p>
                </div>
              </>
            )}

            {/* Form 47 specific fields */}
            {isForm47 && (
              <>
                <div>
                  <span className="text-muted-foreground">Trustee Name:</span>
                  <p>{extractedInfo?.trusteeName || 'Not extracted'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Administrator:</span>
                  <p>{extractedInfo?.administratorName || extractedInfo?.trusteeName || 'Not extracted'}</p>
                </div>
              </>
            )}

            {/* Common fields for all forms */}
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
                    {risk.solution && (
                      <p className="text-xs mt-1 italic">Solution: {risk.solution}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <p>Analysis in progress or no risks identified yet. This document may need manual review.</p>
              </div>
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
