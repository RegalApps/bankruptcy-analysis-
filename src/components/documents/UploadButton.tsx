
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';
import { toast } from 'sonner';

interface UploadButtonProps {
  clientId?: string;
  clientName?: string;
  onUploadComplete?: (documentId: string) => void;
  variant?: 'default' | 'outline' | 'secondary';
  className?: string;
}

export const UploadButton = ({
  clientId,
  clientName,
  onUploadComplete,
  variant = 'default',
  className
}: UploadButtonProps) => {
  const [fileInputKey, setFileInputKey] = useState<number>(0);
  const { uploadDocument, isUploading } = useDocumentUpload({
    clientId,
    clientName,
    onUploadComplete: (id) => {
      // Reset the file input to allow uploading the same file again
      setFileInputKey(prevKey => prevKey + 1);
      
      // Call the parent's onUploadComplete if provided
      if (onUploadComplete) {
        onUploadComplete(id);
      }
    },
    onUploadError: () => {
      // Reset the file input on error too
      setFileInputKey(prevKey => prevKey + 1);
    }
  });
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const validTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png'
    ];
    
    // Check file type
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type', {
        description: 'Please upload a PDF, Word, Excel document or image (JPEG/PNG)'
      });
      return;
    }
    
    // Check file size (10 MB limit)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > MAX_SIZE) {
      toast.error('File too large', {
        description: 'Maximum file size is 10MB'
      });
      return;
    }
    
    // Proceed with upload
    await uploadDocument(file);
  };
  
  return (
    <Button 
      variant={variant} 
      className={className}
      disabled={isUploading}
    >
      {isUploading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Upload className="h-4 w-4 mr-2" />
      )}
      
      <label className="cursor-pointer">
        {isUploading ? 'Uploading...' : 'Upload Document'}
        <input
          type="file"
          className="hidden"
          key={fileInputKey}
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
          disabled={isUploading}
        />
      </label>
    </Button>
  );
};
