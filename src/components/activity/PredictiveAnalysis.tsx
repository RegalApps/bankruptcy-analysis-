
import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MetricCard } from "@/components/analytics/MetricCard";
import { TrendingUp, AlertTriangle, DollarSign, LineChart as ChartIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  // Calculate moving averages for trend analysis
  const calculateMovingAverage = (data: any[], periods: number) => {
    if (!data?.length) return [];
    
    return data.map((record, index) => {
      if (index < periods - 1) return null;
      
      const window = data.slice(index - periods + 1, index + 1);
      const sum = window.reduce((acc, curr) => acc + curr.surplus_income, 0);
      return sum / periods;
    });
  };

  // Detect anomalies using Z-score method
  const detectAnomalies = (data: any[]) => {
    if (!data?.length) return [];

    // Calculate mean and standard deviation
    const surplusValues = data.map(record => record.surplus_income);
    const mean = surplusValues.reduce((a, b) => a + b, 0) / surplusValues.length;
    const stdDev = Math.sqrt(
      surplusValues.map(x => Math.pow(x - mean, 2))
        .reduce((a, b) => a + b, 0) / surplusValues.length
    );

    // Flag anomalies (Z-score > 2)
    return data.map(record => {
      const zScore = Math.abs((record.surplus_income - mean) / stdDev);
      return {
        ...record,
        isAnomaly: zScore > 2
      };
    });
  };

  // Calculate exponential smoothing for forecasting
  const calculateForecast = (data: any[], alpha: number = 0.3) => {
    if (!data?.length) return [];

    let forecast = [data[0].surplus_income];
    for (let i = 1; i < data.length; i++) {
      forecast[i] = alpha * data[i-1].surplus_income + (1 - alpha) * forecast[i-1];
    }

    // Generate future predictions (next 3 periods)
    for (let i = 0; i < 3; i++) {
      forecast.push(alpha * forecast[forecast.length - 1] + 
                   (1 - alpha) * forecast[forecast.length - 2]);
    }

    return forecast;
  };

  // Calculate metrics and detect trends
  const calculateMetrics = () => {
    if (!financialRecords?.length) return null;

    const latestRecord = financialRecords[financialRecords.length - 1];
    const surplusIncome = latestRecord.monthly_income - latestRecord.total_expenses;
    const surplusPercentage = ((surplusIncome / latestRecord.monthly_income) * 100).toFixed(1);

    // Calculate seasonality score (if we have enough data)
    const seasonalityScore = financialRecords.length >= 12 ? 
      calculateSeasonalityScore(financialRecords) : null;

    return {
      currentSurplus: surplusIncome.toFixed(2),
      surplusPercentage,
      monthlyTrend: calculateTrend(),
      riskLevel: surplusIncome < 0 ? "High" : surplusIncome < 1000 ? "Medium" : "Low",
      seasonalityScore
    };
  };

  const calculateSeasonalityScore = (data: any[]) => {
    // Simple seasonality detection using autocorrelation
    const surplusValues = data.map(record => record.surplus_income);
    let correlation = 0;
    
    for (let i = 12; i < surplusValues.length; i++) {
      correlation += (surplusValues[i] - surplusValues[i - 12]) ** 2;
    }
    
    return (1 / (1 + correlation)).toFixed(2);
  };

  const calculateTrend = () => {
    if (!financialRecords?.length) return "0";
    const recentRecords = financialRecords.slice(-2);
    if (recentRecords.length < 2) return "0";
    
    const change = recentRecords[1].surplus_income - recentRecords[0].surplus_income;
    return change.toFixed(2);
  };

  // Process anomalies and notify if found
  const processedData = useMemo(() => {
    if (!financialRecords?.length) return [];
    
    const anomalies = detectAnomalies(financialRecords);
    const forecast = calculateForecast(financialRecords);
    
    // Notify of any anomalies
    anomalies.forEach((record, index) => {
      if (record.isAnomaly) {
        toast.warning(`Anomaly detected: Unusual surplus income on ${new Date(record.submission_date).toLocaleDateString()}`);
      }
    });

    return anomalies.map((record, index) => ({
      ...record,
      forecast: forecast[index]
    }));
  }, [financialRecords]);

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
                <LineChart data={processedData}>
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
                    dot={(props: any) => {
                      const isAnomaly = processedData[props.index]?.isAnomaly;
                      return isAnomaly ? (
                        <circle
                          cx={props.cx}
                          cy={props.cy}
                          r={6}
                          fill="red"
                          stroke="none"
                        />
                      ) : (
                        <circle
                          cx={props.cx}
                          cy={props.cy}
                          r={4}
                          fill={props.fill}
                          stroke="none"
                        />
                      );
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="#82ca9d"
                    name="Forecast"
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

      {/* Seasonality Analysis */}
      {metrics?.seasonalityScore && (
        <Card>
          <CardContent className="pt-6">
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertTitle>Seasonality Analysis</AlertTitle>
              <AlertDescription>
                Seasonality Score: {metrics.seasonalityScore}
                {Number(metrics.seasonalityScore) > 0.7 && " - Strong seasonal pattern detected"}
                {Number(metrics.seasonalityScore) > 0.4 && Number(metrics.seasonalityScore) <= 0.7 && " - Moderate seasonal pattern detected"}
                {Number(metrics.seasonalityScore) <= 0.4 && " - Weak or no seasonal pattern detected"}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
