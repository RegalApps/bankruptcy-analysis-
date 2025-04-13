
import React from "react";
import { AnalysisPanelProps } from "../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { RiskAssessment } from "../RiskAssessment";
import { DeadlineManager } from "../DeadlineManager";
import { RegulatoryCompliance } from "@/utils/documents/types/analysisTypes";
import { SummaryPanel } from "./SummaryPanel";

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  documentId,
  isLoading = false,
  analysis
}) => {
  const hasAnalysis = !!analysis;
  const extractedInfo = analysis?.extracted_info;
  const risks = analysis?.risks || [];

  const defaultRegulatoryCompliance: RegulatoryCompliance = {
    status: "needs_review" as const,
    details: 'This document requires regulatory compliance review.',
    references: ['BIA Section 124(1)', 'BIA Section 121(1)']
  };

  const regulatoryCompliance = analysis?.regulatory_compliance || defaultRegulatoryCompliance;

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
          ) : (
            <SummaryPanel
              extractedInfo={extractedInfo}
              regulatoryCompliance={regulatoryCompliance}
              isLoading={isLoading}
              hasAnalysis={hasAnalysis}
            />
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
