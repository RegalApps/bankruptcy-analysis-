
import React from "react";
import { Document } from "@/components/client/types";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface UncategorizedTabProps {
  documents: Document[];
  onDocumentOpen?: (documentId: string) => void;
}

export const UncategorizedTab = ({ 
  documents, 
  onDocumentOpen 
}: UncategorizedTabProps) => {
  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Uncategorized Documents</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map(doc => (
          <Card 
            key={doc.id}
            className={cn(
              "relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer h-[120px]",
              "border-muted-foreground/20"
            )}
            onClick={() => onDocumentOpen?.(doc.id)}
          >
            <CardContent className="p-4 flex flex-col h-full">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                  <h3 className="font-medium truncate">{doc.title}</h3>
                </div>
                <Eye 
                  className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDocumentOpen?.(doc.id);
                  }}
                />
              </div>
              
              <div className="mt-auto text-xs text-muted-foreground">
                {new Date(doc.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
