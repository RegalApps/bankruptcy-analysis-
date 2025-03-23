
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, X, FolderTree, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { FolderRecommendation } from "../hooks/types/folderTypes";

interface FolderOperationsProps {
  showRecommendation: boolean;
  recommendation: FolderRecommendation | null;
  onAcceptRecommendation: () => Promise<void>;
  onDismissRecommendation: () => void;
  onRefresh: () => void;
  setExpandedFolders: (setter: (prev: Record<string, boolean>) => Record<string, boolean>) => void;
}

export const FolderOperations = ({
  showRecommendation,
  recommendation,
  onAcceptRecommendation,
  onDismissRecommendation,
  onRefresh,
  setExpandedFolders
}: FolderOperationsProps) => {
  // Handle moving a document to recommended folder
  const handleMoveDocument = async () => {
    if (!recommendation) return;
    
    try {
      const { error } = await supabase
        .from('documents')
        .update({
          parent_folder_id: recommendation.suggestedFolderId
        })
        .eq('id', recommendation.documentId);
        
      if (error) throw error;
      
      // Auto-expand the folder after moving the document
      setExpandedFolders(prev => ({
        ...prev,
        [recommendation.suggestedFolderId]: true
      }));
      
      // Track the activity in audit_logs
      await supabase
        .from('audit_logs')
        .insert({
          document_id: recommendation.documentId,
          action: 'document_moved',
          metadata: {
            destination_folder: recommendation.suggestedFolderId,
            folder_path: recommendation.folderPath.join(' > '),
            moved_by: 'AI Recommendation',
            timestamp: new Date().toISOString()
          }
        });
      
      toast.success(`Document moved to ${recommendation.folderPath.join(' > ')}`);
      onAcceptRecommendation();
      onRefresh();
    } catch (error) {
      console.error("Error moving document:", error);
      toast.error("Failed to move document");
    }
  };
  
  if (!showRecommendation || !recommendation) {
    return null;
  }
  
  return (
    <Alert className="mb-5 bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 bg-primary/10 p-1.5 rounded-full">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        
        <div className="flex-1">
          <AlertTitle className="flex items-center gap-2 mb-1">
            AI Folder Recommendation
          </AlertTitle>
          
          <AlertDescription className="space-y-3">
            <div className="text-sm">
              <span className="font-medium">"{recommendation.documentTitle}"</span> should be placed in:
              <div className="mt-2 font-medium text-primary bg-card/80 border border-border/50 p-2 rounded-md flex items-center gap-1.5">
                <FolderTree className="h-4 w-4 text-primary/70" />
                {recommendation.folderPath.join(' > ')}
              </div>
            </div>
            
            <div className="flex gap-2 mt-2">
              <Button
                variant="default"
                size="sm"
                className="gap-1.5"
                onClick={handleMoveDocument}
              >
                <Check className="h-3.5 w-3.5" />
                Accept
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={onDismissRecommendation}
              >
                <X className="h-3.5 w-3.5" />
                Dismiss
              </Button>
            </div>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};
