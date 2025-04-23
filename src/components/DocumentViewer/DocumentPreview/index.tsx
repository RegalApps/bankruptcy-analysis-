import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, FileText, RefreshCcw } from "lucide-react";
import { usePreviewState } from "./hooks/usePreviewState";
import { analyzeBankruptcyForm, BankruptcyAnalysisResult } from "@/utils/documentOperations";
import { getJson, setJson } from "@/utils/storage";
import logger from "@/utils/logger";

interface DocumentPreviewProps {
  documentId?: string;
  title?: string;
  storagePath: string;
  bypassAnalysis?: boolean;
  onAnalysisComplete?: () => void;
}

// Local storage for document analysis
const getLocalAnalysisData = (documentId: string) => {
  const analysisKey = `local_analysis_${documentId}`;
  return getJson(analysisKey);
};

// Save analysis data to local storage
const saveLocalAnalysisData = (documentId: string, data: any) => {
  const analysisKey = `local_analysis_${documentId}`;
  setJson(analysisKey, data);
};

// Convert bankruptcy analysis to document analysis format
const convertBankruptcyAnalysisToDocumentAnalysis = (
  analysis: BankruptcyAnalysisResult,
  fileName: string
) => {
  // Create risks array from missing fields and validation issues
  const risks = [
    ...analysis.missingFields.map(field => ({
      type: 'Missing Information',
      description: `Missing field: ${field}`,
      severity: analysis.riskLevel as string,
      regulation: 'Bankruptcy Filing Guidelines',
      impact: 'Potential delay in processing',
      requiredAction: 'Complete all required fields',
      solution: 'Review document for completeness',
      deadline: '7 days'
    })),
    ...analysis.validationIssues.map(issue => ({
      type: 'Validation Issue',
      description: issue,
      severity: analysis.riskLevel as string,
      regulation: 'Bankruptcy Filing Guidelines',
      impact: 'Potential rejection of filing',
      requiredAction: 'Address validation issues',
      solution: 'Correct errors in document',
      deadline: '5 days'
    }))
  ];

  // If no specific risks were found but risk level is not low, add a general risk
  if (risks.length === 0 && analysis.riskLevel !== 'low') {
    risks.push({
      type: 'General Risk',
      description: 'This document requires additional review',
      severity: analysis.riskLevel,
      regulation: 'Bankruptcy Filing Guidelines',
      impact: 'Potential processing issues',
      requiredAction: 'Review document thoroughly',
      solution: 'Consult with an expert',
      deadline: '7 days'
    });
  }

  // Create extracted info from key fields
  return {
    extracted_info: {
      clientName: analysis.keyFields.creditor || analysis.keyFields.debtor || 'Unknown',
      formNumber: analysis.formType.split(',')[0].replace('Form', '').trim(),
      formType: analysis.formType.split(',')[1]?.trim() || analysis.formType,
      summary: analysis.narrative
    },
    risks: risks
  };
};

