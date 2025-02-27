
import { useState, useEffect } from "react";
import { Loader2, AlertTriangle, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { extractTextFromPdf } from "@/utils/documents/pdfUtils";

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
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const publicUrl = supabase.storage.from('documents').getPublicUrl(storagePath).data.publicUrl;

  useEffect(() => {
    console.log('DocumentPreview mounted with storagePath:', storagePath);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, [storagePath]);

  const handleAnalyzeDocument = async () => {
    setError(null);
    
    try {
      if (!session) {
        throw new Error('You must be logged in to analyze documents');
      }

      setAnalyzing(true);
      
      // Fetch the document record first to confirm it exists
      console.log('Fetching document record for path:', storagePath);
      const { data: documentRecord, error: fetchError } = await supabase
        .from('documents')
        .select('id, title')
        .eq('storage_path', storagePath)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching document record:', fetchError);
        throw fetchError;
      }
      
      if (!documentRecord) {
        console.error('Document record not found for path:', storagePath);
        throw new Error('Document record not found in database');
      }
      
      console.log('Document record found:', documentRecord);
      
      // Extract text from PDF
      console.log('Extracting text from PDF at URL:', publicUrl);
      const documentText = await extractTextFromPdf(publicUrl);
      
      if (!documentText || documentText.trim().length < 50) {
        console.error('Insufficient text extracted from document. Length:', documentText?.length || 0);
        throw new Error('Could not extract sufficient text from the document');
      }
      
      console.log(`Extracted ${documentText.length} characters of text from PDF`);
      
      // Submit for analysis
      console.log('Submitting to analyze-document function with document ID:', documentRecord.id);
      const { data, error } = await supabase.functions.invoke('analyze-document', {
        body: { 
          documentText: documentText,
          documentId: documentRecord.id,
          includeRegulatory: true,
          title: documentRecord.title
        }
      });

      if (error) {
        console.error('Analysis function error:', error);
        throw new Error(`Analysis failed: ${error.message}`);
      }

      console.log('Analysis completed successfully. Results:', data);

      toast({
        title: "Analysis Complete",
        description: "Document has been analyzed with regulatory compliance check"
      });

      if (onAnalysisComplete) {
        onAnalysisComplete();
      }
    } catch (error: any) {
      console.error('Document analysis failed:', error);
      setError(error.message || 'An unknown error occurred');
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
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Preview
          </CardTitle>
          <div className="flex items-center gap-4">
            <Button
              variant="outline" 
              size="sm"
              asChild
            >
              <a 
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm"
              >
                Open Document
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="aspect-[3/4] w-full bg-muted rounded-lg overflow-hidden">
            <iframe
              src={publicUrl}
              className="w-full h-full rounded-lg"
              title="Document Preview"
            />
          </div>
          
          {analyzing && (
            <Alert className="mt-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertTitle>Analyzing Document</AlertTitle>
              <AlertDescription>
                Please wait while we extract information and perform risk assessment...
              </AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert className="mt-4" variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Analysis Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
