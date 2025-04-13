
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ExtractedInfo } from "@/utils/documents/types/analysisTypes";

interface ClientDetailsProps {
  extractedInfo: ExtractedInfo;
}

export const ClientDetails: React.FC<ClientDetailsProps> = ({ extractedInfo }) => {
  return (
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
  );
};
