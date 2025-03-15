
import {
  AlertTriangle,
  CheckCircle,
  X,
  Info,
  FileCheck,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  BarChart3
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface RiskCompliancePanelProps {
  clientData: any;
  riskLevel: 'low' | 'medium' | 'high' | null;
}

export const RiskCompliancePanel = ({ clientData, riskLevel }: RiskCompliancePanelProps) => {
  // Calculate financial metrics
  const totalMonthlyIncome = parseFloat(clientData.income.monthly || "0");
  const totalMonthlyExpenses = 
    parseFloat(clientData.expenses.housing || "0") +
    parseFloat(clientData.expenses.utilities || "0") +
    parseFloat(clientData.expenses.transportation || "0") +
    parseFloat(clientData.expenses.food || "0") +
    parseFloat(clientData.expenses.childcare || "0") +
    parseFloat(clientData.expenses.health || "0") +
    parseFloat(clientData.expenses.entertainment || "0") +
    parseFloat(clientData.expenses.debtRepayments || "0");
  
  const disposableIncome = totalMonthlyIncome - totalMonthlyExpenses;
  const disposableIncomePercentage = totalMonthlyIncome > 0 
    ? (disposableIncome / totalMonthlyIncome) * 100 
    : 0;
  
  const totalDebt = 
    parseFloat(clientData.debt.unsecured || "0") + 
    parseFloat(clientData.debt.secured || "0") + 
    parseFloat(clientData.debt.taxDebt || "0");
  
  const debtToIncomeRatio = totalMonthlyIncome > 0 
    ? (totalDebt / (totalMonthlyIncome * 12)) 
    : 0;
  
  // Get compliance issues
  const complianceIssues = clientData.aiAnalysis.complianceIssues || [];
  
  // Get risk color
  const getRiskColor = () => {
    switch(riskLevel) {
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  // Get solution badge color
  const getSolutionBadgeColor = () => {
    const solution = clientData.aiAnalysis.suggestedSolution;
    if (!solution) return "bg-gray-100 text-gray-800";
    
    if (solution.includes("Bankruptcy")) {
      return "bg-red-100 text-red-800";
    } else if (solution.includes("Consumer Proposal")) {
      return "bg-amber-100 text-amber-800";
    } else if (solution.includes("Debt Management")) {
      return "bg-blue-100 text-blue-800";
    } else {
      return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>AI Financial Analysis Results</CardTitle>
            <Badge variant="outline" className={getRiskColor()}>
              {riskLevel === 'high' && <AlertTriangle className="h-3 w-3 mr-1" />}
              {riskLevel === 'medium' && <Info className="h-3 w-3 mr-1" />}
              {riskLevel === 'low' && <CheckCircle className="h-3 w-3 mr-1" />}
              {riskLevel ? `${riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk` : 'Analyzing...'}
            </Badge>
          </div>
          <CardDescription>
            AI-powered analysis of the client's financial situation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalMonthlyIncome.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  {clientData.income.frequency || 'Monthly'} income
                </p>
              </CardContent>
            </Card>
            
            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalMonthlyExpenses.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  All monthly expenses
                </p>
              </CardContent>
            </Card>
            
            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
                  <BarChart3 className="h-4 w-4 text-amber-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalDebt.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Combined secured & unsecured
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Disposable Income</h3>
              <div className="flex justify-between mb-1">
                <span className="text-sm">${disposableIncome.toFixed(2)} / month</span>
                <span className="text-sm">{disposableIncomePercentage.toFixed(0)}% of income</span>
              </div>
              <Progress 
                value={Math.max(0, Math.min(disposableIncomePercentage, 100))} 
                className={`h-2 ${disposableIncome < 0 ? 'bg-red-200' : ''}`}
              />
              {disposableIncome < 0 && (
                <p className="text-xs text-red-500 mt-1">
                  Expenses exceed income by ${Math.abs(disposableIncome).toFixed(2)}/month
                </p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Debt-to-Income Ratio</h3>
              <div className="flex justify-between mb-1">
                <span className="text-sm">{(debtToIncomeRatio * 100).toFixed(0)}%</span>
                <span className="text-sm">
                  {debtToIncomeRatio < 0.43 ? 'Acceptable' : 'Concerning'}
                </span>
              </div>
              <Progress 
                value={Math.min(debtToIncomeRatio * 100, 100)} 
                className={`h-2 ${debtToIncomeRatio > 0.43 ? 'bg-red-200' : ''}`}
              />
              {debtToIncomeRatio > 0.43 && (
                <p className="text-xs text-red-500 mt-1">
                  Debt ratio exceeds recommended maximum (43%)
                </p>
              )}
            </div>
          </div>
          
          {/* Recommended Solution */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-sm font-medium">Recommended Solution</h3>
              <Badge variant="outline" className={getSolutionBadgeColor()}>
                {clientData.aiAnalysis.suggestedSolution || "Pending Analysis"}
              </Badge>
            </div>
            <Alert>
              <FileCheck className="h-4 w-4" />
              <AlertTitle>AI Recommendation</AlertTitle>
              <AlertDescription>
                {clientData.aiAnalysis.suggestedSolution === "Bankruptcy" && (
                  "Based on the client's financial situation, bankruptcy appears to be the most suitable option due to high debt levels and limited disposable income."
                )}
                {clientData.aiAnalysis.suggestedSolution === "Consumer Proposal" && (
                  "The client may benefit from a Consumer Proposal, which would allow them to repay a portion of their debt while maintaining assets and rebuilding credit."
                )}
                {clientData.aiAnalysis.suggestedSolution === "Debt Management Plan" && (
                  "With manageable debt levels and sufficient disposable income, a Debt Management Plan could help the client repay debts without formal insolvency."
                )}
                {clientData.aiAnalysis.suggestedSolution === "Further Assessment Required" && (
                  "Additional financial information and discussion with the client is recommended before determining the most appropriate solution."
                )}
                {!clientData.aiAnalysis.suggestedSolution && (
                  "Please complete the financial analysis to receive an AI recommendation."
                )}
              </AlertDescription>
            </Alert>
          </div>
          
          {/* Compliance Issues */}
          {complianceIssues.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Compliance Issues</h3>
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Action Required</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    {complianceIssues.map((issue: string, index: number) => (
                      <li key={index} className="text-sm">{issue}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Legal Compliance Check</CardTitle>
          <CardDescription>
            Verification of legal requirements for insolvency filing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <div className={`p-1 rounded-full mt-0.5 ${clientData.previousBankruptcy ? 'bg-amber-100' : 'bg-green-100'}`}>
                {clientData.previousBankruptcy ? (
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium">Previous Bankruptcy</h4>
                <p className="text-xs text-muted-foreground">
                  {clientData.previousBankruptcy 
                    ? "Client has previously filed for bankruptcy - additional requirements apply" 
                    : "No previous bankruptcy filings detected"}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <div className={`p-1 rounded-full mt-0.5 ${clientData.sin ? 'bg-green-100' : 'bg-red-100'}`}>
                {clientData.sin ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium">SIN Verification</h4>
                <p className="text-xs text-muted-foreground">
                  {clientData.sin 
                    ? "Social Insurance Number provided for insolvency filing" 
                    : "SIN required for insolvency filing - missing"}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <div className={`p-1 rounded-full mt-0.5 ${
                (clientData.maritalStatus === "married" || clientData.maritalStatus === "common_law") && !clientData.spouse.name 
                  ? 'bg-red-100' 
                  : 'bg-green-100'
              }`}>
                {(clientData.maritalStatus === "married" || clientData.maritalStatus === "common_law") && !clientData.spouse.name ? (
                  <X className="h-4 w-4 text-red-600" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium">Spouse Information</h4>
                <p className="text-xs text-muted-foreground">
                  {(clientData.maritalStatus === "married" || clientData.maritalStatus === "common_law")
                    ? clientData.spouse.name 
                      ? "Spouse information provided as required" 
                      : "Spouse information required but missing"
                    : "Not applicable - client is not married/common-law"
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <div className={`p-1 rounded-full mt-0.5 ${
                clientData.income.monthly ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {clientData.income.monthly ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium">Income Verification</h4>
                <p className="text-xs text-muted-foreground">
                  {clientData.income.monthly
                    ? "Income information provided for means testing" 
                    : "Income details required for insolvency assessment"
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <div className="p-1 rounded-full mt-0.5 bg-blue-100">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Credit Counseling</h4>
                <p className="text-xs text-muted-foreground">
                  Client must complete mandatory credit counseling sessions during the insolvency process
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
