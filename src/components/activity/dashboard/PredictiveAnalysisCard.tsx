
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ForecastChart } from "../components/ForecastChart";
import { PredictiveHeader } from "../components/PredictiveHeader";

interface PredictiveAnalysisCardProps {
  clientName: string;
  lastRefreshed: Date | null;
  processedData: any;
  categoryAnalysis: any;
  isLoading: boolean;
  onRefresh: () => void;
}

export const PredictiveAnalysisCard = ({
  clientName,
  lastRefreshed,
  processedData,
  categoryAnalysis,
  isLoading,
  onRefresh
}: PredictiveAnalysisCardProps) => {
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
        <ForecastChart
          processedData={processedData}
          categoryAnalysis={categoryAnalysis}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};
