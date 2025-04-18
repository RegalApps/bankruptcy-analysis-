
import { ChevronRight, ChevronDown, FileText, FolderOpen } from "lucide-react";
import { useState } from "react";
import { StatusIcon } from "./StatusIcon";
import { cn } from "@/lib/utils";

interface ClientDocumentTreeProps {
  client: {
    id: string;
    name: string;
    documents: any[];
  };
  onDocumentSelect: (documentId: string) => void;
  selectedDocumentId?: string;
}

export const ClientDocumentTree = ({ 
  client,
  onDocumentSelect,
  selectedDocumentId
}: ClientDocumentTreeProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border rounded-md overflow-hidden shadow-sm">
      <div 
        className="flex items-center justify-between bg-muted/50 px-3 py-2 cursor-pointer hover:bg-muted transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-primary" />
          <span className="font-medium">{client.name}</span>
          <span className="text-xs text-muted-foreground ml-2">
            ({client.documents.length} document{client.documents.length !== 1 ? 's' : ''})
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </div>
      
      {isExpanded && (
        <div className="divide-y">
          {client.documents.map((doc) => (
            <div 
              key={doc.id}
              className={cn(
                "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent/20 transition-colors",
                selectedDocumentId === doc.id && "bg-accent/40"
              )}
              onClick={() => onDocumentSelect(doc.id)}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className={cn("text-sm", doc.status === "needs-review" ? "font-medium" : "")}>{doc.name}</span>
              </div>
              <StatusIcon status={doc.status} />
            </div>
          ))}
          
          {client.documents.length === 0 && (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No documents available
            </div>
          )}
        </div>
      )}
    </div>
  );
};
