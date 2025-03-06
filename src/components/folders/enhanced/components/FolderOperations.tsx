
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, X, FolderTree } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface FolderOperationsProps {
  showRecommendation: boolean;
  recommendation: {
    documentId: string;
    suggestedFolderId: string;
    documentTitle: string;
    folderPath: string[];
  } | null;
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
    <Alert className="mb-4">
      <FolderTree className="h-5 w-5" />
      <AlertTitle>AI Folder Recommendation</AlertTitle>
      <AlertDescription className="space-y-2">
        <div className="text-sm">
          <span className="font-medium">"{recommendation.documentTitle}"</span> should be placed in folder:
          <div className="mt-1 font-medium text-primary">
            {recommendation.folderPath.join(' > ')}
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <Button
            variant="default"
            size="sm"
            className="gap-1"
            onClick={handleMoveDocument}
          >
            <Check className="h-4 w-4" />
            Accept
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={onDismissRecommendation}
          >
            <X className="h-4 w-4" />
            Dismiss
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
