
import { File, FileText } from "lucide-react";
import { Document } from "@/components/DocumentList/types";
import { cn } from "@/lib/utils";

interface DocumentListItemProps {
  documents: Document[];
  indentationLevel: number;
  onDocumentSelect: (documentId: string) => void;
  onDocumentOpen: (documentId: string) => void;
  handleDragStart: (id: string, type: 'folder' | 'document') => void;
}

export const DocumentListItem = ({
  documents,
  indentationLevel,
  onDocumentSelect,
  onDocumentOpen,
  handleDragStart
}: DocumentListItemProps) => {
  // Create indentation based on level
  const indentation = Array(indentationLevel).fill(0).map((_, i) => (
    <div key={i} className="w-6" />
  ));

  // Sort documents: Form 47/76 first, then alphabetically
  const sortedDocuments = [...documents].sort((a, b) => {
    // Check for Form 47 or Form 76 to prioritize them
    const aIsForm47or76 = isForm47or76(a);
    const bIsForm47or76 = isForm47or76(b);
    
    if (aIsForm47or76 && !bIsForm47or76) return -1;
    if (!aIsForm47or76 && bIsForm47or76) return 1;
    
    // If both are forms or both are not forms, sort alphabetically
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="ml-10">
      {sortedDocuments.map(doc => (
        <div
          key={doc.id}
          className={cn(
            "flex items-center py-1 px-2 hover:bg-accent/50 rounded-sm cursor-pointer",
            "group transition-colors duration-200"
          )}
          onClick={() => onDocumentSelect(doc.id)}
          onDoubleClick={() => onDocumentOpen(doc.id)}
          draggable
          onDragStart={() => handleDragStart(doc.id, 'document')}
        >
          {indentation}
          {isForm47or76(doc) ? (
            <FileText className="h-4 w-4 text-primary mr-2" />
          ) : (
            <File className="h-4 w-4 text-muted-foreground mr-2" />
          )}
          <span className="text-sm truncate flex-1">{doc.title}</span>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
            <button 
              className="text-xs text-muted-foreground hover:text-primary px-1.5 py-0.5 rounded-sm hover:bg-accent"
              onClick={(e) => {
                e.stopPropagation();
                onDocumentOpen(doc.id);
              }}
            >
              Open
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper function to identify Form 47 or Form 76 documents
function isForm47or76(doc: Document): boolean {
  // Check document title
  if (doc.title?.toLowerCase().includes('form 47') || 
      doc.title?.toLowerCase().includes('form 76') ||
      doc.title?.toLowerCase().includes('consumer proposal') ||
      doc.title?.toLowerCase().includes('statement of affairs')) {
    return true;
  }
  
  // Check metadata
  if (doc.metadata?.formType === 'form-47' || 
      doc.metadata?.formType === 'form-76') {
    return true;
  }
  
  return false;
}
