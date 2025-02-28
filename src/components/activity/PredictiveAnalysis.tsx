
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
import { Button } from "@/components/ui/button";
import { RefreshCw, User2 } from "lucide-react";
import { ClientSelector } from "./form/ClientSelector";
import { Client } from "./types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const PredictiveAnalysis = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  
  // Add to console to track issues
  console.log("PredictiveAnalysis - Current selected client:", selectedClient);
  
  const { data: financialRecords, isLoading, error, refetch } = useQuery({
    queryKey: ["financial_records_prediction", selectedClient?.id, refreshTrigger],
    queryFn: async () => {
      if (!selectedClient) return [];
      
      console.log("PredictiveAnalysis - Fetching financial records for client:", selectedClient.id);
      
      const { data, error } = await supabase
        .from("financial_records")
        .select("*")
        .eq("user_id", selectedClient.id)
        .order("submission_date", { ascending: true });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("PredictiveAnalysis - Received financial records:", data?.length || 0);
      
      // If no data, return simulated data for demonstration
      if (!data || data.length === 0) {
        console.log("PredictiveAnalysis - Generating simulated data for client:", selectedClient.name);
        const today = new Date();
        const simulatedData = [];
        
        // Create six months of simulated data
        for (let i = 5; i >= 0; i--) {
          const date = new Date(today);
          date.setMonth(date.getMonth() - i);
          
          // Generate slightly different data for each month
          const variance = Math.random() * 0.2 - 0.1; // -10% to +10%
          
          const monthData = {
            id: `sim-${5-i}`,
            submission_date: date.toISOString(),
            monthly_income: 5800 * (1 + variance * 0.5),
            total_expenses: 3800 * (1 + variance),
            total_income: 5800 * (1 + variance * 0.5),
            surplus_income: 2000 * (1 + variance),
            user_id: selectedClient.id,
          };
          
          simulatedData.push(monthData);
        }
        
        setLastRefreshed(new Date());
        return simulatedData;
      }
      
      setLastRefreshed(new Date());
      return data;
    },
    enabled: !!selectedClient, // Only run query when client is selected
  });

  // Log any errors for debugging
  useEffect(() => {
    if (error) {
      console.error("PredictiveAnalysis - Query error:", error);
      toast.error("Error loading predictive analysis data");
    }
  }, [error]);

  const calculateMetrics = () => {
    if (!financialRecords?.length) return null;

    console.log("PredictiveAnalysis - Calculating metrics from records:", financialRecords.length);
    
    const latestRecord = financialRecords[financialRecords.length - 1];
    const surplusIncome = latestRecord.surplus_income || 
                         (latestRecord.monthly_income - latestRecord.total_expenses) || 0;
                         
    const totalIncome = latestRecord.total_income || latestRecord.monthly_income || 0;
    const surplusPercentage = ((surplusIncome / totalIncome) * 100).toFixed(1);

    const seasonalityScore = financialRecords.length >= 12 ? 
      calculateSeasonalityScore(financialRecords) : null;

    const riskLevel = surplusIncome < 0 ? "High" : surplusIncome < 1000 ? "Medium" : "Low";
    
    // Only show risk level toast if client is selected
    if (selectedClient) {
      if (riskLevel === "High") {
        toast.error(`High Risk Alert for ${selectedClient.name}: Negative surplus income detected`, {
          duration: 5000,
        });
      } else if (riskLevel === "Medium") {
        toast.warning(`Medium Risk Alert for ${selectedClient.name}: Low surplus income detected`, {
          duration: 5000,
        });
      }
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
    
    console.log("PredictiveAnalysis - Processing data for forecast and anomalies");
    
    const anomalies = detectAnomalies(financialRecords);
    const forecast = calculateForecast(financialRecords);
    
    // Only show anomaly notifications if client is selected
    if (selectedClient) {
      anomalies.forEach((record) => {
        if (record.isAnomaly) {
          const severity = record.severity === 'high' ? 'error' : 'warning';
          const message = `Anomaly detected for ${selectedClient.name}: Unusual surplus income on ${new Date(record.submission_date).toLocaleDateString()}`;
          
          if (severity === 'error') {
            toast.error(message, { duration: 5000 });
          } else {
            toast.warning(message, { duration: 5000 });
          }
        }
      });
    }

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
  }, [financialRecords, selectedClient]);

  // Real-time subscription for new financial records
  useEffect(() => {
    if (!selectedClient) return;
    
    console.log("PredictiveAnalysis - Setting up real-time subscription for client:", selectedClient.id);
    
    const channel = supabase
      .channel('financial_records_predictive_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'financial_records',
          filter: `user_id=eq.${selectedClient.id}`
        },
        (payload) => {
          console.log("PredictiveAnalysis - New financial record detected:", payload);
          toast.info(`New financial record detected for ${selectedClient.name}. Updating analysis...`, {
            duration: 3000,
          });
          setRefreshTrigger(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedClient]);

  // Also listen for document uploads which might contain Excel data
  useEffect(() => {
    if (!selectedClient) return;
    
    console.log("PredictiveAnalysis - Setting up documents change subscription for client:", selectedClient.id);
    
    const channel = supabase
      .channel('documents_predictive_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'documents',
          filter: `user_id=eq.${selectedClient.id}`
        },
        (payload: any) => {
          // Check if it's an Excel file
          const isExcel = 
            payload.new.type?.includes('excel') || 
            payload.new.storage_path?.endsWith('.xlsx') || 
            payload.new.storage_path?.endsWith('.xls');
            
          if (isExcel) {
            console.log("PredictiveAnalysis - New Excel document detected:", payload.new);
            toast.info(`New Excel financial data detected for ${selectedClient.name}. Analysis will update shortly...`, {
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
  }, [selectedClient]);

  // Set up polling for financial records in case real-time subscriptions miss something
  useEffect(() => {
    if (!selectedClient) return;
    
    console.log("PredictiveAnalysis - Setting up polling for client:", selectedClient.id);
    
    const interval = setInterval(() => {
      refetch();
    }, 15000); // Poll every 15 seconds
    
    return () => clearInterval(interval);
  }, [refetch, selectedClient]);

  const metrics = calculateMetrics();
  
  const handleManualRefresh = () => {
    if (!selectedClient) return;
    
    console.log("PredictiveAnalysis - Manual refresh triggered for client:", selectedClient.id);
    setRefreshTrigger(prev => prev + 1);
    toast.success(`Refreshing prediction data for ${selectedClient.name}...`);
  };
  
  const handleClientSelect = (clientId: string) => {
    console.log("PredictiveAnalysis - Client selected:", clientId);
    
    // Reset metrics and last refreshed time when changing clients
    setLastRefreshed(null);
    
    const client = {
      id: clientId,
      name: clientId === "1" ? "John Doe" : "Reginald Dickerson",
      status: "active" as const,
      last_activity: "2024-03-10",
    };
    
    setSelectedClient(client);
    toast.success(`Selected client for predictive analysis: ${client.name}`);
    
    // Trigger data refresh for the new client
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Client Selection Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Predictive Financial Analysis</CardTitle>
          <CardDescription>Select a client to view predictive financial analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <ClientSelector 
            selectedClient={selectedClient}
            onClientSelect={handleClientSelect}
          />
        </CardContent>
      </Card>
      
      {/* Show this when no client is selected */}
      {!selectedClient && (
        <Card className="py-12">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
            <User2 className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-medium">No Client Selected</h3>
            <p className="text-muted-foreground max-w-md">
              Please select a client above to view their predictive financial analysis.
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Show analysis content only when client is selected */}
      {selectedClient && (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold mb-1">Financial Predictive Analysis for {selectedClient.name}</h2>
              <p className="text-sm text-muted-foreground">
                {lastRefreshed ? (
                  <>
                    Updated {lastRefreshed.toLocaleTimeString()} ({(Date.now() - lastRefreshed.getTime()) < 60000 ? 'Just now' : 
                      `${Math.floor((Date.now() - lastRefreshed.getTime()) / 60000)} minutes ago`})
                  </>
                ) : (
                  "Loading data..."
                )}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleManualRefresh} disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Analysis
            </Button>
          </div>
          
          {isLoading ? (
            <>
              <Skeleton className="h-[120px] w-full rounded-lg" />
              <Skeleton className="h-[400px] w-full rounded-lg" />
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </>
          ) : (
            financialRecords && financialRecords.length > 0 ? (
              <>
                <MetricsGrid metrics={metrics} />
                <ForecastChart processedData={processedData} isLoading={isLoading} />
                <AnalysisAlerts 
                  riskLevel={metrics?.riskLevel || ''} 
                  seasonalityScore={metrics?.seasonalityScore || null} 
                />
              </>
            ) : (
              <Card>
                <CardContent className="py-8">
                  <div className="flex flex-col items-center justify-center text-center">
                    <p className="text-muted-foreground">No financial records found for this client.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={handleManualRefresh}
                    >
                      Try Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </>
      )}
    </div>
  );
};
