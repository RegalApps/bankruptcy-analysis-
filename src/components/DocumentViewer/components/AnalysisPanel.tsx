
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SummaryPanel } from "./SummaryPanel";
import { RiskPanel } from "./RiskPanel";
import { HistoryPanel } from "./HistoryPanel";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { getForm31DemoAnalysisData, isDocumentForm31 } from "../utils/documentTypeUtils";

interface AnalysisPanelProps {
  documentId: string;
  isLoading: boolean;
  analysis?: any;
  isForm31GreenTech?: boolean;
  title?: string;
  storagePath?: string;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ 
  documentId, 
  isLoading, 
  analysis,
  isForm31GreenTech,
  title,
  storagePath
}) => {
  const [activeTab, setActiveTab] = useState<string>("summary");
  const [riskData, setRiskData] = useState<any[]>([]);
  const [extractedInfo, setExtractedInfo] = useState<any>(null);
  const [regulatoryCompliance, setRegulatoryCompliance] = useState<any>(null);
  
  // Detect if this is a Form 31 document
  const isForm31 = isForm31GreenTech || isDocumentForm31(null, documentId, storagePath, title);

  // Process analysis data
  useEffect(() => {
    if (isLoading) return;
    
    let analysisData = analysis;
    
    // For Form 31 documents, provide demo analysis data if none exists
    if (isForm31 && !analysis) {
      console.log("Using Form 31 demo analysis data");
      analysisData = getForm31DemoAnalysisData();
    }
    
    if (analysisData) {
      // Handle different data structures (object, array, or string)
      if (typeof analysisData === 'string') {
        try {
          analysisData = JSON.parse(analysisData);
        } catch (e) {
          console.error('Error parsing analysis data:', e);
        }
      }
      
      // Handle analysis inside content property
      const contentData = (analysisData.content || analysisData);
      
      // Extract risk data
      const risks = contentData.risks || [];
      setRiskData(Array.isArray(risks) ? risks : []);
      
      // Extract document info
      setExtractedInfo(contentData.extracted_info || null);
      
      // Extract regulatory compliance
      setRegulatoryCompliance(contentData.regulatory_compliance || null);
    } else if (isForm31) {
      // Ensure Form 31 always has data
      const form31Data = getForm31DemoAnalysisData();
      setRiskData(form31Data.risks || []);
      setExtractedInfo(form31Data.extracted_info || null);
      setRegulatoryCompliance(form31Data.regulatory_compliance || null);
    }
  }, [analysis, isLoading, isForm31, documentId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-sm text-muted-foreground mt-2">
            Analyzing document...
          </p>
        </div>
      </div>
    );
  }

  const hasAnalysis = !!extractedInfo || (riskData && riskData.length > 0);
  
  return (
    <div className="p-2 h-full flex flex-col overflow-hidden">
      <Tabs
        defaultValue="summary"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full h-full flex flex-col overflow-hidden"
      >
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
          <TabsTrigger value="history">Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="flex-1 overflow-y-auto p-1">
          <SummaryPanel
            extractedInfo={extractedInfo}
            regulatoryCompliance={regulatoryCompliance}
            isLoading={isLoading}
            hasAnalysis={hasAnalysis}
            documentId={documentId}
            documentTitle={title}
            storagePath={storagePath}
            isForm31GreenTech={isForm31}
          />
        </TabsContent>
        
        <TabsContent value="risks" className="flex-1 overflow-y-auto p-1">
          <RiskPanel
            risks={riskData}
            isLoading={isLoading}
            hasRisks={riskData && riskData.length > 0}
            documentId={documentId}
            isForm31GreenTech={isForm31}
          />
        </TabsContent>
        
        <TabsContent value="history" className="flex-1 overflow-y-auto p-1">
          <HistoryPanel documentId={documentId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
