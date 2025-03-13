
import { useState, useEffect } from "react";
import { Client, IncomeExpenseData } from "./types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateFormButton } from "./components/CreateFormButton";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MetricsGrid } from "./components/MetricsGrid";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrintButton } from "./form/PrintButton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ActivityDashboardProps {
  selectedClient: Client | null;
}

export const ActivityDashboard = ({ selectedClient }: ActivityDashboardProps) => {
  const [financialData, setFinancialData] = useState<IncomeExpenseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("income");
  const [metrics, setMetrics] = useState<{
    currentSurplus: string;
    surplusPercentage: string;
    monthlyTrend: string;
    riskLevel: string;
  } | null>(null);
  
  // Debounce the financial data changes for auto-save
  const debouncedFinancialData = useDebounce(financialData, 1500);
  
  // Load initial financial data
  useEffect(() => {
    if (selectedClient) {
      setLoading(true);
      
      // Simulate fetching data from API
      setTimeout(() => {
        // Mock data - in a real app, this would come from your Supabase query
        const mockData: IncomeExpenseData = {
          // Client Information
          full_name: selectedClient.name,
          residential_address: "123 Main St, Anytown",
          phone_home: "555-123-4567",
          marital_status: "married",
          employer_name: "ABC Corporation",
          work_phone: "555-987-6543",
          occupation: "Financial Analyst",
          spouse_name: "Jamie Smith",
          household_size: "4",
          submission_date: new Date().toISOString().split('T')[0],
          
          // Income Information
          employment_income: "5500",
          pension_annuities: "1000",
          child_spousal_support: "0",
          self_employment_income: "800",
          government_benefits: "0",
          rental_income: "1200",
          other_income: "300",
          other_income_description: "Freelance consulting",
          total_monthly_income: "8800",
          
          // Spouse Income
          spouse_employment_income: "4200",
          spouse_pension_annuities: "0",
          spouse_child_spousal_support: "0",
          spouse_self_employment_income: "0",
          spouse_government_benefits: "0",
          spouse_rental_income: "0",
          spouse_other_income: "500",
          spouse_total_monthly_income: "4700",
          
          // Essential Expenses
          mortgage_rent: "2200",
          utilities: "450",
          groceries: "800",
          child_care: "600",
          medical_dental: "200",
          transportation: "350",
          education_tuition: "300",
          debt_repayments: "500",
          misc_essential_expenses: "200",
          total_essential_expenses: "5600",
          
          // Discretionary Expenses
          dining_out: "400",
          alcohol: "150",
          tobacco: "0",
          entertainment: "200",
          gym_memberships: "100",
          gifts_donations: "150",
          subscriptions: "80",
          clothing: "300",
          pet_care: "100",
          leisure_travel: "400",
          other_discretionary: "120",
          other_discretionary_description: "Hobbies",
          total_discretionary_expenses: "2000",
          
          // Savings
          emergency_savings: "500",
          retirement_savings: "800",
          education_savings: "300",
          investment_contributions: "400",
          total_savings: "2000",
          
          // Insurance
          vehicle_insurance: "180",
          health_insurance: "220",
          life_insurance: "150",
          home_insurance: "120",
          other_insurance: "0",
          other_insurance_description: "",
          total_insurance: "670",
          
          // Frequency settings
          income_frequency: "monthly",
          expense_frequency: "monthly",
          notes: "",
        };

        // Calculate metrics
        const totalIncome = parseFloat(mockData.total_monthly_income) + parseFloat(mockData.spouse_total_monthly_income || "0");
        const totalExpenses = 
          parseFloat(mockData.total_essential_expenses) + 
          parseFloat(mockData.total_discretionary_expenses) + 
          parseFloat(mockData.total_savings) + 
          parseFloat(mockData.total_insurance);
        const surplusIncome = totalIncome - totalExpenses;
        const surplusPercentage = (surplusIncome / totalIncome) * 100;
        
        setMetrics({
          currentSurplus: surplusIncome.toFixed(2),
          surplusPercentage: surplusPercentage.toFixed(1),
          monthlyTrend: "320.00",
          riskLevel: surplusPercentage > 20 ? "Low" : surplusPercentage > 10 ? "Medium" : "High"
        });
        
        setFinancialData(mockData);
        setLoading(false);
      }, 1000);
    }
  }, [selectedClient]);
  
  // Auto-save effect when data changes
  useEffect(() => {
    if (debouncedFinancialData && !loading) {
      saveFinancialData();
    }
  }, [debouncedFinancialData]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (financialData) {
      setFinancialData(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };
  
  // Save financial data
  const saveFinancialData = async () => {
    if (!financialData || !selectedClient) return;
    
    setSaving(true);
    
    try {
      // Simulate API call to save data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update metrics
      if (financialData) {
        const totalIncome = parseFloat(financialData.total_monthly_income) + parseFloat(financialData.spouse_total_monthly_income || "0");
        const totalExpenses = 
          parseFloat(financialData.total_essential_expenses) + 
          parseFloat(financialData.total_discretionary_expenses) + 
          parseFloat(financialData.total_savings) + 
          parseFloat(financialData.total_insurance);
        const surplusIncome = totalIncome - totalExpenses;
        const surplusPercentage = (surplusIncome / totalIncome) * 100;
        
        setMetrics({
          currentSurplus: surplusIncome.toFixed(2),
          surplusPercentage: surplusPercentage.toFixed(1),
          monthlyTrend: "320.00", // This would be calculated with historical data
          riskLevel: surplusPercentage > 20 ? "Low" : surplusPercentage > 10 ? "Medium" : "High"
        });
      }
      
      toast.success("Financial data saved automatically");
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };
  
  // Manually trigger save
  const handleManualSave = () => {
    if (financialData) {
      saveFinancialData();
    }
  };

  if (!selectedClient) {
    return (
      <Card className="py-12">
        <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
          <h3 className="text-lg font-medium">No Client Selected</h3>
          <p className="text-muted-foreground max-w-md">
            Please select a client above to view their financial dashboard.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{selectedClient.name}'s Financial Dashboard</h2>
        
        <div className="flex items-center space-x-2">
          {saving && (
            <span className="text-muted-foreground text-sm flex items-center">
              <Save className="animate-pulse h-4 w-4 mr-1" />
              Auto-saving...
            </span>
          )}
          
          <Button 
            variant="outline" 
            onClick={handleManualSave}
            disabled={saving || loading}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          
          {financialData && (
            <PrintButton formData={financialData} />
          )}
          
          <CreateFormButton clientId={selectedClient.id} />
        </div>
      </div>
      
      {/* Metrics Overview */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-[100px] w-full rounded-lg" />
          <Skeleton className="h-[100px] w-full rounded-lg" />
          <Skeleton className="h-[100px] w-full rounded-lg" />
          <Skeleton className="h-[100px] w-full rounded-lg" />
        </div>
      ) : (
        <MetricsGrid metrics={metrics} />
      )}
      
      {/* Auto-save indicator */}
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          All changes are automatically saved after you finish typing. You can also click the Save button anytime.
        </AlertDescription>
      </Alert>
      
      {/* Financial Data Sections */}
      {loading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-full max-w-md" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      ) : financialData ? (
        <Card>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
            <CardDescription>
              Edit any field below to update the financial information. Changes save automatically.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="essential">Essential Expenses</TabsTrigger>
                <TabsTrigger value="discretionary">Discretionary Expenses</TabsTrigger>
                <TabsTrigger value="savings">Savings & Insurance</TabsTrigger>
              </TabsList>
              
              {/* Income Tab */}
              <TabsContent value="income" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Income Source</TableHead>
                      <TableHead>Debtor ($)</TableHead>
                      <TableHead>Spouse/Partner ($)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Employment Income</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          name="employment_income"
                          value={financialData.employment_income}
                          onChange={handleInputChange}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          name="spouse_employment_income"
                          value={financialData.spouse_employment_income}
                          onChange={handleInputChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Pension/Annuities</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          name="pension_annuities"
                          value={financialData.pension_annuities}
                          onChange={handleInputChange}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          name="spouse_pension_annuities"
                          value={financialData.spouse_pension_annuities}
                          onChange={handleInputChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Self-Employment Income</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          name="self_employment_income"
                          value={financialData.self_employment_income}
                          onChange={handleInputChange}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          name="spouse_self_employment_income"
                          value={financialData.spouse_self_employment_income}
                          onChange={handleInputChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Other Income</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          name="other_income"
                          value={financialData.other_income}
                          onChange={handleInputChange}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          name="spouse_other_income"
                          value={financialData.spouse_other_income}
                          onChange={handleInputChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow className="font-bold">
                      <TableCell>Total Monthly Income</TableCell>
                      <TableCell>${financialData.total_monthly_income}</TableCell>
                      <TableCell>${financialData.spouse_total_monthly_income}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>
              
              {/* Essential Expenses Tab */}
              <TabsContent value="essential" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Expense Category</TableHead>
                      <TableHead>Amount ($)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Mortgage/Rent</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          name="mortgage_rent"
                          value={financialData.mortgage_rent}
                          onChange={handleInputChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Utilities</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          name="utilities"
                          value={financialData.utilities}
                          onChange={handleInputChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Groceries</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          name="groceries"
                          value={financialData.groceries}
                          onChange={handleInputChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Transportation</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          name="transportation"
                          value={financialData.transportation}
                          onChange={handleInputChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Debt Repayments</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          name="debt_repayments"
                          value={financialData.debt_repayments}
                          onChange={handleInputChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow className="font-bold">
                      <TableCell>Total Essential Expenses</TableCell>
                      <TableCell>${financialData.total_essential_expenses}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>
              
              {/* Discretionary Expenses Tab */}
              <TabsContent value="discretionary" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Expense Category</TableHead>
                      <TableHead>Amount ($)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Dining Out</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          name="dining_out"
                          value={financialData.dining_out}
                          onChange={handleInputChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Entertainment</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          name="entertainment"
                          value={financialData.entertainment}
                          onChange={handleInputChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Subscriptions</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          name="subscriptions"
                          value={financialData.subscriptions}
                          onChange={handleInputChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Clothing</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          name="clothing"
                          value={financialData.clothing}
                          onChange={handleInputChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow className="font-bold">
                      <TableCell>Total Discretionary Expenses</TableCell>
                      <TableCell>${financialData.total_discretionary_expenses}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>
              
              {/* Savings & Insurance Tab */}
              <TabsContent value="savings" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount ($)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Emergency Savings</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          name="emergency_savings"
                          value={financialData.emergency_savings}
                          onChange={handleInputChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Retirement Savings</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          name="retirement_savings"
                          value={financialData.retirement_savings}
                          onChange={handleInputChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Vehicle Insurance</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          name="vehicle_insurance"
                          value={financialData.vehicle_insurance}
                          onChange={handleInputChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Home Insurance</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          name="home_insurance"
                          value={financialData.home_insurance}
                          onChange={handleInputChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow className="font-bold">
                      <TableCell>Total Savings</TableCell>
                      <TableCell>${financialData.total_savings}</TableCell>
                    </TableRow>
                    <TableRow className="font-bold">
                      <TableCell>Total Insurance</TableCell>
                      <TableCell>${financialData.total_insurance}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No financial data available for this client.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
