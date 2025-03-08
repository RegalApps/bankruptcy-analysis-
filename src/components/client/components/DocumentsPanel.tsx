
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Clock } from "lucide-react";
import { DocumentList } from "./DocumentList";
import { ActivityHistoryTab } from "./ActivityHistoryTab";
import { Document } from "../types";

interface DocumentsPanelProps {
  documents: Document[];
  activeTab: string;
  setActiveTab: (value: string) => void;
  onDocumentOpen: (documentId: string) => void;
}

export const DocumentsPanel = ({ 
  documents, 
  activeTab, 
  setActiveTab, 
  onDocumentOpen 
}: DocumentsPanelProps) => {
  return (
    <div className="p-4 h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-1.5" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="h-4 w-4 mr-1.5" />
            Activity History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents" className="mt-0">
          <DocumentList 
            documents={documents} 
            onDocumentOpen={onDocumentOpen} 
          />
        </TabsContent>
        
        <TabsContent value="history" className="mt-0">
          <ActivityHistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