export const DocumentPreview = ({
  documentId,
  title,
  storagePath,
  bypassAnalysis = false,
  onAnalysisComplete
}: DocumentPreviewProps) => {
  const [downloading, setDownloading] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const {
    url,
    isLoading: previewLoading,
    error: previewError,
    fileType,
    fileExists,
    downloadUrl,
    isLocalFile,
  } = usePreviewState({ storagePath });
  
  useEffect(() => {
    const fetchAnalysisData = async () => {
      if (!documentId || analyzing) return;
      
      try {
        logger.info("Fetching analysis data for document:", documentId);
        
        // Get analysis data from local storage
        const data = getLocalAnalysisData(documentId);
        
        if (data) {
          logger.info("Analysis data found:", data);
          setAnalysisData(data);
        } else {
          logger.info("No analysis data found for document");
        }
      } catch (err) {
        logger.error("Error in fetchAnalysisData:", err);
      }
    };
    
    fetchAnalysisData();
  }, [documentId, analyzing]);
  
  const handleDownload = async () => {
    if (isLocalFile) {
      toast({
        title: "Local Only Mode",
        description: "Download functionality is disabled in local-only mode"
      });
    } else {
      // Implement download logic here
    }
  };
  
  const triggerAnalysis = async () => {
    if (!documentId || !url) {
      toast({
        variant: "destructive",
        title: "Analysis Error",
        description: "Document not available for analysis"
      });
      return;
    }
    
    setAnalyzing(true);
    setAnalysisError(null);
    setAnalysisStep("Initializing analysis...");
    setProgress(10);
    
    try {
      // Fetch the document as a blob
      setAnalysisStep("Downloading document...");
      setProgress(20);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to download document: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      setProgress(30);
      
      // Convert blob to File object
      const file = new File([blob], title || "document.pdf", { type: blob.type });
      
      setAnalysisStep("Analyzing document...");
      setProgress(40);
      
      // Process the document using bankruptcyAnalyzer
      const analysisResult = await analyzeBankruptcyForm(file);
      
      setProgress(70);
      setAnalysisStep("Processing results...");
      
      // Convert the analysis to the format expected by the UI
      const documentAnalysis = convertBankruptcyAnalysisToDocumentAnalysis(analysisResult, file.name);
      
      // Save analysis to local storage
      if (documentId) {
        saveLocalAnalysisData(documentId, documentAnalysis);
        logger.info("Analysis saved to local storage:", documentId);
      }
      
      // Update state with analysis data
      setAnalysisData(documentAnalysis);
      setProgress(100);
      setAnalysisStep("Analysis complete");
      
      // Notify parent component if callback provided
      if (onAnalysisComplete) {
        onAnalysisComplete();
      }
      
      toast({
        title: "Analysis complete",
        description: "Document has been analyzed successfully"
      });
    } catch (error) {
      logger.error("Analysis error:", error);
      setAnalysisError(error.message || "An error occurred during analysis");
      
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "Failed to analyze document"
      });
    } finally {
      setAnalyzing(false);
    }
  };
  
  if (previewLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 space-y-4">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="text-center text-muted-foreground">Loading document...</p>
      </div>
    );
  }
  
  if (previewError || !fileExists) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 space-y-4">
        <div className="p-3 bg-red-100 rounded-full">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <p className="text-center text-muted-foreground">
          {previewError || "Document not found or cannot be previewed"}
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
            Download
          </Button>
        </div>
      </div>
      
      <Card className="flex-grow overflow-hidden">
        <div className="h-full p-4">
          {/* Simplified document preview - just shows file type */}
          <div className="flex flex-col items-center justify-center h-full">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground">
              {fileType.toUpperCase()} document: {title || storagePath.split("/").pop()}
            </p>
            <p className="text-center text-muted-foreground text-sm mt-2">
              Document preview is simplified in local-only mode.
            </p>
            {analysisData && (
              <div className="mt-6 w-full max-w-md p-4 border rounded-md bg-background/50">
                <h3 className="font-medium mb-2">Analysis Results:</h3>
                <p className="text-sm mb-1">
                  <span className="font-medium">Summary:</span> {analysisData.extracted_info?.summary || 'No summary available'}
                </p>
                <p className="text-sm mb-1">
                  <span className="font-medium">Client:</span> {analysisData.extracted_info?.clientName || 'Unknown'}
                </p>
                <p className="text-sm mb-1">
                  <span className="font-medium">Form Type:</span> {analysisData.extracted_info?.formType || 'Unknown'}
                </p>
                
                {analysisData.risks && analysisData.risks.length > 0 && (
                  <div className="mt-3">
                    <h4 className="font-medium mb-1">Identified Risks:</h4>
                    <ul className="text-sm space-y-2">
                      {analysisData.risks.map((risk: any, index: number) => (
                        <li key={index} className="p-2 rounded bg-background border">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              risk.severity === 'high' ? 'bg-red-500' : 
                              risk.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                            }`} />
                            <span className="font-medium">{risk.type}</span>
                          </div>
                          <p className="mt-1">{risk.description}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
