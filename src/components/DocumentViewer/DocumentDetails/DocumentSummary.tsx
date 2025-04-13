
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegulatoryCompliance } from "@/utils/documents/types/analysisTypes";

interface DocumentSummaryProps {
  summary: string;
  regulatoryCompliance?: RegulatoryCompliance;
}

export const DocumentSummary: React.FC<DocumentSummaryProps> = ({ 
  summary,
  regulatoryCompliance 
}) => {
  if (!summary) {
    return (
      <Card className="bg-muted/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Document Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm italic">No summary available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-muted/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Document Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{summary}</p>
        
        {regulatoryCompliance && (
          <div className="mt-4 pt-4 border-t border-muted">
            <h4 className="font-medium text-sm mb-2">Regulatory Compliance</h4>
            <p className="text-sm">{regulatoryCompliance.details}</p>
            
            {regulatoryCompliance.references && regulatoryCompliance.references.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground">References:</p>
                <ul className="text-xs list-disc pl-5 mt-1 space-y-1">
                  {regulatoryCompliance.references.map((ref, idx) => (
                    <li key={idx}>{ref}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
