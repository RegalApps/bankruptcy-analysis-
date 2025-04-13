
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { RegulatoryCompliance } from "@/utils/documents/types/analysisTypes";
import { ClientDetails } from "./ClientDetails";
import { DocumentSummary } from "../DocumentDetails/DocumentSummary";

interface SummaryPanelProps {
  extractedInfo: any;
  regulatoryCompliance: RegulatoryCompliance;
  isLoading: boolean;
  hasAnalysis: boolean;
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({
  extractedInfo,
  regulatoryCompliance,
  isLoading,
  hasAnalysis,
}) => {
  if (isLoading) {
    return null; // Loading state is handled in parent component
  }
  
  if (!hasAnalysis) {
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
      {extractedInfo && <ClientDetails extractedInfo={extractedInfo} />}
      
      {extractedInfo?.summary && (
        <DocumentSummary 
          summary={extractedInfo.summary}
          regulatoryCompliance={regulatoryCompliance}
        />
      )}
    </>
  );
};
