
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, Check, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { FolderRecommendation as FolderRecommendationType } from "@/types/folders";

interface FolderRecommendationProps {
  recommendation: FolderRecommendationType;
  onDismiss: () => void;
  onMoveToFolder: (documentId: string, folderId: string, folderPath: string) => Promise<void>;
  setShowRecommendation: (show: boolean) => void;
}

export const FolderRecommendation = ({
  recommendation,
  onDismiss,
  onMoveToFolder,
  setShowRecommendation
}: FolderRecommendationProps) => {
  const [isMoving, setIsMoving] = useState(false);

  const handleMoveDocument = async () => {
    setIsMoving(true);
    try {
      if (!recommendation) {
        toast.error("No recommendation available");
        return;
      }

      await onMoveToFolder(
        recommendation.documentId,
        recommendation.suggestedFolderId,
        recommendation.folderPath.join('/')
      );
      toast.success("Document moved successfully");
    } catch (error) {
      console.error("Error moving document:", error);
      toast.error("Failed to move document");
    } finally {
      setIsMoving(false);
    }
  };

  return (
    <Card className="w-full bg-amber-50 border-amber-200 mb-4">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-center space-x-2 text-sm">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <p className="text-amber-700 font-medium">
            AI Recommendation
          </p>
        </div>
        <p className="text-sm text-gray-700">
          Move "{recommendation.documentTitle}" to: 
          <span className="font-semibold ml-1">
            {recommendation.folderPath.join(' / ')}
          </span>
        </p>
        <div className="flex justify-end space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onDismiss}
            disabled={isMoving}
          >
            <X className="h-4 w-4 mr-2" />
            Dismiss
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleMoveDocument}
            disabled={isMoving}
          >
            {isMoving ? (
              <>Moving...</>
            ) : (
              <>
                <Folder className="h-4 w-4 mr-2" />
                Move Document
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
