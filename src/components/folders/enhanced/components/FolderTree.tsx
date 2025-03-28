
import { ChevronRight, ChevronDown, Folder, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { FolderStructure } from "@/types/folders";

interface FolderTreeProps {
  folders: FolderStructure[];
  selectedFolderId?: string;
  expandedFolders: Record<string, boolean>;
  onFolderSelect: (folderId: string) => void;
  onToggleExpand: (folderId: string, e: React.MouseEvent) => void;
  isDragging?: boolean;
}

export const FolderTree = ({
  folders,
  selectedFolderId,
  expandedFolders,
  onFolderSelect,
  onToggleExpand,
  isDragging
}: FolderTreeProps) => {
  const renderFolder = (folder: FolderStructure, level = 0) => {
    const isExpanded = expandedFolders[folder.id];
    const isSelected = folder.id === selectedFolderId;
    const hasChildren = folder.children && folder.children.length > 0;
    
    return (
      <div key={folder.id} className="mb-1">
        <div 
          className={cn(
            "flex items-center py-1 px-2 rounded-sm cursor-pointer",
            isSelected ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent/50",
            isDragging && "opacity-50"
          )}
          style={{ paddingLeft: `${(level * 16) + 8}px` }}
          onClick={() => onFolderSelect(folder.id)}
        >
          <button 
            className="mr-1 p-1 hover:bg-muted rounded-sm"
            onClick={(e) => onToggleExpand(folder.id, e)}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )
            ) : (
              <span className="w-4 inline-block"></span>
            )}
          </button>
          
          {isExpanded ? (
            <FolderOpen className="h-4 w-4 text-primary mr-2" />
          ) : (
            <Folder className="h-4 w-4 text-muted-foreground mr-2" />
          )}
          
          <span className="text-sm truncate">{folder.name}</span>
          
          {folder.documentCount && (
            <span className="ml-auto text-xs text-muted-foreground">{folder.documentCount}</span>
          )}
        </div>
        
        {isExpanded && hasChildren && (
          <div className="ml-4">
            {folder.children.map(child => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {folders.map(folder => renderFolder(folder))}
    </div>
  );
};
