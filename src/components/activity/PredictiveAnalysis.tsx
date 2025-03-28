
import { Client } from "./types";
import { Card, CardContent } from "@/components/ui/card";
import { usePredictiveData } from "./hooks/usePredictiveData";
import { ForecastChart } from "./components/ForecastChart";
import { PredictiveHeader } from "./components/PredictiveHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedRiskAssessment } from "./components/EnhancedRiskAssessment";
import { EnhancedOpportunityPanel } from "./components/EnhancedOpportunityPanel";
import { AnalysisAlerts } from "./components/AnalysisAlerts";
import { ChartBarIcon, TrendingUpIcon, BarChart } from "lucide-react";

interface PredictiveAnalysisProps {
  selectedClient: Client | null;
}

export const PredictiveAnalysis = ({ selectedClient }: PredictiveAnalysisProps) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState("forecast");
  
  const {
    processedData,
    metrics,
    categoryAnalysis,
    advancedRiskMetrics,
    isLoading,
    lastRefreshed,
    refetch
  } = usePredictiveData(selectedClient);

  // Memoize metrics to prevent unnecessary re-renders
  const memoizedMetrics = useMemo(() => metrics, [metrics]);

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
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList>
              <TabsTrigger value="forecast" className="flex items-center gap-1">
                <BarChart className="h-4 w-4" />
                Financial Forecast
              </TabsTrigger>
              <TabsTrigger value="risk" className="flex items-center gap-1">
                <TrendingUpIcon className="h-4 w-4" />
                Risk Assessment
              </TabsTrigger>
              <TabsTrigger value="opportunities" className="flex items-center gap-1">
                <ChartBarIcon className="h-4 w-4" />
                Opportunities
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="forecast" className="pt-4">
              {isLoading ? (
                <Skeleton className="h-[350px] w-full rounded-md" />
              ) : (
                <ForecastChart
                  key={`forecast-${refreshTrigger}`}
                  processedData={processedData}
                  categoryAnalysis={categoryAnalysis}
                  isLoading={isLoading}
                />
              )}
            </TabsContent>
            
            <TabsContent value="risk" className="pt-4">
              {isLoading ? (
                <Skeleton className="h-[450px] w-full rounded-md" />
              ) : (
                <EnhancedRiskAssessment 
                  key={`risk-${refreshTrigger}`}
                  riskMetrics={advancedRiskMetrics}
                  isLoading={isLoading}
                />
              )}
            </TabsContent>
            
            <TabsContent value="opportunities" className="pt-4">
              {isLoading ? (
                <Skeleton className="h-[450px] w-full rounded-md" />
              ) : (
                <EnhancedOpportunityPanel 
                  key={`opportunities-${refreshTrigger}`}
                  riskMetrics={advancedRiskMetrics}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-32 w-full rounded-md" />
            <Skeleton className="h-32 w-full rounded-md" />
            <Skeleton className="h-32 w-full rounded-md" />
          </>
        ) : (
          <>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-base font-medium mb-2">Risk Assessment</h3>
                <div className="text-2xl font-bold">{memoizedMetrics?.riskLevel || "Low Risk"}</div>
                <p className="text-sm text-muted-foreground mt-1">Based on cash flow stability</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-base font-medium mb-2">Current Surplus</h3>
                <div className="text-2xl font-bold">${memoizedMetrics?.currentSurplus || "0.00"}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {memoizedMetrics?.surplusPercentage ? `${memoizedMetrics.surplusPercentage}% of income` : "No data"}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-base font-medium mb-2">Seasonality Score</h3>
                <div className="text-2xl font-bold">{memoizedMetrics?.seasonalityScore || "0.0"}</div>
                <p className="text-sm text-muted-foreground mt-1">Variance in monthly income</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      
      {/* Only render alerts when data is loaded */}
      {!isLoading && (
        <AnalysisAlerts 
          key={`alerts-${refreshTrigger}`}
          riskLevel={memoizedMetrics?.riskLevel || "Low"}
          seasonalityScore={memoizedMetrics?.seasonalityScore ? memoizedMetrics.seasonalityScore.toString() : null}
        />
      )}
    </div>
  );
};
