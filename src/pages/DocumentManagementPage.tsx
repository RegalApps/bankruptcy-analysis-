
import { useDocuments } from "@/components/DocumentList/hooks/useDocuments";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { uploadDocument, triggerDocumentAnalysis } from "@/utils/documentOperations";
import { UploadArea } from "@/components/documents/UploadArea";
import { DocumentList } from "@/components/documents/DocumentList";

export const DocumentManagementPage = () => {
  const { documents, isLoading, refetch } = useDocuments();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleDocumentDoubleClick = (documentId: string) => {
    navigate('/', { state: { selectedDocument: documentId } });
  };

  const handleFileUpload = async (file: File) => {
    if (isUploading) return;

    try {
      setIsUploading(true);

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

      const documentData = await uploadDocument(file);
      
      if (documentData) {
        await triggerDocumentAnalysis(documentData.id);
      }

      toast({
        title: "Success",
        description: "Document uploaded successfully and analysis started"
      });

      refetch();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload document. Please try again."
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex-1 p-6 space-y-8">
      <UploadArea 
        onFileUpload={handleFileUpload}
        isUploading={isUploading}
      />

      <section>
        <h2 className="text-lg font-semibold mb-4">Recently Uploaded</h2>
        <DocumentList 
          documents={documents}
          isLoading={isLoading}
          onDocumentDoubleClick={handleDocumentDoubleClick}
        />
      </section>
    </div>
  );
};

export default DocumentManagementPage;
