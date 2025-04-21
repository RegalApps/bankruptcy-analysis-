
import { CheckCircle, AlertTriangle, Info } from "lucide-react";
import { Risk } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiskItem } from "./RiskItem";

interface Form31RiskViewProps {
  risks: Risk[];
  documentId: string;
}

export const Form31RiskView: React.FC<Form31RiskViewProps> = ({ risks, documentId }) => {
  // Count risks by severity
  const criticalCount = risks?.filter(r => r.severity === 'high').length || 0;
  const moderateCount = risks?.filter(r => r.severity === 'medium').length || 0;
  const minorCount = risks?.filter(r => r.severity === 'low').length || 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-3">
        {criticalCount > 0 && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {criticalCount} Critical
          </Badge>
        )}
        {moderateCount > 0 && (
          <Badge variant="default" className="bg-amber-500 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {moderateCount} Moderate
          </Badge>
        )}
        {minorCount > 0 && (
          <Badge variant="outline" className="text-yellow-600 flex items-center gap-1">
            <Info className="h-3 w-3" />
            {minorCount} Minor
          </Badge>
        )}
        {risks?.length === 0 && (
          <Badge variant="outline" className="text-green-600 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Claim Verified
          </Badge>
        )}
      </div>

      {risks.length > 0 ? (
        <div className="space-y-3">
          {risks.map((risk, index) => (
            <RiskItem key={`risk-${index}`} risk={risk} documentId={documentId} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-center space-x-2 mb-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <p className="font-medium">Claim Appears Complete</p>
            </div>
            <p className="text-sm text-center text-muted-foreground">
              This proof of claim appears to be properly completed with all required information.
              No immediate issues were detected in the claim validation process.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
