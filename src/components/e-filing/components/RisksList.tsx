
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { RiskItem } from "../types";

interface RisksListProps {
  risks: RiskItem[];
}

export const RisksList = ({ risks }: RisksListProps) => {
  if (risks.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Risk Assessment</h3>
      <div className="space-y-4">
        {risks.map((risk, index) => (
          <Alert 
            key={index}
            variant={risk.severity === 'high' ? 'destructive' : 'default'}
          >
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="flex items-center gap-2">
              {risk.type}
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                risk.severity === 'high' 
                  ? 'bg-destructive text-destructive-foreground' 
                  : risk.severity === 'medium'
                  ? 'bg-yellow-500/20 text-yellow-700'
                  : 'bg-green-500/20 text-green-700'
              }`}>
                {risk.severity.toUpperCase()}
              </span>
            </AlertTitle>
            <AlertDescription>
              <p className="mt-2">{risk.description}</p>
              {risk.regulation && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Regulation: {risk.regulation}
                </p>
              )}
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  );
};
