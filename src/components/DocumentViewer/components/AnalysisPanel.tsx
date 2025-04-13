
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface AnalysisPanelProps {
  documentId: string;
  isLoading: boolean;
  analysis?: any;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ 
  documentId, 
  isLoading, 
  analysis 
}) => {
  const hasRisks = analysis?.risks && analysis.risks.length > 0;
  const hasExtractedInfo = analysis?.extracted_info;
  
  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }
  
  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
        <h3 className="text-lg font-semibold mb-1">No Analysis Available</h3>
        <p className="text-muted-foreground text-sm">
          The document has not been analyzed yet or no analysis data is available.
        </p>
      </div>
    );
  }
  
  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-amber-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="risks">
          Risks {hasRisks ? `(${analysis.risks.length})` : ''}
        </TabsTrigger>
        <TabsTrigger value="compliance">Compliance</TabsTrigger>
      </TabsList>
      
      <TabsContent value="summary" className="space-y-4 mt-4">
        {hasExtractedInfo ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Document Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {analysis.extracted_info.summary && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-1">Summary</h4>
                  <p className="text-sm text-muted-foreground">{analysis.extracted_info.summary}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(analysis.extracted_info)
                  .filter(([key]) => key !== 'summary' && key !== 'type')
                  .map(([key, value]) => (
                    value && (
                      <div key={key}>
                        <h4 className="text-xs font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                        <p className="text-sm">{String(value)}</p>
                      </div>
                    )
                  ))
                }
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <p className="text-muted-foreground text-sm">No information extracted from this document</p>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="risks" className="mt-4">
        {hasRisks ? (
          <div className="space-y-3">
            {analysis.risks.map((risk: any, idx: number) => (
              <Card key={idx}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-2">
                    {risk.severity === 'high' ? (
                      <AlertTriangle className={`h-4 w-4 ${getSeverityColor(risk.severity)} mt-1`} />
                    ) : (
                      <CheckCircle className={`h-4 w-4 ${getSeverityColor(risk.severity)} mt-1`} />
                    )}
                    <div>
                      <h4 className="text-sm font-medium">{risk.type}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{risk.description}</p>
                      
                      {risk.regulation && (
                        <div className="mt-2 text-xs">
                          <span className="font-medium">Regulation:</span> {risk.regulation}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
            <h3 className="text-lg font-semibold mb-1">No Risks Detected</h3>
            <p className="text-muted-foreground text-sm">This document appears to be compliant with regulations</p>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="compliance" className="mt-4">
        {analysis.regulatory_compliance ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Regulatory Compliance</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div>
                  <h4 className="text-sm font-medium">Status</h4>
                  <p className="text-sm">{analysis.regulatory_compliance.status}</p>
                </div>
                {analysis.regulatory_compliance.details && (
                  <div>
                    <h4 className="text-sm font-medium">Details</h4>
                    <p className="text-sm text-muted-foreground">{analysis.regulatory_compliance.details}</p>
                  </div>
                )}
                {analysis.regulatory_compliance.references?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium">References</h4>
                    <ul className="text-sm list-disc pl-4">
                      {analysis.regulatory_compliance.references.map((ref: string, idx: number) => (
                        <li key={idx}>{ref}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <p className="text-muted-foreground text-sm">No compliance information available</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
