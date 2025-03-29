
import { Document } from "@/components/DocumentList/types";
import { FileQuestion } from "lucide-react";

interface UncategorizedTabProps {
  documents: Document[];
  onDocumentOpen: (documentId: string) => void;
}

export const UncategorizedTab = ({ documents, onDocumentOpen }: UncategorizedTabProps) => {
  // Filter uncategorized documents (not in any folder)
  const uncategorizedDocuments = documents.filter(doc => 
    !doc.is_folder && !doc.parent_folder_id
  );

  return (
    <div className="border rounded-md p-3">
      <h3 className="text-sm font-medium mb-2">Uncategorized Documents</h3>
      <div className="space-y-1">
        {uncategorizedDocuments.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2">No uncategorized documents found.</p>
        ) : (
          uncategorizedDocuments.map(doc => (
            <div 
              key={doc.id}
              className="flex items-center gap-2 p-2 hover:bg-accent/50 rounded-sm cursor-pointer"
              onClick={() => onDocumentOpen(doc.id)}
            >
              <FileQuestion className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm truncate">{doc.title}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {new Date(doc.created_at).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
