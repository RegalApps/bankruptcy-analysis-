
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertTriangle, RefreshCw } from "lucide-react";
import { ExcelPreview } from "../ExcelPreview";
import { AnalysisProgress } from "./components/AnalysisProgress";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { DocumentObject } from "./components/DocumentObject";
import { PreviewControls } from "./components/PreviewControls";
import { PreviewErrorAlert } from "./components/PreviewErrorAlert";
import { usePreviewState } from "./hooks/usePreviewState";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingState } from "../LoadingState";
import { Button } from "@/components/ui/button";

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
    setBypassAnalysis
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
            <PreviewControls 
              publicUrl={publicUrl} 
              onRefresh={handleRefreshPreview} 
            />
          </div>
        </CardHeader>
        <CardContent>
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
            </Alert>
          ) : previewError ? (
            <PreviewErrorAlert 
              error={previewError}
              onRefresh={handleRefreshPreview}
              publicUrl={publicUrl}
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
