
import { useState, useEffect } from "react";
import { MainHeader } from "@/components/header/MainHeader";
import { MainSidebar } from "@/components/layout/MainSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IncomeExpenseForm } from "@/components/activity/IncomeExpenseForm";
import { ActivityDashboard } from "@/components/activity/ActivityDashboard";
import { PredictiveAnalysis } from "@/components/activity/PredictiveAnalysis";
import { ClientSelector } from "@/components/activity/form/ClientSelector";
import { Client } from "@/components/activity/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const ActivityPage = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState("form");

  // Handle client selection for all tabs
  const handleClientSelect = (clientId: string) => {
    console.log("ActivityPage - Client selected:", clientId);
    
    // Create mock client objects for demonstration
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
    <div className="flex h-screen overflow-hidden bg-background">
      <MainSidebar />
      <div className="flex-1 flex flex-col pl-64">
        <MainHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Smart Income & Expense Management</h1>
            </div>
            
            {/* Global Client Selection Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
                <CardDescription>Select a client to manage their financial data</CardDescription>
              </CardHeader>
              <CardContent>
                <ClientSelector 
                  selectedClient={selectedClient}
                  onClientSelect={handleClientSelect}
                />
              </CardContent>
            </Card>
            
            <Tabs 
              defaultValue="form" 
              className="space-y-4"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList>
                <TabsTrigger value="form">Income & Expense Form</TabsTrigger>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="predictive">Predictive Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="form" className="space-y-4">
                <IncomeExpenseForm selectedClient={selectedClient} />
              </TabsContent>

              <TabsContent value="dashboard">
                <ActivityDashboard selectedClient={selectedClient} />
              </TabsContent>

              <TabsContent value="predictive">
                <PredictiveAnalysis selectedClient={selectedClient} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};
