
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentDetails } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Comments } from "../Comments";
import { MessageSquare, ClipboardList, Clock, Calendar, FileBarChart } from "lucide-react";
import { TaskManager } from "../TaskManager";
import { DeadlineManager } from "../DeadlineManager";
import { DocumentVersions } from "../components/DocumentVersions";

interface CollaborationPanelProps {
  document?: DocumentDetails;
  documentId?: string;
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
        <div className="p-2 bg-muted/20">
          <TabsList className="w-full grid grid-cols-4 p-1">
            <TabsTrigger value="comments" className="flex items-center gap-1 py-2 text-xs">
              <MessageSquare className="h-3 w-3" />
              <span>Comments</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-1 py-2 text-xs">
              <ClipboardList className="h-3 w-3" />
              <span>Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="versions" className="flex items-center gap-1 py-2 text-xs">
              <Clock className="h-3 w-3" />
              <span>Versions</span>
            </TabsTrigger>
            <TabsTrigger value="deadlines" className="flex items-center gap-1 py-2 text-xs">
              <Calendar className="h-3 w-3" />
              <span>Deadlines</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <TabsContent value="comments" className="mt-0 h-full">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="p-3">
                <Comments 
                  documentId={docId}
                  onCommentAdded={onCommentAdded}
                  comments={document?.comments || []}
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
          
          <TabsContent value="versions" className="mt-0 h-full">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="p-3">
                <DocumentVersions
                  documentId={docId}
                  documentVersions={[]}
                />
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="deadlines" className="mt-0 h-full">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="p-3">
                {document && 
                  <DeadlineManager 
                    documentId={docId}
                    deadlines={document?.deadlines || []}
                    onDeadlineUpdated={onCommentAdded}
                  />
                }
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
};
