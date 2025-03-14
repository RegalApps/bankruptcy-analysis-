
import React, { useState } from "react";
import { Client } from "./types";
import { useIncomeExpenseForm } from "./hooks/useIncomeExpenseForm";
import { usePredictiveData } from "./hooks/usePredictiveData";
import { useDashboardData } from "./dashboard/useDashboardData";
import { RealTimeAnalyticsPanel } from "./components/RealTimeAnalyticsPanel";
import { NoClientSelected } from "./components/NoClientSelected";
import { LoadingState } from "./components/LoadingState";
import { ExcelDocumentsAlert } from "./components/ExcelDocumentsAlert";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { FinancialAnalysisCard } from "./dashboard/FinancialAnalysisCard";
import { FinancialChartCard } from "./dashboard/FinancialChartCard";
import { FinancialSnapshotCard } from "./dashboard/FinancialSnapshotCard";
import { PredictiveAnalysisCard } from "./dashboard/PredictiveAnalysisCard";

interface ActivityDashboardProps {
  selectedClient: Client | null;
}

export const ActivityDashboard = ({ selectedClient }: ActivityDashboardProps) => {
  const [activeAnalysisTab, setActiveAnalysisTab] = useState("metrics");
  const [showPredictiveAnalysis, setShowPredictiveAnalysis] = useState(false);
  
  const {
    formData,
    isSubmitting,
    historicalData,
    isDataLoading,
    handleSubmit,
  } = useIncomeExpenseForm(selectedClient);

  const {
    processedData,
    metrics: predictiveMetrics,
    categoryAnalysis,
    isLoading: isPredictiveLoading,
    lastRefreshed,
    refetch: refreshPredictiveData
  } = usePredictiveData(selectedClient);

  const {
    metrics,
    mockChartData,
    mockExcelDocuments,
    seasonalityScore,
    expenseBreakdown
  } = useDashboardData(selectedClient, formData, historicalData);

  if (!selectedClient) {
    return <NoClientSelected />;
  }

  if (isDataLoading) {
    return <LoadingState clientName={selectedClient.name} />;
  }

  return (
    <div className="space-y-6">
      <DashboardHeader 
        selectedClient={selectedClient}
        formData={formData}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
      />

      <RealTimeAnalyticsPanel formData={formData} />

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Current Financial Analysis</h3>
        <button 
          onClick={() => setShowPredictiveAnalysis(!showPredictiveAnalysis)}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {showPredictiveAnalysis ? 'Hide Predictive Analysis' : 'Show Predictive Analysis'}
        </button>
      </div>

      {showPredictiveAnalysis && (
        <PredictiveAnalysisCard
          clientName={selectedClient.name}
          lastRefreshed={lastRefreshed}
          processedData={processedData}
          categoryAnalysis={categoryAnalysis}
          isLoading={isPredictiveLoading}
          onRefresh={refreshPredictiveData}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <FinancialAnalysisCard
            activeAnalysisTab={activeAnalysisTab}
            setActiveAnalysisTab={setActiveAnalysisTab}
            metrics={metrics}
            currentPeriod={historicalData.currentPeriod}
            previousPeriod={historicalData.previousPeriod}
            seasonalityScore={seasonalityScore}
          />

          <FinancialChartCard
            chartData={mockChartData}
            expenseBreakdown={expenseBreakdown}
            clientName={selectedClient.name}
          />
        </div>

        <div className="space-y-6">
          <ExcelDocumentsAlert
            documents={mockExcelDocuments}
            clientName={selectedClient.name}
          />
          
          <FinancialSnapshotCard
            formData={formData}
            currentSurplus={metrics?.currentSurplus || "0"}
          />
        </div>
      </div>
    </div>
  );
};
