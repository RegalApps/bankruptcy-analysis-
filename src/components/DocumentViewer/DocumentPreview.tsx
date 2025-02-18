
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface DocumentPreviewProps {
  storagePath: string;
  onAnalysisComplete?: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ 
  storagePath,
  onAnalysisComplete 
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const { toast } = useToast();
  const publicUrl = supabase.storage.from('documents').getPublicUrl(storagePath).data.publicUrl;

  const handleAnalyzeDocument = async () => {
    try {
      setAnalyzing(true);
      
      // First, get the document text content
      const response = await fetch(publicUrl);
      const documentText = await response.text();
      
      // Call the analyze-document function
      const { data, error } = await supabase.functions.invoke('analyze-document', {
        body: { 
          documentText,
          documentId: storagePath.split('/')[0] // Assuming the first part of the path is the document ID
        }
      });

      if (error) throw error;

      toast({
        title: "Analysis Complete",
        description: "Document has been analyzed successfully"
      });

      if (onAnalysisComplete) {
        onAnalysisComplete();
      }
    } catch (error: any) {
      console.error('Error analyzing document:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "Failed to analyze document"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Document Preview</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={handleAnalyzeDocument}
            disabled={analyzing}
            className="text-sm text-primary hover:underline flex items-center gap-2"
          >
            {analyzing && <Loader2 className="h-4 w-4 animate-spin" />}
            {analyzing ? 'Analyzing...' : 'Analyze Document'}
          </button>
          <a 
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            Open Document
          </a>
        </div>
      </div>
      
      <div className="aspect-[3/4] w-full bg-muted rounded-lg">
        <iframe
          src={publicUrl}
          className="w-full h-full rounded-lg"
          title="Document Preview"
        />
      </div>
    </div>
  );
};
