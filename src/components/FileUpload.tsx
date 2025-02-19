
import { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { supabase } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

type UploadStatus = {
  step: number;
  message: string;
};

export const FileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<UploadStatus>({ step: 0, message: '' });
  const { toast } = useToast();

  const updateStatus = (step: number, message: string) => {
    setStatus({ step, message });
    setUploadProgress(Math.min((step / 4) * 100, 100)); // 4 total steps
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Reset progress
    setUploadProgress(0);
    updateStatus(0, "Starting upload process...");

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
      // Step 1: Authentication check
      updateStatus(1, "Verifying authentication...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Step 2: Upload file to storage
      updateStatus(2, "Uploading file to secure storage...");
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from('documents')
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      // Step 3: Create database record
      updateStatus(3, "Creating document record...");
      const { error: dbError, data: documentData } = await supabase
        .from('documents')
        .insert([
          {
            title: file.name,
            type: file.type,
            size: file.size,
            storage_path: fileName,
            url: data?.path || '',
            user_id: user.id
          }
        ])
        .select()
        .single();

      if (dbError) {
        console.error('Database insert error:', dbError);
        throw dbError;
      }

      // Step 4: Analyze document
      updateStatus(4, "Analyzing document content...");
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const documentText = e.target?.result as string;
          
          const { error: analysisError } = await supabase.functions
            .invoke('analyze-document', {
              body: {
                documentText,
                documentId: documentData.id
              }
            });

          if (analysisError) {
            console.error('Analysis error:', analysisError);
            toast({
              variant: "destructive",
              title: "Analysis failed",
              description: "Document was uploaded but analysis failed"
            });
            return;
          }

          // All steps complete
          setUploadProgress(100);
          toast({
            title: "Success",
            description: "File uploaded and analyzed successfully"
          });
        } catch (error) {
          console.error('Error analyzing document:', error);
          toast({
            variant: "destructive",
            title: "Analysis failed",
            description: "Document was uploaded but analysis failed"
          });
        }
      };

      if (file.type === 'application/pdf') {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }

      console.log('Document uploaded successfully:', documentData);

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
        <div className="space-y-4 rounded-lg border-2 border-dashed p-4">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            <p className="text-sm font-medium text-gray-600">{status.message}</p>
          </div>
          <div className="space-y-2">
            <Progress value={uploadProgress} className="h-2 w-full" />
            <p className="text-xs text-gray-500 text-right">{Math.round(uploadProgress)}%</p>
          </div>
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
