
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientDashboard } from "@/components/crm/ClientDashboard";
import { IntelligentScheduling } from "@/components/crm/IntelligentScheduling";
import { DocumentVault } from "@/components/crm/DocumentVault";
import { AIWorkflow } from "@/components/crm/AIWorkflow";

export const CRMTabs = () => {
  return (
    <Tabs defaultValue="dashboard" className="space-y-4">
      <TabsList>
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
        <TabsTrigger value="documents">Document Vault</TabsTrigger>
        <TabsTrigger value="workflow">AI Workflow</TabsTrigger>
      </TabsList>
      <TabsContent value="dashboard" className="space-y-4">
        <ClientDashboard />
      </TabsContent>
      <TabsContent value="scheduling" className="space-y-4">
        <IntelligentScheduling />
      </TabsContent>
      <TabsContent value="documents" className="space-y-4">
        <DocumentVault />
      </TabsContent>
      <TabsContent value="workflow" className="space-y-4">
        <AIWorkflow />
      </TabsContent>
    </Tabs>
  );
};
