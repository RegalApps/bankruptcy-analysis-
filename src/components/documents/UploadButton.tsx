
import React, { useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { uploadDocument } from "@/utils/documentOperations";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface UploadButtonProps extends ButtonProps {
  clientId?: string;
  clientName?: string;
  onUploadComplete?: (documentId: string) => void;
}

export const UploadButton = ({
  clientId,
  clientName,
  onUploadComplete,
  ...props
}: UploadButtonProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const updateProgress = (progress: number, step: string) => {
    setUploadProgress(progress);
    setUploadStep(step);
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setIsDialogOpen(true);
    setIsUploading(true);
    setUploadProgress(0);
    setUploadStep("Preparing file upload...");
    
    try {
      // Add client metadata
      const extraMetadata = {
        ...(clientId ? { client_id: clientId } : {}),
        ...(clientName ? { client_name: clientName } : {})
      };
      
      // Initial progress update
      updateProgress(10, "Validating file...");
      
      // Simulate initial processing
      await new Promise(r => setTimeout(r, 800));
      
      updateProgress(20, "Uploading to secure storage...");
      
      // Upload document with progress tracking
      const document = await uploadDocument(file, updateProgress, extraMetadata);
      
      // Final processing
      updateProgress(90, "Finalizing document processing...");
      await new Promise(r => setTimeout(r, 800));
      
      updateProgress(100, "Upload complete!");
      
      // Reset file input
      e.target.value = '';
      
      // Delay closing the dialog slightly
      setTimeout(() => {
        setIsDialogOpen(false);
        setIsUploading(false);
        
        if (onUploadComplete && document?.id) {
          onUploadComplete(document.id);
        }
      }, 1000);
      
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload document"
      });
      
      setIsDialogOpen(false);
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="gap-2 w-full" 
        {...props}
      >
        <Upload className="h-4 w-4" />
        <label className="cursor-pointer flex-1">
          Upload Document
          <input
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
            onChange={handleFileSelected}
            disabled={isUploading}
          />
        </label>
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        // Only allow closing if not currently uploading
        if (!isUploading) {
          setIsDialogOpen(open);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{uploadProgress === 100 ? "Upload Complete" : "Uploading Document"}</DialogTitle>
          </DialogHeader>
          
          <div className="py-6">
            <div className="mb-2">
              <Progress value={uploadProgress} className="h-2" />
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">{uploadStep}</p>
          </div>
          
          <DialogFooter>
            {uploadProgress === 100 && (
              <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
