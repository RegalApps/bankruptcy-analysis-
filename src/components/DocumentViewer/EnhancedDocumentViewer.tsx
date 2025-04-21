
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { DocumentDetails, Risk } from "./types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ViewerLoadingState } from "./components/ViewerLoadingState";
import { ViewerErrorState } from "./components/ViewerErrorState";
import { DocumentPreview } from "./DocumentPreview";
import { RiskAssessment } from "./RiskAssessment";
import { AlertTriangle, AlertCircle, RefreshCcw, Bug } from "lucide-react";
import { AIConnectionTest } from "@/components/AIConnectionTest";

interface EnhancedDocumentViewerProps {
  documentId: string;
  documentTitle?: string;
}

export const EnhancedDocumentViewer: React.FC<EnhancedDocumentViewerProps> = ({
  documentId,
  documentTitle
}) => {
  const [document, setDocument] = useState<DocumentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const { toast } = useToast();
  const isDevMode = process.env.NODE_ENV === 'development';
  
  // Function to fetch document details
  const fetchDocumentDetails = async () => {
    try {
      setLoading(true);
      setLoadingError(null);
      
      console.log('Fetching document details for ID:', documentId);
      
      const { data: document, error: docError } = await supabase
        .from('documents')
        .select(`
          *,
          analysis:document_analysis(content),
          comments:document_comments(id, content, created_at, user_id)
        `)
        .eq('id', documentId)
        .maybeSingle();

      if (docError) {
        console.error("Error fetching document:", docError);
        setLoadingError(`Failed to load document: ${docError.message}`);
        return;
      }
      
      if (!document) {
        console.error("Document not found");
        setLoadingError("Document not found. It may have been deleted or moved.");
        return;
      }
      
      console.log("Raw document data:", document);

      // Check if analysis exists and is properly formatted
      if (!document.analysis || document.analysis.length === 0) {
        console.warn("Document has no analysis data");
        setAnalysisError("No analysis data found for this document");
      } else {
        console.log("Analysis data found:", document.analysis[0]?.content);
        setDebugInfo(document.analysis[0]?.content?.debug_info || null);
        
        // Check if analysis content has the expected structure
        const analysisContent = document.analysis[0]?.content;
        if (!analysisContent || (!analysisContent.extracted_info && !analysisContent.risks)) {
          console.warn("Analysis data is missing required fields");
          setAnalysisError("Analysis data is incomplete or malformed");
        } else {
          setAnalysisError(null);
        }
      }

      setDocument(document);
    } catch (error: any) {
      console.error('Error fetching document details:', error);
      setLoadingError(`Failed to load document: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to manually trigger document analysis
  const triggerAnalysis = async () => {
    try {
      setAnalysisLoading(true);
      setAnalysisError(null);
      
      const { data: document } = await supabase
        .from('documents')
        .select('storage_path, title')
        .eq('id', documentId)
        .single();
        
      if (!document?.storage_path) {
        throw new Error("Document has no storage path");
      }
      
      // Get file content from storage
      const { data: fileData, error: fileError } = await supabase.storage
        .from('documents')
        .download(document.storage_path);
        
      if (fileError) {
        throw new Error(`Failed to download document: ${fileError.message}`);
      }
      
      // Convert file to text
      const textContent = await fileData.text();
      
      // Detect form type from title if possible
      let formType = null;
      if (document.title) {
        const title = document.title.toLowerCase();
        if (title.includes('form 31') || title.includes('proof of claim')) {
          formType = 'form-31';
        } else if (title.includes('form 47') || title.includes('consumer proposal')) {
          formType = 'form-47';
        }
      }
      
      // Call AI analysis function
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('process-ai-request', {
        body: {
          message: textContent,
          documentId: documentId,
          module: "document-analysis",
          formType: formType,
          title: document.title
        }
      });
      
      if (analysisError) {
        throw new Error(`Analysis failed: ${analysisError.message}`);
      }
      
      if (!analysisData || (!analysisData.response && !analysisData.parsedData)) {
        console.error("OpenAI returned no data. Response:", analysisData);
        throw new Error("OpenAI returned no data. Please check your API key configuration.");
      }
      
      toast({
        title: "Analysis Complete",
        description: "Document has been successfully analyzed",
      });
      
      // Fetch updated document with new analysis
      fetchDocumentDetails();
      
    } catch (error: any) {
      console.error("Error triggering analysis:", error);
      setAnalysisError(`Failed to analyze document: ${error.message}`);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message
      });
    } finally {
      setAnalysisLoading(false);
    }
  };
  
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
  const risks = analysisContent.risks as Risk[] || [];
  const extractedInfo = analysisContent.extracted_info || {};
  
  // Fix: Get summary from extracted_info rather than directly from analysisContent
  // This solves the TypeScript error by using the correct property path
  const documentSummary = extractedInfo?.summary || "";
  
  return (
    <div className="flex flex-col h-full">
      {analysisError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Analysis Issue</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <div>{analysisError}</div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={triggerAnalysis}
                disabled={analysisLoading}
              >
                <RefreshCcw className="h-4 w-4 mr-1" />
                {analysisLoading ? "Analyzing..." : "Re-Analyze Document"}
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
      
      {/* OpenAI Connection Diagnostics */}
      {showDiagnostics && (
        <div className="mb-4">
          <AIConnectionTest />
        </div>
      )}
      
      {/* Document Preview */}
      <div className="flex-grow">
        <DocumentPreview 
          documentId={documentId}
          title={document.title}
          storagePath={document.storage_path || ""}
          bypassAnalysis={true}
        />
      </div>
      
      {/* Document Summary */}
      <Card className="p-4 mt-4">
        <h3 className="text-lg font-medium mb-2">Document Summary</h3>
        {documentSummary ? (
          <p className="text-sm text-gray-700">{documentSummary}</p>
        ) : (
          <Skeleton className="h-8 w-full" />
        )}
      </Card>
      
      {/* Risk Assessment */}
      <div className="mt-4">
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
      
      {/* Debug Info (Development Only) */}
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
