
import { AlertCircle, CheckCircle2, FolderTree } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface FolderRecommendationAlertProps {
  documentTitle: string;
  folderPath: string[];
  onAccept: () => void;
  onDismiss: () => void;
}

export const FolderRecommendationAlert = ({
  documentTitle,
  folderPath,
  onAccept,
  onDismiss
}: FolderRecommendationAlertProps) => {
  return (
    <Alert className="mb-4 border-primary/20 bg-primary/10">
      <FolderTree className="h-5 w-5 text-primary" />
      <AlertTitle className="flex items-center">
        AI Recommendation
      </AlertTitle>
      <AlertDescription className="space-y-4">
        <p className="text-sm pt-2">
          <span className="font-medium">"{documentTitle}"</span> should be stored under:
          <span className="font-medium ml-1">{folderPath.join(' > ')}</span>
        </p>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            className="gap-1" 
            onClick={onAccept}
          >
            <CheckCircle2 className="h-4 w-4" />
            Confirm
          </Button>
          <Button 
            size="sm"
            variant="outline"
            onClick={onDismiss}
          >
            Choose Another Folder
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
