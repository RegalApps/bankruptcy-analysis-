
import { useEffect, useState } from "react";
import { FileText, RotateCw, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnalysisProgress } from "./components/AnalysisProgress";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { useDocumentAnalysis } from "./hooks/useDocumentAnalysis";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExcelPreview } from "../ExcelPreview";

interface DocumentPreviewProps {
  storagePath: string;
  title?: string;
  onAnalysisComplete?: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ 
  storagePath,
  title,
  onAnalysisComplete 
}) => {
  const [previewError, setPreviewError] = useState<string | null>(null);
  const {
    analyzing,
    error,
    analysisStep,
    progress,
    setSession,
    handleAnalyzeDocument
  } = useDocumentAnalysis(storagePath, onAnalysisComplete);

  const publicUrl = supabase.storage.from('documents').getPublicUrl(storagePath).data.publicUrl;
  
  const isExcelFile = 
    storagePath?.endsWith('.xlsx') || 
    storagePath?.endsWith('.xls') ||
    title?.endsWith('.xlsx') || 
    title?.endsWith('.xls');

  // Fetch session on component mount and start analysis when ready
  useEffect(() => {
    console.log('DocumentPreview mounted with storagePath:', storagePath);
    
    let mounted = true;
    const initializeComponent = async () => {
      try {
        // Get the current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        console.log("Current auth session in DocumentPreview:", currentSession);
        
        if (currentSession) {
          setSession(currentSession);
          
          // If we have a session and there's a storage path but we're not already analyzing
          // and there's no error, start the analysis
          if (storagePath && !analyzing && !error && !isExcelFile) {
            // Small delay to ensure the session state is updated
            setTimeout(() => {
              if (mounted) handleAnalyzeDocument(currentSession);
            }, 100);
          }
        } else {
          throw new Error("No active session found. Please sign in again.");
        }
      } catch (err: any) {
        console.error("Error fetching session:", err);
      }
    };
    
    initializeComponent();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, updatedSession) => {
      if (mounted) {
        console.log("Auth state changed in DocumentPreview:", updatedSession);
        setSession(updatedSession);
      }
    });
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [storagePath, analyzing, error, setSession, handleAnalyzeDocument, isExcelFile]);

  const handleRefreshPreview = () => {
    setPreviewError(null);
    // Force reload the iframe
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.src) {
      iframe.src = `${iframe.src}?refresh=${new Date().getTime()}`;
    }
  };

  const handleIframeError = () => {
    setPreviewError("There was an issue loading the document preview.");
  };

  if (isExcelFile) {
    return <ExcelPreview storagePath={storagePath} title={title} />;
  }
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Preview
          </CardTitle>
          <div className="flex items-center gap-4">
            <Button
              variant="outline" 
              size="sm"
              onClick={handleRefreshPreview}
              title="Refresh preview"
            >
              <RotateCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="default" 
              size="sm"
              asChild
            >
              <a 
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Document
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {previewError ? (
            <Alert className="mb-4">
              <AlertDescription className="flex flex-col gap-4">
                <p>{previewError}</p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button variant="outline" size="sm" onClick={handleRefreshPreview}>
                    Try Again
                  </Button>
                  <Button variant="default" size="sm" asChild>
                    <a 
                      href={publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Document Externally
                    </a>
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          ) : null}
          
          <div className="aspect-[3/4] w-full bg-muted rounded-lg overflow-hidden">
            <object
              data={publicUrl}
              type="application/pdf"
              className="w-full h-full rounded-lg"
              onError={handleIframeError}
            >
              <p>
                Unable to display PDF. <a href={publicUrl} target="_blank" rel="noopener noreferrer">Download</a> instead.
              </p>
            </object>
          </div>
          
          {analyzing && (
            <AnalysisProgress
              analysisStep={analysisStep}
              progress={progress}
            />
          )}
          
          {error && (
            <ErrorDisplay
              error={error}
              onRetry={() => handleAnalyzeDocument()}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
