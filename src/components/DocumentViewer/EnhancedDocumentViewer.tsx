
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ViewerLoadingState } from "./components/ViewerLoadingState";
import { ViewerErrorState } from "./components/ViewerErrorState";
import { DocumentPreview } from "./DocumentPreview";
import { RiskAssessment } from "./RiskAssessment";
import { AlertTriangle, AlertCircle, RefreshCcw, Bug, FileText } from "lucide-react";
import { DocumentClientInfo } from "./DocumentClientInfo";
import { useDocumentState } from "./hooks/useDocumentState";
import { DiagnosticsPanel } from "./components/DiagnosticsPanel";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface EnhancedDocumentViewerProps {
  documentId: string;
  documentTitle?: string;
}

export const EnhancedDocumentViewer: React.FC<EnhancedDocumentViewerProps> = ({
  documentId,
  documentTitle
}) => {
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const isDevMode = process.env.NODE_ENV === 'development';
  
  const {
    document,
    loading,
    loadingError,
    analysisError,
    analysisLoading,
    debugInfo,
    fetchDocumentDetails,
    triggerAnalysis
  } = useDocumentState(documentId, documentTitle);
  
  // Initial document fetch
  useEffect(() => {
    if (documentId) {
      fetchDocumentDetails();
    }
  }, [documentId]);
  
  // Set up real-time subscription for analysis updates
  useEffect(() => {
    if (!documentId) return;
    
    const channel = supabase
      .channel(`document_analysis_${documentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'document_analysis',
          filter: `document_id=eq.${documentId}`
        },
        async () => {
          console.log("Real-time update received for document analysis");
          fetchDocumentDetails();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [documentId]);

  if (loading) {
    return <ViewerLoadingState message={`Loading ${documentTitle || "Document"}...`} />;
  }

  if (loadingError) {
    return <ViewerErrorState error={loadingError} onRetry={fetchDocumentDetails} />;
  }

  if (!document) {
    return <ViewerErrorState error="Document not found" onRetry={fetchDocumentDetails} />;
  }

  const analysisContent = document?.analysis?.[0]?.content || {};
  const risks = analysisContent.risks || [];
  const extractedInfo = analysisContent.extracted_info || {};
  const documentSummary = extractedInfo?.summary || analysisContent.summary || "";

  return (
    <div className="flex flex-col h-full">
      {(analysisError || analysisLoading) && (
        <Alert variant={analysisError ? "destructive" : "default"} className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{analysisLoading ? "Processing Document" : "Analysis Issue"}</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <div>{analysisLoading ? "Document analysis in progress..." : analysisError}</div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={triggerAnalysis}
                disabled={analysisLoading}
              >
                <RefreshCcw className={`h-4 w-4 mr-1 ${analysisLoading ? "animate-spin" : ""}`} />
                {analysisLoading ? "Analyzing..." : "Analyze Document"}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowDiagnostics(!showDiagnostics)}
              >
                <Bug className="h-4 w-4 mr-1" />
                {showDiagnostics ? "Hide Diagnostics" : "Show Diagnostics"}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {showDiagnostics && (
        <div className="mb-4">
          <DiagnosticsPanel documentId={documentId} document={document} />
        </div>
      )}
      
      {extractedInfo && Object.keys(extractedInfo).length > 0 && (
        <div className="mb-4">
          <DocumentClientInfo clientInfo={extractedInfo} />
        </div>
      )}
      
      <div className="flex-grow mb-4">
        <DocumentPreview 
          documentId={documentId}
          title={document.title}
          storagePath={document.storage_path || ""}
          bypassAnalysis={true}
        />
      </div>
      
      <Card className="p-4 mb-4">
        <div className="flex items-center mb-2">
          <FileText className="h-5 w-5 text-primary mr-2" />
          <h3 className="text-lg font-medium">Document Summary</h3>
        </div>
        {documentSummary ? (
          <p className="text-sm text-gray-700">{documentSummary}</p>
        ) : (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        )}
      </Card>
      
      <div className="mb-4">
        <RiskAssessment 
          risks={risks} 
          documentId={documentId}
          isLoading={analysisLoading} 
        />
        
        {risks && risks.length > 0 && (
          <div className="mt-2 text-sm flex items-center text-amber-600">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span>Found {risks.length} {risks.length === 1 ? 'risk' : 'risks'} that require attention</span>
          </div>
        )}
      </div>
      
      {isDevMode && debugInfo && (
        <Card className="p-4 mt-4 bg-stone-50">
          <details>
            <summary className="text-sm font-medium cursor-pointer">Debug Information (Dev Only)</summary>
            <pre className="text-xs mt-2 overflow-auto max-h-40 p-2 bg-stone-100 rounded">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        </Card>
      )}
    </div>
  );
};
