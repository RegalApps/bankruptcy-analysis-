
import { useState, useEffect } from "react";
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
  const [session, setSession] = useState<any>(null);
  const { toast } = useToast();
  const publicUrl = supabase.storage.from('documents').getPublicUrl(storagePath).data.publicUrl;

  useEffect(() => {
    console.log('DocumentPreview mounted with storagePath:', storagePath);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const handleAnalyzeDocument = async () => {
    try {
      if (!session) {
        throw new Error('You must be logged in to analyze documents');
      }

      setAnalyzing(true);
      
      // First, get the document text content
      console.log('Attempting to fetch document from URL:', publicUrl);
      const response = await fetch(publicUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch document: ${response.statusText}`);
      }

      const documentText = await response.text();
      console.log('Document text fetched successfully, length:', documentText.length);
      console.log('First 200 characters of document:', documentText.substring(0, 200));

      // Clean the text content by removing any potential formatting or special characters
      const cleanedText = documentText
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '') // Remove control characters
        .replace(/```[^`]*```/g, '') // Remove code blocks
        .trim(); // Remove leading/trailing whitespace

      console.log('Cleaned text length:', cleanedText.length);
      console.log('First 200 characters of cleaned text:', cleanedText.substring(0, 200));

      // Get the document record to get its ID
      const { data: documents, error: fetchError } = await supabase
        .from('documents')
        .select('id')
        .eq('storage_path', storagePath)
        .single();

      if (fetchError) {
        console.error('Error fetching document record:', fetchError);
        throw new Error('Could not find document record');
      }

      console.log('Found document record with ID:', documents.id);
      console.log('Calling analyze-document function...');

      // Call the analyze-document function
      const { data, error } = await supabase.functions.invoke('analyze-document', {
        body: { 
          documentText: cleanedText,
          documentId: documents.id
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      console.log('Analysis complete, result:', data);

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
