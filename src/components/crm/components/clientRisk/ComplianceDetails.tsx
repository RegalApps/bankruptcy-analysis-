
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { getComplianceExplanation } from "./RiskExplanations";

interface ComplianceDetailsProps {
  complianceStatus: 'compliant' | 'issues' | 'critical';
}

export const ComplianceDetails = ({ complianceStatus }: ComplianceDetailsProps) => {
  return (
    <Collapsible className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Compliance Details</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
            <Info className="h-4 w-4" />
            <span className="sr-only">Toggle explanation</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md bg-muted p-3">
          <p className="text-sm">{getComplianceExplanation(complianceStatus)}</p>
          
          {complianceStatus !== 'compliant' && (
            <div className="mt-3 space-y-2">
              <h5 className="text-xs font-semibold">Key compliance areas requiring attention:</h5>
              <ul className="list-disc list-inside text-xs space-y-1">
                {complianceStatus === 'issues' ? (
                  <>
                    <li>Documentation updates needed for recent transactions</li>
                    <li>Minor discrepancies in financial reporting</li>
                    <li>Upcoming regulatory deadlines require preparation</li>
                  </>
                ) : (
                  <>
                    <li>Significant documentation gaps in required filings</li>
                    <li>Potential violations of regulatory requirements</li>
                    <li>Missing signatures on critical documents</li>
                    <li>Discrepancies between declared and actual financial position</li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
