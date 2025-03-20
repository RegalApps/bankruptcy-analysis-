
import React from "react";
import { RealTimeAnalyticsPanel } from "../../components/RealTimeAnalyticsPanel";
import { IncomeExpenseData } from "../../types";

interface AnalyticsSidebarProps {
  formData: IncomeExpenseData;
  previousMonthData: any;
  historicalData: any;
}

export const AnalyticsSidebar = ({
  formData,
  previousMonthData,
  historicalData
}: AnalyticsSidebarProps) => {
  return (
    <div className="w-1/4 border-l p-4 overflow-y-auto bg-slate-50">
      <h3 className="text-lg font-medium mb-4">📈 Real-time Analysis</h3>
      <RealTimeAnalyticsPanel 
        formData={formData}
        previousMonthData={previousMonthData}
        historicalData={historicalData}
      />
    </div>
  );
};
