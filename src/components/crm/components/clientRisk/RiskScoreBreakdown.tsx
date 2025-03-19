
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { getRiskScoreExplanation } from "./RiskExplanations";

interface RiskScoreBreakdownProps {
  riskScore: number;
}

export const RiskScoreBreakdown = ({ riskScore }: RiskScoreBreakdownProps) => {
  return (
    <Collapsible className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Risk Score Breakdown</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
            <Info className="h-4 w-4" />
            <span className="sr-only">Toggle explanation</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md bg-muted p-3">
          <div className="space-y-2">
            <p className="text-sm">{getRiskScoreExplanation(riskScore)}</p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Financial factors</span>
                <span>{Math.round(riskScore * 0.4)}/40</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Documentation completeness</span>
                <span>{Math.round(riskScore * 0.3)}/30</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Regulatory compliance</span>
                <span>{Math.round(riskScore * 0.3)}/30</span>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
