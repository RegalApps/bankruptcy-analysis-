
import { 
  ContextMenuContent, 
  ContextMenuItem, 
  ContextMenuSeparator, 
  ContextMenuShortcut 
} from "@/components/ui/context-menu";
import { 
  ChevronDown, 
  ChevronRight, 
  Edit, 
  Lock, 
  MessageSquare
} from "lucide-react";

interface FolderContextMenuProps {
  isExpanded: boolean;
  isFolderLocked: boolean;
  onToggleExpand: () => void;
  onRenameClick: (e: React.MouseEvent) => void;
  onLockClick: () => void;
  onCommentClick: () => void;
}

export const FolderContextMenu = ({
  isExpanded,
  isFolderLocked,
  onToggleExpand,
  onRenameClick,
  onLockClick,
  onCommentClick
}: FolderContextMenuProps) => {
  // Create a synthetic mouse event for the rename action
  const handleRenameClick = () => {
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    }) as unknown as React.MouseEvent;
    onRenameClick(event);
  };

  return (
    <ContextMenuContent className="w-64">
      <ContextMenuItem onClick={onToggleExpand}>
        {isExpanded ? (
          <>
            <ChevronDown className="h-4 w-4 mr-2" />
            <span>Collapse Folder</span>
          </>
        ) : (
          <>
            <ChevronRight className="h-4 w-4 mr-2" />
            <span>Expand Folder</span>
          </>
        )}
        <ContextMenuShortcut>⌘E</ContextMenuShortcut>
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      <ContextMenuItem 
        onClick={handleRenameClick}
        disabled={isFolderLocked}
      >
        <Edit className="h-4 w-4 mr-2" />
        <span>Rename</span>
        <ContextMenuShortcut>⌘R</ContextMenuShortcut>
      </ContextMenuItem>
      
      <ContextMenuItem onClick={onLockClick}>
        <Lock className="h-4 w-4 mr-2" />
        <span>{isFolderLocked ? 'Unlock Folder' : 'Lock Folder'}</span>
        <ContextMenuShortcut>⌘L</ContextMenuShortcut>
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      <ContextMenuItem onClick={onCommentClick}>
        <MessageSquare className="h-4 w-4 mr-2" />
        <span>Add Comment</span>
        <ContextMenuShortcut>⌘C</ContextMenuShortcut>
      </ContextMenuItem>
    </ContextMenuContent>
  );
};
