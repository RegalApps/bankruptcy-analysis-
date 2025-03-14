
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
        <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
          <CardTitle>Financial Analysis</CardTitle>
          <TabsList>
            <TabsTrigger 
              value="metrics" 
              onClick={() => setActiveAnalysisTab("metrics")}
              data-state={activeAnalysisTab === "metrics" ? "active" : ""}
            >
              Metrics
            </TabsTrigger>
            <TabsTrigger 
              value="comparison"
              onClick={() => setActiveAnalysisTab("comparison")}
              data-state={activeAnalysisTab === "comparison" ? "active" : ""}
            >
              Comparison
            </TabsTrigger>
            <TabsTrigger 
              value="alerts"
              onClick={() => setActiveAnalysisTab("alerts")}
              data-state={activeAnalysisTab === "alerts" ? "active" : ""}
            >
              Alerts
            </TabsTrigger>
          </TabsList>
        </div>
      </CardHeader>
      <CardContent>
        {activeAnalysisTab === "metrics" && (
          <MetricsGrid metrics={metrics} />
        )}
        
        {activeAnalysisTab === "comparison" && (
          <HistoricalComparison
            currentPeriod={currentPeriod}
            previousPeriod={previousPeriod}
          />
        )}
        
        {activeAnalysisTab === "alerts" && (
          <AnalysisAlerts
            riskLevel={metrics?.riskLevel || "Low"}
            seasonalityScore={seasonalityScore}
          />
        )}
      </CardContent>
    </Card>
  );
};
