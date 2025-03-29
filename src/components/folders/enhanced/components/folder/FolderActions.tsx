
import { Edit2, MessageCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FolderActionsProps {
  isFolderLocked: boolean;
  onRenameClick: (e: React.MouseEvent) => void;
  onCommentClick: (e: React.MouseEvent) => void;
}

export const FolderActions = ({ isFolderLocked, onRenameClick, onCommentClick }: FolderActionsProps) => {
  if (isFolderLocked) {
    return null;
  }

  return (
    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Edit2
              className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={onRenameClick}
              aria-label="Rename Folder"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Rename Folder</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <MessageCircle
              className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={onCommentClick}
              aria-label="Add Comment"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Add Comment</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
