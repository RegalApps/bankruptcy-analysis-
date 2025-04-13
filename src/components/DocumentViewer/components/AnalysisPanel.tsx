
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
                <Card className="mb-4">
                  <CardContent className="pt-4">
                    <h4 className="font-medium mb-2">Client Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Client Name:</span>
                        <span className="font-medium">{extractedInfo.clientName || "Not available"}</span>
                      </div>
                      {extractedInfo.trusteeName && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Trustee/Administrator:</span>
                          <span className="font-medium">{extractedInfo.trusteeName}</span>
                        </div>
                      )}
                      {extractedInfo.dateSigned && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date Signed:</span>
                          <span className="font-medium">{extractedInfo.dateSigned}</span>
                        </div>
                      )}
                      {extractedInfo.filingDate && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Filing Date:</span>
                          <span className="font-medium">{extractedInfo.filingDate}</span>
                        </div>
                      )}
                      {extractedInfo.submissionDeadline && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Submission Deadline:</span>
                          <span className="font-medium text-orange-600">{extractedInfo.submissionDeadline}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Form Number:</span>
                        <span className="font-medium">{extractedInfo.formNumber || "Unknown"}</span>
                      </div>
                      {extractedInfo.documentStatus && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <span className="font-medium">{extractedInfo.documentStatus}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
              {extractedInfo?.summary && (
                <DocumentSummary 
                  summary={extractedInfo.summary} 
                  regulatoryCompliance={analysis.regulatoryCompliance || {
                    status: 'needs_review',
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
