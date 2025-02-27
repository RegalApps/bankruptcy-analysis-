
import { CheckCircle, ShieldAlert, Timer, BookOpen } from "lucide-react";
import { TooltipProvider } from "../../ui/tooltip";
import { RiskItem } from "./RiskItem";
import { RiskAssessmentProps } from "./types";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const RiskAssessment: React.FC<RiskAssessmentProps> = ({ risks, documentId }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const runBiaComplianceAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-bia-compliance', {
        body: { documentId }
      });

      if (error) throw error;

      if (data && data.complianceRisks) {
        toast({
          title: "BIA Compliance Analysis Complete",
          description: data.summary
        });
      }
    } catch (error) {
      console.error('Error running BIA compliance analysis:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Failed to run BIA compliance analysis"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Risk Assessment</h3>
          </div>
          {risks && risks.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Timer className="h-4 w-4" />
              <span>Updated {new Date().toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <Button
          size="sm"
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={runBiaComplianceAnalysis}
          disabled={isAnalyzing}
        >
          <BookOpen className="h-4 w-4" />
          {isAnalyzing ? "Running BIA Compliance Check..." : "Run BIA Compliance Check"}
        </Button>

        {risks && risks.length > 0 ? (
          <div className="space-y-4">
            {risks.map((risk, index) => (
              <RiskItem key={index} risk={risk} documentId={documentId} />
            ))}
          </div>
        ) : (
          <div className="text-center p-6 border rounded-lg bg-muted/10">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No risks identified in this document</p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
