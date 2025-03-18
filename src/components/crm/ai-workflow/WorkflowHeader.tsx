
import { MessageSquare, CheckCircle, AlertCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WorkflowHeaderProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const WorkflowHeader = ({ activeTab, setActiveTab }: WorkflowHeaderProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">AI-Powered Workflows</h2>
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
          AI Enhanced
        </span>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="communication">
            <MessageSquare className="h-4 w-4 mr-2" />
            Communication Hub
          </TabsTrigger>
          <TabsTrigger value="document">
            <CheckCircle className="h-4 w-4 mr-2" />
            Document Automation
          </TabsTrigger>
          <TabsTrigger value="compliance">
            <AlertCircle className="h-4 w-4 mr-2" />
            Compliance Monitoring
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
