
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, TrendingUp } from "lucide-react";

interface AnalysisAlertsProps {
  riskLevel: string;
  seasonalityScore: string | null;
}

export const AnalysisAlerts = ({ riskLevel, seasonalityScore }: AnalysisAlertsProps) => {
  return (
    <>
      {riskLevel === "High" && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>High Risk Alert</AlertTitle>
          <AlertDescription>
            Current surplus income is below threshold. Immediate review recommended.
          </AlertDescription>
        </Alert>
      )}

      {seasonalityScore && (
        <Card>
          <CardContent className="pt-6">
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertTitle>Seasonality Analysis</AlertTitle>
              <AlertDescription>
                Seasonality Score: {seasonalityScore}
                {Number(seasonalityScore) > 0.7 && " - Strong seasonal pattern detected"}
                {Number(seasonalityScore) > 0.4 && Number(seasonalityScore) <= 0.7 && " - Moderate seasonal pattern detected"}
                {Number(seasonalityScore) <= 0.4 && " - Weak or no seasonal pattern detected"}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </>
  );
};
