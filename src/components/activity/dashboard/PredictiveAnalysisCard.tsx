
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ForecastChart } from "../components/ForecastChart";
import { PredictiveHeader } from "../components/PredictiveHeader";
import { EnhancedRiskAssessment } from "../components/EnhancedRiskAssessment";
import { EnhancedOpportunityPanel } from "../components/EnhancedOpportunityPanel";
import { AdvancedRiskMetrics } from "../hooks/predictiveData/types";
import { useState } from "react";

interface PredictiveAnalysisCardProps {
  clientName: string;
  lastRefreshed: Date | null;
  processedData: any;
  categoryAnalysis: any;
  advancedRiskMetrics?: AdvancedRiskMetrics | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export const PredictiveAnalysisCard = ({
  clientName,
  lastRefreshed,
  processedData,
  categoryAnalysis,
  advancedRiskMetrics,
  isLoading,
  onRefresh
}: PredictiveAnalysisCardProps) => {
  const [activeTab, setActiveTab] = useState("forecast");

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <PredictiveHeader
          clientName={clientName}
          lastRefreshed={lastRefreshed}
          onRefresh={onRefresh}
          isLoading={isLoading}
        />
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="mb-2">
            <TabsTrigger value="forecast">Financial Forecast</TabsTrigger>
            <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          </TabsList>
          
          <TabsContent value="forecast">
            <ForecastChart
              processedData={processedData}
              categoryAnalysis={categoryAnalysis}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="risk">
            <EnhancedRiskAssessment
              riskMetrics={advancedRiskMetrics}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="opportunities">
            <EnhancedOpportunityPanel 
              riskMetrics={advancedRiskMetrics}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
