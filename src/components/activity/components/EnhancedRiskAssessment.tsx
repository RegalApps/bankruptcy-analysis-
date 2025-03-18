
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Zap,
  Lightbulb,
  BarChart3,
  DollarSign,
  CheckCircle
} from "lucide-react";
import { AdvancedRiskMetrics } from "../hooks/predictiveData/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface EnhancedRiskAssessmentProps {
  riskMetrics: AdvancedRiskMetrics | null;
  isLoading: boolean;
}

export const EnhancedRiskAssessment = ({
  riskMetrics,
  isLoading
}: EnhancedRiskAssessmentProps) => {
  if (!riskMetrics) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            <p>No risk assessment data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-500';
      case 'medium':
        return 'bg-amber-500';
      case 'high':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-xl">
            <ShieldCheck className="h-5 w-5" />
            Enhanced Risk Assessment & Opportunities
          </CardTitle>
          <Badge className={`${getRiskColor(riskMetrics.riskLevel)} text-white px-3 py-1`}>
            {riskMetrics.riskLevel.charAt(0).toUpperCase() + riskMetrics.riskLevel.slice(1)} Risk
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Overall Risk Score */}
          <div>
            <h3 className="text-sm font-medium mb-1">Overall Risk Score</h3>
            <div className="flex items-center mb-1">
              <div className="w-full bg-muted rounded-full h-3 mr-2">
                <div
                  className={`h-3 rounded-full ${getRiskColor(riskMetrics.riskLevel)}`}
                  style={{ width: `${riskMetrics.overallRiskScore}%` }}
                ></div>
              </div>
              <span className={`text-lg font-bold ${getScoreColor(riskMetrics.overallRiskScore)}`}>
                {riskMetrics.overallRiskScore}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {riskMetrics.primaryRiskFactor}
            </p>
          </div>

          {/* Risk Breakdown */}
          <div>
            <h3 className="text-sm font-medium mb-2">Risk Factors Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 mb-3">
              <div className="bg-muted rounded p-2">
                <p className="text-xs mb-1">Credit Utilization</p>
                <Progress value={riskMetrics.detailedRiskScores.creditUtilization} className="h-1.5 mb-1" />
                <p className={`text-right text-xs ${getScoreColor(riskMetrics.detailedRiskScores.creditUtilization)}`}>
                  {riskMetrics.detailedRiskScores.creditUtilization}
                </p>
              </div>
              <div className="bg-muted rounded p-2">
                <p className="text-xs mb-1">Debt-to-Income</p>
                <Progress value={riskMetrics.detailedRiskScores.debtToIncome} className="h-1.5 mb-1" />
                <p className={`text-right text-xs ${getScoreColor(riskMetrics.detailedRiskScores.debtToIncome)}`}>
                  {riskMetrics.detailedRiskScores.debtToIncome}
                </p>
              </div>
              <div className="bg-muted rounded p-2">
                <p className="text-xs mb-1">Emergency Fund</p>
                <Progress value={riskMetrics.detailedRiskScores.emergencyFund} className="h-1.5 mb-1" />
                <p className={`text-right text-xs ${getScoreColor(riskMetrics.detailedRiskScores.emergencyFund)}`}>
                  {riskMetrics.detailedRiskScores.emergencyFund}
                </p>
              </div>
              <div className="bg-muted rounded p-2">
                <p className="text-xs mb-1">Income Stability</p>
                <Progress value={riskMetrics.detailedRiskScores.incomeStability} className="h-1.5 mb-1" />
                <p className={`text-right text-xs ${getScoreColor(riskMetrics.detailedRiskScores.incomeStability)}`}>
                  {riskMetrics.detailedRiskScores.incomeStability}
                </p>
              </div>
              <div className="bg-muted rounded p-2">
                <p className="text-xs mb-1">Expense Volatility</p>
                <Progress value={riskMetrics.detailedRiskScores.expenseVolatility} className="h-1.5 mb-1" />
                <p className={`text-right text-xs ${getScoreColor(riskMetrics.detailedRiskScores.expenseVolatility)}`}>
                  {riskMetrics.detailedRiskScores.expenseVolatility}
                </p>
              </div>
            </div>
          </div>

          {/* Scenario Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-3 bg-green-50">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                <h3 className="text-sm font-medium text-green-700">Best Case Scenario</h3>
              </div>
              <ul className="space-y-1 text-xs text-green-800">
                <li className="flex justify-between">
                  <span>Surplus Increase:</span>
                  <span className="font-medium">{riskMetrics.scenarioAnalysis.bestCase.surplusIncrease}</span>
                </li>
                <li className="flex justify-between">
                  <span>Debt Reduction:</span>
                  <span className="font-medium">{riskMetrics.scenarioAnalysis.bestCase.debtReduction}</span>
                </li>
                <li className="flex justify-between">
                  <span>Time Frame:</span>
                  <span className="font-medium">{riskMetrics.scenarioAnalysis.bestCase.timeFrame}</span>
                </li>
              </ul>
            </div>
            <div className="border rounded-md p-3 bg-red-50">
              <div className="flex items-center mb-2">
                <TrendingDown className="h-4 w-4 text-red-600 mr-2" />
                <h3 className="text-sm font-medium text-red-700">Worst Case Scenario</h3>
              </div>
              <ul className="space-y-1 text-xs text-red-800">
                <li className="flex justify-between">
                  <span>Surplus Decrease:</span>
                  <span className="font-medium">{riskMetrics.scenarioAnalysis.worstCase.surplusDecrease}</span>
                </li>
                <li className="flex justify-between">
                  <span>Debt Increase:</span>
                  <span className="font-medium">{riskMetrics.scenarioAnalysis.worstCase.debtIncrease}</span>
                </li>
                <li className="flex justify-between">
                  <span>Recovery Time:</span>
                  <span className="font-medium">{riskMetrics.scenarioAnalysis.worstCase.recoveryTime}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Financial Opportunities */}
          <div>
            <h3 className="text-base font-medium mb-3 flex items-center">
              <Lightbulb className="h-4 w-4 text-amber-500 mr-2" />
              Financial Opportunities
            </h3>
            <div className="space-y-3">
              {riskMetrics.opportunities.map((opportunity, index) => (
                <Alert key={index} className={opportunity.type === 'saving' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}>
                  <div className="flex">
                    {opportunity.type === 'saving' ? (
                      <DollarSign className="h-4 w-4 text-blue-600 mr-2" />
                    ) : (
                      <BarChart3 className="h-4 w-4 text-green-600 mr-2" />
                    )}
                    <div>
                      <AlertTitle className={`text-sm font-medium ${opportunity.type === 'saving' ? 'text-blue-800' : 'text-green-800'}`}>
                        {opportunity.title}
                      </AlertTitle>
                      <AlertDescription className={`text-xs ${opportunity.type === 'saving' ? 'text-blue-700' : 'text-green-700'}`}>
                        {opportunity.description}
                      </AlertDescription>
                      <div className="flex justify-between mt-1 text-xs">
                        <span className="font-medium">
                          {opportunity.potentialSavings || opportunity.potentialGains}
                        </span>
                        <span>
                          Confidence: {opportunity.confidence}
                        </span>
                      </div>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </div>

          {/* Improvement Suggestions */}
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <Zap className="h-4 w-4 text-purple-500 mr-2" />
              Improvement Suggestions
            </h3>
            <ul className="space-y-1 pl-6 list-disc text-sm">
              {riskMetrics.improvementSuggestions.map((suggestion, index) => (
                <li key={index} className="text-muted-foreground">
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
