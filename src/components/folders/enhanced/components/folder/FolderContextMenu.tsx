
import { Edit2, Lock, MessageCircle } from "lucide-react";
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";

interface FolderContextMenuProps {
  isExpanded: boolean;
  isFolderLocked: boolean;
  onToggleExpand: (e: React.MouseEvent) => void;
  onRenameClick: () => void;
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
  return (
    <ContextMenuContent className="min-w-[160px]">
      <ContextMenuItem onClick={onToggleExpand}>
        {isExpanded ? "Collapse" : "Expand"}
      </ContextMenuItem>
      
      {!isFolderLocked && (
        <>
          <ContextMenuItem onClick={onRenameClick}>
            <Edit2 className="h-4 w-4 mr-2" />
            Rename
          </ContextMenuItem>
          <ContextMenuItem onClick={onLockClick}>
            <Lock className="h-4 w-4 mr-2" />
            Lock Folder
          </ContextMenuItem>
        </>
      )}
      
      <ContextMenuSeparator />
      
      <ContextMenuItem onClick={onCommentClick}>
        <MessageCircle className="h-4 w-4 mr-2" />
        Add Comment
      </ContextMenuItem>
    </ContextMenuContent>
  );
};
