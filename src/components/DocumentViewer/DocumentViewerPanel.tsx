
import React, { useState } from "react";
import { useDocumentViewer } from "./hooks/useDocumentViewer";
import { DocumentPreview } from "./DocumentPreview";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, RefreshCw, AlertTriangle } from "lucide-react";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { DocumentAnalysis } from "./DocumentAnalysis";
import { DocumentTasks } from "./DocumentTasks";
import { DocumentRisk } from "@/utils/documents/types";

interface DocumentViewerPanelProps {
  documentId: string;
  onClose?: () => void;
}

export const DocumentViewerPanel: React.FC<DocumentViewerPanelProps> = ({
  documentId,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<string>("preview");
  const { 
    document, 
    loading, 
    loadingError, 
    isNetworkError,
    handleRefresh
  } = useDocumentViewer(documentId);

  // Extract metadata from document if available
  const metadata = document?.metadata;
  
  // Extract analysis from document if available
  const analysis = document?.analysis && document.analysis.length > 0
    ? document.analysis[0].content
    : undefined;
  
  // Extract summary and risks from analysis if available
  const summary = analysis?.extracted_info?.summary || "No summary available.";
  
  // Convert risks to the expected DocumentRisk format, ensuring each risk has an id
  const risks: DocumentRisk[] = (analysis?.risks || []).map((risk: any, index: number) => ({
    id: risk.id || `risk-${index}`, // Add id if missing
    type: risk.type || '',
    severity: risk.severity || 'low',
    description: risk.description || '',
    position: risk.position || undefined,
    regulation: risk.regulation || undefined,
    impact: risk.impact || undefined,
    solution: risk.solution || undefined,
    status: risk.status || 'open',
    deadline: risk.deadline || undefined
  }));

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-card px-4 py-3 flex items-center justify-between border-b">
        <div>
          <h3 className="font-semibold text-lg">{document?.title || "Document Viewer"}</h3>
          {document && <p className="text-sm text-muted-foreground">{document.type || "Unknown document type"}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <LoadingSpinner size="lg" className="mx-auto mb-4" />
              <p>Loading document...</p>
            </div>
          </div>
        ) : loadingError ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-8 max-w-md">
              <div className="bg-red-100 p-4 rounded-full inline-flex mb-4">
                <AlertTriangle className="text-red-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Error Loading Document</h3>
              <p className="text-gray-600 mb-4">{loadingError}</p>
              <Button onClick={handleRefresh}>Try Again</Button>
            </div>
          </div>
        ) : document ? (
          <Tabs
            defaultValue="preview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="bg-card px-4 border-b">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent 
              value="preview" 
              className="flex-1 overflow-auto p-0 m-0 data-[state=active]:flex flex-col"
            >
              <DocumentPreview 
                documentId={documentId}
                storagePath={document.storage_path}
                title={document.title}
              />
            </TabsContent>
            
            <TabsContent 
              value="analysis" 
              className="flex-1 overflow-auto p-4 m-0"
            >
              <DocumentAnalysis
                summary={summary}
                risks={risks}
                extractedInfo={analysis?.extracted_info}
                complianceStatus={analysis?.regulatory_compliance ? {
                  overall: analysis.regulatory_compliance.status || 'pending',
                  details: analysis.regulatory_compliance.details || 'Compliance analysis in progress.',
                  score: 0.8 // Example score
                } : undefined}
              />
            </TabsContent>
            
            <TabsContent 
              value="tasks" 
              className="flex-1 overflow-auto p-4 m-0"
            >
              <DocumentTasks
                tasks={generateSampleTasks(documentId, document.title, risks)}
              />
            </TabsContent>
            
            <TabsContent 
              value="comments" 
              className="flex-1 overflow-auto p-4 m-0"
            >
              <div className="text-center py-12 text-gray-500">
                <p>Comments feature coming soon.</p>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p>Document not found</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to generate sample tasks from risks (in a production app, these would come from the backend)
function generateSampleTasks(documentId: string, documentName: string, risks: DocumentRisk[]) {
  const tasks = [];
  
  // Add one task for each critical or high risk
  const criticalRisks = risks.filter(risk => risk.severity === 'critical' || risk.severity === 'high');
  
  for (const risk of criticalRisks) {
    tasks.push({
      taskID: `TASK-${Math.random().toString(36).substring(2, 10)}`,
      sourceReference: risk.id || 'unknown',
      taskTitle: getTaskTitleFromRisk(risk),
      taskDescription: risk.description,
      taskType: "DOCUMENT_CORRECTION",
      severity: risk.severity,
      status: 'open',
      dueDate: getTaskDueDate(risk.severity),
      daysRemaining: getDaysRemaining(getTaskDueDate(risk.severity)),
      assignedTo: {
        userRole: "trustee",
        userName: ""
      },
      documentReferences: [
        {
          documentID: documentId,
          documentName: documentName,
          page: risk.position?.page
        }
      ],
      actionRequired: {
        actionType: "CORRECTION",
        actionInstructions: risk.solution || `Address the following issue: ${risk.description}`
      }
    });
  }
  
  // Add a sample completion task if no tasks were created
  if (tasks.length === 0 && risks.length > 0) {
    const risk = risks[0];
    tasks.push({
      taskID: `TASK-${Math.random().toString(36).substring(2, 10)}`,
      sourceReference: risk.id || 'unknown',
      taskTitle: "Review document risks",
      taskDescription: "Review all identified risks and determine necessary actions",
      taskType: "REVIEW",
      severity: "medium",
      status: 'open',
      dueDate: getTaskDueDate("medium"),
      daysRemaining: getDaysRemaining(getTaskDueDate("medium")),
      assignedTo: {
        userRole: "case_manager",
        userName: ""
      },
      documentReferences: [
        {
          documentID: documentId,
          documentName: documentName
        }
      ],
      actionRequired: {
        actionType: "REVIEW",
        actionInstructions: "Review all identified risks and create action items as needed."
      }
    });
  }
  
  return tasks;
}

function getTaskTitleFromRisk(risk: DocumentRisk): string {
  if (risk.type.includes('MISSING')) {
    return `Add missing ${risk.type.replace('MISSING_', '').replace(/_/g, ' ').toLowerCase()}`;
  }
  
  if (risk.type.includes('INCOMPLETE')) {
    return `Complete ${risk.type.replace('INCOMPLETE_', '').replace(/_/g, ' ').toLowerCase()}`;
  }
  
  if (risk.solution) {
    // Extract first sentence from solution
    const firstSentence = risk.solution.split('.')[0].trim();
    if (firstSentence) {
      return firstSentence;
    }
  }
  
  return risk.description;
}

function getTaskDueDate(severity: string): string {
  const date = new Date();
  
  switch(severity) {
    case 'critical':
      date.setDate(date.getDate() + 1);
      break;
    case 'high':
      date.setDate(date.getDate() + 3);
      break;
    default:
      date.setDate(date.getDate() + 7);
  }
  
  return date.toISOString().split('T')[0];
}

function getDaysRemaining(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueDate = new Date(dateStr);
  dueDate.setHours(0, 0, 0, 0);
  
  const diffTime = dueDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
