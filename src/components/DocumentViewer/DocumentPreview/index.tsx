
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { ExcelPreview } from "../ExcelPreview";
import { AnalysisProgress } from "./components/AnalysisProgress";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { DocumentObject } from "./components/DocumentObject";
import { PreviewControls } from "./components/PreviewControls";
import { PreviewErrorAlert } from "./components/PreviewErrorAlert";
import { usePreviewState } from "./hooks/usePreviewState";

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
    analyzing,
    error,
    analysisStep,
    progress,
    handleRefreshPreview,
    handleIframeError,
    handleAnalyzeDocument
  } = usePreviewState(storagePath, title, onAnalysisComplete);

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
          {previewError ? (
            <PreviewErrorAlert 
              error={previewError}
              onRefresh={handleRefreshPreview}
              publicUrl={publicUrl}
            />
          ) : null}
          
          <DocumentObject 
            publicUrl={publicUrl} 
            onError={handleIframeError} 
          />
          
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
