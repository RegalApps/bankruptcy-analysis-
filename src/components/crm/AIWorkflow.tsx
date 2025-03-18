
import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { WorkflowHeader } from "./ai-workflow/WorkflowHeader";
import { CommunicationHub } from "./ai-workflow/CommunicationHub";
import { DocumentAutomation } from "./ai-workflow/DocumentAutomation";
import { ComplianceMonitoring } from "./ai-workflow/ComplianceMonitoring";

export const AIWorkflow = () => {
  const [activeTab, setActiveTab] = useState("communication");

  return (
    <div className="space-y-6">
      <WorkflowHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <TabsContent value="communication" className="space-y-4">
        <CommunicationHub />
      </TabsContent>

      <TabsContent value="document" className="space-y-4">
        <DocumentAutomation />
      </TabsContent>

      <TabsContent value="compliance" className="space-y-4">
        <ComplianceMonitoring />
      </TabsContent>
    </div>
  );
};
