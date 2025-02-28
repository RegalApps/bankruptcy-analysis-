
import React, { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { User2 } from "lucide-react";
import { ClientSelector } from "./form/ClientSelector";
import { Client } from "./types";
import { MetricsGrid } from "./components/MetricsGrid";
import { ForecastChart } from "./components/ForecastChart";
import { AnalysisAlerts } from "./components/AnalysisAlerts";
import { PredictiveHeader } from "./components/PredictiveHeader";
import { usePredictiveData } from "./hooks/usePredictiveData";
import { NoClientSelected } from "./components/NoClientSelected";

export const PredictiveAnalysis = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Add to console to track issues
  console.log("PredictiveAnalysis - Current selected client:", selectedClient);
  
  const { 
    processedData, 
    metrics, 
    isLoading, 
    lastRefreshed,
    financialRecords
  } = usePredictiveData(selectedClient, refreshTrigger);
  
  const handleManualRefresh = () => {
    if (!selectedClient) return;
    
    console.log("PredictiveAnalysis - Manual refresh triggered for client:", selectedClient.id);
    setRefreshTrigger(prev => prev + 1);
    toast.success(`Refreshing prediction data for ${selectedClient.name}...`);
  };
  
  const handleClientSelect = (clientId: string) => {
    console.log("PredictiveAnalysis - Client selected:", clientId);
    
    // Reset metrics and last refreshed time when changing clients
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
