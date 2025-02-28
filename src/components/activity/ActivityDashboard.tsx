
import { useState } from "react";
import { toast } from "sonner";
import { Client } from "./types";
import { useFinancialData } from "./hooks/useFinancialData";
import { ClientSelectionCard } from "./components/ClientSelectionCard";
import { NoClientSelected } from "./components/NoClientSelected";
import { LoadingState } from "./components/LoadingState";
import { MetricsGrid } from "./components/MetricsGrid";
import { ExcelDocumentsAlert } from "./components/ExcelDocumentsAlert";
import { FinancialChart } from "./components/FinancialChart";

export const ActivityDashboard = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Add to console to track issues
  console.log("Current selected client:", selectedClient);

  const { 
    metrics, 
    chartData, 
    excelDocuments,
    isLoading
  } = useFinancialData(selectedClient);

  // Handle client selection
  const handleClientSelect = (clientId: string) => {
    console.log("Client selected:", clientId);
    
    // Reset metrics when changing clients
    const client = {
      id: clientId,
      name: clientId === "1" ? "John Doe" : "Reginald Dickerson",
      status: "active" as const,
      last_activity: "2024-03-10",
    };
    
    setSelectedClient(client);
    toast.success(`Selected client: ${client.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Client Selection Card */}
      <ClientSelectionCard 
        selectedClient={selectedClient} 
        onClientSelect={handleClientSelect} 
      />
      
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
