
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Client } from "./types";
import { MetricsGrid } from "./components/MetricsGrid";
import { ForecastChart } from "./components/ForecastChart";
import { AnalysisAlerts } from "./components/AnalysisAlerts";
import { PredictiveHeader } from "./components/PredictiveHeader";
import { usePredictiveData } from "./hooks/usePredictiveData";
import { NoClientSelected } from "./components/NoClientSelected";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw } from "lucide-react";

interface PredictiveAnalysisProps {
  selectedClient: Client | null;
}

export const PredictiveAnalysis = ({ selectedClient }: PredictiveAnalysisProps) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRealTimeUpdate, setIsRealTimeUpdate] = useState(false);
  
  // Add to console to track issues
  console.log("PredictiveAnalysis - Current selected client:", selectedClient);
  
  const { 
    processedData, 
    metrics,
    categoryAnalysis,
    isLoading, 
    lastRefreshed,
    financialRecords,
    refetch
  } = usePredictiveData(selectedClient, refreshTrigger);
  
  const handleManualRefresh = () => {
    if (!selectedClient) return;
    
    console.log("PredictiveAnalysis - Manual refresh triggered for client:", selectedClient.id);
    setRefreshTrigger(prev => prev + 1);
    toast.success(`Refreshing prediction data for ${selectedClient.name}...`);
  };

  // Set up listener for updates from other components
  useEffect(() => {
    if (!selectedClient) return;
    
    const handleDataUpdate = (event: CustomEvent) => {
      if (event.detail?.clientId === selectedClient.id) {
        console.log("PredictiveAnalysis - Detected data change event, refreshing...");
        setIsRealTimeUpdate(true);
        setRefreshTrigger(prev => prev + 1);
        
        // Reset the real-time update flag after a delay
        setTimeout(() => setIsRealTimeUpdate(false), 3000);
      }
    };
    
    // Listen for the custom event
    window.addEventListener('financial-data-updated' as any, handleDataUpdate);
    
    return () => {
      window.removeEventListener('financial-data-updated' as any, handleDataUpdate);
    };
  }, [selectedClient]);

  return (
    <div className="space-y-6">
      {/* Show this when no client is selected */}
      {!selectedClient && <NoClientSelected />}
      
      {/* Show analysis content only when client is selected */}
      {selectedClient && (
        <>
          <PredictiveHeader 
            clientName={selectedClient.name} 
            lastRefreshed={lastRefreshed} 
            onRefresh={handleManualRefresh}
            isLoading={isLoading}
          />
          
          {isRealTimeUpdate && (
            <Alert className="bg-blue-50 border-blue-200">
              <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
              <AlertDescription className="text-blue-800">
                Financial data has been updated. Refreshing predictive analysis...
              </AlertDescription>
            </Alert>
          )}
          
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
                <ForecastChart 
                  processedData={processedData} 
                  categoryAnalysis={categoryAnalysis}
                  isLoading={isLoading} 
                />
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
