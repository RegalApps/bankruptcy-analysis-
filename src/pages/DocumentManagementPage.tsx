
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useDocuments } from "@/components/DocumentList/hooks/useDocuments";
import { Document } from "@/components/DocumentList/types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const DocumentManagementPage = () => {
  const { documents, isLoading, refetch } = useDocuments();
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleDocumentDoubleClick = (documentId: string) => {
    navigate('/', { state: { selectedDocument: documentId } });
  };

  const handleFileUpload = async (file: File) => {
    if (isUploading) return;

    try {
      setIsUploading(true);

      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please log in to upload documents"
        });
        return;
      }

      // Validate file type and size
      if (!file.type.match('application/pdf|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a PDF or Word document"
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "File size should be less than 10MB"
        });
        return;
      }

      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = fileName;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Create document record in database
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          title: file.name,
          type: file.type,
          size: file.size,
          storage_path: filePath,
          url: publicUrl,
          user_id: session.user.id, // Set the user_id
          ai_processing_status: 'pending'
        });

      if (dbError) {
        // If database insert fails, delete the uploaded file
        await supabase.storage
          .from('documents')
          .remove([filePath]);
        throw dbError;
      }

      toast({
        title: "Success",
        description: "Document uploaded successfully"
      });

      refetch(); // Refresh the documents list
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload document. Please try again."
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="flex-1 p-6 space-y-8">
      {/* Drag and Drop Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          isDragging ? 'border-primary bg-primary/10' : 'hover:border-primary/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="flex flex-col items-center justify-center py-12 text-center cursor-pointer">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFileUpload(file);
              }
            }}
          />
          <div 
            onClick={() => document.getElementById('file-upload')?.click()}
            className="w-full"
          >
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {isUploading ? 'Uploading...' : 'Drag and drop your documents here'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse your files
            </p>
            <Button variant="outline" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Browse Files'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recently Uploaded Documents */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Recently Uploaded</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse h-[200px]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc: Document) => (
              <Card 
                key={doc.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onDoubleClick={() => handleDocumentDoubleClick(doc.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium truncate" title={doc.title}>
                        {doc.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(doc.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="mt-1"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DocumentManagementPage;
