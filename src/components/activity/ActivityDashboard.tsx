
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricsGrid } from "./components/MetricsGrid";
import { HistoricalComparison } from "./components/HistoricalComparison";
import { FinancialChart } from "./components/FinancialChart";
import { NoClientSelected } from "./components/NoClientSelected";
import { LoadingState } from "./components/LoadingState";
import { ExcelDocumentsAlert } from "./components/ExcelDocumentsAlert";
import { AnalysisAlerts } from "./components/AnalysisAlerts";
import { Client } from "./types";
import { useIncomeExpenseForm } from "./hooks/useIncomeExpenseForm";
import { RealTimeAnalyticsPanel } from "./components/RealTimeAnalyticsPanel";
import { SmartCreateDocumentButton } from "./form/SmartCreateDocumentButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrintButton } from "./form/PrintButton";

interface ActivityDashboardProps {
  selectedClient: Client | null;
}

export const ActivityDashboard = ({ selectedClient }: ActivityDashboardProps) => {
  const [activeAnalysisTab, setActiveAnalysisTab] = useState("metrics");
  const {
    formData,
    isSubmitting,
    historicalData,
    isDataLoading,
    handleSubmit,
  } = useIncomeExpenseForm(selectedClient);

  const [metrics, setMetrics] = useState<{
    currentSurplus: string;
    surplusPercentage: string;
    monthlyTrend: string;
    riskLevel: string;
  } | null>(null);

  useEffect(() => {
    if (selectedClient && !isDataLoading) {
      // Calculate metrics from form data and historical data
      const currentSurplus = (
        parseFloat(formData.total_monthly_income || "0") +
        parseFloat(formData.spouse_total_monthly_income || "0") -
        parseFloat(formData.total_essential_expenses || "0") -
        parseFloat(formData.total_discretionary_expenses || "0") -
        parseFloat(formData.total_savings || "0") -
        parseFloat(formData.total_insurance || "0")
      ).toFixed(2);

      const totalIncome = parseFloat(formData.total_monthly_income || "0") +
                          parseFloat(formData.spouse_total_monthly_income || "0");
      
      const surplusPercentage = totalIncome > 0 
        ? ((parseFloat(currentSurplus) / totalIncome) * 100).toFixed(1)
        : "0";
      
      const monthlyTrend = (
        historicalData.currentPeriod.surplusIncome -
        historicalData.previousPeriod.surplusIncome
      ).toFixed(2);

      // Determine risk level
      let riskLevel = "Low";
      if (parseFloat(currentSurplus) < 0) {
        riskLevel = "High";
      } else if (parseFloat(surplusPercentage) < 10) {
        riskLevel = "Medium";
      }

      setMetrics({
        currentSurplus,
        surplusPercentage,
        monthlyTrend,
        riskLevel,
      });
    }
  }, [selectedClient, formData, historicalData, isDataLoading]);

  if (!selectedClient) {
    return <NoClientSelected />;
  }

  if (isDataLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Financial Dashboard: {selectedClient.name}</h2>
        <div className="flex gap-2">
          <PrintButton formData={formData} />
          <SmartCreateDocumentButton 
            formData={formData}
            selectedClient={selectedClient}
            isSubmitting={isSubmitting}
            onSubmit={() => handleSubmit(new Event('submit') as unknown as React.SyntheticEvent<HTMLFormElement>)}
          />
        </div>
      </div>

      <RealTimeAnalyticsPanel formData={formData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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
                <HistoricalComparison historicalData={historicalData} />
              </TabsContent>
              <TabsContent value="alerts" className="pt-2 pb-0 m-0">
                <AnalysisAlerts formData={formData} />
              </TabsContent>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Income vs. Expenses Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialChart formData={formData} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <ExcelDocumentsAlert clientId={selectedClient.id} />
          
          <Card>
            <CardHeader>
              <CardTitle>Financial Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Monthly Income</h3>
                <p className="text-xl font-bold">
                  ${(parseFloat(formData.total_monthly_income || "0") + 
                     parseFloat(formData.spouse_total_monthly_income || "0")).toFixed(2)}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Essential Expenses</h3>
                <p className="text-xl font-bold">${parseFloat(formData.total_essential_expenses || "0").toFixed(2)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Discretionary Expenses</h3>
                <p className="text-xl font-bold">${parseFloat(formData.total_discretionary_expenses || "0").toFixed(2)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Savings & Insurance</h3>
                <p className="text-xl font-bold">
                  ${(parseFloat(formData.total_savings || "0") + 
                     parseFloat(formData.total_insurance || "0")).toFixed(2)}
                </p>
              </div>
              
              <div className="pt-2 border-t">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Surplus/Deficit</h3>
                <p className={`text-xl font-bold ${parseFloat(metrics?.currentSurplus || "0") >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${parseFloat(metrics?.currentSurplus || "0").toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
