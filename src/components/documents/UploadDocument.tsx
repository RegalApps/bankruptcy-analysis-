
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UploadDocumentProps {
  clientId?: string;
  clientName?: string;
  onUploadComplete?: () => void;
  className?: string;
}

export const UploadDocument = ({ clientId, clientName, onUploadComplete, className }: UploadDocumentProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const file = e.target.files[0];
    setIsUploading(true);
    setProgress(0);
    
    try {
      // Step 1: Generate a unique file path
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;
      
      // Step 2: Upload to storage
      setProgress(20);
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      setProgress(50);
      
      // Step 3: Create document record
      const { data: document, error: docError } = await supabase
        .from('documents')
        .insert([
          {
            title: file.name,
            type: file.type,
            size: file.size,
            storage_path: filePath,
            url: uploadData?.path || '',
            ai_processing_status: 'processing',
            metadata: {
              client_id: clientId,
              client_name: clientName,
              original_filename: file.name,
              upload_timestamp: new Date().toISOString()
            }
          }
        ])
        .select()
        .single();
      
      if (docError) throw docError;
      
      setProgress(80);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProgress(100);
      
      toast.success('Document uploaded successfully', {
        description: `${file.name} has been uploaded and is being processed.`
      });
      
      onUploadComplete?.();
      
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Upload failed', {
        description: error.message || 'Failed to upload document'
      });
    } finally {
      setIsUploading(false);
      setProgress(0);
      // Reset the input
      e.target.value = '';
    }
  }, [clientId, clientName, onUploadComplete]);

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader>
        <CardTitle>Upload Document</CardTitle>
        <CardDescription>
          {clientName 
            ? `Upload documents for ${clientName}` 
            : "Upload financial statements, identification, or other client documents"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
          <input
            type="file"
            id="document-upload"
            className="hidden"
            onChange={handleUpload}
            disabled={isUploading}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
          />
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div>
                <p className="font-medium">Uploading Document...</p>
                <div className="w-full bg-muted rounded-full h-2.5 mt-2">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Drag and drop files here, or click to browse</p>
              <Button asChild>
                <label htmlFor="document-upload" className="cursor-pointer">
                  Select File
                </label>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
