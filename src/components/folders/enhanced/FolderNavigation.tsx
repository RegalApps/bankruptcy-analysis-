
import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { FolderStructure } from "@/types/folders";
import { Document } from "@/components/DocumentList/types";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const toggleFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const renderFolderItem = (folder: FolderStructure) => {
    const isExpanded = expandedFolders[folder.id] || false;
    const isSelected = folder.id === selectedFolderId;
    const folderDocuments = documents.filter(
      doc => !doc.is_folder && doc.parent_folder_id === folder.id
    );

    // Create indentation based on level
    const indentation = Array(folder.level).fill(0).map((_, i) => (
      <div key={i} className="w-6" />
    ));

    return (
      <div key={folder.id}>
        <div 
          className={cn(
            "flex items-center py-1 px-2 hover:bg-accent/40 rounded-sm cursor-pointer",
            isSelected && "bg-accent/60"
          )}
          onClick={() => onFolderSelect(folder.id)}
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
        {folders.map(folder => renderFolderItem(folder))}
      </div>
    </ScrollArea>
  );
}
