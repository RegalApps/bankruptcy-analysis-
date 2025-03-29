
import { File, FileText, Eye, Lock, Edit2, MessageCircle, History } from "lucide-react";
import { Document } from "@/components/DocumentList/types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>('');

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

  const handleDoubleClick = (document: Document) => {
    if (isDocumentLocked(document)) return;
    setEditingId(document.id);
    setNewName(document.title);
  };

  const handleRename = (id: string, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // In a real app, you would call an API to update the document title
      console.log(`Renamed document ${id} to ${newName}`);
      setEditingId(null);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const getStatusIndicator = (document: Document) => {
    const status = document.metadata?.status || 'pending';
    
    switch (status) {
      case 'approved':
        return <span className="h-2.5 w-2.5 rounded-full bg-green-500" title="Approved / No Risks" />;
      case 'pending':
        return <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" title="Pending / Minor Issues" />;
      case 'attention':
        return <span className="h-2.5 w-2.5 rounded-full bg-orange-500" title="Requires Attention" />;
      case 'critical':
        return <span className="h-2.5 w-2.5 rounded-full bg-red-500" title="Critical Compliance Risks" />;
      default:
        return <span className="h-2.5 w-2.5 rounded-full bg-gray-300" title="No Status" />;
    }
  };

  const isDocumentLocked = (document: Document) => {
    return document.metadata?.locked || document.metadata?.signed || document.title.toLowerCase().includes('signed') || 
      document.metadata?.submitted || document.metadata?.approved;
  };

  return (
    <div className="ml-10">
      {sortedDocuments.map(doc => (
        <ContextMenu key={doc.id}>
          <ContextMenuTrigger>
            <div
              className={cn(
                "flex items-center py-1 px-2 hover:bg-accent/50 rounded-sm cursor-pointer",
                "group transition-colors duration-200"
              )}
              onClick={() => onDocumentSelect(doc.id)}
              onDoubleClick={() => handleDoubleClick(doc)}
              draggable
              onDragStart={() => handleDragStart(doc.id, 'document')}
            >
              {indentation}
              {isForm47or76(doc) ? (
                <FileText className="h-4 w-4 text-primary mr-2" />
              ) : (
                <File className="h-4 w-4 text-muted-foreground mr-2" />
              )}
              
              {editingId === doc.id ? (
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => handleRename(doc.id, e)}
                  onBlur={() => setEditingId(null)}
                  autoFocus
                  className="text-sm px-1 py-0.5 border border-primary rounded flex-1 outline-none"
                />
              ) : (
                <div className="flex items-center flex-1 space-x-2">
                  <span className="text-sm truncate">{doc.title}</span>
                  {getStatusIndicator(doc)}
                  {isDocumentLocked(doc) && (
                    <Lock className="h-3 w-3 text-muted-foreground" title="This document is locked" />
                  )}
                  {doc.metadata?.version && (
                    <span className="text-xs text-muted-foreground">v{doc.metadata.version}</span>
                  )}
                </div>
              )}

              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye 
                  className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDocumentOpen(doc.id);
                  }}
                  aria-label="View Document"
                />
                {!isDocumentLocked(doc) && (
                  <Edit2
                    className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDoubleClick(doc);
                    }}
                    aria-label="Rename Document"
                  />
                )}
                <History
                  className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("View history for", doc.id);
                  }}
                  aria-label="View History"
                />
              </div>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="min-w-[160px]">
            <ContextMenuItem onClick={() => onDocumentOpen(doc.id)}>
              <Eye className="h-4 w-4 mr-2" />
              Open
            </ContextMenuItem>
            {!isDocumentLocked(doc) && (
              <>
                <ContextMenuItem onClick={() => handleDoubleClick(doc)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Rename
                </ContextMenuItem>
                <ContextMenuItem>
                  <Lock className="h-4 w-4 mr-2" />
                  Lock Document
                </ContextMenuItem>
              </>
            )}
            <ContextMenuSeparator />
            <ContextMenuItem>
              <History className="h-4 w-4 mr-2" />
              View History
            </ContextMenuItem>
            <ContextMenuItem>
              <MessageCircle className="h-4 w-4 mr-2" />
              Add Comment
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
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
