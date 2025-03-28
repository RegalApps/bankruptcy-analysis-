
import { Document } from "../types";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileText, ExternalLink } from "lucide-react";

interface DocumentListProps {
  documents: Document[];
  onDocumentSelect: (documentId: string) => void;
  onDocumentOpen: (documentId: string) => void;
  selectedDocumentId: string | null;
}

export const DocumentList = ({ 
  documents, 
  onDocumentSelect, 
  onDocumentOpen,
  selectedDocumentId 
}: DocumentListProps) => {
  // Group documents by type
  const documentsByType = documents.reduce((acc, doc) => {
    const type = doc.type || 'Other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);
  
  // Sort documents in each group by updated_at
  Object.keys(documentsByType).forEach(type => {
    documentsByType[type].sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  });
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-medium text-lg">Client Documents</h3>
        <p className="text-sm text-muted-foreground">
          {documents.length === 0 
            ? "No documents found" 
            : `${documents.length} document${documents.length === 1 ? '' : 's'} found`}
        </p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4">
          {documents.length > 0 ? (
            Object.entries(documentsByType).map(([type, docs]) => (
              <div key={type} className="mb-6">
                <h4 className="font-medium text-sm mb-2 px-2">{type}</h4>
                <div className="space-y-2">
                  {docs.map(doc => (
                    <div
                      key={doc.id}
                      className={cn(
                        "p-3 border rounded-md cursor-pointer hover:bg-accent/50 transition-colors",
                        selectedDocumentId === doc.id ? "bg-accent" : ""
                      )}
                      onClick={() => onDocumentSelect(doc.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h5 className="font-medium">{doc.title}</h5>
                            <p className="text-xs text-muted-foreground mt-1">
                              Updated: {format(new Date(doc.updated_at), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDocumentOpen(doc.id);
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-6">
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h4 className="font-medium">No Documents Found</h4>
              <p className="text-sm text-muted-foreground mt-1">
                This client does not have any documents yet.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
