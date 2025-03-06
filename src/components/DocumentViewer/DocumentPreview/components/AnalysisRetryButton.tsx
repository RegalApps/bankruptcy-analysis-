
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { retryDocumentAnalysis } from "@/utils/diagnostics/documentDiagnostics";
import { useToast } from "@/hooks/use-toast";

interface AnalysisRetryButtonProps {
  documentId: string;
  onRetryComplete?: () => void;
}

export const AnalysisRetryButton = ({ documentId, onRetryComplete }: AnalysisRetryButtonProps) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const { toast } = useToast();

  const handleRetry = async () => {
    if (!documentId) return;
    
    setIsRetrying(true);
    try {
      const result = await retryDocumentAnalysis(documentId);
      
      if (result.success) {
        toast({
          title: "Analysis Restarted",
          description: "Document analysis has been restarted successfully",
        });
        
        if (onRetryComplete) {
          onRetryComplete();
        }
      } else {
        toast({
          variant: "destructive",
          title: "Retry Failed",
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while trying to restart analysis",
      });
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleRetry} 
      disabled={isRetrying}
      className="gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
      {isRetrying ? "Restarting..." : "Restart Analysis"}
    </Button>
  );
};
