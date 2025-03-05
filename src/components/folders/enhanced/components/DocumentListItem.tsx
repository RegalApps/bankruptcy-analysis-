
import { FileText } from "lucide-react";
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

  return (
    <div>
      {documents.map(doc => (
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
          <FileText className="h-4 w-4 text-muted-foreground mr-2" />
          <span className="text-sm truncate">{doc.title}</span>
        </div>
      ))}
    </div>
  );
};
