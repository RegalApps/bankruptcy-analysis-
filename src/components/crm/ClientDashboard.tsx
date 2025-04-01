
import { useState, useEffect } from "react";
import { useClientInsights } from "./hooks/useClientInsights";
import { ClientProfilePanel } from "./components/profile/ClientProfilePanel";
import { ClientActivityPanel } from "./components/profile/ClientActivityPanel";
import { ClientIntelligencePanel } from "./components/profile/ClientIntelligencePanel";
import { ClientGridView } from "./components/ClientGridView";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, UserPlus } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

interface ClientDashboardProps {
  clientId?: string;
  clientName?: string;
}

export const ClientDashboard = ({ clientId: propClientId, clientName: propClientName }: ClientDashboardProps) => {
  const [selectedClientId, setSelectedClientId] = useState<string>(propClientId || "1");
  const [selectedClientName, setSelectedClientName] = useState<string>(propClientName || "John Doe");
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"detail" | "grid">("detail");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { insightData, isLoading, error } = useClientInsights(selectedClientId);

  // Mock client list - in a real app, this would come from an API
  const clients = [
    { id: "1", name: "John Doe", company: "Acme Inc.", status: "active", lastActivity: "2023-06-10", riskScore: 85 },
    { id: "2", name: "Jane Smith", company: "Tech Solutions", status: "inactive", lastActivity: "2023-05-20", riskScore: 45 },
    { id: "3", name: "Robert Johnson", company: "Global Services", status: "at_risk", lastActivity: "2023-06-15", riskScore: 62 }
  ];

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setSelectedClientName(client.name);
    }
    setView("detail");
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-[450px]" />
          <Skeleton className="h-[450px]" />
          <Skeleton className="h-[450px]" />
        </div>
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
        <div className="text-center p-6">
          <h3 className="text-lg font-medium">No Client Selected</h3>
          <p className="text-muted-foreground">Please select a client to view their dashboard.</p>
        </div>
      </div>
    );
  }

  // Render grid view for multiple clients
  if (view === "grid") {
    return (
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Client Management</h1>
          
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-[250px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="at_risk">At Risk</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={() => setView("detail")} className="w-full md:w-auto">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </div>
        </div>

        <ClientGridView 
          clients={clients} 
          onSelectClient={handleClientChange}
          searchQuery={searchQuery}
          filterStatus={filterStatus}
        />
      </div>
    );
  }

  // Render detailed client profile view
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{selectedClientName}'s Profile</h1>
          <Badge 
            variant={insightData.riskLevel === "high" ? "destructive" : insightData.riskLevel === "medium" ? "outline" : "secondary"}
            className="text-xs"
          >
            {insightData.riskLevel === "high" ? "At Risk" : insightData.riskLevel === "medium" ? "Needs Attention" : "Healthy"}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedClientId} onValueChange={handleClientChange}>
            <SelectTrigger className="w-full md:w-[200px]">
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

          <Button variant="outline" onClick={() => setView("grid")}>
            View All Clients
          </Button>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="min-h-[500px] rounded-lg border">
        <ResizablePanel defaultSize={25} minSize={20}>
          <ClientProfilePanel insights={insightData} clientName={selectedClientName} />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={45} minSize={30}>
          <ClientActivityPanel insights={insightData} />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={30} minSize={20}>
          <ClientIntelligencePanel insights={insightData} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
