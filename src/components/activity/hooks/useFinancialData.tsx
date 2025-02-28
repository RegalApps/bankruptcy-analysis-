
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Client } from "../types";
import { Database } from "@/integrations/supabase/types";

type FinancialRecord = Database["public"]["Tables"]["financial_records"]["Row"];

export type FinancialMetrics = {
  currentSurplus: string;
  surplusPercentage: string;
  monthlyTrend: string;
  riskLevel: string;
};

export const useFinancialData = (selectedClient: Client | null) => {
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [lastDataUpdate, setLastDataUpdate] = useState<Date | null>(null);

  // Query for financial records
  const { 
    data: financialRecords, 
    isLoading, 
    error, 
    refetch 
  } = useQuery<FinancialRecord[]>({
    queryKey: ["financial_records", selectedClient?.id],
    queryFn: async () => {
      if (!selectedClient) return [];
      
      console.log("Fetching financial records for client:", selectedClient.id);
      
      try {
        const { data, error } = await supabase
          .from("financial_records")
          .select("*")
          .eq("user_id", selectedClient.id)
          .order("submission_date", { ascending: true });

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        
        console.log("Received financial records:", data?.length || 0);
        
        // If no data, return simulated data for demonstration
        if (!data || data.length === 0) {
          console.log("Generating simulated data for client:", selectedClient.name);
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
              user_id: selectedClient.id, 
            };
            
            simulatedData.push(monthData);
          }
          
          return simulatedData as FinancialRecord[];
        }
        
        return data;
      } catch (error) {
        console.error("Error fetching financial records:", error);
        throw error;
      }
    },
    enabled: !!selectedClient, // Only run query when a client is selected
  });

  // Log any errors for debugging
  useEffect(() => {
    if (error) {
      console.error("Query error:", error);
      toast.error("Error loading financial data");
    }
  }, [error]);

  // Setup real-time subscription to financial_records table
  useEffect(() => {
    if (!selectedClient) return;
    
    console.log("Setting up real-time subscription for client:", selectedClient.id);
    const channel = supabase
      .channel('financial_records_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'financial_records',
          filter: `user_id=eq.${selectedClient.id}`
        },
        (payload) => {
          console.log('Financial records changed, refreshing data', payload);
          setLastDataUpdate(new Date());
          toast.info("Financial data updated in real-time", {
            description: "Dashboard is refreshing with the latest data",
            duration: 3000,
          });
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch, selectedClient]);

  // Calculate metrics from financial data
  useEffect(() => {
    if (financialRecords && financialRecords.length > 0) {
      console.log("Calculating metrics from financial records:", financialRecords.length);
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
      
      const newMetrics = {
        currentSurplus: currentSurplus.toFixed(0),
        surplusPercentage: surplusPercentage.toString(),
        monthlyTrend,
        riskLevel
      };
      
      console.log("Setting new metrics:", newMetrics);
      setMetrics(newMetrics);
      
      // If this is a refresh after a change, notify other components
      if (lastDataUpdate) {
        console.log("Notifying other components of data update");
        const updateEvent = new CustomEvent('metrics-updated', { 
          detail: { 
            clientId: selectedClient?.id,
            metrics: newMetrics
          } 
        });
        window.dispatchEvent(updateEvent);
      }
    } else {
      console.log("No financial records to calculate metrics");
      setMetrics(null);
    }
  }, [financialRecords, lastDataUpdate, selectedClient]);

  // Query for Excel documents
  const { data: excelDocuments } = useQuery({
    queryKey: ["excel_documents", selectedClient?.id],
    queryFn: async () => {
      if (!selectedClient) return [];
      
      console.log("Checking for Excel documents for client:", selectedClient.id);
      
      try {
        const { data, error } = await supabase
          .from("documents")
          .select("*")
          .eq("user_id", selectedClient.id)
          .or("type.eq.application/vnd.ms-excel,type.eq.application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,storage_path.ilike.%.xls,storage_path.ilike.%.xlsx")
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) {
          console.error("Error fetching Excel documents:", error);
          throw error;
        }
        
        console.log("Found Excel documents:", data?.length || 0);
        return data;
      } catch (error) {
        console.error("Error fetching Excel documents:", error);
        return [];
      }
    },
    enabled: !!selectedClient, // Only run when client is selected
  });

  // Process chart data
  const chartData = financialRecords?.map(record => ({
    date: new Date(record.submission_date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    Income: record.total_income || record.monthly_income,
    Expenses: record.total_expenses,
    Surplus: record.surplus_income
  })) || [];

  return {
    financialRecords,
    chartData,
    metrics,
    excelDocuments,
    isLoading,
    error,
    refetch
  };
};
