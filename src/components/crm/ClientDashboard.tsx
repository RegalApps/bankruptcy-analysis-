
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useClientInsights } from "./hooks/useClientInsights";
import { ClientRiskCard } from "./components/ClientRiskCard";
import { CaseProgressCard } from "./components/CaseProgressCard";
import { AiInsightsCard } from "./components/AiInsightsCard";
import { UpcomingDeadlinesCard } from "./components/UpcomingDeadlinesCard";
import { RecentActivitiesCard } from "./components/RecentActivitiesCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ClientDashboardProps {
  clientId?: string;
  clientName?: string;
}

export const ClientDashboard = ({ clientId: propClientId, clientName: propClientName }: ClientDashboardProps) => {
  const [selectedClientId, setSelectedClientId] = useState<string>(propClientId || "1");
  const [selectedClientName, setSelectedClientName] = useState<string>(propClientName || "John Doe");
  const { insightData, isLoading, error } = useClientInsights(selectedClientId);

  // Mock client list - in a real app, this would come from an API
  const clients = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Robert Johnson" }
  ];

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setSelectedClientName(client.name);
    }
  };

  useEffect(() => {
    if (propClientId) {
      setSelectedClientId(propClientId);
    }
    if (propClientName) {
      setSelectedClientName(propClientName);
    }
  }, [propClientId, propClientName]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-[180px]" />
          <Skeleton className="h-[180px]" />
          <Skeleton className="h-[180px]" />
        </div>
        <Skeleton className="h-[250px] mt-4" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!insightData) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Client Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Select a client to view their dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{selectedClientName}'s Dashboard</h1>
        
        <div className="w-full md:w-64">
          <Label htmlFor="client-select" className="mb-2 block text-sm font-medium">
            Select Client
          </Label>
          <Select value={selectedClientId} onValueChange={handleClientChange}>
            <SelectTrigger id="client-select" className="w-full">
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map(client => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ClientRiskCard insights={insightData} />
          <CaseProgressCard insights={insightData} />
          <UpcomingDeadlinesCard insights={insightData} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <AiInsightsCard insights={insightData} />
          </div>
          <RecentActivitiesCard insights={insightData} />
        </div>
      </div>
    </div>
  );
};
