
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Check } from "lucide-react";
import { getForm31DemoAnalysisData } from "../utils/documentTypeUtils";

interface RiskPanelProps {
  risks: any[];
  isLoading: boolean;
  hasRisks: boolean;
  documentId: string;
  isForm31GreenTech?: boolean;
}

export const RiskPanel: React.FC<RiskPanelProps> = ({
  risks,
  isLoading,
  hasRisks,
  documentId,
  isForm31GreenTech = false
}) => {
  // For Form 31 documents, ensure we always have risk data
  const finalRisks = isForm31GreenTech && (!risks || risks.length === 0) 
                    ? getForm31DemoAnalysisData().risks
                    : risks;
  
  const finalHasRisks = isForm31GreenTech || hasRisks;

  if (isLoading) {
    return null; // Loading state is handled in parent component
  }
  
  if (!finalHasRisks || !finalRisks || finalRisks.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            <h3 className="font-medium text-sm">No risks identified in this document</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            This document appears to comply with regulatory requirements.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Group risks by severity
  const highRisks = finalRisks.filter(risk => risk.severity === 'high');
  const mediumRisks = finalRisks.filter(risk => risk.severity === 'medium');
  const lowRisks = finalRisks.filter(risk => risk.severity === 'low');
  
  return (
    <div className="space-y-4">
      {highRisks.length > 0 && (
        <Card className="border-red-300">
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-medium text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Critical Issues
            </h3>
            {highRisks.map((risk, index) => (
              <div key={`high-${index}`} className="bg-red-50 p-3 rounded-md border border-red-100">
                <h4 className="font-medium text-sm">{risk.type}</h4>
                <p className="text-xs text-gray-700 mt-1">{risk.description}</p>
                <div className="mt-2 text-xs text-gray-600">
                  <p><span className="font-medium">Regulation:</span> {risk.regulation}</p>
                  <p><span className="font-medium">Solution:</span> {risk.solution}</p>
                  <p><span className="font-medium">Deadline:</span> {risk.deadline}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      {mediumRisks.length > 0 && (
        <Card className="border-amber-300">
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-medium text-amber-600">Important Concerns</h3>
            {mediumRisks.map((risk, index) => (
              <div key={`medium-${index}`} className="bg-amber-50 p-3 rounded-md border border-amber-100">
                <h4 className="font-medium text-sm">{risk.type}</h4>
                <p className="text-xs text-gray-700 mt-1">{risk.description}</p>
                <div className="mt-2 text-xs text-gray-600">
                  <p><span className="font-medium">Regulation:</span> {risk.regulation}</p>
                  <p><span className="font-medium">Solution:</span> {risk.solution}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      {lowRisks.length > 0 && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-medium text-gray-600">Minor Issues</h3>
            {lowRisks.map((risk, index) => (
              <div key={`low-${index}`} className="bg-gray-50 p-3 rounded-md border border-gray-100">
                <h4 className="font-medium text-sm">{risk.type}</h4>
                <p className="text-xs text-gray-700 mt-1">{risk.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
