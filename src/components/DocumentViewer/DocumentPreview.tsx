
import { useState, useEffect } from "react";
import { Loader2, AlertTriangle, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import * as pdfjs from 'pdfjs-dist';

interface DocumentPreviewProps {
  storagePath: string;
  onAnalysisComplete?: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ 
  storagePath,
  onAnalysisComplete 
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [extractedText, setExtractedText] = useState<string>('');
  const [session, setSession] = useState<any>(null);
  const { toast } = useToast();
  const publicUrl = supabase.storage.from('documents').getPublicUrl(storagePath).data.publicUrl;

  useEffect(() => {
    console.log('DocumentPreview mounted with storagePath:', storagePath);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Initialize PDF.js worker
    const workerSrc = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  }, []);

  const extractTextFromPdf = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      
      console.log('Extracted text length:', fullText.length);
      console.log('Sample text:', fullText.substring(0, 200));
      return fullText;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Failed to extract text from PDF');
    }
  };

  const handleAnalyzeDocument = async () => {
    try {
      if (!session) {
        throw new Error('You must be logged in to analyze documents');
      }

      setAnalyzing(true);
      
      // First, get the document text content
      console.log('Attempting to fetch document from URL:', publicUrl);
      const documentText = await extractTextFromPdf(publicUrl);
      console.log('Document text extracted successfully, length:', documentText.length);

      if (!documentText) {
        throw new Error('No text could be extracted from the document');
      }

      // Get the document record
      const { data: documents, error: fetchError } = await supabase
        .from('documents')
        .select('id')
        .eq('storage_path', storagePath)
        .single();

      if (fetchError) throw fetchError;

      // Call the analyze-document function with regulatory validation
      const { data, error } = await supabase.functions.invoke('analyze-document', {
        body: { 
          documentText,
          documentId: documents.id,
          includeRegulatory: true
        }
      });

      if (error) {
        console.error('Analysis error:', error);
        throw error;
      }

      console.log('Analysis results:', data);

      toast({
        title: "Analysis Complete",
        description: "Document has been analyzed with regulatory compliance check"
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
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Preview
          </CardTitle>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleAnalyzeDocument}
              disabled={analyzing}
              className="text-sm flex items-center gap-2"
            >
              {analyzing && <Loader2 className="h-4 w-4 animate-spin" />}
              {analyzing ? 'Analyzing...' : 'Analyze Document'}
            </Button>
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
        </CardContent>
      </Card>
    </div>
  );
};
