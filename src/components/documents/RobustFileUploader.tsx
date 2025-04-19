
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Upload, AlertCircle, FileX } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { ensureStorageBuckets, diagnoseUploadIssues, formatFileSize } from "@/utils/storage/bucketManager";

interface RobustFileUploaderProps {
  onUploadComplete?: (documentId: string, uploadData: any) => void;
  onError?: (error: Error) => void;
  className?: string;
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
  buttonText?: string;
  clientId?: string;
  clientName?: string;
}

export const RobustFileUploader = ({
  onUploadComplete,
  onError,
  className,
  maxSizeMB = 30,
  acceptedFileTypes = [
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png'
  ],
  buttonText = "Upload Document",
  clientId,
  clientName
}: RobustFileUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Utility to extract file extension
  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };
  
  // Utility to check file type validity
  const isValidFileType = (file: File): boolean => {
    const fileExt = getFileExtension(file.name);
    const validExts = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png'];
    
    return acceptedFileTypes.includes(file.type) || 
           validExts.includes(fileExt);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    setError(null);
    
    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size (${formatFileSize(file.size)}) exceeds the ${maxSizeMB}MB limit`);
      return;
    }
    
    // Validate file type
    if (!isValidFileType(file)) {
      setError(`File type not supported. Please upload a PDF, Word, Excel or image file`);
      return;
    }
    
    // Auto-upload on file selection
    handleUpload(file);
  };
  
  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      setProgress(5);
      setError(null);
      
      // Step 1: Ensure storage bucket exists
      setProgress(10);
      const bucketReady = await ensureStorageBuckets();
      
      if (!bucketReady) {
        throw new Error("Unable to initialize storage system. Please try again or contact support.");
      }
      
      // Step 2: Run diagnostics
      setProgress(15);
      const diagnostics = await diagnoseUploadIssues(file);
      
      if (!diagnostics.isAuthenticated || !diagnostics.bucketExists || 
          !diagnostics.hasPermission || !diagnostics.fileSizeValid) {
        throw new Error(diagnostics.diagnostic);
      }
      
      // Step 3: Generate unique file path
      setProgress(20);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw new Error("Authentication required. Please login again.");
      }
      
      const userId = user?.id || 'anonymous';
      const timeStamp = new Date().getTime();
      const safeFileName = file.name.replace(/\s+/g, '_');
      const filePath = `${userId}/${timeStamp}_${safeFileName}`;
      
      console.log(`Uploading file to storage path: ${filePath}`);
      
      // Step 4: Create document record first (to track even failed uploads)
      setProgress(30);
      const { data: documentData, error: documentError } = await supabase
        .from('documents')
        .insert({
          title: file.name,
          type: file.type,
          size: file.size,
          ai_processing_status: 'uploading',
          user_id: userId,
          metadata: {
            client_id: clientId,
            client_name: clientName,
            original_filename: file.name,
            upload_timestamp: new Date().toISOString()
          }
        })
        .select()
        .single();
        
      if (documentError) {
        throw new Error(`Database error: ${documentError.message}`);
      }
      
      // Step 5: Upload file to storage with abort controller for timeout handling
      setProgress(40);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
      
      try {
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            // Specify signal for abort controller
            signal: controller.signal as any
          });
          
        clearTimeout(timeoutId);
          
        if (uploadError) {
          // Handle storage full or other issues
          await supabase
            .from('documents')
            .update({ ai_processing_status: 'failed' })
            .eq('id', documentData.id);
            
          throw uploadError;
        }
      } catch (uploadError) {
        clearTimeout(timeoutId);
        
        if ((uploadError as any)?.name === 'AbortError') {
          throw new Error("Upload timed out. Please try a smaller file or check your connection.");
        }
        throw uploadError;
      }
      
      // Step 6: Update document record with storage path
      setProgress(80);
      const { error: updateError } = await supabase
        .from('documents')
        .update({
          storage_path: filePath,
          ai_processing_status: 'processing'
        })
        .eq('id', documentData.id);
        
      if (updateError) {
        throw updateError;
      }
      
      // Step 7: Complete the upload process
      setProgress(100);
      toast.success("Document uploaded successfully", {
        description: "Your document is now being processed"
      });
      
      if (onUploadComplete) {
        onUploadComplete(documentData.id, {
          title: file.name,
          storagePath: filePath,
          size: file.size
        });
      }
      
      // Reset file state after successful upload
      setSelectedFile(null);
      
    } catch (error) {
      console.error("Upload error:", error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unknown error occurred";
        
      setError(errorMessage);
      toast.error("Upload failed", {
        description: errorMessage
      });
      
      if (onError && error instanceof Error) {
        onError(error);
      }
    } finally {
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 1500);
    }
  };

  const retryUpload = () => {
    if (selectedFile) {
      handleUpload(selectedFile);
    }
  };

  const cancelUpload = () => {
    setSelectedFile(null);
    setError(null);
  };
  
  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      <div>
        <input
          type="file"
          id="document-upload"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
          accept={acceptedFileTypes.join(',')}
        />
        
        {!selectedFile && (
          <Button asChild variant="default">
            <label htmlFor="document-upload" className="cursor-pointer flex items-center gap-2">
              <Upload className="h-4 w-4" />
              {buttonText}
            </label>
          </Button>
        )}
        
        {selectedFile && !uploading && !error && (
          <Alert>
            <div className="flex justify-between items-center">
              <div>
                <AlertTitle>Selected File</AlertTitle>
                <AlertDescription>
                  {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </AlertDescription>
              </div>
              
              <Button variant="destructive" size="sm" onClick={cancelUpload}>
                <FileX className="h-4 w-4" />
              </Button>
            </div>
          </Alert>
        )}
        
        {uploading && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full h-2" />
            <p className="text-sm text-muted-foreground">
              Uploading {selectedFile?.name} ({progress}%)
            </p>
          </div>
        )}
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Upload Error</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>{error}</p>
              <div className="flex gap-2">
                {selectedFile && (
                  <Button size="sm" variant="outline" onClick={retryUpload}>
                    Retry Upload
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => setError(null)}>
                  Dismiss
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};
