
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertTriangle } from "lucide-react";
import { ExcelPreview } from "../ExcelPreview";
import { AnalysisProgress } from "./components/AnalysisProgress";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { DocumentObject } from "./components/DocumentObject";
import { PreviewControls } from "./components/PreviewControls";
import { PreviewErrorAlert } from "./components/PreviewErrorAlert";
import { usePreviewState } from "./hooks/usePreviewState";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingState } from "../LoadingState";

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
    loading,
    handleRefreshPreview,
    handleIframeError,
    handleAnalyzeDocument
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
          <PreviewControls 
            publicUrl={publicUrl} 
            onRefresh={handleRefreshPreview} 
          />
        </CardHeader>
        <CardContent>
          {loading && !analyzing && (
            <div className="p-6 flex justify-center">
              <LoadingState />
            </div>
          )}
          
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
          
          {fileExists && publicUrl && (
            <DocumentObject 
              publicUrl={publicUrl} 
              onError={handleIframeError} 
            />
          )}
          
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
