
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Flame, TrendingDown, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalysisAlertsProps {
  riskLevel: string;
  seasonalityScore: string | null;
}

export const AnalysisAlerts: React.FC<AnalysisAlertsProps> = ({
  riskLevel,
  seasonalityScore
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Risk & Opportunity Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Risk Level Alert */}
          {riskLevel === "High" && (
            <Alert variant="destructive">
              <Flame className="h-4 w-4" />
              <AlertTitle>High Financial Risk Detected</AlertTitle>
              <AlertDescription>
                Your current surplus income is negative or critically low. Immediate action is 
                recommended to reduce expenses or increase income to improve financial stability.
              </AlertDescription>
            </Alert>
          )}
          
          {riskLevel === "Medium" && (
            <Alert variant="default" className="bg-amber-50 border-amber-200 text-amber-800">
              <TrendingDown className="h-4 w-4" />
              <AlertTitle>Medium Financial Risk</AlertTitle>
              <AlertDescription>
                Your surplus income is below recommended levels. Consider reviewing non-essential 
                expenses and exploring ways to increase monthly income.
              </AlertDescription>
            </Alert>
          )}
          
          {riskLevel === "Low" && (
            <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
              <TrendingUp className="h-4 w-4" />
              <AlertTitle>Healthy Financial Status</AlertTitle>
              <AlertDescription>
                Your current surplus income is at a healthy level. Consider directing additional 
                funds toward savings or debt reduction to further improve financial security.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Seasonality Alert */}
          {seasonalityScore && (
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertTitle>Seasonal Pattern Detection</AlertTitle>
              <AlertDescription>
                Our analysis has detected a seasonality score of {seasonalityScore} in your financial patterns.
                {parseFloat(seasonalityScore) > 0.7 ? (
                  " Strong seasonal variations suggest you should prepare for predictable financial changes throughout the year."
                ) : parseFloat(seasonalityScore) > 0.4 ? (
                  " Moderate seasonal variations are present in your financial data."
                ) : (
                  " Your financial patterns show minimal seasonal variation."
                )}
              </AlertDescription>
            </Alert>
          )}
          
          {/* General Recommendation */}
          <div className="bg-muted p-4 rounded-md mt-4">
            <h4 className="font-medium mb-2">Recommendations</h4>
            <ul className="space-y-2 text-sm">
              <li>• Aim to maintain a surplus income of at least 20% of your total monthly income</li>
              <li>• Review your expense categories with significant month-to-month variations</li>
              <li>• Update your financial data regularly for more accurate predictions</li>
              {riskLevel === "High" && (
                <li className="text-red-600 font-medium">• Schedule a financial consultation to address immediate concerns</li>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
