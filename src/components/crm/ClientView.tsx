
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientProfilePanel } from "./components/profile/ClientProfilePanel";
import { ClientInteractionsPanel } from "./components/interactions/ClientInteractionsPanel";
import { ClientDocumentsTab } from "./components/documents/ClientDocumentsTab";
import { ClientInsightData } from "./types";

// Mock client data for the example
const mockClientData: ClientInsightData = {
  clientProfile: {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Inc.",
    role: "Chief Technology Officer",
    website: "www.acmeinc.com",
    avatarUrl: "",
    tags: ["VIP", "Tech", "Enterprise"],
    assignedAgent: "Jane Smith",
    leadDescription: "Looking for financial restructuring options",
    leadSource: "Website Inquiry",
    accountStatus: "Active",
  },
  financialData: {
    income: 120000,
    expenses: 85000,
    assets: 350000,
    liabilities: 275000,
    creditScore: 720,
  },
  interactions: [
    {
      date: "2023-06-01",
      type: "Email",
      description: "Sent initial consultation information",
    },
    {
      date: "2023-06-03",
      type: "Call",
      description: "Discussed financial options for 30 minutes",
    },
    {
      date: "2023-06-10",
      type: "Meeting",
      description: "In-person meeting to review documents",
    },
  ],
  // Required fields to match the type definition
  riskLevel: "medium",
  riskScore: 65,
  complianceStatus: "compliant",
  caseProgress: 42,
  pendingTasks: [
    { id: "1", title: "Review proposal", priority: "high" },
    { id: "2", title: "Schedule meeting", priority: "medium" }
  ],
  missingDocuments: [
    "Bank statement",
    "Tax return",
    "Credit report"
  ],
  recentActivities: [
    { 
      id: "1", 
      type: "email", 
      action: "Sent initial proposal", 
      timestamp: "2023-06-15T10:30:00Z" 
    },
    { 
      id: "2", 
      type: "call", 
      action: "Follow-up call", 
      timestamp: "2023-06-16T14:45:00Z" 
    }
  ],
  upcomingDeadlines: [
    { id: "1", title: "Submit documents", date: "2023-07-15", priority: "high" },
    { id: "2", title: "Review meeting", date: "2023-07-20", priority: "medium" }
  ]
};

interface ClientViewProps {
  clientId?: string;
}

export const ClientView = ({ clientId = '1' }: ClientViewProps) => {
  const [activeTab, setActiveTab] = useState("profile");
  
  // In a real app, you would fetch client data based on clientId
  const clientInfo = {
    id: clientId,
    name: mockClientData.clientProfile?.name || "Unknown Client",
    email: mockClientData.clientProfile?.email,
    company: mockClientData.clientProfile?.company,
    status: "active",
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-2 bg-muted/40">
        <h2 className="text-lg font-semibold">{clientInfo.name}</h2>
        <p className="text-sm text-muted-foreground">{clientInfo.email}</p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className="border-b px-4">
          <TabsList className="h-10">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="interactions">Activity & Notes</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 p-4 overflow-auto">
          <TabsContent value="profile" className="mt-0 h-full">
            <ClientProfilePanel
              insights={mockClientData}
              clientName={clientInfo.name}
            />
          </TabsContent>

          <TabsContent value="interactions" className="mt-0 h-full">
            <ClientInteractionsPanel
              clientId={clientId}
              interactions={mockClientData.interactions || []}
            />
          </TabsContent>

          <TabsContent value="documents" className="mt-0 h-full">
            <ClientDocumentsTab client={clientInfo} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
