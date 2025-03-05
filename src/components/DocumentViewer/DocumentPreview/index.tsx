
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertTriangle, RefreshCw, FileSearch } from "lucide-react";
import { ExcelPreview } from "../ExcelPreview";
import { AnalysisProgress } from "./components/AnalysisProgress";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { DocumentObject } from "./components/DocumentObject";
import { PreviewControls } from "./components/PreviewControls";
import { PreviewErrorAlert } from "./components/PreviewErrorAlert";
import { DocumentDiagnostics } from "./components/DocumentDiagnostics";
import { usePreviewState } from "./hooks/usePreviewState";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingState } from "../LoadingState";
import { Button } from "@/components/ui/button";

interface DocumentPreviewProps {
  storagePath: string;
  title?: string;
  onAnalysisComplete?: () => void;
  documentId?: string;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ 
  storagePath,
  title,
  onAnalysisComplete,
  documentId 
}) => {
  const {
    previewError,
    publicUrl,
    isExcelFile,
    fileExists,
    analyzing,
    error,
    analysisStep,
    progress,
    processingStage,
    loading,
    handleRefreshPreview,
    handleIframeError,
    handleAnalyzeDocument,
    bypassAnalysis,
    setBypassAnalysis,
    diagnosticsMode,
    toggleDiagnosticsMode
  } = usePreviewState(storagePath, title, onAnalysisComplete);

  if (!storagePath) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Document Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>No document storage path provided.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

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
          <div className="flex items-center gap-2">
            {loading && !analyzing && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setBypassAnalysis(true)}
                className="text-xs"
              >
                Skip Processing
              </Button>
            )}
            {documentId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDiagnosticsMode}
                className="gap-1"
              >
                <FileSearch className="h-4 w-4" />
                {diagnosticsMode ? "Hide Diagnostics" : "Diagnostics"}
              </Button>
            )}
            <PreviewControls 
              publicUrl={publicUrl} 
              onRefresh={handleRefreshPreview} 
            />
          </div>
        </CardHeader>
        <CardContent>
          {diagnosticsMode && documentId && (
            <div className="mb-6 p-4 border rounded-lg bg-muted/20">
              <h3 className="text-sm font-medium mb-3">Document Diagnostics</h3>
              <DocumentDiagnostics 
                documentId={documentId}
                onDiagnosticsComplete={handleRefreshPreview}
              />
            </div>
          )}
          
          {loading && !analyzing && !bypassAnalysis ? (
            <div className="p-6 flex flex-col items-center justify-center gap-4">
              <LoadingState size="medium" message="Loading document..." />
              <p className="text-sm text-muted-foreground mt-2">
                {isExcelFile ? 
                  "Processing Excel file data. This may take a moment for large files." : 
                  "Loading document preview and analysis data..."}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefreshPreview}
                className="mt-4"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Preview
              </Button>
            </div>
          ) : null}
          
          {!fileExists ? (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                The document file could not be found in storage. It may have been deleted or moved.
              </AlertDescription>
              {documentId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleDiagnosticsMode}
                  className="mt-3 gap-2"
                >
                  <FileSearch className="h-4 w-4" />
                  Run Diagnostics
                </Button>
              )}
            </Alert>
          ) : previewError ? (
            <PreviewErrorAlert 
              error={previewError}
              onRefresh={handleRefreshPreview}
              publicUrl={publicUrl}
              documentId={documentId}
              onRunDiagnostics={toggleDiagnosticsMode}
            />
          ) : null}
          
          {(fileExists && publicUrl && (!loading || bypassAnalysis)) && (
            <DocumentObject 
              publicUrl={publicUrl} 
              onError={handleIframeError} 
            />
          )}
          
          {analyzing && (
            <AnalysisProgress
              analysisStep={analysisStep}
              progress={progress}
              processingStage={processingStage}
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
