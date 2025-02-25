
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MetricsGrid } from "./components/MetricsGrid";
import { ForecastChart } from "./components/ForecastChart";
import { AnalysisAlerts } from "./components/AnalysisAlerts";
import {
  calculateSeasonalityScore,
  calculateTrend,
  detectAnomalies,
  calculateForecast
} from "./utils/financialCalculations";

export const PredictiveAnalysis = () => {
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

  const calculateMetrics = () => {
    if (!financialRecords?.length) return null;

    const latestRecord = financialRecords[financialRecords.length - 1];
    const surplusIncome = latestRecord.monthly_income - latestRecord.total_expenses;
    const surplusPercentage = ((surplusIncome / latestRecord.monthly_income) * 100).toFixed(1);

    const seasonalityScore = financialRecords.length >= 12 ? 
      calculateSeasonalityScore(financialRecords) : null;

    return {
      currentSurplus: surplusIncome.toFixed(2),
      surplusPercentage,
      monthlyTrend: calculateTrend(financialRecords),
      riskLevel: surplusIncome < 0 ? "High" : surplusIncome < 1000 ? "Medium" : "Low",
      seasonalityScore
    };
  };

  const processedData = useMemo(() => {
    if (!financialRecords?.length) return [];
    
    const anomalies = detectAnomalies(financialRecords);
    const forecast = calculateForecast(financialRecords);
    
    anomalies.forEach((record) => {
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
      <MetricsGrid metrics={metrics} />
      <ForecastChart processedData={processedData} isLoading={isLoading} />
      <AnalysisAlerts 
        riskLevel={metrics?.riskLevel || ''} 
        seasonalityScore={metrics?.seasonalityScore || null} 
      />
    </div>
  );
};
