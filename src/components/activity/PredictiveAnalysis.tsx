
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MetricCard } from "@/components/analytics/MetricCard";
import { TrendingUp, AlertTriangle, DollarSign, LineChart as ChartIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const PredictiveAnalysis = () => {
  // Fetch financial records for analysis
  const { data: financialRecords, isLoading } = useQuery({
    queryKey: ["financial_records_prediction"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_records")
        .select("*")
        .order("submission_date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Calculate metrics
  const calculateMetrics = () => {
    if (!financialRecords?.length) return null;

    const latestRecord = financialRecords[financialRecords.length - 1];
    const surplusIncome = latestRecord.monthly_income - latestRecord.total_expenses;
    const surplusPercentage = ((surplusIncome / latestRecord.monthly_income) * 100).toFixed(1);

    return {
      currentSurplus: surplusIncome.toFixed(2),
      surplusPercentage,
      monthlyTrend: calculateTrend(),
      riskLevel: surplusIncome < 0 ? "High" : surplusIncome < 1000 ? "Medium" : "Low"
    };
  };

  const calculateTrend = () => {
    if (!financialRecords?.length) return "0";
    const recentRecords = financialRecords.slice(-2);
    if (recentRecords.length < 2) return "0";
    
    const change = recentRecords[1].surplus_income - recentRecords[0].surplus_income;
    return change.toFixed(2);
  };

  const metrics = calculateMetrics();

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Current Surplus Income"
          value={`$${metrics?.currentSurplus || '0'}`}
          description="Available funds after expenses"
          icon={DollarSign}
        />
        <MetricCard
          title="Surplus Percentage"
          value={`${metrics?.surplusPercentage || '0'}%`}
          description="Of total monthly income"
          icon={TrendingUp}
        />
        <MetricCard
          title="Monthly Trend"
          value={`$${metrics?.monthlyTrend || '0'}`}
          description="Change from previous month"
          icon={ChartIcon}
        />
        <MetricCard
          title="Risk Level"
          value={metrics?.riskLevel || 'N/A'}
          description="Based on surplus threshold"
          icon={AlertTriangle}
        />
      </div>

      {/* Predictive Trend Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Surplus Income Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p>Loading forecast data...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={financialRecords}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="submission_date"
                    tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="surplus_income"
                    stroke="#8884d8"
                    name="Actual Surplus"
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted_surplus"
                    stroke="#82ca9d"
                    name="Predicted Surplus"
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Risk Alerts */}
      {metrics?.riskLevel === "High" && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>High Risk Alert</AlertTitle>
          <AlertDescription>
            Current surplus income is below threshold. Immediate review recommended.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
