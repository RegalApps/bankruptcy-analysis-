
import { useState } from "react";
import { Document } from "../types";
import { ChevronRight, ChevronDown, FileText, Folder } from "lucide-react";

interface DocumentTreeProps {
  documents: Document[];
  onDocumentSelect: (documentId: string) => void;
  selectedDocument?: string;
}

export const DocumentTree = ({ 
  documents, 
  onDocumentSelect,
  selectedDocument 
}: DocumentTreeProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  
  // Create a nested structure for the document tree
  const createDocumentTree = () => {
    const rootDocs: Document[] = [];
    const docsByParent: Record<string, Document[]> = {};
    
    // First pass: organize documents by parent
    documents.forEach(doc => {
      if (doc.parent_folder_id) {
        if (!docsByParent[doc.parent_folder_id]) {
          docsByParent[doc.parent_folder_id] = [];
        }
        docsByParent[doc.parent_folder_id].push(doc);
      } else {
        rootDocs.push(doc);
      }
    });
    
    // Sort documents by type (folders first) and then by title
    const sortDocs = (docs: Document[]) => {
      return [...docs].sort((a, b) => {
        // Folders first
        if ((a.is_folder ?? false) && !(b.is_folder ?? false)) return -1;
        if (!(a.is_folder ?? false) && (b.is_folder ?? false)) return 1;
        
        // Then by title
        return a.title.localeCompare(b.title);
      });
    };
    
    // Recursive function to render a document and its children
    const renderDocument = (doc: Document, level: number = 0) => {
      const isFolder = doc.is_folder ?? false;
      const hasChildren = isFolder && docsByParent[doc.id] && docsByParent[doc.id].length > 0;
      const isExpanded = expandedFolders[doc.id] || false;
      const isSelected = selectedDocument === doc.id;
      
      return (
        <div key={doc.id} style={{ marginLeft: `${level * 16}px` }}>
          <div 
            className={`flex items-center py-1 px-2 rounded-md cursor-pointer hover:bg-accent/50 ${isSelected ? 'bg-accent' : ''}`}
            onClick={() => {
              if (isFolder) {
                setExpandedFolders(prev => ({
                  ...prev,
                  [doc.id]: !prev[doc.id]
                }));
              } else {
                onDocumentSelect(doc.id);
              }
            }}
          >
            {isFolder ? (
              <>
                {hasChildren ? (
                  isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground mr-1" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground mr-1" />
                  )
                ) : (
                  <span className="w-4 mr-1" />
                )}
                <Folder className="h-4 w-4 text-primary mr-2" />
              </>
            ) : (
              <>
                <span className="w-4 mr-1" />
                <FileText className="h-4 w-4 text-muted-foreground mr-2" />
              </>
            )}
            <span className="text-sm truncate">{doc.title}</span>
          </div>
          
          {isFolder && isExpanded && hasChildren && (
            <div>
              {sortDocs(docsByParent[doc.id]).map(childDoc => 
                renderDocument(childDoc, level + 1)
              )}
            </div>
          )}
        </div>
      );
    };
    
    return sortDocs(rootDocs).map(doc => renderDocument(doc));
  };
  
  if (documents.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No documents found for this client.
      </div>
    );
  }

  return <div className="space-y-1">{createDocumentTree()}</div>;
};
