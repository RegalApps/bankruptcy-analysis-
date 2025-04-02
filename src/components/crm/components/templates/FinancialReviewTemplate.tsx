
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ClientInfoPanel } from "@/components/client/components/ClientInfo/ClientInfoPanel";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { FileSpreadsheet, DollarSign, Home, Car, CreditCard, AlertTriangle, ArrowDownCircle, ArrowUpCircle, LineChart } from "lucide-react";

interface ClientInfo {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  language?: string;
  filing_date?: string;
  status?: string;
}

interface FinancialReviewTemplateProps {
  clientInfo: ClientInfo;
}

export const FinancialReviewTemplate = ({ clientInfo }: FinancialReviewTemplateProps) => {
  const [notes, setNotes] = useState<string>("");
  
  // Mock financial data - in a real app, fetch this from API
  const financialData = {
    income: {
      employment: 4280,
      selfEmployment: 0,
      pension: 0,
      childSupport: 0,
      other: 150,
      total: 4430
    },
    expenses: {
      housing: 1850,
      utilities: 320,
      food: 650,
      transportation: 380,
      insurance: 210,
      medical: 75,
      other: 200,
      total: 3685
    },
    assets: {
      realEstate: {
        value: 0,
        equity: 0
      },
      vehicles: {
        value: 8500,
        equity: 3000
      },
      investments: 6400,
      cashAccounts: 1200,
      other: 800,
      total: 16900
    },
    liabilities: {
      mortgages: 0,
      autoLoans: 5500,
      creditCards: 22800,
      lineOfCredit: 15600,
      studentLoans: 0,
      taxDebt: 3200,
      other: 1800,
      total: 48900
    },
    surplusIncome: 745,
    redFlags: [
      "No housing expenses reported despite address provided",
      "High ratio of credit card debt to income",
      "Recent large cash withdrawals"
    ]
  };
  
  // Calculate debt-to-income ratio
  const debtToIncomeRatio = ((financialData.liabilities.total / (financialData.income.total * 12)) * 100).toFixed(1);
  
  return (
    <div className="space-y-6">
      <ClientInfoPanel clientInfo={clientInfo} readOnly={true} />
      
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Financial Review</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <ArrowDownCircle className="h-4 w-4 text-green-500" />
                  Income Sources
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Employment Income</span>
                    <span className="font-medium">${financialData.income.employment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Self-Employment</span>
                    <span className="font-medium">${financialData.income.selfEmployment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Pension</span>
                    <span className="font-medium">${financialData.income.pension.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Child Support</span>
                    <span className="font-medium">${financialData.income.childSupport.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Other Income</span>
                    <span className="font-medium">${financialData.income.other.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total Monthly Income</span>
                    <span className="text-green-600">${financialData.income.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <ArrowUpCircle className="h-4 w-4 text-red-500" />
                  Expense Summary
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Housing (Rent/Mortgage)</span>
                    <span className="font-medium">${financialData.expenses.housing.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Utilities</span>
                    <span className="font-medium">${financialData.expenses.utilities.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Food</span>
                    <span className="font-medium">${financialData.expenses.food.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Transportation</span>
                    <span className="font-medium">${financialData.expenses.transportation.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Insurance</span>
                    <span className="font-medium">${financialData.expenses.insurance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Medical</span>
                    <span className="font-medium">${financialData.expenses.medical.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Other Expenses</span>
                    <span className="font-medium">${financialData.expenses.other.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total Monthly Expenses</span>
                    <span className="text-red-600">${financialData.expenses.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Home className="h-4 w-4 text-blue-500" />
                  Assets Overview
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Real Estate</span>
                    <span className="font-medium">${financialData.assets.realEstate.value.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Vehicles</span>
                    <span className="font-medium">${financialData.assets.vehicles.value.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Investments</span>
                    <span className="font-medium">${financialData.assets.investments.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cash & Bank Accounts</span>
                    <span className="font-medium">${financialData.assets.cashAccounts.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Other Assets</span>
                    <span className="font-medium">${financialData.assets.other.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total Assets</span>
                    <span className="text-blue-600">${financialData.assets.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-amber-500" />
                  Liabilities Summary
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Mortgages</span>
                    <span className="font-medium">${financialData.liabilities.mortgages.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Auto Loans</span>
                    <span className="font-medium">${financialData.liabilities.autoLoans.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Credit Cards</span>
                    <span className="font-medium">${financialData.liabilities.creditCards.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Line of Credit</span>
                    <span className="font-medium">${financialData.liabilities.lineOfCredit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Student Loans</span>
                    <span className="font-medium">${financialData.liabilities.studentLoans.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax Debt</span>
                    <span className="font-medium">${financialData.liabilities.taxDebt.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Other Debt</span>
                    <span className="font-medium">${financialData.liabilities.other.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total Debt</span>
                    <span className="text-amber-600">${financialData.liabilities.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <LineChart className="h-4 w-4 text-primary" />
                Financial Analysis
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <h5 className="text-sm font-medium">Surplus Income</h5>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-green-600">${financialData.surplusIncome}</div>
                    <p className="text-xs text-muted-foreground">Monthly available after expenses</p>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h5 className="text-sm font-medium">Debt-to-Income Ratio</h5>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-amber-600">{debtToIncomeRatio}%</div>
                    <p className="text-xs text-muted-foreground">Total debt to annual income</p>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h5 className="text-sm font-medium">Insolvency Score</h5>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-red-600">High</div>
                    <p className="text-xs text-muted-foreground">Based on financial indicators</p>
                  </div>
                </Card>
              </div>
              
              <Alert variant="destructive" className="bg-red-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <h5 className="font-medium">Red Flags</h5>
                  <ul className="text-sm list-disc pl-5 mt-1">
                    {financialData.redFlags.map((flag, index) => (
                      <li key={index}>{flag}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Trustee Notes & Recommendations</Label>
              <Textarea 
                id="notes" 
                placeholder="Enter your notes and recommendations here..." 
                className="min-h-[100px]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline">Save Draft</Button>
              <Button>Generate PDF Report</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
