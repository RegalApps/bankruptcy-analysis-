
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { AnalysisRetryButton } from "./AnalysisRetryButton";

interface StuckAnalysisAlertProps {
  documentId: string;
  minutesStuck: number;
  onRetryComplete?: () => void;
}

export const StuckAnalysisAlert = ({ 
  documentId, 
  minutesStuck,
  onRetryComplete
}: StuckAnalysisAlertProps) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Analysis Process Stuck</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-2">
          Document analysis has been running for {minutesStuck} minutes without completing. 
          This may indicate a problem with the analysis process.
        </p>
        <div className="mt-3">
          <AnalysisRetryButton 
            documentId={documentId} 
            onRetryComplete={onRetryComplete} 
          />
        </div>
      </AlertDescription>
    </Alert>
  );
};
