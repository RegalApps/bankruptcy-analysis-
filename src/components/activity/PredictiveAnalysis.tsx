
import { Client } from "./types";
import { Card, CardContent } from "@/components/ui/card";
import { usePredictiveData } from "./hooks/usePredictiveData";
import { ForecastChart } from "./components/ForecastChart";
import { PredictiveHeader } from "./components/PredictiveHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface PredictiveAnalysisProps {
  selectedClient: Client | null;
}

export const PredictiveAnalysis = ({ selectedClient }: PredictiveAnalysisProps) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const {
    processedData,
    metrics,
    categoryAnalysis,
    isLoading,
    lastRefreshed,
    refetch
  } = usePredictiveData(selectedClient);

  const handleRefresh = () => {
    refetch();
    setRefreshTrigger(prev => prev + 1);
  };

  if (!selectedClient) {
    return (
      <Card className="py-12">
        <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
          <h3 className="text-lg font-medium">No Client Selected</h3>
          <p className="text-muted-foreground max-w-md">
            Please select a client above to view predictive analysis.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{selectedClient.name}'s Predictive Analysis</h2>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <PredictiveHeader
            clientName={selectedClient.name}
            lastRefreshed={lastRefreshed}
            onRefresh={handleRefresh}
            isLoading={isLoading}
          />
          
          {isLoading ? (
            <div className="mt-6">
              <Skeleton className="h-[350px] w-full rounded-md" />
            </div>
          ) : (
            <div className="mt-6">
              <ForecastChart
                processedData={processedData}
                categoryAnalysis={categoryAnalysis}
                isLoading={isLoading}
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-base font-medium mb-2">Risk Assessment</h3>
            <div className="text-2xl font-bold">{metrics?.riskLevel || "Low Risk"}</div>
            <p className="text-sm text-muted-foreground mt-1">Based on cash flow stability</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-base font-medium mb-2">Current Surplus</h3>
            <div className="text-2xl font-bold">${metrics?.currentSurplus || "0.00"}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {metrics?.surplusPercentage ? `${metrics.surplusPercentage}% of income` : "No data"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-base font-medium mb-2">Seasonality Score</h3>
            <div className="text-2xl font-bold">{metrics?.seasonalityScore || "0.0"}</div>
            <p className="text-sm text-muted-foreground mt-1">Variance in monthly income</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
