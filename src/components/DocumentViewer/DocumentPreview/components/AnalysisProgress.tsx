
import { Progress } from "@/components/ui/progress";
import { FileDigit } from "lucide-react";

interface AnalysisProgressProps {
  analysisStep: string;
  progress: number;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  analysisStep,
  progress
}) => {
  return (
    <div className="bg-muted/30 border rounded-lg p-6 my-4 flex flex-col items-center">
      <div className="flex items-center justify-center mb-4">
        <div className="animate-pulse bg-primary/20 p-3 rounded-full">
          <FileDigit className="h-8 w-8 text-primary" />
        </div>
      </div>
      
      <h3 className="text-lg font-medium text-center mb-2">
        Document Analysis in Progress
      </h3>
      
      <p className="text-sm text-muted-foreground text-center mb-4">
        {analysisStep}
      </p>
      
      <div className="w-full max-w-md mb-2">
        <Progress value={progress} className="h-2" />
      </div>
      
      <p className="text-xs text-muted-foreground">
        {progress}% complete
      </p>
    </div>
  );
};
