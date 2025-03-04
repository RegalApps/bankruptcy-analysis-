
import { Document } from "@/components/DocumentList/types";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";
import { useState } from "react";

interface FolderDocumentListProps {
  documents: Document[];
  folderId: string;
  onOpenDocument?: (documentId: string) => void;
}

export const FolderDocumentList = ({ 
  documents, 
  folderId, 
  onOpenDocument 
}: FolderDocumentListProps) => {
  const folderDocuments = documents.filter(doc => !doc.is_folder && doc.parent_folder_id === folderId);
  
  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
      <h5 className="text-sm font-medium mb-2">Documents in this folder:</h5>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {folderDocuments.length > 0 ? (
          folderDocuments.map(doc => (
            <DocumentItem 
              key={doc.id}
              document={doc}
              onOpenDocument={onOpenDocument}
            />
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No documents in this folder</p>
        )}
      </div>
    </div>
  );
};

interface DocumentItemProps {
  document: Document;
  onOpenDocument?: (documentId: string) => void;
}

const DocumentItem = ({ document, onOpenDocument }: DocumentItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={cn(
        "text-sm p-2 rounded-md cursor-pointer flex items-center",
        "border border-transparent transition-all duration-200",
        isHovered && "bg-accent/10 border-accent/20"
      )}
      onClick={(e) => {
        e.stopPropagation();
        if (onOpenDocument) onOpenDocument(document.id);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && onOpenDocument) {
          onOpenDocument(document.id);
        }
      }}
    >
      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
      <span className="truncate flex-1">{document.title}</span>
      {isHovered && (
        <span className="text-xs text-primary ml-2">Open</span>
      )}
    </div>
  );
};
