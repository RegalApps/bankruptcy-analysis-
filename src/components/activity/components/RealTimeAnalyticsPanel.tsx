
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, TrendingUp, TrendingDown, DollarSign, BarChart, AlertCircle } from "lucide-react";
import { IncomeExpenseData } from "../types";

interface RealTimeAnalyticsPanelProps {
  formData: IncomeExpenseData;
}

export const RealTimeAnalyticsPanel = ({ formData }: RealTimeAnalyticsPanelProps) => {
  // Calculate financial metrics
  const totalIncome = parseFloat(formData.total_monthly_income || "0") + 
                     parseFloat(formData.spouse_total_monthly_income || "0");
  
  const totalExpenses = parseFloat(formData.total_essential_expenses || "0") + 
                       parseFloat(formData.total_discretionary_expenses || "0") + 
                       parseFloat(formData.total_savings || "0") + 
                       parseFloat(formData.total_insurance || "0");
  
  const surplusDeficit = totalIncome - totalExpenses;
  const surplusDeficitPercent = totalIncome > 0 ? (surplusDeficit / totalIncome) * 100 : 0;
  
  // Calculate debt ratio
  const debtPayments = parseFloat(formData.debt_repayments || "0");
  const debtRatio = totalIncome > 0 ? (debtPayments / totalIncome) * 100 : 0;
  
  // Determine risk level
  const getRiskLevel = () => {
    if (surplusDeficit < 0) return "High";
    if (surplusDeficitPercent < 10) return "Medium";
    if (debtRatio > 36) return "High";
    if (debtRatio > 28) return "Medium";
    return "Low";
  };
  
  const riskLevel = getRiskLevel();
  
  // Identify high risk categories
  const getHighRiskCategories = () => {
    const risks = [];
    
    // Check housing costs (should be under 35% of income)
    const housingCost = parseFloat(formData.mortgage_rent || "0");
    if (totalIncome > 0 && (housingCost / totalIncome) > 0.35) {
      risks.push({
        category: "Housing",
        description: "Housing costs exceed 35% of income",
        value: `${((housingCost / totalIncome) * 100).toFixed(1)}%`
      });
    }
    
    // Check debt payments (should be under 20% of income)
    if (totalIncome > 0 && (debtPayments / totalIncome) > 0.2) {
      risks.push({
        category: "Debt",
        description: "Debt payments exceed 20% of income",
        value: `${debtRatio.toFixed(1)}%`
      });
    }
    
    // Check discretionary vs essential ratio
    const discretionaryTotal = parseFloat(formData.total_discretionary_expenses || "0");
    const essentialTotal = parseFloat(formData.total_essential_expenses || "0");
    if (essentialTotal > 0 && discretionaryTotal > (essentialTotal * 0.4)) {
      risks.push({
        category: "Discretionary",
        description: "High discretionary spending relative to essentials",
        value: `${((discretionaryTotal / essentialTotal) * 100).toFixed(1)}%`
      });
    }
    
    return risks;
  };
  
  const highRiskCategories = getHighRiskCategories();
  
  // Get suitable repayment options based on debt ratio
  const getRepaymentOptions = () => {
    if (debtRatio > 40) {
      return ["Debt consolidation", "Consumer proposal assessment"];
    } else if (debtRatio > 30) {
      return ["Debt management plan", "Refinancing"];
    } else if (debtRatio > 20) {
      return ["Budget adjustment", "Snowball debt reduction method"];
    } else {
      return ["Accelerated payment strategy", "Extra payment towards high-interest debt"];
    }
  };
  
  const repaymentOptions = getRepaymentOptions();
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart className="h-5 w-5 text-primary" />
          Real-Time Financial Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Surplus/Deficit Card */}
          <div className="bg-muted rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Surplus/Deficit</h3>
              {surplusDeficit >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <p className={`text-2xl font-bold ${surplusDeficit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${Math.abs(surplusDeficit).toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">
              {surplusDeficit >= 0
                ? `${surplusDeficitPercent.toFixed(1)}% of income available after expenses`
                : `${Math.abs(surplusDeficitPercent).toFixed(1)}% shortfall each month`}
            </p>
          </div>
          
          {/* Debt Ratio Card */}
          <div className="bg-muted rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Debt-to-Income Ratio</h3>
              <DollarSign className={`h-4 w-4 ${debtRatio > 36 ? 'text-red-500' : debtRatio > 28 ? 'text-yellow-500' : 'text-green-500'}`} />
            </div>
            <p className="text-2xl font-bold">{debtRatio.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">
              {debtRatio <= 28 ? 'Healthy debt level' : 
               debtRatio <= 36 ? 'Moderate debt level' : 
               'High debt level - attention needed'}
            </p>
          </div>
          
          {/* Risk Level Card */}
          <div className="bg-muted rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Risk Assessment</h3>
              <AlertCircle className={`h-4 w-4 ${
                riskLevel === 'High' ? 'text-red-500' : 
                riskLevel === 'Medium' ? 'text-yellow-500' : 
                'text-green-500'
              }`} />
            </div>
            <p className={`text-2xl font-bold ${
              riskLevel === 'High' ? 'text-red-500' : 
              riskLevel === 'Medium' ? 'text-yellow-500' : 
              'text-green-500'
            }`}>
              {riskLevel} Risk
            </p>
            <p className="text-xs text-muted-foreground">
              Based on surplus, debt ratio and spending patterns
            </p>
          </div>
        </div>
        
        {/* Risk Flags Section */}
        {highRiskCategories.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <h3 className="text-sm font-medium text-red-700">Risk Flags</h3>
            </div>
            <ul className="space-y-2">
              {highRiskCategories.map((risk, index) => (
                <li key={index} className="flex justify-between items-center text-sm">
                  <span className="text-red-700">🛑 {risk.description}</span>
                  <span className="font-medium text-red-700">{risk.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Debt Repayment Options */}
        {debtRatio > 0 && (
          <div className="bg-muted rounded-lg p-3">
            <h3 className="text-sm font-medium mb-2">Suggested Repayment Options</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {repaymentOptions.map((option, index) => (
                <li key={index} className="text-sm flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-primary inline-block"></span>
                  {option}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
