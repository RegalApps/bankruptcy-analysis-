
import React from "react";
import { Document } from "@/components/client/types";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UncategorizedTabProps {
  documents: Document[];
  onDocumentOpen?: (documentId: string) => void;
}

export const UncategorizedTab = ({ documents, onDocumentOpen }: UncategorizedTabProps) => {
  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Uncategorized Documents</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map(doc => doc && (
          <Card key={doc.id} className="h-[120px] hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex flex-col h-full">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                  <h3 className="font-medium truncate">{doc.title || "Unnamed Document"}</h3>
                </div>
                {onDocumentOpen && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDocumentOpen(doc.id)}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="mt-auto text-xs text-muted-foreground flex items-center justify-between">
                <span>
                  {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : "No date available"}
                </span>
                <span className="text-xs font-medium text-primary">
                  {doc.type || "Unknown type"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
