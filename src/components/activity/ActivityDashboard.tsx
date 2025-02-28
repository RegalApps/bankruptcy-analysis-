
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Database } from "@/integrations/supabase/types";
import { useEffect, useState } from "react";
import { MetricsGrid } from "./components/MetricsGrid";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileSpreadsheet } from "lucide-react";

type FinancialRecord = Database["public"]["Tables"]["financial_records"]["Row"];

export const ActivityDashboard = () => {
  const [metrics, setMetrics] = useState<{
    currentSurplus: string;
    surplusPercentage: string;
    monthlyTrend: string;
    riskLevel: string;
  } | null>(null);

  const { data: financialRecords, isLoading, refetch } = useQuery<FinancialRecord[]>({
    queryKey: ["financial_records"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_records")
        .select("*")
        .order("submission_date", { ascending: true });

      if (error) throw error;
      
      // If no data, return simulated data for demonstration
      if (!data || data.length === 0) {
        const today = new Date();
        const simulatedData = [];
        
        // Create six months of simulated data
        for (let i = 5; i >= 0; i--) {
          const date = new Date(today);
          date.setMonth(date.getMonth() - i);
          
          // Generate slightly different data for each month
          const monthData = {
            id: `sim-${5-i}`,
            submission_date: date.toISOString(),
            monthly_income: 5800 - (Math.random() * 300),
            total_expenses: 3800 - (Math.random() * 400),
            total_income: 5800 - (Math.random() * 300),
            surplus_income: 2000 - (Math.random() * 500),
            user_id: "2", // Reginald Dickerson
          };
          
          simulatedData.push(monthData);
        }
        
        return simulatedData as FinancialRecord[];
      }
      
      return data;
    },
  });

  // Setup real-time subscription to financial_records table
  useEffect(() => {
    const channel = supabase
      .channel('financial_records_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'financial_records'
        },
        () => {
          console.log('Financial records changed, refreshing data');
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // Calculate metrics from financial data
  useEffect(() => {
    if (financialRecords && financialRecords.length > 0) {
      const currentRecord = financialRecords[financialRecords.length - 1];
      const previousRecord = financialRecords.length > 1 ? financialRecords[financialRecords.length - 2] : null;
      
      const currentSurplus = currentRecord.surplus_income || 0;
      const currentIncome = currentRecord.total_income || currentRecord.monthly_income || 0;
      
      const surplusPercentage = currentIncome > 0 
        ? Math.round((currentSurplus / currentIncome) * 100) 
        : 0;
      
      const monthlyTrend = previousRecord 
        ? (currentSurplus - (previousRecord.surplus_income || 0)).toFixed(0)
        : "0";
      
      let riskLevel = "Low";
      if (surplusPercentage < 10) {
        riskLevel = "High";
      } else if (surplusPercentage < 20) {
        riskLevel = "Medium";
      }
      
      setMetrics({
        currentSurplus: currentSurplus.toFixed(0),
        surplusPercentage: surplusPercentage.toString(),
        monthlyTrend,
        riskLevel
      });
    }
  }, [financialRecords]);

  // Process chart data
  const chartData = financialRecords?.map(record => ({
    date: new Date(record.submission_date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    Income: record.total_income || record.monthly_income,
    Expenses: record.total_expenses,
    Surplus: record.surplus_income
  })) || [];

  // Check if there are any Excel documents
  const { data: excelDocuments } = useQuery({
    queryKey: ["excel_documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .or("type.eq.application/vnd.ms-excel,type.eq.application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,storage_path.ilike.%.xls,storage_path.ilike.%.xlsx")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      {metrics && <MetricsGrid metrics={metrics} />}
      
      {excelDocuments && excelDocuments.length > 0 && (
        <Alert className="bg-green-50 border-green-200">
          <FileSpreadsheet className="h-5 w-5 text-green-600" />
          <AlertDescription className="flex justify-between items-center">
            <span>Found {excelDocuments.length} Excel document{excelDocuments.length !== 1 ? 's' : ''} with financial data.</span>
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Income vs Expenses Overview</CardTitle>
          <CardDescription>Monthly financial trends analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p>Loading financial data...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, undefined]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Income"
                    stroke="#8884d8"
                    name="Income"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="Expenses"
                    stroke="#82ca9d"
                    name="Expenses"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="Surplus"
                    stroke="#ff7300"
                    name="Surplus"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
