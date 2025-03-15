
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Check, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

interface FileUploadSectionProps {
  clientName: string;
  onDocumentUpload?: (documentId: string) => void;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: "uploading" | "analyzing" | "completed" | "error";
  progress: number;
  documentId?: string;
}

export const FileUploadSection = ({ clientName, onDocumentUpload }: FileUploadSectionProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files).map(file => ({
      id: uuidv4(),
      name: file.name,
      size: file.size,
      status: "uploading" as const,
      progress: 0,
      file
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    e.target.value = "";
    
    newFiles.forEach(fileObj => {
      uploadFile(fileObj);
    });
  };
  
  const uploadFile = async (fileObj: UploadedFile & { file: File }) => {
    try {
      setIsUploading(true);
      
      // Create document record in database
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Create the document entry in the database
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
      
      // Update the file status in state
      setFiles(prev => prev.map(f => 
        f.id === fileObj.id 
          ? { ...f, status: "analyzing", progress: 50, documentId: document.id } 
          : f
      ));
      
      // Upload file to storage
      const filePath = `${user.id}/${document.id}/${fileObj.name}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, fileObj.file);
      
      if (uploadError) throw uploadError;
      
      // Update document with storage path
      const { error: updateError } = await supabase
        .from("documents")
        .update({ 
          storage_path: filePath,
          ai_processing_status: "complete"
        })
        .eq("id", document.id);
      
      if (updateError) throw updateError;
      
      // Update state to completed
      setFiles(prev => prev.map(f => 
        f.id === fileObj.id ? { ...f, status: "completed", progress: 100 } : f
      ));
      
      // Call the onDocumentUpload callback if provided
      if (onDocumentUpload) {
        onDocumentUpload(document.id);
      }
      
      toast({
        title: "Document uploaded successfully",
        description: `${fileObj.name} was analyzed and categorized for ${clientName}`,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      
      setFiles(prev => prev.map(f => 
        f.id === fileObj.id ? { ...f, status: "error", progress: 0 } : f
      ));
      
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: `Failed to upload ${fileObj.name}`,
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const determineFileType = (filename: string): string => {
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
  };
  
  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
      case 'analyzing':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
    }
  };
  
  const getStatusText = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return 'Uploading...';
      case 'analyzing':
        return 'AI Analysis...';
      case 'completed':
        return 'Completed';
      case 'error':
        return 'Failed';
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Client Documents</CardTitle>
          <CardDescription>
            Upload financial statements, identification, and other documents for AI analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
            <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
            <div>
              <h3 className="font-medium">Drag & drop files or click to upload</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Supports PDF, Word, Excel, and image files
              </p>
            </div>
            <Button variant="outline" disabled={isUploading}>
              <Upload className="mr-2 h-4 w-4" />
              <label className="cursor-pointer">
                Select Files
                <input
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.doc,.xlsx,.xls,.jpg,.jpeg,.png"
                />
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {files.map(file => (
                <div key={file.id} className="border rounded-md p-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {getStatusIcon(file.status)}
                      <span className="text-xs ml-1">{getStatusText(file.status)}</span>
                    </div>
                    {file.status !== 'completed' && file.status !== 'error' && (
                      <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
