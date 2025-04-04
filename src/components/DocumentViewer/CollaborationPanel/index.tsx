
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentDetails } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EnhancedComments } from "../Comments/EnhancedComments";
import { MessageSquare, Clock, ClipboardList, Calendar } from "lucide-react";
import { TaskManager } from "../TaskManager";
import { DocumentVersions } from "../components/DocumentVersions";
import { DeadlineManager } from "../DeadlineManager";

interface CollaborationPanelProps {
  document?: DocumentDetails;
  documentId?: string;  // Ensuring documentId is explicitly defined in the interface
  onCommentAdded?: () => void;
  activeRiskId?: string | null;
  onRiskSelect?: (riskId: string | null) => void;
}

export const CollaborationPanel: React.FC<CollaborationPanelProps> = ({ 
  document,
  documentId,
  onCommentAdded = () => {},
  activeRiskId,
  onRiskSelect
}) => {
  const docId = documentId || document?.id;
  const [activeTab, setActiveTab] = useState("comments");
  
  // Effect to activate tasks tab when a risk is selected
  useEffect(() => {
    if (activeRiskId) {
      setActiveTab("tasks");
    }
  }, [activeRiskId]);
  
  if (!docId) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">No document information available</p>
      </div>
    );
  }

  return (
    <Card className="h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="p-1 px-2 border-b">
          <TabsList className="w-full">
            <TabsTrigger value="comments" className="flex items-center text-xs py-1.5">
              <MessageSquare className="h-3.5 w-3.5 mr-1" />
              Comments
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center text-xs py-1.5">
              <ClipboardList className="h-3.5 w-3.5 mr-1" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="deadlines" className="flex items-center text-xs py-1.5">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              Deadlines
            </TabsTrigger>
            <TabsTrigger value="versions" className="flex items-center text-xs py-1.5">
              <Clock className="h-3.5 w-3.5 mr-1" />
              Versions
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <TabsContent value="comments" className="mt-0 h-full">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="p-3">
                <EnhancedComments 
                  documentId={docId} 
                  onCommentAdded={onCommentAdded}
                />
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-0 h-full">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="p-3">
                <TaskManager
                  documentId={docId}
                  activeRiskId={activeRiskId}
                  onRiskSelect={onRiskSelect}
                />
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="deadlines" className="mt-0 h-full">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="p-3">
                {document && <DeadlineManager document={document} onDeadlineUpdated={onCommentAdded} />}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="versions" className="mt-0 h-full">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="p-3">
                {document?.versions ? (
                  <DocumentVersions 
                    documentVersions={document.versions} 
                    currentDocumentId={docId}
                  />
                ) : (
                  <p className="text-muted-foreground">Version history is not available at this time.</p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
};
