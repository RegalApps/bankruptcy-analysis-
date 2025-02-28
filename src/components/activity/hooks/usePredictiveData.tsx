
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Client } from "../types";
import { processForecastData, calculateFinancialMetrics } from "../utils/forecastingUtils";

export const usePredictiveData = (selectedClient: Client | null, refreshTrigger: number) => {
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  // Query for financial records
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
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedClient, refetch]);

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
              refetch();
            }, 2000);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedClient, refetch]);

  // Set up polling for financial records in case real-time subscriptions miss something
  useEffect(() => {
    if (!selectedClient) return;
    
    console.log("PredictiveAnalysis - Setting up polling for client:", selectedClient.id);
    
    const interval = setInterval(() => {
      refetch();
    }, 15000); // Poll every 15 seconds
    
    return () => clearInterval(interval);
  }, [refetch, selectedClient]);

  // Calculate metrics
  const metrics = useMemo(() => {
    return calculateFinancialMetrics(financialRecords || [], selectedClient);
  }, [financialRecords, selectedClient]);

  // Process data for the chart
  const processedData = useMemo(() => {
    return processForecastData(financialRecords || [], selectedClient);
  }, [financialRecords, selectedClient]);

  return {
    financialRecords,
    processedData,
    metrics,
    isLoading,
    lastRefreshed,
    refetch
  };
};
