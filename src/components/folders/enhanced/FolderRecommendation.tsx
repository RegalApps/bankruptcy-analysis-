
import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, FolderTree } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FolderAIRecommendation } from "@/types/folders";
import { folderService } from "@/services/folderService";
import { Document } from "@/components/DocumentList/types";

interface FolderRecommendationProps {
  document: Document;
  onAccept: (folderId: string) => Promise<void>;
  onReject: () => void;
}

export function FolderRecommendation({ document, onAccept, onReject }: FolderRecommendationProps) {
  const [recommendation, setRecommendation] = useState<FolderAIRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRecommendation = async () => {
      setIsLoading(true);
      try {
        const result = await folderService.getAIFolderRecommendation(document.id);
        setRecommendation(result);
      } catch (error) {
        console.error("Error fetching folder recommendation:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (document?.id) {
      fetchRecommendation();
    }
  }, [document?.id]);

  const handleAccept = async () => {
    if (!recommendation) return;
    
    setIsSubmitting(true);
    try {
      await onAccept(recommendation.suggestedFolderId);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="animate-pulse flex space-x-4 w-full">
              <div className="h-10 w-10 rounded-full bg-primary/20"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-primary/20 rounded w-3/4"></div>
                <div className="h-4 bg-primary/20 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!recommendation) {
    return (
      <Alert variant="default" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No recommendation available</AlertTitle>
        <AlertDescription>
          We couldn't determine the best folder for this document. Please organize it manually.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="mb-4 border-primary/20">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <FolderTree className="h-6 w-6 text-primary mt-1" />
          <div className="flex-1">
            <h4 className="font-medium mb-1">AI Recommendation</h4>
            <p className="text-sm text-muted-foreground mb-2">
              "{document.title}" should be stored under:
            </p>
            <div className="bg-accent/30 p-2 rounded-md mb-4">
              <div className="font-mono text-sm">
                📂 {recommendation.suggestedPath.join(' > ')}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                onClick={handleAccept}
                disabled={isSubmitting}
                className="gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Confirm
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onReject}
                disabled={isSubmitting}
              >
                Choose Another
              </Button>
            </div>
            
            {recommendation.alternatives && recommendation.alternatives.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-1">Alternative locations:</p>
                {recommendation.alternatives.map((alt, index) => (
                  <div 
                    key={index}
                    className="text-xs p-1 hover:bg-accent cursor-pointer rounded-sm"
                    onClick={() => onAccept(alt.folderId)}
                  >
                    📂 {alt.path.join(' > ')}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
