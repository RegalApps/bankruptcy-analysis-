import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentPreview } from "./DocumentPreview";
import { BankruptcyAnalysisResult } from "@/utils/documentOperations";
import { AlertTriangle, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import logger from '@/utils/logger';

interface EnhancedDocumentViewerProps {
  document: any;
  analysis: BankruptcyAnalysisResult | null;
}

const EnhancedDocumentViewer: React.FC<EnhancedDocumentViewerProps> = ({ document, analysis }) => {
  const [pdfError, setPdfError] = useState<boolean>(false);
  
  // Get the document ID and storage path
  const documentId = document?.id || '';
  const documentTitle = document?.title || 'Document Preview';
  
  // Use the document's storage path or a fallback
  const storagePath = document?.id || '';
  
  const handlePdfError = (error: Error) => {
    logger.error('Error loading PDF document:', error);
    setPdfError(true);
  };

  return (
    <div className="flex flex-col h-full">
      {analysis && analysis.riskLevel === 'high' && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>High Risk Document</AlertTitle>
          <AlertDescription>
            This document has been flagged as high risk. Please review carefully.
          </AlertDescription>
        </Alert>
      )}
      
      {pdfError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error loading PDF</AlertTitle>
          <AlertDescription>
            There was a problem loading this PDF. The file may be corrupted or in an unsupported format.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full overflow-hidden">
            <DocumentPreview 
              documentId={documentId}
              title={documentTitle}
              storagePath={storagePath}
              onAnalysisComplete={() => logger.info('Analysis completed')}
            />
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="h-full p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Analysis</h2>
              {analysis && (
                <Badge variant={
                  analysis.riskLevel === 'high' ? 'destructive' : 
                  analysis.riskLevel === 'medium' ? 'default' : 
                  'default'
                }>
                  {analysis.riskLevel.toUpperCase()} RISK
                </Badge>
              )}
            </div>
            
            {!analysis ? (
              <div className="flex flex-col items-center justify-center h-64">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  No analysis available for this document.
                </p>
              </div>
            ) : (
              <Tabs defaultValue="summary">
                <TabsList className="w-full">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="issues">Issues</TabsTrigger>
                </TabsList>
                
                <TabsContent value="summary" className="mt-4">
                  <h3 className="font-medium mb-2">Form Type</h3>
                  <p className="text-sm mb-4">{analysis.formType}</p>
                  
                  <h3 className="font-medium mb-2">Narrative</h3>
                  <p className="text-sm">{analysis.narrative}</p>
                </TabsContent>
                
                <TabsContent value="details" className="mt-4">
                  <h3 className="font-medium mb-2">Key Fields</h3>
                  <div className="space-y-2">
                    {Object.entries(analysis.keyFields).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-3 gap-2 text-sm">
                        <div className="font-medium capitalize">{key}</div>
                        <div className="col-span-2">{value as string}</div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="issues" className="mt-4">
                  <h3 className="font-medium mb-2">Missing Fields</h3>
                  {analysis.missingFields.length > 0 ? (
                    <ul className="list-disc list-inside text-sm mb-4">
                      {analysis.missingFields.map((field, index) => (
                        <li key={index}>{field}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm mb-4">No missing fields detected.</p>
                  )}
                  
                  <h3 className="font-medium mb-2">Validation Issues</h3>
                  {analysis.validationIssues.length > 0 ? (
                    <ul className="list-disc list-inside text-sm">
                      {analysis.validationIssues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm">No validation issues detected.</p>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDocumentViewer;
