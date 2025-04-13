
import React from "react";
import { AnalysisPanelProps } from "../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ClientDetails } from "./ClientDetails";
import { DocumentSummary } from "../DocumentDetails/DocumentSummary";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RiskAssessment } from "../RiskAssessment";
import { DeadlineManager } from "../DeadlineManager";
import { RegulatoryCompliance } from "@/utils/documents/types/analysisTypes";

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  documentId,
  isLoading = false,
  analysis
}) => {
  const hasAnalysis = !!analysis;
  const extractedInfo = analysis?.extracted_info;
  const risks = analysis?.risks || [];

  return (
    <div className="h-full overflow-y-auto">
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4">
          {isLoading ? (
            <>
              <Skeleton className="h-[100px] w-full rounded-md mb-4" />
              <Skeleton className="h-[200px] w-full rounded-md" />
            </>
          ) : hasAnalysis ? (
            <>
              {extractedInfo && (
                <ClientDetails extractedInfo={extractedInfo} />
              )}
              {extractedInfo?.summary && (
                <DocumentSummary 
                  summary={extractedInfo.summary} 
                  regulatoryCompliance={analysis.regulatory_compliance || {
                    status: "needs_review" as "needs_review",
                    details: 'This document requires regulatory compliance review.',
                    references: ['BIA Section 124(1)', 'BIA Section 121(1)']
                  }}
                />
              )}
            </>
          ) : (
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
          )}
        </TabsContent>
        
        <TabsContent value="risks" className="mt-0">
          {isLoading ? (
            <Skeleton className="h-[300px] w-full rounded-md" />
          ) : (
            <RiskAssessment 
              documentId={documentId}
              risks={risks}
              isLoading={isLoading}
            />
          )}
        </TabsContent>
        
        <TabsContent value="deadlines" className="mt-0">
          <DeadlineManager
            documentId={documentId}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
