
import { useState, useRef } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { FolderStructure } from "@/types/folders";
import { Document } from "@/components/DocumentList/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface FolderNavigationProps {
  folders: FolderStructure[];
  documents: Document[];
  onFolderSelect: (folderId: string) => void;
  onDocumentSelect: (documentId: string) => void;
  onDocumentOpen: (documentId: string) => void;
  selectedFolderId?: string;
  expandedFolders: Record<string, boolean>;
  setExpandedFolders: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export function FolderNavigation({
  folders,
  documents,
  onFolderSelect,
  onDocumentSelect,
  onDocumentOpen,
  selectedFolderId,
  expandedFolders,
  setExpandedFolders
}: FolderNavigationProps) {
  const [draggedItem, setDraggedItem] = useState<{ id: string, type: 'folder' | 'document' } | null>(null);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const toggleFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const handleDragStart = (id: string, type: 'folder' | 'document') => {
    setDraggedItem({ id, type });
  };

  const handleDragOver = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    setDragOverFolder(folderId);
    
    // Auto-expand folder when dragging over it
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setExpandedFolders(prev => ({
        ...prev,
        [folderId]: true
      }));
    }, 1000); // Expand after hovering for 1 second
  };

  const handleDragLeave = () => {
    setDragOverFolder(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetFolderId: string) => {
    e.preventDefault();
    setDragOverFolder(null);
    
    if (!draggedItem) return;
    
    try {
      if (draggedItem.type === 'document') {
        // Move document to target folder
        const { error } = await supabase
          .from('documents')
          .update({ parent_folder_id: targetFolderId })
          .eq('id', draggedItem.id);
          
        if (error) throw error;
        
        // Show success message
        toast.success("Document moved successfully");
      } else if (draggedItem.type === 'folder') {
        // Validate: Can't move a folder into its own child
        let isValidMove = true;
        let currentFolderId = targetFolderId;
        
        // Check if target folder is a descendant of the dragged folder
        while (currentFolderId) {
          if (currentFolderId === draggedItem.id) {
            isValidMove = false;
            break;
          }
          
          const parentFolder = documents.find(
            doc => doc.is_folder && doc.id === currentFolderId
          );
          
          currentFolderId = parentFolder?.parent_folder_id || null;
        }
        
        if (!isValidMove) {
          toast.error("Cannot move a folder into its own subfolder");
          return;
        }
        
        // Move folder to target folder
        const { error } = await supabase
          .from('documents')
          .update({ parent_folder_id: targetFolderId })
          .eq('id', draggedItem.id);
          
        if (error) throw error;
        
        // Show success message
        toast.success("Folder moved successfully");
      }
    } catch (error) {
      console.error("Error moving item:", error);
      toast.error("Failed to move item");
    } finally {
      setDraggedItem(null);
    }
  };

  const renderFolderItem = (folder: FolderStructure) => {
    const isExpanded = expandedFolders[folder.id] || false;
    const isSelected = folder.id === selectedFolderId;
    const folderDocuments = documents.filter(
      doc => !doc.is_folder && doc.parent_folder_id === folder.id
    );
    
    const isDragTarget = dragOverFolder === folder.id;

    // Create indentation based on level
    const indentation = Array(folder.level).fill(0).map((_, i) => (
      <div key={i} className="w-6" />
    ));

    return (
      <div key={folder.id}>
        <div 
          className={cn(
            "flex items-center py-1 px-2 hover:bg-accent/40 rounded-sm cursor-pointer",
            isSelected && "bg-accent/60",
            isDragTarget && "bg-primary/20 border border-dashed border-primary"
          )}
          onClick={() => onFolderSelect(folder.id)}
          draggable
          onDragStart={(e) => handleDragStart(folder.id, 'folder')}
          onDragOver={(e) => handleDragOver(e, folder.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, folder.id)}
        >
          {indentation}
          
          <button 
            className="p-1 rounded-sm hover:bg-muted/60 mr-1"
            onClick={(e) => toggleFolder(folder.id, e)}
          >
            {folder.children && folder.children.length > 0 ? (
              isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
            ) : (
              <div className="w-4" />
            )}
          </button>
          
          {isExpanded ? (
            <FolderOpen className="h-4 w-4 text-primary mr-2" />
          ) : (
            <Folder className="h-4 w-4 text-muted-foreground mr-2" />
          )}
          
          <span className="text-sm truncate">{folder.name}</span>
          
          {folderDocuments.length > 0 && (
            <span className="ml-auto text-xs text-muted-foreground">{folderDocuments.length}</span>
          )}
        </div>

        {/* Render child folders if expanded */}
        {isExpanded && folder.children && folder.children.length > 0 && (
          <div>
            {folder.children.map(childFolder => renderFolderItem(childFolder))}
          </div>
        )}

        {/* Render documents in this folder if expanded */}
        {isExpanded && folderDocuments.length > 0 && (
          <div>
            {folderDocuments.map(doc => (
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
        )}
      </div>
    );
  };

  return (
    <ScrollArea className="h-[calc(100vh-10rem)]">
      <div className="pr-4">
        {folders.length > 0 ? (
          folders.map(folder => renderFolderItem(folder))
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <p>No folders found</p>
            <p className="text-sm mt-1">Create a folder to organize your documents</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
