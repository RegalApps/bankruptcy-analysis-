
import React, { useMemo, useEffect, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";

export const PredictiveAnalysis = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const { data: financialRecords, isLoading, refetch } = useQuery({
    queryKey: ["financial_records_prediction", refreshTrigger],
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

    const riskLevel = surplusIncome < 0 ? "High" : surplusIncome < 1000 ? "Medium" : "Low";
    
    // Show risk level toast notification
    if (riskLevel === "High") {
      toast.error("High Risk Alert: Negative surplus income detected", {
        duration: 5000,
      });
    } else if (riskLevel === "Medium") {
      toast.warning("Medium Risk Alert: Low surplus income detected", {
        duration: 5000,
      });
    }

    return {
      currentSurplus: surplusIncome.toFixed(2),
      surplusPercentage,
      monthlyTrend: calculateTrend(financialRecords),
      riskLevel,
      seasonalityScore
    };
  };

  const processedData = useMemo(() => {
    if (!financialRecords?.length) return [];
    
    const anomalies = detectAnomalies(financialRecords);
    const forecast = calculateForecast(financialRecords);
    
    // Process anomalies and show notifications
    anomalies.forEach((record) => {
      if (record.isAnomaly) {
        const severity = record.severity === 'high' ? 'error' : 'warning';
        const message = `Anomaly detected: Unusual surplus income on ${new Date(record.submission_date).toLocaleDateString()}`;
        if (severity === 'error') {
          toast.error(message, { duration: 5000 });
        } else {
          toast.warning(message, { duration: 5000 });
        }
      }
    });

    // Add 6 months of future dates for forecast
    const lastRecord = financialRecords[financialRecords.length - 1];
    const lastDate = new Date(lastRecord.submission_date);
    
    const futureData = Array.from({ length: 6 }, (_, i) => {
      const futureDate = new Date(lastDate);
      futureDate.setMonth(lastDate.getMonth() + i + 1);
      return {
        submission_date: futureDate.toISOString(),
        forecast: forecast[forecast.length - 6 + i],
        isForecast: true
      };
    });

    return [...anomalies.map((record, index) => ({
      ...record,
      forecast: forecast[index]
    })), ...futureData];
  }, [financialRecords]);

  // Real-time subscription for new financial records
  useEffect(() => {
    const channel = supabase
      .channel('financial_records_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'financial_records'
        },
        (payload) => {
          toast.info('New financial record detected. Updating analysis...', {
            duration: 3000,
          });
          setRefreshTrigger(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Also listen for document uploads which might contain Excel data
  useEffect(() => {
    const channel = supabase
      .channel('documents_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'documents'
        },
        (payload: any) => {
          // Check if it's an Excel file
          const isExcel = 
            payload.new.type?.includes('excel') || 
            payload.new.storage_path?.endsWith('.xlsx') || 
            payload.new.storage_path?.endsWith('.xls');
            
          if (isExcel) {
            toast.info('New Excel financial data detected. Analysis will update shortly...', {
              duration: 3000,
            });
            
            // Schedule a refresh after a short delay to allow processing
            setTimeout(() => {
              setRefreshTrigger(prev => prev + 1);
            }, 2000);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Set up polling for financial records in case real-time subscriptions miss something
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 15000); // Poll every 15 seconds
    
    return () => clearInterval(interval);
  }, [refetch]);

  const metrics = calculateMetrics();

  return (
    <div className="space-y-6">
      {isLoading ? (
        <>
          <Skeleton className="h-[120px] w-full rounded-lg" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </>
      ) : (
        <>
          <MetricsGrid metrics={metrics} />
          <ForecastChart processedData={processedData} isLoading={isLoading} />
          <AnalysisAlerts 
            riskLevel={metrics?.riskLevel || ''} 
            seasonalityScore={metrics?.seasonalityScore || null} 
          />
        </>
      )}
    </div>
  );
};
