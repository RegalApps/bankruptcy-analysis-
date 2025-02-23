
import { useState, useRef } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { supabase } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UploadProgress } from './UploadProgress';
import { UploadStatus } from './types';
import { validateFile } from './validateFile';
import { handleDocumentUpload, uploadToStorage, cleanupUpload } from './uploadService';

export const FileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<UploadStatus>({ step: 0, message: '' });
  const [error, setError] = useState<string | null>(null);
  const abortController = useRef<AbortController | null>(null);
  const { toast } = useToast();

  const updateProgress = (message: string, percentage?: number) => {
    setStatus({ step: percentage ? Math.floor(percentage / 25) : 0, message });
    setUploadProgress(percentage || 0);
    
    // Show progress toast for important steps
    if (percentage && percentage % 25 === 0) {
      toast({
        title: "Upload Progress",
        description: message,
      });
    }
  };

  const resetUpload = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setStatus({ step: 0, message: '' });
    if (abortController.current) {
      abortController.current = null;
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
    updateProgress("Starting upload process...", 5);
    abortController.current = new AbortController();
    let uploadedFileName: string | null = null;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Show initial upload toast
      toast({
        title: "Upload Started",
        description: `Uploading ${file.name}...`
      });

      const { fileName, documentData } = await uploadToStorage(
        file,
        user.id,
        updateProgress
      );
      uploadedFileName = fileName;

      try {
        await handleDocumentUpload(
          file,
          documentData.id,
          updateProgress
        );

        // Show success toast with document details
        toast({
          title: "Upload Successful",
          description: `${file.name} has been uploaded and processed successfully`,
          variant: "default"
        });

        // Reset the upload state
        resetUpload();
      } catch (error) {
        console.error('Error analyzing document:', error);
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: "Document was uploaded but analysis failed. Please try again."
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
        title: "Upload Failed",
        description: error.message || "There was an error uploading your file"
      });
      resetUpload();
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
    resetUpload();
    toast({
      title: "Upload Cancelled",
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
        <UploadProgress
          message={status.message}
          progress={uploadProgress}
          onCancel={cancelUpload}
        />
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
