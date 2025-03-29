
import { Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FolderLockIndicatorProps {
  isLocked: boolean;
}

export const FolderLockIndicator = ({ isLocked }: FolderLockIndicatorProps) => {
  if (!isLocked) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Lock className="h-3 w-3 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent>
          <p>This folder is locked</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
