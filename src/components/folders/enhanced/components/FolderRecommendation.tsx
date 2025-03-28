import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, Check, X } from "lucide-react";
import { FolderAIRecommendation } from "@/types/folders";

interface FolderRecommendationProps {
  recommendation: FolderAIRecommendation;
  onAccept: () => void;
  onReject: () => void;
}

export const FolderRecommendation = ({
  recommendation,
  onAccept,
  onReject
}: FolderRecommendationProps) => {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">
              Recommended Folder: {recommendation.suggestedPath.join(' / ')}
            </h3>
            <p className="text-xs text-muted-foreground">
              Reason: {recommendation.reason}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onReject}>
              <X className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button variant="outline" size="sm" onClick={onAccept}>
              <Check className="h-4 w-4 mr-2" />
              Accept
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
