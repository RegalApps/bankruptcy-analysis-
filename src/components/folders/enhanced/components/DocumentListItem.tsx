
import { FileText, File } from "lucide-react";
import { Document } from "@/components/DocumentList/types";

interface DocumentListProps {
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
}: DocumentListProps) => {
  // Create indentation based on level
  const indentation = Array(indentationLevel).fill(0).map((_, i) => (
    <div key={i} className="w-6" />
  ));

  // Get icon based on document type
  const getDocumentIcon = (doc: Document) => {
    const formType = doc.metadata?.formType;
    const title = doc.title?.toLowerCase() || '';
    
    if (formType === 'form-47' || title.includes('form 47') || title.includes('consumer proposal')) {
      return <FileText className="h-4 w-4 text-green-500 mr-2" />;
    } else if (formType === 'form-76' || title.includes('form 76') || title.includes('statement of affairs')) {
      return <FileText className="h-4 w-4 text-blue-500 mr-2" />;
    } else {
      return <File className="h-4 w-4 text-muted-foreground mr-2" />;
    }
  };

  // Sort documents to show forms first
  const sortedDocuments = [...documents].sort((a, b) => {
    const aIsForm = a.metadata?.formType === 'form-47' || a.metadata?.formType === 'form-76';
    const bIsForm = b.metadata?.formType === 'form-47' || b.metadata?.formType === 'form-76';
    
    if (aIsForm && !bIsForm) return -1;
    if (!aIsForm && bIsForm) return 1;
    return 0;
  });

  return (
    <div>
      {sortedDocuments.map(doc => {
        const isForm = doc.metadata?.formType === 'form-47' || doc.metadata?.formType === 'form-76';
        const clientName = doc.metadata?.client_name;
        
        return (
          <div 
            key={doc.id}
            className="flex items-center py-1 px-2 hover:bg-accent/40 rounded-sm cursor-pointer"
            onClick={() => onDocumentSelect(doc.id)}
            onDoubleClick={() => onDocumentOpen(doc.id)}
            draggable
            onDragStart={() => handleDragStart(doc.id, 'document')}
          >
            {indentation}
            <div className="w-6" /> {/* Align with folder icon */}
            {getDocumentIcon(doc)}
            <div className="flex flex-col">
              <span className="text-sm truncate">{doc.title}</span>
              {isForm && clientName && (
                <span className="text-xs text-muted-foreground">Client: {clientName}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
