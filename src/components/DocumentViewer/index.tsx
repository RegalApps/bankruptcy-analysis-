
import React, { useState, useEffect } from "react";
import { ViewerLayout } from "./layout/ViewerLayout";
import { ClientDetails } from "./components/ClientDetails";
import { DocumentSummary } from "./components/DocumentSummary";
import { RiskAssessment } from "./RiskAssessment";
import { Comments } from "./Comments";
import { TaskManager } from "./TaskManager";
import { DocumentVersions } from "./components/DocumentVersions";
import { DeadlineManager } from "./DeadlineManager";
import { AnalysisPanel } from "./components/AnalysisPanel";
import { DocumentPreview } from "./DocumentPreview";
import { useDocumentViewer } from "./useDocumentViewer";
import { useDocumentAnalysisAI } from "./hooks/useDocumentAnalysisAI";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DocumentViewerProps {
  documentId: string;
  documentTitle?: string;
  isForm47?: boolean;
  isForm31GreenTech?: boolean;
  onLoadFailure?: () => void;
  bypassProcessing?: boolean;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  documentId,
  documentTitle = "Document",
  isForm47 = false,
  isForm31GreenTech = false,
  onLoadFailure = () => {},
  bypassProcessing = false
}) => {
  const { document, loading, fetchDocumentDetails } = useDocumentViewer(documentId);
  const { analyzeDocument, isAnalyzing, result, error } = useDocumentAnalysisAI();
  const [activeRiskId, setActiveRiskId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const documentType = document?.type || (isForm47 ? "Form 47" : isForm31GreenTech ? "Form 31" : "Document");

  useEffect(() => {
    if (document && !document.analysis?.length && !isAnalyzing && !bypassProcessing) {
      analyzeDocument(documentId, undefined, documentType);
    }
  }, [document, documentId, documentType, isAnalyzing, bypassProcessing]);

  const handleRefreshAnalysis = () => {
    analyzeDocument(documentId, undefined, documentType);
  };

  const handleRiskSelect = (riskId: string) => {
    setActiveRiskId(riskId === activeRiskId ? null : riskId);
  };
  
  const handleCommentAdded = () => {
    fetchDocumentDetails();
  };

  // Build the right panel content
  const rightPanelContent = (
    <div className="space-y-6">
      {document && document.analysis?.[0]?.content?.extracted_info ? (
        <>
          <ClientDetails extractedInfo={document.analysis[0].content.extracted_info} />
          <DocumentSummary summary={document.analysis[0].content.extracted_info.summary || ''} />
        </>
      ) : loading ? (
        <>
          <Skeleton className="h-[200px] w-full rounded-md mb-4" />
          <Skeleton className="h-[150px] w-full rounded-md" />
        </>
      ) : (
        <div className="space-y-2">
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No document data available</AlertTitle>
            <AlertDescription>
              We couldn't find any extracted information for this document.
            </AlertDescription>
          </Alert>
          
          {!isAnalyzing && (
            <Button 
              onClick={handleRefreshAnalysis}
              variant="outline"
              className="w-full"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Analyze Document
                </>
              )}
            </Button>
          )}
        </div>
      )}
      
      {document && (
        <RiskAssessment 
          documentId={documentId}
          risks={document.analysis?.[0]?.content?.risks || []}
          isLoading={loading || isAnalyzing}
          activeRiskId={activeRiskId}
          onRiskSelect={handleRiskSelect}
        />
      )}
    </div>
  );

  // Create empty div for sidebar content
  const sidebarContent = <div></div>;

  return (
    <ViewerLayout
      documentTitle={document?.title || documentTitle}
      documentType={documentType}
      isForm47={isForm47}
      mainContent={
        <DocumentPreview
          documentId={documentId}
          document={document}
          loading={loading}
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
          onLoadFailure={onLoadFailure}
          isForm31GreenTech={isForm31GreenTech}
          activeRiskId={activeRiskId}
          onRiskSelect={handleRiskSelect}
        />
      }
      rightPanel={rightPanelContent}
      sidebar={sidebarContent}
      collaborationPanel={
        <Comments
          documentId={documentId}
          comments={document?.comments || []}
          onCommentAdded={handleCommentAdded}
        />
      }
      taskPanel={
        <TaskManager
          documentId={documentId}
          activeRiskId={activeRiskId}
          onRiskSelect={handleRiskSelect}
          isLoading={loading}
        />
      }
      versionPanel={
        <DocumentVersions
          documentId={documentId}
          documentVersions={document?.versions || []}
          currentDocumentId={documentId}
          isLoading={loading}
        />
      }
      deadlinesPanel={
        <DeadlineManager
          documentId={documentId}
          deadlines={document?.deadlines || []}
          isLoading={loading}
          onDeadlineUpdated={fetchDocumentDetails}
        />
      }
      analysisPanel={
        <AnalysisPanel
          documentId={documentId}
          isLoading={loading}
          analysis={document?.analysis?.[0]?.content}
        />
      }
    />
  );
};
