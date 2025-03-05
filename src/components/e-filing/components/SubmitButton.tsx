
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle } from "lucide-react";

interface SubmitButtonProps {
  isAnalyzing: boolean;
  overallStatus: 'pending' | 'failed' | 'passed';
  onValidationComplete: (isValid: boolean) => void;
}

export const SubmitButton = ({ 
  isAnalyzing, 
  overallStatus, 
  onValidationComplete 
}: SubmitButtonProps) => {
  return (
    <Button 
      className="w-full mt-6"
      onClick={() => onValidationComplete(overallStatus === 'passed')}
      disabled={isAnalyzing || overallStatus === 'failed'}
    >
      {isAnalyzing ? (
        <>Analyzing Document...</>
      ) : overallStatus === 'passed' ? (
        <>
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Confirm Document Review
        </>
      ) : (
        <>
          <AlertTriangle className="h-4 w-4 mr-2" />
          Review Required Issues
        </>
      )}
    </Button>
  );
};
