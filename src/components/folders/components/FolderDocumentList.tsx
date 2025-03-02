
import { Document } from "@/components/DocumentList/types";
import { cn } from "@/lib/utils";

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
      <div className="space-y-2">
        {folderDocuments.length > 0 ? (
          folderDocuments.map(doc => (
            <div 
              key={doc.id}
              className="text-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenDocument) onOpenDocument(doc.id);
              }}
            >
              <span className="truncate">{doc.title}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No documents in this folder</p>
        )}
      </div>
    </div>
  );
};
