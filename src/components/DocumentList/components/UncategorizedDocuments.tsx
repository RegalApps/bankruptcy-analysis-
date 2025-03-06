import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface UncategorizedDocumentsProps {
  documents: any[];
  onDocumentClick: (document: { id: string; title: string; storage_path: string }) => void;
}

export const UncategorizedDocuments: React.FC<UncategorizedDocumentsProps> = ({
  documents,
  onDocumentClick
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Uncategorized Documents</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {documents.map(doc => (
          <Card 
            key={doc.id} 
            className="cursor-pointer hover:bg-accent/10 transition-colors"
            onClick={() => onDocumentClick({
              id: doc.id,
              title: doc.title,
              storage_path: doc.storage_path
            })}
          >
            <CardHeader>
              <CardTitle className="text-sm font-medium truncate">{doc.title}</CardTitle>
            </CardHeader>
            <CardContent className="py-2 text-sm text-muted-foreground">
              Uploaded {formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}
            </CardContent>
          </Card>
        ))}
        
        {documents.length === 0 && (
          <div className="col-span-full text-center p-8 text-muted-foreground">
            No uncategorized documents found.
          </div>
        )}
      </div>
    </div>
  );
};
