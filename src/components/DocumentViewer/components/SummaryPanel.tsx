
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { RegulatoryCompliance } from "@/utils/documents/types/analysisTypes";
import { ClientDetails } from "./ClientDetails";
import { DocumentSummary } from "../DocumentDetails/DocumentSummary";
import { isDocumentForm31, getForm31DemoAnalysisData } from "../utils/documentTypeUtils";

interface SummaryPanelProps {
  extractedInfo: any;
  regulatoryCompliance: RegulatoryCompliance;
  isLoading: boolean;
  hasAnalysis: boolean;
  documentId?: string;
  documentTitle?: string;
  storagePath?: string;
  isForm31GreenTech?: boolean;
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({
  extractedInfo,
  regulatoryCompliance,
  isLoading,
  hasAnalysis,
  documentId,
  documentTitle,
  storagePath,
  isForm31GreenTech = false,
}) => {
  // If it's explicitly a Form 31 document or detected as one, use pre-defined analysis data
  const isForm31 = isForm31GreenTech || 
                  isDocumentForm31(null, documentId, storagePath, documentTitle);
  
  // For Form 31 documents, use our pre-defined analysis data if no analysis is available
  const finalExtractedInfo = isForm31 && !extractedInfo ? 
                            getForm31DemoAnalysisData().extracted_info : 
                            extractedInfo;
  
  const finalRegCompliance = isForm31 && !regulatoryCompliance?.status ? 
                            getForm31DemoAnalysisData().regulatory_compliance : 
                            regulatoryCompliance;
  
  if (isLoading) {
    return null; // Loading state is handled in parent component
  }
  
  // For Form 31, we always have analysis data
  const finalHasAnalysis = isForm31 ? true : hasAnalysis;
  
  if (!finalHasAnalysis || !finalExtractedInfo) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>No Analysis Available</AlertTitle>
            <AlertDescription>
              We couldn't find any analysis data for this document.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      {finalExtractedInfo && <ClientDetails extractedInfo={finalExtractedInfo} />}
      
      {finalExtractedInfo?.summary && (
        <DocumentSummary 
          summary={finalExtractedInfo.summary}
          regulatoryCompliance={finalRegCompliance}
        />
      )}
    </>
  );
};
