
import { Document } from "@/components/DocumentList/types";
import { cn } from "@/lib/utils";
import { FileText, Tag } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

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
  const documentTags = document.metadata?.tags || [];
  
  // Format the date for display
  let dateDisplay = "";
  if (document.updated_at) {
    dateDisplay = `Updated ${formatDistanceToNow(new Date(document.updated_at), { addSuffix: true })}`;
  } else if (document.created_at) {
    dateDisplay = `Created ${formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}`;
  }
  
  return (
    <div 
      className={cn(
        "text-sm p-3 rounded-md cursor-pointer flex flex-col",
        "border border-transparent transition-all duration-200",
        isHovered ? "bg-accent/10 border-accent/20" : "hover:bg-accent/5"
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
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="truncate flex-1 font-medium">{document.title}</span>
        </div>
        
        {isHovered && (
          <span className="text-xs text-primary ml-2 whitespace-nowrap">Open Document</span>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-1 pl-6">
        <div className="flex items-center">
          {documentTags.length > 0 && (
            <div className="flex items-center mr-2">
              <Tag className="h-3 w-3 text-muted-foreground mr-1" />
              <div className="flex space-x-1">
                {documentTags.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0 h-5">
                    {tag}
                  </Badge>
                ))}
                {documentTags.length > 2 && (
                  <span className="text-xs text-muted-foreground">+{documentTags.length - 2}</span>
                )}
              </div>
            </div>
          )}
        </div>
        
        {dateDisplay && (
          <span className="text-xs text-muted-foreground">{dateDisplay}</span>
        )}
      </div>
    </div>
  );
};
