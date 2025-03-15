
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { IncomeExpenseData } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertTriangle, Check } from "lucide-react";
import { HistoricalData } from "../hooks/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RealTimeAnalyticsPanelProps {
  formData: IncomeExpenseData;
  previousMonthData?: any;
  historicalData: HistoricalData;
}

export const RealTimeAnalyticsPanel = ({ 
  formData, 
  previousMonthData,
  historicalData
}: RealTimeAnalyticsPanelProps) => {
  const [barChartData, setBarChartData] = useState<any[]>([]);
  const [pieChartData, setPieChartData] = useState<any[]>([]);
  const [forecastData, setForecastData] = useState<any>({
    nextMonthIncome: 0,
    nextMonthExpenses: 0,
    surplusOrDeficit: 0,
    riskLevel: "low"
  });
  const [alerts, setAlerts] = useState<any[]>([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Calculate real-time analytics based on current form data
  useEffect(() => {
    calculateAnalytics();
  }, [formData]);
  
  const calculateAnalytics = () => {
    // Calculate total income
    const totalIncome = parseFloat(formData.total_monthly_income || '0') + 
                         parseFloat(formData.spouse_total_monthly_income || '0');
    
    // Calculate total expenses
    const totalEssentialExpenses = parseFloat(formData.total_essential_expenses || '0');
    const totalDiscretionaryExpenses = parseFloat(formData.total_discretionary_expenses || '0');
    const totalSavings = parseFloat(formData.total_savings || '0');
    const totalInsurance = parseFloat(formData.total_insurance || '0');
    
    const totalExpenses = totalEssentialExpenses + totalDiscretionaryExpenses + 
                          totalSavings + totalInsurance;
    
    // Create bar chart data
    const newBarChartData = [
      { name: 'Income', current: totalIncome, previous: parseFloat(previousMonthData?.total_monthly_income || '0') + parseFloat(previousMonthData?.spouse_total_monthly_income || '0') },
      { name: 'Essential', current: totalEssentialExpenses, previous: parseFloat(previousMonthData?.total_essential_expenses || '0') },
      { name: 'Discretionary', current: totalDiscretionaryExpenses, previous: parseFloat(previousMonthData?.total_discretionary_expenses || '0') },
      { name: 'Savings', current: totalSavings, previous: parseFloat(previousMonthData?.total_savings || '0') },
      { name: 'Insurance', current: totalInsurance, previous: parseFloat(previousMonthData?.total_insurance || '0') }
    ];
    
    // Create pie chart data for expense breakdown
    const newPieChartData = [
      { name: 'Essential', value: totalEssentialExpenses },
      { name: 'Discretionary', value: totalDiscretionaryExpenses },
      { name: 'Savings', value: totalSavings },
      { name: 'Insurance', value: totalInsurance }
    ].filter(item => item.value > 0);
    
    // Simple forecast algorithm (for demonstration)
    const nextMonthIncome = totalIncome * 1.01; // Assuming 1% income growth
    const nextMonthExpenses = totalExpenses * 1.02; // Assuming 2% expense growth
    const surplusOrDeficit = nextMonthIncome - nextMonthExpenses;
    
    // Risk level calculation
    let riskLevel = "low";
    if (totalExpenses > totalIncome * 0.9) {
      riskLevel = "high";
    } else if (totalExpenses > totalIncome * 0.75) {
      riskLevel = "medium";
    }
    
    // Generate alerts/recommendations
    const newAlerts = [];
    
    if (totalExpenses > totalIncome) {
      newAlerts.push({
        type: "danger",
        message: "Expenses exceed income. Consider reducing discretionary spending."
      });
    }
    
    if (totalSavings < totalIncome * 0.1) {
      newAlerts.push({
        type: "warning",
        message: "Savings are below recommended 10% of income."
      });
    }
    
    if (totalDiscretionaryExpenses > totalEssentialExpenses * 0.5) {
      newAlerts.push({
        type: "info",
        message: "Discretionary expenses are relatively high compared to essential expenses."
      });
    }
    
    // Update state with calculated data
    setBarChartData(newBarChartData);
    setPieChartData(newPieChartData);
    setForecastData({
      nextMonthIncome,
      nextMonthExpenses,
      surplusOrDeficit,
      riskLevel
    });
    setAlerts(newAlerts);
  };
  
  return (
    <div className="space-y-6">
      {/* Monthly Comparison Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Monthly Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Bar dataKey="current" fill="#8884d8" name="Current" />
                <Bar dataKey="previous" fill="#82ca9d" name="Previous" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Expense Breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Forecast & Recommendations */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Next Month Forecast</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Projected Income:</span>
            <span className="font-medium">${forecastData.nextMonthIncome.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Projected Expenses:</span>
            <span className="font-medium">${forecastData.nextMonthExpenses.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center font-medium">
            <span className="text-sm">Surplus/Deficit:</span>
            <span className={forecastData.surplusOrDeficit >= 0 ? "text-green-600" : "text-red-600"}>
              ${forecastData.surplusOrDeficit.toFixed(2)}
              {forecastData.surplusOrDeficit >= 0 ? 
                <TrendingUp className="inline h-4 w-4 ml-1" /> : 
                <TrendingDown className="inline h-4 w-4 ml-1" />}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Risk Level:</span>
            <span className={`font-medium ${
              forecastData.riskLevel === "low" ? "text-green-600" : 
              forecastData.riskLevel === "medium" ? "text-amber-600" : 
              "text-red-600"
            }`}>
              {forecastData.riskLevel.charAt(0).toUpperCase() + forecastData.riskLevel.slice(1)}
            </span>
          </div>
        </CardContent>
      </Card>
      
      {/* Recommendations & Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Recommendations</h3>
          {alerts.map((alert, index) => (
            <Alert 
              key={index} 
              variant="default" 
              className={`
                ${alert.type === "danger" ? "bg-red-50 border-red-200" : 
                  alert.type === "warning" ? "bg-amber-50 border-amber-200" : 
                  "bg-blue-50 border-blue-200"}
              `}
            >
              {alert.type === "danger" ? (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              ) : alert.type === "warning" ? (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              ) : (
                <Check className="h-4 w-4 text-blue-500" />
              )}
              <AlertDescription className="text-xs">
                {alert.message}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
};
