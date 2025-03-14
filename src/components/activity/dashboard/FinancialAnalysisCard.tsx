
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MetricsGrid } from "../components/MetricsGrid";
import { HistoricalComparison } from "../components/HistoricalComparison";
import { AnalysisAlerts } from "../components/AnalysisAlerts";

interface FinancialAnalysisCardProps {
  activeAnalysisTab: string;
  setActiveAnalysisTab: (value: string) => void;
  metrics: {
    currentSurplus: string;
    surplusPercentage: string;
    monthlyTrend: string;
    riskLevel: string;
  } | null;
  currentPeriod: {
    totalIncome: number;
    totalExpenses: number;
    surplusIncome: number;
  };
  previousPeriod: {
    totalIncome: number;
    totalExpenses: number;
    surplusIncome: number;
  };
  seasonalityScore: string | null;
}

export const FinancialAnalysisCard = ({
  activeAnalysisTab,
  setActiveAnalysisTab,
  metrics,
  currentPeriod,
  previousPeriod,
  seasonalityScore
}: FinancialAnalysisCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Tabs
          defaultValue="metrics"
          value={activeAnalysisTab}
          onValueChange={setActiveAnalysisTab}
          className="w-full"
        >
          <div className="flex justify-between items-center">
            <CardTitle>Financial Analysis</CardTitle>
            <TabsList>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </CardHeader>
      <CardContent>
        <TabsContent value="metrics" className="pt-2 pb-0 m-0">
          <MetricsGrid metrics={metrics} />
        </TabsContent>
        <TabsContent value="comparison" className="pt-2 pb-0 m-0">
          <HistoricalComparison
            currentPeriod={currentPeriod}
            previousPeriod={previousPeriod}
          />
        </TabsContent>
        <TabsContent value="alerts" className="pt-2 pb-0 m-0">
          <AnalysisAlerts
            riskLevel={metrics?.riskLevel || "Low"}
            seasonalityScore={seasonalityScore}
          />
        </TabsContent>
      </CardContent>
    </Card>
  );
};
