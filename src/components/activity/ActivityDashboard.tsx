
import { useState, useEffect } from "react";
import { Client } from "./types";
import { useFinancialData } from "./hooks/useFinancialData";
import { NoClientSelected } from "./components/NoClientSelected";
import { LoadingState } from "./components/LoadingState";
import { MetricsGrid } from "./components/MetricsGrid";
import { ExcelDocumentsAlert } from "./components/ExcelDocumentsAlert";
import { FinancialChart } from "./components/FinancialChart";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface ActivityDashboardProps {
  selectedClient: Client | null;
}

export const ActivityDashboard = ({ selectedClient }: ActivityDashboardProps) => {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Add to console to track issues
  console.log("ActivityDashboard - Current selected client:", selectedClient);

  const { 
    metrics, 
    chartData, 
    expenseBreakdown,
    excelDocuments,
    isLoading,
    refetch
  } = useFinancialData(selectedClient);

  // Set last update time whenever data changes
  useEffect(() => {
    if (metrics) {
      setLastUpdate(new Date());
      if (isUpdating) {
        toast.success("Dashboard data updated in real-time!");
        setIsUpdating(false);
      }
    }
  }, [metrics, isUpdating]);

  // Set up listener for manual updates from other components
  useEffect(() => {
    if (!selectedClient) return;
    
    const handleDataUpdate = (event: CustomEvent) => {
      if (event.detail?.clientId === selectedClient.id) {
        console.log("ActivityDashboard - Detected data change event, refreshing...");
        setIsUpdating(true);
        refetch();
      }
    };
    
    // Listen for the custom event
    window.addEventListener('financial-data-updated' as any, handleDataUpdate);
    
    return () => {
      window.removeEventListener('financial-data-updated' as any, handleDataUpdate);
    };
  }, [selectedClient, refetch]);

  return (
    <div className="space-y-6">
      {/* Show this when no client is selected */}
      {!selectedClient && <NoClientSelected />}
      
      {/* Show dashboard content only when client is selected */}
      {selectedClient && (
        <>
          {/* Status header showing last update */}
          {lastUpdate && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-2 py-1">
                  {isUpdating ? (
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  ) : null}
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </Badge>
                {isUpdating && <span className="text-xs text-muted-foreground">Updating in real-time...</span>}
              </div>
            </div>
          )}
          
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
                expenseBreakdown={expenseBreakdown}
                clientName={selectedClient.name}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};
