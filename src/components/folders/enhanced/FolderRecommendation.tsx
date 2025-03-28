import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, Check, X, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { folderService } from "@/services/folderService";
import { FolderAIRecommendation } from "@/types/folders";

interface FolderRecommendationProps {
  recommendation: FolderAIRecommendation;
  onDismiss: () => void;
  onMove: () => void;
}

export const FolderRecommendation = ({
  recommendation,
  onDismiss,
  onMove
}: FolderRecommendationProps) => {
  const { toast } = useToast();
  const [isMoving, setIsMoving] = useState(false);

  const handleMoveDocument = async () => {
    setIsMoving(true);
    try {
      if (!recommendation) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No recommendation available"
        });
        return;
      }

      const success = await folderService.moveDocumentToFolder(
        recommendation.documents[0],
        recommendation.suggestedFolderId
      );

      if (success) {
        toast({
          title: "Success",
          description: "Document moved successfully"
        });
        onMove();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to move document"
        });
      }
    } catch (error) {
      console.error("Error moving document:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to move document"
      });
    } finally {
      setIsMoving(false);
    }
  };

  return (
    <Card className="w-full bg-amber-50 border-amber-200">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-center space-x-2 text-sm">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <p className="text-amber-700 font-medium">
            AI Recommendation
          </p>
        </div>
        <p className="text-sm text-gray-700">
          Move this document to: 
          <span className="font-semibold">
            {recommendation?.suggestedPath?.join(' / ')}
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
