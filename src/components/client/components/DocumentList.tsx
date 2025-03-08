
import { FileText, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Document } from "../types";

interface DocumentListProps {
  documents: Document[];
  onDocumentOpen: (documentId: string) => void;
}

export const DocumentList = ({ documents, onDocumentOpen }: DocumentListProps) => {
  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Documents Found</h3>
        <p className="text-muted-foreground">This client doesn't have any documents yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <Card 
          key={doc.id} 
          className="hover:shadow-sm cursor-pointer transition-shadow"
          onClick={() => onDocumentOpen(doc.id)}
        >
          <CardContent className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{doc.title}</p>
                <p className="text-xs text-muted-foreground">
                  Last modified: {new Date(doc.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button size="sm" variant="ghost">
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
