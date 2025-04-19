
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Upload, AlertCircle, FileX } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { trackUpload } from "@/utils/documents/uploadTracker";

interface RobustFileUploaderProps {
  onUploadComplete?: (documentId: string, uploadData?: any) => void;
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
  
  // Ensure storage bucket exists
  useEffect(() => {
    const checkBucket = async () => {
      try {
        const { data, error } = await supabase.storage.listBuckets();
        if (error) {
          console.error("Error checking buckets:", error);
          return;
        }
        
        const bucketExists = data?.some(bucket => bucket.name === 'documents');
        if (!bucketExists) {
          console.log("Documents bucket doesn't exist, will create on upload");
        }
      } catch (err) {
        console.error("Error in bucket check:", err);
      }
    };
    
    checkBucket();
  }, []);
  
  // Utility to extract file extension
  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };
  
  // Utility to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
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
  
  const createBucketIfNeeded = async (): Promise<boolean> => {
    try {
      // Check if bucket exists
      const { data, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error("Error checking buckets:", error);
        return false;
      }
      
      const bucketExists = data?.some(bucket => bucket.name === 'documents');
      
      if (!bucketExists) {
        console.log("Creating documents bucket...");
        const { error: createError } = await supabase.storage.createBucket('documents', {
          public: false,
          fileSizeLimit: 30 * 1024 * 1024 // 30MB
        });
        
        if (createError) {
          console.error("Error creating bucket:", createError);
          return false;
        }
        
        console.log("Bucket created successfully");
      }
      
      return true;
    } catch (err) {
      console.error("Error creating bucket:", err);
      return false;
    }
  };
  
  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      setProgress(5);
      setError(null);
      
      console.log(`Starting upload for file: ${file.name}, size: ${file.size} bytes`);
      
      // Ensure storage bucket exists
      const bucketReady = await createBucketIfNeeded();
      if (!bucketReady) {
        throw new Error("Unable to initialize document storage. Please try again later.");
      }
      
      setProgress(15);
      
      // Create document record first
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw new Error("Authentication required. Please login again.");
      }
      
      setProgress(25);
      
      // Create document record in database
      const { data: document, error: documentError } = await supabase
        .from('documents')
        .insert({
          title: file.name,
          type: file.type || getFileExtension(file.name),
          size: file.size,
          ai_processing_status: 'uploading',
          user_id: user?.id,
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
        console.error("Database error:", documentError);
        throw new Error(`Failed to create document record: ${documentError.message}`);
      }
      
      // Set up upload tracking
      const uploadTracker = trackUpload(document.id, 25);
      
      // Generate unique file path
      const fileExt = getFileExtension(file.name);
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = fileName;
      
      uploadTracker.updateProgress(40, "Uploading to secure storage...");
      
      // Upload file with explicit content type
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });
      
      if (uploadError) {
        console.error("Storage system error detected, showing detailed error", uploadError);
        
        // Handle specific error cases
        if (uploadError.message.includes('permission') || uploadError.message.includes('403')) {
          throw new Error("Permission denied. You don't have access to upload files.");
        } else if (uploadError.message.includes('size')) {
          throw new Error(`File size (${formatFileSize(file.size)}) exceeds the maximum allowed size.`);
        } else if (uploadError.message.includes('network') || uploadError.message.includes('timeout')) {
          throw new Error("Network error. Please check your connection and try again.");
        }
        
        throw new Error(`Upload failed: ${uploadError.message}`);
      }
      
      uploadTracker.updateProgress(70, "Processing document...");
      
      // Update document with storage path
      const { error: updateError } = await supabase
        .from('documents')
        .update({
          storage_path: filePath,
          url: null, // We'll generate signed URLs on demand
          ai_processing_status: 'processing'
        })
        .eq('id', document.id);
        
      if (updateError) {
        throw new Error(`Failed to update document: ${updateError.message}`);
      }
      
      uploadTracker.updateProgress(90, "Finalizing upload...");
      
      // Create signed URL
      const { data: urlData } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
      
      if (urlData?.signedUrl) {
        // Update document with signed URL
        await supabase
          .from('documents')
          .update({
            url: urlData.signedUrl,
            ai_processing_status: 'completed'
          })
          .eq('id', document.id);
      }
      
      setProgress(100);
      uploadTracker.completeUpload("Document uploaded successfully");
      
      toast.success("Document uploaded successfully", {
        description: "Your document is now available"
      });
      
      if (onUploadComplete) {
        onUploadComplete(document.id, {
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
      }, 1000);
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
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
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
