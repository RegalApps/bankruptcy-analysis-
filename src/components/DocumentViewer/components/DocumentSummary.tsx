
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DocumentSummaryProps {
  summary: string;
}

export const DocumentSummary: React.FC<DocumentSummaryProps> = ({ summary }) => {
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
      </CardContent>
    </Card>
  );
};
