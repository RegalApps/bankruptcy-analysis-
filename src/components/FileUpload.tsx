
import { useState, useRef } from 'react';
import { Upload, Loader2, AlertCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { supabase } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import * as pdfjs from 'pdfjs-dist';

// Set worker path for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type UploadStatus = {
  step: number;
  message: string;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export const FileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<UploadStatus>({ step: 0, message: '' });
  const [error, setError] = useState<string | null>(null);
  const abortController = useRef<AbortController | null>(null);
  const { toast } = useToast();

  const updateStatus = (step: number, message: string) => {
    setStatus({ step, message });
    setUploadProgress(Math.min((step / 4) * 100, 100));
  };

  const validateFile = (file: File): string | null => {
    if (!file) return "No file selected";
    if (!ALLOWED_TYPES.includes(file.type)) return "Invalid file type. Please upload a PDF or Word document";
    if (file.size > MAX_FILE_SIZE) return "File size should be less than 10MB";
    return null;
  };

  const cleanupUpload = async (fileName: string | null = null) => {
    if (fileName) {
      try {
        await supabase.storage.from('documents').remove([fileName]);
      } catch (error) {
        console.error('Error cleaning up failed upload:', error);
      }
    }
    setIsUploading(false);
    setUploadProgress(0);
    setStatus({ step: 0, message: '' });
    if (abortController.current) {
      abortController.current = null;
    }
  };

  const extractTextFromPdf = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    try {
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let text = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item: any) => item.str)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
        text += pageText + '\n';
      }
      
      return text;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Failed to extract text from PDF');
    }
  };

  const handleFileUpload = async (file: File) => {
    setError(null);
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      toast({
        variant: "destructive",
        title: "Invalid file",
        description: validationError
      });
      return;
    }

    setIsUploading(true);
    updateStatus(1, "Starting upload process...");
    abortController.current = new AbortController();
    let uploadedFileName: string | null = null;

    try {
      // Step 1: Authentication check
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Step 2: Upload file to storage
      updateStatus(2, "Uploading file to secure storage...");
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      uploadedFileName = fileName;

      const { error: uploadError, data } = await supabase.storage
        .from('documents')
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Step 3: Create database record
      updateStatus(3, "Creating document record...");
      const { error: dbError, data: documentData } = await supabase
        .from('documents')
        .insert([
          {
            title: file.name,
            type: file.type,
            size: file.size,
            storage_path: fileName,
            url: data?.path || '',
            user_id: user.id
          }
        ])
        .select()
        .single();

      if (dbError) throw dbError;

      // Step 4: Analyze document
      updateStatus(4, "Analyzing document content...");
      try {
        let documentText = '';
        
        if (file.type === 'application/pdf') {
          const arrayBuffer = await file.arrayBuffer();
          documentText = await extractTextFromPdf(arrayBuffer);
          console.log('Extracted PDF text:', documentText);
        } else {
          const text = await file.text();
          documentText = text;
        }

        const { error: analysisError } = await supabase.functions
          .invoke('analyze-document', {
            body: {
              documentText,
              documentId: documentData.id
            }
          });

        if (analysisError) throw analysisError;

        setUploadProgress(100);
        toast({
          title: "Success",
          description: "File uploaded and analyzed successfully"
        });
      } catch (error) {
        console.error('Error analyzing document:', error);
        toast({
          variant: "destructive",
          title: "Analysis failed",
          description: "Document was uploaded but analysis failed"
        });
      } finally {
        setIsUploading(false);
      }
    } catch (error: any) {
      console.error('Error uploading file:', error);
      await cleanupUpload(uploadedFileName);
      setError(error.message || "There was an error uploading your file");
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "There was an error uploading your file"
      });
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const cancelUpload = () => {
    if (abortController.current) {
      abortController.current.abort();
    }
    cleanupUpload();
    toast({
      title: "Upload cancelled",
      description: "The file upload was cancelled"
    });
  };

  return (
    <div className="w-full">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isUploading ? (
        <div className="space-y-4 rounded-lg border-2 border-dashed p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              <p className="text-sm font-medium text-gray-600">{status.message}</p>
            </div>
            <button
              onClick={cancelUpload}
              className="text-sm text-destructive hover:text-destructive/90"
            >
              Cancel
            </button>
          </div>
          <div className="space-y-2">
            <Progress value={uploadProgress} className="h-2 w-full" />
            <p className="text-xs text-gray-500 text-right">{Math.round(uploadProgress)}%</p>
          </div>
        </div>
      ) : (
        <label
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6",
            "hover:border-primary hover:bg-primary/5",
            "transition-colors duration-200"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Upload className="mb-2 h-8 w-8 text-gray-400" />
          <span className="text-sm font-medium text-primary hover:text-primary/80">
            Click or drag to upload a file
          </span>
          <input 
            type="file" 
            className="hidden"
            onChange={handleFileInput}
            accept=".pdf,.doc,.docx"
          />
          <p className="mt-1 text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
        </label>
      )}
    </div>
  );
};
