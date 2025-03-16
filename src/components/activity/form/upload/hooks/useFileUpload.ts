
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { FileInfo, UseFileUploadProps } from "../types";
import { validateFile } from "../utils/fileValidator";
import { simulateProcessingStages } from "../utils/processingSimulation";
import { generateId } from "../utils/generateId";

export const useFileUpload = ({ clientName, onDocumentUpload, setFiles }: UseFileUploadProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const validationError = validateFile(file);
    
    if (validationError) {
      toast({
        variant: "destructive",
        title: "Invalid file",
        description: validationError
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Create file info object
      const fileObj: FileInfo = {
        id: generateId(),
        name: file.name,
        size: file.size,
        status: 'uploading',
        progress: 0,
        file
      };
      
      // Add to files state
      setFiles(prev => [...prev, fileObj]);
      e.target.value = "";
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Create document record in database
      const { data: document, error: docError } = await supabase
        .from("documents")
        .insert({
          title: fileObj.name,
          type: determineFileType(fileObj.name),
          size: fileObj.size,
          user_id: user.id,
          metadata: {
            client_name: clientName,
            original_filename: fileObj.name,
            upload_method: "client_intake"
          }
        })
        .select()
        .single();
      
      if (docError) throw docError;
      
      // Update file status to analyzing
      setFiles(prev => 
        prev.map(f => 
          f.id === fileObj.id 
            ? {
                ...f,
                status: 'analyzing',
                progress: 50,
                documentId: document.id
              } 
            : f
        )
      );
      
      // Upload file to storage
      const filePath = `${user.id}/${document.id}/${fileObj.name}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Simulate processing
      const isForm76 = file.name.toLowerCase().includes('form 76');
      const isExcel = file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls');
      await simulateProcessingStages(isForm76, isExcel);
      
      // Update document with storage path
      const { error: updateError } = await supabase
        .from("documents")
        .update({
          storage_path: filePath,
          ai_processing_status: "complete"
        })
        .eq("id", document.id);
      
      if (updateError) throw updateError;
      
      // Update file status to completed
      setFiles(prev => 
        prev.map(f => 
          f.id === fileObj.id 
            ? {
                ...f,
                status: 'completed',
                progress: 100
              } 
            : f
        )
      );
      
      // Call the onDocumentUpload callback if provided
      if (onDocumentUpload) {
        onDocumentUpload(document.id);
      }
      
      toast({
        title: "Document uploaded successfully",
        description: `${fileObj.name} was analyzed and categorized for ${clientName || 'the client'}`
      });
      
    } catch (error) {
      console.error("Error uploading file:", error);
      
      setFiles(prev => 
        prev.map(f => 
          f.id === fileObj.id 
            ? {
                ...f,
                status: 'error',
                progress: 0
              } 
            : f
        )
      );
      
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: `Failed to upload ${file.name}`
      });
      
    } finally {
      setIsUploading(false);
    }
  }, [clientName, onDocumentUpload, setFiles, toast]);

  return { handleUpload, isUploading };
};

function determineFileType(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'pdf':
      return 'pdf';
    case 'docx':
    case 'doc':
      return 'document';
    case 'xlsx':
    case 'xls':
      return 'excel';
    case 'jpg':
    case 'jpeg':
    case 'png':
      return 'image';
    default:
      return 'other';
  }
}
