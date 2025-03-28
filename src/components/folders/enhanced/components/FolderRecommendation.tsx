
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FolderIcon, FolderPlusIcon, FolderXIcon, CheckIcon, XIcon } from "lucide-react";
import { FolderAIRecommendation } from "@/types/folders";
import { folderService } from "@/services/folderService";

interface FolderRecommendationProps {
  folderRecommendation: FolderAIRecommendation | null;
  onAccept: () => Promise<void>;
  onDismiss: () => void;
  isOpen: boolean;
}

export const FolderRecommendation = ({
  folderRecommendation,
  onAccept,
  onDismiss,
  isOpen
}: FolderRecommendationProps) => {
  if (!isOpen || !folderRecommendation) return null;
  
  return (
    <Card className="p-4 mb-4 bg-muted/50">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <FolderPlusIcon className="h-5 w-5 mr-2 text-primary" />
            <div>
              <h3 className="font-medium">Suggested Folder</h3>
              <p className="text-sm text-muted-foreground">
                AI has a recommendation for organizing your documents
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="bg-background rounded-md p-3">
          <p className="text-sm mb-2">
            Move {folderRecommendation.documents.length} document(s) to:
          </p>
          <div className="flex items-center text-sm font-medium mb-1">
            <FolderIcon className="h-4 w-4 mr-1 text-muted-foreground" />
            {folderRecommendation.suggestedPath.join(' / ')}
          </div>
          <p className="text-xs text-muted-foreground">
            {folderRecommendation.reason}
          </p>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            Dismiss
          </Button>
          <Button size="sm" onClick={onAccept} className="gap-1">
            <CheckIcon className="h-4 w-4" />
            Accept
          </Button>
        </div>
      </div>
    </Card>
  );
};
