
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";

interface CaseProgressExplanationProps {
  progress: number;
}

export const CaseProgressExplanation = ({ progress }: CaseProgressExplanationProps) => {
  const getProgressExplanation = (progress: number) => {
    if (progress < 25) {
      return "Case is in the initial stages. Key documents are being collected and initial assessment is underway. Client has recently engaged with the process.";
    } else if (progress < 50) {
      return "Case is in early development. Basic documentation has been collected, but several key items are still pending. Initial assessments have been completed and a preliminary plan is being formed.";
    } else if (progress < 75) {
      return "Case is in mid-stage processing. Most required documentation has been received and verified. Action plans have been established and implementation is in progress.";
    } else if (progress < 100) {
      return "Case is in late-stage processing. All critical documentation has been received and processed. Final reviews are being conducted before completion.";
    } else {
      return "Case has been completed successfully. All required documentation has been processed, all tasks completed, and all necessary actions taken.";
    }
  };

  return (
    <Collapsible className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Progress Details</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
            <AlertCircle className="h-4 w-4" />
            <span className="sr-only">Toggle explanation</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md bg-muted p-3">
          <p className="text-sm">{getProgressExplanation(progress)}</p>
          
          <div className="mt-3 space-y-2">
            <h5 className="text-xs font-semibold">Key milestones:</h5>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className={`h-3 w-3 ${progress >= 25 ? 'text-green-500' : 'text-gray-300'}`} />
                <span className="text-xs">Initial documentation (25%)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`h-3 w-3 ${progress >= 50 ? 'text-green-500' : 'text-gray-300'}`} />
                <span className="text-xs">Assessment completion (50%)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`h-3 w-3 ${progress >= 75 ? 'text-green-500' : 'text-gray-300'}`} />
                <span className="text-xs">Plan implementation (75%)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`h-3 w-3 ${progress >= 100 ? 'text-green-500' : 'text-gray-300'}`} />
                <span className="text-xs">Case completion (100%)</span>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
