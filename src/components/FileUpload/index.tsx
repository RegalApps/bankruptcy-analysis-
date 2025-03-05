
import React, { useCallback, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { FileUploadProps, ALLOWED_TYPES } from './types';
import { Progress } from "@/components/ui/progress";

export const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(10);
      setUploadStep("Validating document format and size...");

      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a PDF, Word, or Excel document"
        });
        setIsUploading(false);
        return;
      }

      // Get user ID for document ownership
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "You must be logged in to upload documents"
        });
        setIsUploading(false);
        return;
      }

      setUploadProgress(25);
      setUploadStep("Uploading document to secure storage...");

      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      // Create upload options with onUploadProgress callback
      const uploadOptions = {
        cacheControl: '3600',
        upsert: false
      };

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, uploadOptions);

      if (uploadError) throw uploadError;

      setUploadProgress(50);
      setUploadStep("Processing document and extracting information...");

      // Try to detect if this is Form 76 from the filename
      const isForm76 = file.name.toLowerCase().includes('form 76') || 
                       file.name.toLowerCase().includes('f76') || 
                       file.name.toLowerCase().includes('form76');

      // Create database record with user_id
      const { data: documentData, error: documentError } = await supabase
        .from('documents')
        .insert({
          title: file.name,
          type: file.type,
          size: file.size,
          storage_path: filePath,
          user_id: user.id, // Add user_id field to fix RLS policy
          ai_processing_status: 'pending',
          metadata: {
            formType: isForm76 ? 'form-76' : null,
            uploadDate: new Date().toISOString(),
            client_name: isForm76 ? extractClientName(file.name) : 'Untitled Client',
            ocr_status: 'pending'
          }
        })
        .select()
        .single();

      if (documentError) throw documentError;

      setUploadProgress(70);
      
      // Different message based on file type      
      if (isForm76) {
        setUploadStep("Analyzing Form 76 and extracting client details...");
      } else if (file.type.includes('excel') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setUploadStep("Processing financial spreadsheet data...");
      } else {
        setUploadStep("Performing document analysis and risk assessment...");
      }

      // Trigger document analysis using the edge function
      const { error: analysisError } = await supabase.functions.invoke('analyze-document', {
        body: { 
          documentId: documentData.id,
          includeRegulatory: true,
          includeClientExtraction: true,
          title: file.name,
          extractionMode: 'comprehensive',
          formType: isForm76 ? 'form-76' : 'unknown'
        }
      });

      if (analysisError) {
        console.error("Error triggering analysis:", analysisError);
        // Continue anyway, the analysis might be running in the background
      }

      setUploadProgress(90);
      setUploadStep("Organizing document in folder structure...");

      await onUploadComplete(documentData.id);

      setUploadProgress(100);
      setUploadStep("Upload complete!");

      toast({
        title: "Success",
        description: isForm76 
          ? "Form 76 uploaded and analyzed successfully" 
          : "Document uploaded and processed successfully",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload document. Please try again.",
      });
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setUploadStep("");
      }, 2000);
    }
  }, [onUploadComplete, toast]);

  // Function to extract client name from Form 76 filename
  function extractClientName(filename: string): string {
    const nameMatch = filename.match(/form[- ]?76[- ]?(.+?)(?:\.|$)/i);
    if (nameMatch && nameMatch[1]) {
      return nameMatch[1].trim();
    }
    return 'Untitled Client';
  }

  return (
    <div className="space-y-4">
      {isUploading ? (
        <div className="w-full space-y-6 p-6 border-2 border-dashed border-gray-300 rounded-lg">
          <Upload className={`h-8 w-8 mx-auto ${uploadProgress === 100 ? 'text-green-500' : 'text-primary animate-pulse'}`} />
          <p className="text-center font-medium">{uploadStep}</p>
          <Progress value={uploadProgress} className="w-full" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className={uploadProgress >= 10 ? "text-primary" : ""}>Validation</span>
            <span className={uploadProgress >= 40 ? "text-primary" : ""}>Upload</span>
            <span className={uploadProgress >= 70 ? "text-primary" : ""}>Processing</span>
            <span className={uploadProgress >= 100 ? "text-primary" : ""}>Complete</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <label htmlFor="file-upload" className="w-full">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-primary transition-colors">
              <div className="flex flex-col items-center justify-center space-y-2">
                <Upload className="h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Drop your document here or click to browse
                </p>
                <p className="text-xs text-gray-400">
                  Supports PDF, DOC, DOCX, XLS, XLSX up to 10MB
                </p>
              </div>
            </div>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              onChange={handleUpload}
            />
          </label>
        </div>
      )}
    </div>
  );
};
