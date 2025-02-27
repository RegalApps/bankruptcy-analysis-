
import React from "react";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface AnalysisProgressProps {
  analysisStep: string;
  progress: number;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  analysisStep,
  progress
}) => {
  return (
    <div className="mt-4 space-y-3">
      <Alert>
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertTitle>Analyzing Document</AlertTitle>
        <AlertDescription>
          {analysisStep}
        </AlertDescription>
      </Alert>
      
      <div className="space-y-2">
        <Progress value={progress} className="h-2 w-full" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Extraction</span>
          <span>Entity Recognition</span>
          <span>Compliance</span>
          <span>Complete</span>
        </div>
      </div>
    </div>
  );
};
