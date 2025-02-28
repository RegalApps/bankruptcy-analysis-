
import { useEffect } from "react";
import { Client } from "./types";
import { useFinancialData } from "./hooks/useFinancialData";
import { NoClientSelected } from "./components/NoClientSelected";
import { LoadingState } from "./components/LoadingState";
import { MetricsGrid } from "./components/MetricsGrid";
import { ExcelDocumentsAlert } from "./components/ExcelDocumentsAlert";
import { FinancialChart } from "./components/FinancialChart";

interface ActivityDashboardProps {
  selectedClient: Client | null;
}

export const ActivityDashboard = ({ selectedClient }: ActivityDashboardProps) => {
  // Add to console to track issues
  console.log("ActivityDashboard - Current selected client:", selectedClient);

  const { 
    metrics, 
    chartData, 
    excelDocuments,
    isLoading
  } = useFinancialData(selectedClient);

  return (
    <div className="space-y-6">
      {/* Show this when no client is selected */}
      {!selectedClient && <NoClientSelected />}
      
      {/* Show dashboard content only when client is selected */}
      {selectedClient && (
        <>
          {isLoading ? (
            <LoadingState clientName={selectedClient.name} />
          ) : (
            <>
              {metrics && <MetricsGrid metrics={metrics} />}
              
              {excelDocuments && excelDocuments.length > 0 && (
                <ExcelDocumentsAlert 
                  documents={excelDocuments} 
                  clientName={selectedClient.name} 
                />
              )}
              
              <FinancialChart 
                chartData={chartData} 
                clientName={selectedClient.name}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};
