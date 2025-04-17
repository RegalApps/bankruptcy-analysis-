
import { Document } from "@/components/DocumentList/types";
import { ChevronDown, ChevronRight, FileText, Folder, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ClientDocumentTreeProps {
  client: {
    id: string;
    name: string;
    documents: Document[];
  };
  onDocumentSelect: (documentId: string) => void;
  selectedDocumentId?: string;
}

export const ClientDocumentTree = ({ 
  client, 
  onDocumentSelect,
  selectedDocumentId 
}: ClientDocumentTreeProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const documentsByType = client.documents.reduce((acc, doc) => {
    const type = doc.type || 'Other';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  return (
    <div className="space-y-1">
      <div 
        className={cn(
          "flex items-center gap-2 p-2 hover:bg-accent/50 rounded-md cursor-pointer",
          "text-sm font-medium"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
        <User className="h-4 w-4 text-primary" />
        <span>{client.name}</span>
        <span className="text-xs text-muted-foreground ml-2">
          ({client.documents.length} documents)
        </span>
      </div>

      {isExpanded && (
        <div className="ml-6 space-y-1">
          {Object.entries(documentsByType).map(([type, docs]) => (
            <div key={type} className="space-y-1">
              <div className="flex items-center gap-2 p-1 text-sm text-muted-foreground">
                <Folder className="h-4 w-4" />
                {type}
              </div>
              <div className="ml-4 space-y-1">
                {docs.map((doc) => (
                  <div
                    key={doc.id}
                    className={cn(
                      "flex items-center gap-2 p-2 hover:bg-accent/50 rounded-md cursor-pointer",
                      selectedDocumentId === doc.id && "bg-accent"
                    )}
                    onClick={() => onDocumentSelect(doc.id)}
                  >
                    <FileText className="h-4 w-4" />
                    <span className="text-sm truncate">{doc.title}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
