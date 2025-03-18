
import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { WorkflowHeader } from "./ai-workflow/WorkflowHeader";
import { CommunicationHub } from "./ai-workflow/CommunicationHub";
import { DocumentAutomation } from "./ai-workflow/DocumentAutomation";
import { ComplianceMonitoring } from "./ai-workflow/ComplianceMonitoring";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export const AIWorkflow = () => {
  const [activeTab, setActiveTab] = useState("communication");
  const [selectedClient, setSelectedClient] = useState<string | undefined>();

  // Mock client list - in a real app, this would come from an API
  const clients = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Robert Johnson" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="w-full md:w-64">
          <Label htmlFor="client-select" className="mb-2 block text-sm font-medium">
            Select Client
          </Label>
          <Select value={selectedClient} onValueChange={setSelectedClient}>
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

      <WorkflowHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <TabsContent value="communication" className="space-y-4">
        <CommunicationHub clientId={selectedClient} />
      </TabsContent>

      <TabsContent value="document" className="space-y-4">
        <DocumentAutomation clientId={selectedClient} />
      </TabsContent>

      <TabsContent value="compliance" className="space-y-4">
        <ComplianceMonitoring clientId={selectedClient} />
      </TabsContent>
    </div>
  );
};
