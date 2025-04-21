import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, FileText, RefreshCcw } from "lucide-react";
import { PDFViewer } from "./components/PDFViewer";
import { ImageViewer } from "./ImageViewer";
import { ExcelViewer } from "./ExcelViewer";
import { useDocumentAnalysis } from "./hooks/useDocumentAnalysis";
import { usePreviewState } from "./hooks/usePreviewState";

interface DocumentPreviewProps {
  documentId?: string;
  title?: string;
  storagePath: string;
  bypassAnalysis?: boolean;
  onAnalysisComplete?: () => void;
}

export const DocumentPreview = ({
  documentId,
  title,
  storagePath,
  bypassAnalysis = false,
  onAnalysisComplete
}: DocumentPreviewProps) => {
  const [downloading, setDownloading] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const { toast } = useToast();
  
  const {
    url,
    isLoading: previewLoading,
    error: previewError,
    fileType,
    isExcelFile,
    fileExists,
    downloadUrl,
  } = usePreviewState({ storagePath });
  
  const {
    analyzing,
    analysisStep,
    progress,
    processingStage,
    error: analysisError,
    setSession,
    handleAnalyzeDocument
  } = useDocumentAnalysis(storagePath, onAnalysisComplete);
  
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    getSession();
  }, [setSession]);
  
  useEffect(() => {
    const fetchAnalysisData = async () => {
      if (!documentId || analyzing) return;
      
      try {
        console.log("Fetching analysis data for document:", documentId);
        const { data, error } = await supabase
          .from('document_analysis')
          .select('content')
          .eq('document_id', documentId)
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching analysis data:", error);
          return;
        }
        
        if (data?.content) {
          console.log("Analysis data found:", data.content);
          setAnalysisData(data.content);
        } else {
          console.log("No analysis data found for document");
        }
      } catch (err) {
        console.error("Error in fetchAnalysisData:", err);
      }
    };
    
    fetchAnalysisData();
  }, [documentId, analyzing]);
  
  const handleDownload = async () => {
    if (!storagePath) return;
    
    try {
      setDownloading(true);
      
      if (downloadUrl) {
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = title || storagePath.split("/").pop() || "file";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast({ title: "Download started" });
      } else {
        toast({
          variant: "destructive",
          title: "Download failed",
          description: "File URL not available"
        });
      }
    } catch (error) {
      console.error("Download error:", error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "An error occurred while downloading the file"
      });
    } finally {
      setDownloading(false);
    }
  };
  
  const triggerAnalysis = () => {
    handleAnalyzeDocument();
  };
  
  if (previewLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 space-y-4">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="text-center text-muted-foreground">Loading document preview...</p>
      </div>
    );
  }
  
  if (previewError || !fileExists) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 space-y-4">
        <div className="p-3 bg-red-100 rounded-full">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h3 className="text-xl font-medium">Error Loading Document</h3>
        <p className="text-center text-muted-foreground">
          {previewError || "The document could not be loaded. It may have been deleted or moved."}
        </p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      {analyzing && (
        <div className="bg-amber-50 p-2 border border-amber-200 rounded-md mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-amber-500 border-t-transparent rounded-full"></div>
              <span className="text-amber-800 text-sm font-medium">{analysisStep || "Analyzing document..."}</span>
            </div>
            <span className="text-amber-600 text-xs font-medium">{progress}%</span>
          </div>
          
          {processingStage && (
            <p className="text-xs text-amber-700 mt-1">{processingStage}</p>
          )}
          
          <div className="w-full bg-amber-200 rounded-full h-1 mt-2">
            <div className="bg-amber-500 h-1 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}
      
      {analysisError && !analyzing && (
        <div className="bg-red-50 p-3 border border-red-200 rounded-md mb-3">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <div>
              <p className="text-sm font-medium text-red-800">Analysis Error</p>
              <p className="text-xs text-red-700 mt-1">{analysisError}</p>
              
              <Button
                variant="outline" 
                size="sm" 
                onClick={triggerAnalysis} 
                className="mt-2"
              >
                <RefreshCcw className="h-3 w-3 mr-1" />
                Retry Analysis
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium truncate" title={title}>
          {title || storagePath.split("/").pop() || "Document"}
        </h2>
        
        <div className="flex gap-2">
          {!bypassAnalysis && !analyzing && !analysisData && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={triggerAnalysis}
              disabled={analyzing}
            >
              <FileText className="h-3.5 w-3.5 mr-1" />
              Analyze Document
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? (
              <>
                <div className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full mr-1"></div>
                Downloading...
              </>
            ) : (
              <>Download</>
            )}
          </Button>
        </div>
      </div>
      
      <Card className="flex-grow overflow-hidden">
        <div className="h-full">
          {fileType === "pdf" && url && (
            <PDFViewer fileUrl={url} title={title || "Document"} zoomLevel={100} />
          )}
          
          {fileType === "image" && url && (
            <ImageViewer url={url} />
          )}
          
          {isExcelFile && url && (
            <ExcelViewer url={url} />
          )}
          
          {fileType !== "pdf" && fileType !== "image" && !isExcelFile && (
            <div className="flex flex-col items-center justify-center h-full p-4">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-center text-muted-foreground">
                Preview not available for this file type. Please download the file to view it.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownload}
                className="mt-4"
              >
                Download
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
