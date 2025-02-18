
import { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { supabase } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";

export const FileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a PDF or Word document"
      });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "File size should be less than 10MB"
      });
      return;
    }

    setIsUploading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create document record in the database
      const { error: dbError, data: documentData } = await supabase
        .from('documents')
        .insert([
          {
            title: file.name,
            type: file.type,
            size: file.size,
            storage_path: fileName,
            url: data?.path || '',
            user_id: user.id,
            deadlines: []
          }
        ])
        .select()
        .single();

      if (dbError) throw dbError;

      // Trigger document analysis
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        const documentText = e.target?.result as string;
        try {
          const { error: analysisError } = await supabase.functions.invoke(
            'analyze-document',
            {
              body: { documentText },
              headers: { 'document-id': documentData.id }
            }
          );

          if (analysisError) throw analysisError;

          toast({
            title: "Success",
            description: "File uploaded and analysis started"
          });
        } catch (error: any) {
          console.error('Error analyzing document:', error);
          toast({
            variant: "destructive",
            title: "Analysis failed",
            description: "Document uploaded but analysis failed"
          });
        }
      };

      fileReader.readAsText(file);
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "There was an error uploading your file"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  return (
    <div className="w-full">
      {isUploading ? (
        <div className="flex items-center justify-center space-x-2 rounded-lg border-2 border-dashed p-4">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          <p className="text-sm text-gray-600">Uploading and analyzing file...</p>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 hover:border-primary hover:bg-primary/5">
          <Upload className="mb-2 h-8 w-8 text-gray-400" />
          <span className="text-sm font-medium text-primary hover:text-primary/80">Click to upload a file</span>
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
