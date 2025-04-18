
import { Button, ButtonProps } from "@/components/ui/button";
import { Upload, Plus } from "lucide-react";
import { useState } from "react";
import { useDocumentUpload } from "@/hooks/useDocumentUpload"; 
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface UploadButtonProps extends ButtonProps {
  clientId?: string;
  clientName?: string;
  onUploadComplete?: (documentId: string) => void;
}

export const UploadButton = ({ 
  clientId, 
  clientName, 
  onUploadComplete,
  className,
  variant = "default",
  ...props 
}: UploadButtonProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const { uploadDocument } = useDocumentUpload({
    clientId,
    clientName,
    onUploadComplete,
    onUploadError: (error) => {
      toast.error("Upload failed", {
        description: error.message || "An error occurred during upload"
      });
      setIsUploading(false);
    }
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setIsUploading(true);
    
    try {
      await uploadDocument(file);
    } finally {
      setIsUploading(false);
      // Reset input value so the same file can be uploaded again
      e.target.value = "";
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Button 
      variant={variant} 
      className={cn("gap-2", className)} 
      disabled={isUploading}
      onClick={handleButtonClick}
      {...props}
    >
      {isUploading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Uploading...
        </>
      ) : (
        <>
          {variant === "outline" ? <Plus className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
          Upload Document
        </>
      )}
      <input 
        ref={fileInputRef}
        type="file" 
        className="hidden" 
        onChange={handleFileChange} 
        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
        disabled={isUploading}
      />
    </Button>
  );
};
