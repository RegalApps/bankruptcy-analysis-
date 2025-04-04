import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { DocumentPreview } from "./DocumentPreview";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, Check, Download, Eye, MessageSquare, Share } from "lucide-react";
import { RiskAssessment } from "./components/RiskAssessment";
import { DocumentMetadata } from "./components/DocumentMetadata";
import { DocumentVersions } from "./components/DocumentVersions";
import { CollaborationPanel } from "./CollaborationPanel/index";
import { useDocumentViewer } from "./hooks/useDocumentViewer";

interface DocumentViewerProps {
  documentId: string;
  documentTitle?: string;
  isForm47?: boolean;
  bypassAnalysis?: boolean;
  bypassProcessing?: boolean;
  onLoadFailure?: () => void;
  onBack?: () => void;
  onAnalysisComplete?: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  documentId,
  documentTitle = "Document",
  isForm47 = false,
  bypassAnalysis = false,
  bypassProcessing = false,
  onLoadFailure,
  onBack,
  onAnalysisComplete
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [activeRiskId, setActiveRiskId] = useState<string | null>(null);
  
  const {
    document,
    loading,
    loadingError,
    handleRefresh
  } = useDocumentViewer(documentId);

  const handleRiskSelect = (riskId: string | null) => {
    setActiveRiskId(riskId);
    if (riskId) {
      setActiveTab("risks");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full border rounded-md bg-muted/30">
        <div className="flex flex-col items-center text-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <h3 className="text-lg font-medium">Loading Document</h3>
          <p className="text-muted-foreground mt-2">Please wait while we load the document...</p>
        </div>
      </div>
    );
  }

  if (loadingError) {
    return (
      <div className="flex items-center justify-center h-full border rounded-md bg-muted/30">
        <div className="flex flex-col items-center text-center p-8 max-w-md">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-medium">Error Loading Document</h3>
          <p className="text-muted-foreground mt-2 mb-4">{loadingError}</p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleRefresh}>Try Again</Button>
            {onBack && <Button onClick={onBack}>Go Back</Button>}
          </div>
        </div>
      </div>
    );
  }

  const title = document?.title || documentTitle;
  const storagePath = document?.storage_path || `documents/${documentId}.pdf`;
  
  const documentRisks = document?.analysis?.[0]?.content?.risks || [];

  const handleCommentAdded = () => {
    handleRefresh();
  };

  return (
    <div className="flex flex-col h-full border rounded-md bg-card overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">
              Document ID: {documentId.substring(0, 8)}...
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1.5" />
            Download
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-1.5" />
            Share
          </Button>
          <Button size="sm">
            <Check className="h-4 w-4 mr-1.5" />
            Approve
          </Button>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={25} minSize={20} maxSize={40} className="border-r">
          <CollaborationPanel 
            document={document} 
            documentId={documentId}
            onCommentAdded={handleCommentAdded}
            activeRiskId={activeRiskId}
            onRiskSelect={handleRiskSelect}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col bg-muted/10">
            <DocumentPreview 
              storagePath={storagePath} 
              documentId={documentId} 
              title={title} 
              bypassAnalysis={bypassAnalysis || bypassProcessing}
              onAnalysisComplete={onAnalysisComplete}
              activeRiskId={activeRiskId}
              onRiskSelect={handleRiskSelect}
            />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="w-full px-4 pt-3 pb-0 justify-start border-b rounded-none gap-2">
              <TabsTrigger value="details" className="text-xs data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                Details
              </TabsTrigger>
              <TabsTrigger value="risks" className="text-xs data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                Risks {documentRisks.length > 0 && `(${documentRisks.length})`}
              </TabsTrigger>
              <TabsTrigger value="versions" className="text-xs data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                Versions
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="p-4 flex-1 overflow-auto">
              {document && <DocumentMetadata document={document} />}
            </TabsContent>
            
            <TabsContent value="risks" className="p-0 m-0 flex-1 overflow-auto">
              <RiskAssessment 
                risks={documentRisks} 
                documentId={documentId} 
                activeRiskId={activeRiskId}
                onRiskSelect={handleRiskSelect}
              />
            </TabsContent>
            
            <TabsContent value="versions" className="p-4 flex-1 overflow-auto">
              {document?.versions && (
                <DocumentVersions 
                  documentVersions={document.versions} 
                  currentDocumentId={documentId}
                />
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
