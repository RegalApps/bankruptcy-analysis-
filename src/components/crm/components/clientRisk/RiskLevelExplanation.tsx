
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { getRiskLevelExplanation } from "./RiskExplanations";

interface RiskLevelExplanationProps {
  riskLevel: 'low' | 'medium' | 'high';
}

export const RiskLevelExplanation = ({ riskLevel }: RiskLevelExplanationProps) => {
  return (
    <Collapsible className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Risk Level Explanation</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
            <Info className="h-4 w-4" />
            <span className="sr-only">Toggle explanation</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md bg-muted p-3">
          <p className="text-sm">{getRiskLevelExplanation(riskLevel)}</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
